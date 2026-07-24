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
  currency: 'MDL'
}

function dayExpr(s, col) {
  const c = col || s.createdAtColumn
  return s.timestampFormat === 'unix' ? `date(${c}, 'unixepoch')` : `date(${c})`
}

function monthExpr(s) {
  const c = s.createdAtColumn
  return s.timestampFormat === 'unix' ? `strftime('%Y-%m', ${c}, 'unixepoch')` : `strftime('%Y-%m', ${c})`
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
  const funnel = []
  let cumulative = 0
  for (let i = s.stageOrder.length - 1; i >= 0; i--) {
    const key = s.stageOrder[i]
    cumulative += countByStage.get(key) || 0
    funnel.unshift({ stadiu: s.stageLabels[key] || key, numar: cumulative })
  }

  const wonRows = await queryAll(
    `SELECT COUNT(*) AS numar, COALESCE(SUM(${s.amountColumn}), 0) AS venit FROM ${s.leadsTable} WHERE ${s.statusColumn} IN (${placeholders(won)}) AND ${day} >= date('now', '-29 days')`,
    won
  )
  const won30d = wonRows[0] ? wonRows[0].numar : 0
  const revenue30d = wonRows[0] ? wonRows[0].venit : 0

  const revenueByMonth = await queryAll(
    `SELECT ${month} AS luna, SUM(${s.amountColumn}) AS total FROM ${s.leadsTable} WHERE ${s.statusColumn} IN (${placeholders(won)}) AND ${month} >= strftime('%Y-%m', 'now', '-5 months') GROUP BY luna ORDER BY luna`,
    won
  )

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

  return {
    generatedAt: new Date().toISOString(),
    currency: s.currency,
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
    topSources
  }
}

module.exports = { collectKpi, defaultSchema }
