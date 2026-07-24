const defaultSchema = {
  leadsTable: 'leads',
  createdAtColumn: 'created_at',
  statusColumn: 'status',
  sourceColumn: 'source',
  amountColumn: 'amount',
  firstContactColumn: null,
  timestampFormat: 'iso',
  stageOrder: ['nou', 'contactat', 'oferta', 'castigat'],
  stageLabels: { nou: 'Nou', contactat: 'Contactat', oferta: 'Ofertă', castigat: 'Câștigat' },
  wonStatuses: ['castigat'],
  revenueTable: null,
  revenueDateColumn: 'date',
  revenueAmountColumn: 'amount',
  revenueHint: null,
  oneCTable: null,
  departments: null,
  callCenter: null,
  currency: 'MDL'
}

function dayExpr(s, col) {
  const c = col || s.createdAtColumn
  return s.timestampFormat === 'unix' ? `date(${c}, 'unixepoch')` : `date(${c})`
}

function monthExpr(s, col) {
  const c = col || s.createdAtColumn
  return s.timestampFormat === 'unix' ? `strftime('%Y-%m', ${c}, 'unixepoch')` : `strftime('%Y-%m', ${c})`
}

function normalizeStages(s) {
  return s.stageOrder.map(entry => typeof entry === 'string'
    ? { label: (s.stageLabels && s.stageLabels[entry]) || entry, statuses: [entry] }
    : { label: entry.label, statuses: entry.statuses })
}

function placeholders(list) {
  return list.map(() => '?').join(',')
}

function fillMissingDays(rows, days) {
  const byDay = new Map(rows.map(r => [r.zi, r.numar]))
  const out = []
  const today = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86400000)
    const key = d.toISOString().slice(0, 10)
    out.push({ zi: key, numar: byDay.get(key) || 0 })
  }
  return out
}

async function collectKpi(queryAll, overrides = {}) {
  const s = { ...defaultSchema, ...overrides }
  const day = dayExpr(s)
  const month = monthExpr(s)
  const won = s.wonStatuses

  const leadsRaw = await queryAll(
    `SELECT ${day} AS zi, COUNT(*) AS numar FROM ${s.leadsTable} WHERE ${day} >= date('now', '-29 days') GROUP BY zi ORDER BY zi`
  )
  const leadsPerDay = fillMissingDays(leadsRaw, 30)
  const leads30d = leadsPerDay.reduce((acc, r) => acc + r.numar, 0)

  const statusRows = await queryAll(
    `SELECT ${s.statusColumn} AS stadiu, COUNT(*) AS numar FROM ${s.leadsTable} WHERE ${day} >= date('now', '-89 days') GROUP BY stadiu`
  )
  const countByStage = new Map(statusRows.map(r => [String(r.stadiu), r.numar]))
  const stages = normalizeStages(s)
  const funnel = []
  let cumulative = 0
  for (let i = stages.length - 1; i >= 0; i--) {
    cumulative += stages[i].statuses.reduce((acc, st) => acc + (countByStage.get(st) || 0), 0)
    funnel.unshift({ stadiu: stages[i].label, numar: cumulative })
  }

  const wonRows = await queryAll(
    `SELECT COUNT(*) AS numar FROM ${s.leadsTable} WHERE ${s.statusColumn} IN (${placeholders(won)}) AND ${day} >= date('now', '-29 days')`,
    won
  )
  const won30d = wonRows[0] ? wonRows[0].numar : 0

  let revenue30d, revenueByMonth
  if (s.revenueTable) {
    const rDay = dayExpr(s, s.revenueDateColumn)
    const rMonth = monthExpr(s, s.revenueDateColumn)
    const rev = await queryAll(
      `SELECT COALESCE(SUM(${s.revenueAmountColumn}), 0) AS venit FROM ${s.revenueTable} WHERE ${rDay} >= date('now', '-29 days')`
    )
    revenue30d = rev[0] ? rev[0].venit : 0
    revenueByMonth = await queryAll(
      `SELECT ${rMonth} AS luna, SUM(${s.revenueAmountColumn}) AS total FROM ${s.revenueTable} WHERE ${rMonth} >= strftime('%Y-%m', 'now', '-5 months') GROUP BY luna ORDER BY luna`
    )
  } else {
    const rev = await queryAll(
      `SELECT COALESCE(SUM(${s.amountColumn}), 0) AS venit FROM ${s.leadsTable} WHERE ${s.statusColumn} IN (${placeholders(won)}) AND ${day} >= date('now', '-29 days')`,
      won
    )
    revenue30d = rev[0] ? rev[0].venit : 0
    revenueByMonth = await queryAll(
      `SELECT ${month} AS luna, SUM(${s.amountColumn}) AS total FROM ${s.leadsTable} WHERE ${s.statusColumn} IN (${placeholders(won)}) AND ${month} >= strftime('%Y-%m', 'now', '-5 months') GROUP BY luna ORDER BY luna`,
      won
    )
  }

  const topSources = await queryAll(
    `SELECT COALESCE(${s.sourceColumn}, 'necunoscut') AS sursa, COUNT(*) AS numar FROM ${s.leadsTable} WHERE ${day} >= date('now', '-29 days') GROUP BY sursa ORDER BY numar DESC LIMIT 5`
  )

  let avgResponseMinutes = null
  if (s.firstContactColumn) {
    const rt = await queryAll(
      `SELECT AVG((julianday(${s.firstContactColumn}) - julianday(${s.createdAtColumn})) * 1440) AS minute FROM ${s.leadsTable} WHERE ${s.firstContactColumn} IS NOT NULL AND ${day} >= date('now', '-29 days')`
    )
    avgResponseMinutes = rt[0] && rt[0].minute != null ? Math.round(rt[0].minute) : null
  }

  let oneC = null
  if (s.oneCTable) {
    try {
      const rev = await queryAll(
        `SELECT COALESCE(SUM(suma), 0) AS venit FROM ${s.oneCTable} WHERE date(data) >= date('now', '-29 days')`
      )
      const byMonth = await queryAll(
        `SELECT strftime('%Y-%m', data) AS luna, SUM(suma) AS total FROM ${s.oneCTable} WHERE strftime('%Y-%m', data) >= strftime('%Y-%m', 'now', '-5 months') GROUP BY luna ORDER BY luna`
      )
      const topClients = await queryAll(
        `SELECT COALESCE(client, 'nespecificat') AS client, SUM(suma) AS total FROM ${s.oneCTable} WHERE date(data) >= date('now', '-89 days') GROUP BY client ORDER BY total DESC LIMIT 5`
      )
      oneC = {
        revenue30d: rev[0] ? rev[0].venit : 0,
        revenueByMonth: byMonth,
        topClients: topClients.some(c => c.client !== 'nespecificat') ? topClients : []
      }
    } catch {
      oneC = null
    }
  }

  let departments = null
  if (s.departments) {
    const d = { employeesTable: 'employees', tasksTable: 'tasks', ...s.departments }
    try {
      const emp = await queryAll(
        `SELECT COALESCE(NULLIF(department, ''), 'Fără departament') AS departament, COUNT(*) AS angajati FROM ${d.employeesTable} GROUP BY departament`
      )
      const taskRows = await queryAll(
        `SELECT COALESCE(NULLIF(e.department, ''), 'Fără departament') AS departament,
           SUM(CASE WHEN t.done = 0 THEN 1 ELSE 0 END) AS active,
           SUM(CASE WHEN t.done = 1 AND t.done_at IS NOT NULL AND date(t.done_at) >= date('now', '-29 days') THEN 1 ELSE 0 END) AS finalizate,
           SUM(CASE WHEN t.done = 1 AND t.done_at IS NOT NULL AND date(t.done_at) >= date('now', '-29 days') AND (t.deadline IS NULL OR t.deadline = '' OR t.done_at <= t.deadline) THEN 1 ELSE 0 END) AS laTimp
         FROM ${d.tasksTable} t LEFT JOIN ${d.employeesTable} e ON e.id = t.employee_id GROUP BY departament`
      )
      const evalRows = await queryAll(
        `SELECT COALESCE(NULLIF(e.department, ''), 'Fără departament') AS departament, t.ai_evaluation AS evaluare
         FROM ${d.tasksTable} t LEFT JOIN ${d.employeesTable} e ON e.id = t.employee_id
         WHERE t.ai_evaluation IS NOT NULL AND t.ai_evaluation != '' AND t.done_at IS NOT NULL AND date(t.done_at) >= date('now', '-29 days')`
      )
      const noteByDep = new Map()
      for (const r of evalRows) {
        const m = /Nota\s+(\d+)\s*\/\s*10/i.exec(String(r.evaluare))
        if (!m) continue
        if (!noteByDep.has(r.departament)) noteByDep.set(r.departament, [])
        noteByDep.get(r.departament).push(Number(m[1]))
      }
      const byDep = new Map()
      for (const r of emp) {
        byDep.set(r.departament, { departament: r.departament, angajati: r.angajati, sarciniActive: 0, finalizate30d: 0, laTimp30d: 0 })
      }
      for (const r of taskRows) {
        const row = byDep.get(r.departament) || { departament: r.departament, angajati: 0, sarciniActive: 0, finalizate30d: 0, laTimp30d: 0 }
        row.sarciniActive = r.active || 0
        row.finalizate30d = r.finalizate || 0
        row.laTimp30d = r.laTimp || 0
        byDep.set(r.departament, row)
      }
      departments = [...byDep.values()].map(r => {
        const note = noteByDep.get(r.departament)
        return {
          ...r,
          rataLaTimp: r.finalizate30d > 0 ? Math.round(r.laTimp30d / r.finalizate30d * 100) : null,
          notaMedie: note && note.length ? +(note.reduce((a, b) => a + b, 0) / note.length).toFixed(1) : null
        }
      }).sort((a, b) => b.finalizate30d - a.finalizate30d)
    } catch {
      departments = null
    }
  }

  let callCenter = null
  if (s.callCenter) {
    const c = {
      activitiesTable: 'lead_activities', employeesTable: 'employees',
      callAction: 'status_calling', contactAction: 'status_contacted', wonAction: 'status_won',
      newStatuses: ['new'], ...s.callCenter
    }
    try {
      const actions = [c.callAction, c.contactAction, c.wonAction]
      const tot = await queryAll(
        `SELECT SUM(CASE WHEN action = ? THEN 1 ELSE 0 END) AS apeluri,
                SUM(CASE WHEN action = ? THEN 1 ELSE 0 END) AS contactati,
                SUM(CASE WHEN action = ? THEN 1 ELSE 0 END) AS castigati
         FROM ${c.activitiesTable} WHERE date(created_at) >= date('now', '-29 days')`,
        actions
      )
      const perAgent = await queryAll(
        `SELECT COALESCE(NULLIF(e.name, ''), 'Agent ' || a.agent_id) AS agent,
                SUM(CASE WHEN a.action = ? THEN 1 ELSE 0 END) AS apeluri,
                SUM(CASE WHEN a.action = ? THEN 1 ELSE 0 END) AS contactati,
                SUM(CASE WHEN a.action = ? THEN 1 ELSE 0 END) AS castigati
         FROM ${c.activitiesTable} a LEFT JOIN ${c.employeesTable} e ON e.telegram_id = a.agent_id
         WHERE date(a.created_at) >= date('now', '-29 days') AND a.agent_id != ''
         GROUP BY agent HAVING apeluri + contactati + castigati > 0
         ORDER BY apeluri DESC, contactati DESC LIMIT 8`,
        actions
      )
      const reaction = await queryAll(
        `SELECT AVG((julianday(fa.prima) - julianday(l.${s.createdAtColumn})) * 1440) AS minute
         FROM ${s.leadsTable} l
         JOIN (SELECT lead_id, MIN(created_at) AS prima FROM ${c.activitiesTable} GROUP BY lead_id) fa ON fa.lead_id = l.id
         WHERE ${day} >= date('now', '-29 days') AND julianday(fa.prima) >= julianday(l.${s.createdAtColumn})`
      )
      const processed = await queryAll(
        `SELECT COUNT(*) AS total, SUM(CASE WHEN ${s.statusColumn} NOT IN (${placeholders(c.newStatuses)}) THEN 1 ELSE 0 END) AS procesate
         FROM ${s.leadsTable} WHERE ${day} >= date('now', '-29 days')`,
        c.newStatuses
      )
      const apeluri = (tot[0] && tot[0].apeluri) || 0
      const contactati = (tot[0] && tot[0].contactati) || 0
      callCenter = {
        apeluri30d: apeluri,
        contactati30d: contactati,
        castigati30d: (tot[0] && tot[0].castigati) || 0,
        rataContactare: apeluri > 0 ? Math.round(contactati / apeluri * 100) : null,
        reactieMedieMinute: reaction[0] && reaction[0].minute != null ? Math.round(reaction[0].minute) : null,
        procesatePct: processed[0] && processed[0].total > 0 ? Math.round(processed[0].procesate / processed[0].total * 100) : null,
        perAgent
      }
    } catch {
      callCenter = null
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    currency: s.currency,
    revenueHint: s.revenueHint,
    totals: {
      leads30d,
      won30d,
      conversionRate: leads30d > 0 ? +(won30d / leads30d * 100).toFixed(1) : 0,
      revenue30d,
      avgResponseMinutes
    },
    leadsPerDay,
    funnel,
    revenueByMonth,
    topSources,
    departments,
    callCenter,
    oneC
  }
}

module.exports = { collectKpi, defaultSchema }
