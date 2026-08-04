const PROSPECT_LABELS = {
  NOU: { ro: 'Nou', ru: 'Новый' },
  CONTACTAT: { ro: 'Contactat', ru: 'Связались' },
  PREZENTARE_FACUTA: { ro: 'Prezentare făcută', ru: 'Презентация проведена' },
  INSCRIS: { ro: 'Înscris', ru: 'Записан' },
  ARHIVAT: { ro: 'Arhivat', ru: 'Архив' }
}

const DEPARTMENT_LABELS = {
  'Vânzări': { ro: 'Vânzări', ru: 'Продажи' },
  'Contabilitate': { ro: 'Contabilitate', ru: 'Бухгалтерия' },
  'Administrativ': { ro: 'Administrativ', ru: 'Администрация' },
  'Fără departament': { ro: 'Fără departament', ru: 'Без отдела' }
}

const STAGE_LABELS = {
  'Nou': { ro: 'Nou', ru: 'Новый' },
  'Calificat': { ro: 'Calificat', ru: 'Квалифицирован' },
  'Contactat': { ro: 'Contactat', ru: 'Связались' },
  'Ofertă': { ro: 'Ofertă', ru: 'Оферта' },
  'Ofertă trimisă': { ro: 'Ofertă trimisă', ru: 'Оферта отправлена' },
  'Câștigat': { ro: 'Câștigat', ru: 'Выигран' },
  'Pierdut': { ro: 'Pierdut', ru: 'Проигран' }
}

const SOURCE_LABELS = {
  necunoscut: { ro: 'necunoscut', ru: 'неизвестно' },
  nespecificat: { ro: 'nespecificat', ru: 'не указано' },
  recomandare: { ro: 'Recomandare', ru: 'Рекомендация' },
  site: { ro: 'Site', ru: 'Сайт' }
}

function label(map, key, fallback) {
  return map[key] || { ro: fallback != null ? fallback : key, ru: fallback != null ? fallback : key }
}

function num(row, field) {
  if (!row) return 0
  const v = row[field]
  return v == null ? 0 : Number(v)
}

function pct(part, total) {
  return total > 0 ? Math.round(part / total * 100) : null
}

function fillMissingDays(rows, days) {
  const byDay = new Map(rows.map(r => [r.zi, Number(r.numar) || 0]))
  const out = []
  const today = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const key = new Date(today.getTime() - i * 86400000).toISOString().slice(0, 10)
    out.push({ key, value: byDay.get(key) || 0 })
  }
  return out
}

function dayExpr(s, col) {
  const c = col || s.createdAtColumn
  return s.timestampFormat === 'unix' ? `date(${c}, 'unixepoch')` : `date(${c})`
}

function monthExpr(s, col) {
  const c = col || s.createdAtColumn
  return s.timestampFormat === 'unix' ? `strftime('%Y-%m', ${c}, 'unixepoch')` : `strftime('%Y-%m', ${c})`
}

function placeholders(list) {
  return list.map(() => '?').join(',')
}

function scopeConds(s, cols) {
  const scope = s.scope || {}
  const conds = []
  const args = []
  if (scope.role === 'employee') {
    if (scope.emp != null && scope.emp !== '' && cols.id) { conds.push(cols.id + ' = ?'); args.push(scope.emp) }
    else if (scope.name && cols.name) { conds.push(cols.name + ' = ?'); args.push(scope.name) }
    else if (scope.dept && cols.dept) { conds.push(cols.dept + ' = ?'); args.push(scope.dept) }
  } else if (scope.role === 'head' && scope.dept && cols.dept) {
    conds.push(cols.dept + ' = ?')
    args.push(scope.dept)
  }
  return { conds, args }
}

function normalizeStages(s) {
  return s.stageOrder.map(entry => typeof entry === 'string'
    ? { label: (s.stageLabels && s.stageLabels[entry]) || entry, statuses: [entry] }
    : { label: entry.label, statuses: entry.statuses })
}

const PANELS = {
  chiriasi: {
    title: { ro: 'Chiriași', ru: 'Арендаторы' },
    hint: { ro: 'Portofoliul de chiriași · situația curentă', ru: 'Портфель арендаторов · текущее состояние' },
    async collect(q, s) {
      const table = s.clientsTable || 'clients'
      const tot = await q(
        `SELECT COUNT(*) AS total,
                SUM(CASE WHEN status = 'activ' THEN 1 ELSE 0 END) AS activi,
                SUM(CASE WHEN status = 'activ' AND telegram_id != '' THEN 1 ELSE 0 END) AS portal,
                SUM(CASE WHEN status = 'activ' AND julianday(due_date) < julianday('now') THEN 1 ELSE 0 END) AS restantieri,
                COALESCE(SUM(CASE WHEN status = 'activ' THEN rent_eur ELSE 0 END), 0) AS chirie
         FROM ${table}`
      )
      const activi = num(tot[0], 'activi')
      if (num(tot[0], 'total') === 0) return null
      const list = await q(
        `SELECT name, COALESCE(rent_eur, 0) AS rent_eur, COALESCE(due_day, 0) AS due_day,
                CASE WHEN telegram_id != '' THEN 1 ELSE 0 END AS portal
         FROM ${table} WHERE status = 'activ' ORDER BY rent_eur DESC`
      )
      return {
        tiles: [
          { label: { ro: 'Chiriași activi', ru: 'Активные арендаторы' }, value: activi, fmt: 'int' },
          { label: { ro: 'Chirie contractată · lunar', ru: 'Законтрактованная аренда · в месяц' }, value: num(tot[0], 'chirie'), fmt: 'money' },
          { label: { ro: 'Conectați la Telegram', ru: 'Подключены к Telegram' }, value: num(tot[0], 'portal'), fmt: 'int', note: { ro: 'din ' + activi, ru: 'из ' + activi } },
          { label: { ro: 'Cu restanță', ru: 'С задолженностью' }, value: num(tot[0], 'restantieri'), fmt: 'int' }
        ],
        chart: {
          type: 'bars-h',
          unit: s.currency,
          fmt: 'money',
          rows: list.slice(0, 10).map(r => ({ label: r.name, value: r.rent_eur }))
        },
        table: {
          head: [
            { ro: 'Chiriaș', ru: 'Арендатор' },
            { ro: 'Chirie (' + s.currency + ')', ru: 'Аренда (' + s.currency + ')' },
            { ro: 'Ziua scadenței', ru: 'День оплаты' },
            { ro: 'Portal', ru: 'Портал' }
          ],
          rows: list.map(r => [
            r.name,
            { v: r.rent_eur, fmt: 'money' },
            r.due_day || '—',
            r.portal ? { ro: 'activ', ru: 'активен' } : { ro: 'neactivat', ru: 'не подключён' }
          ])
        }
      }
    }
  },

  restante: {
    title: { ro: 'Restanțe', ru: 'Задолженности' },
    hint: { ro: 'Chiriași cu scadența depășită', ru: 'Арендаторы с просроченным сроком' },
    async collect(q, s) {
      const table = s.clientsTable || 'clients'
      const rows = await q(
        `SELECT name, COALESCE(rent_eur, 0) AS rent_eur,
                CAST(julianday('now') - julianday(due_date) AS INTEGER) AS zile
         FROM ${table}
         WHERE status = 'activ' AND julianday(due_date) < julianday('now')
         ORDER BY zile DESC`
      )
      const suma = rows.reduce((acc, r) => acc + Number(r.rent_eur || 0), 0)
      const medie = rows.length ? Math.round(rows.reduce((acc, r) => acc + Number(r.zile || 0), 0) / rows.length) : null
      return {
        tiles: [
          { label: { ro: 'Chiriași restanțieri', ru: 'Должники' }, value: rows.length, fmt: 'int' },
          { label: { ro: 'Sumă restantă', ru: 'Сумма задолженности' }, value: suma, fmt: 'money' },
          { label: { ro: 'Întârziere medie', ru: 'Средняя просрочка' }, value: medie, fmt: 'days' }
        ],
        chart: rows.length ? {
          type: 'bars-h',
          fmt: 'days',
          color: 'warn',
          rows: rows.slice(0, 10).map(r => ({ label: r.name, value: Number(r.zile) }))
        } : null,
        table: {
          head: [
            { ro: 'Chiriaș', ru: 'Арендатор' },
            { ro: 'Zile întârziere', ru: 'Дней просрочки' },
            { ro: 'Chirie (' + s.currency + ')', ru: 'Аренда (' + s.currency + ')' }
          ],
          rows: rows.map(r => [r.name, Number(r.zile), { v: r.rent_eur, fmt: 'money' }])
        }
      }
    }
  },

  scadente: {
    title: { ro: 'Scadențe', ru: 'Сроки оплаты' },
    hint: { ro: 'Plăți așteptate în următoarele 30 de zile', ru: 'Ожидаемые платежи в ближайшие 30 дней' },
    async collect(q, s) {
      const table = s.clientsTable || 'clients'
      const rows = await q(
        `SELECT name, COALESCE(rent_eur, 0) AS rent_eur,
                CAST(julianday(due_date) - julianday('now') AS INTEGER) AS zile
         FROM ${table}
         WHERE status = 'activ' AND julianday(due_date) >= julianday('now')
           AND julianday(due_date) <= julianday('now', '+30 days')
         ORDER BY zile ASC`
      )
      const in7 = rows.filter(r => Number(r.zile) <= 7)
      const suma = rows.reduce((acc, r) => acc + Number(r.rent_eur || 0), 0)
      return {
        tiles: [
          { label: { ro: 'Scadente în 7 zile', ru: 'Срок в течение 7 дней' }, value: in7.length, fmt: 'int' },
          { label: { ro: 'Scadente în 30 zile', ru: 'Срок в течение 30 дней' }, value: rows.length, fmt: 'int' },
          { label: { ro: 'De încasat · 30 zile', ru: 'К поступлению · 30 дней' }, value: suma, fmt: 'money' }
        ],
        chart: rows.length ? {
          type: 'bars-h',
          fmt: 'days',
          rows: rows.slice(0, 10).map(r => ({ label: r.name, value: Number(r.zile) }))
        } : null,
        table: {
          head: [
            { ro: 'Chiriaș', ru: 'Арендатор' },
            { ro: 'Peste (zile)', ru: 'Через (дней)' },
            { ro: 'Sumă (' + s.currency + ')', ru: 'Сумма (' + s.currency + ')' }
          ],
          rows: rows.map(r => [r.name, Number(r.zile), { v: r.rent_eur, fmt: 'money' }])
        }
      }
    }
  },

  incasari: {
    title: { ro: 'Registru încasări', ru: 'Реестр поступлений' },
    hint: { ro: 'Plăți înregistrate · ultimele 6 luni', ru: 'Зарегистрированные платежи · последние 6 месяцев' },
    async collect(q, s) {
      const table = s.revenueTable || 'payments'
      const amount = s.revenueAmountColumn || 'amount_eur'
      const dateCol = s.revenueDateColumn || 'date'
      const rows = await q(
        `SELECT strftime('%Y-%m', ${dateCol}) AS luna, COALESCE(SUM(${amount}), 0) AS total, COUNT(*) AS numar
         FROM ${table} WHERE strftime('%Y-%m', ${dateCol}) >= strftime('%Y-%m', 'now', '-5 months')
         GROUP BY luna ORDER BY luna`
      )
      if (!rows.length) return null
      const luna = await q(
        `SELECT COALESCE(SUM(${amount}), 0) AS total FROM ${table} WHERE strftime('%Y-%m', ${dateCol}) = strftime('%Y-%m', 'now')`
      )
      const ultimele30 = await q(
        `SELECT COALESCE(SUM(${amount}), 0) AS total FROM ${table} WHERE julianday(${dateCol}) >= julianday('now', '-29 days')`
      )
      const late = await q(
        `SELECT COUNT(*) AS numar, AVG(days_late) AS medie FROM ${table}
         WHERE days_late > 0 AND julianday(${dateCol}) >= julianday('now', '-29 days')`
      ).catch(() => [])
      const medie = late[0] && late[0].medie != null ? Math.round(Number(late[0].medie)) : null
      const tiles = [
        { label: { ro: 'Încasat luna curentă', ru: 'Поступило в этом месяце' }, value: num(luna[0], 'total'), fmt: 'money' },
        { label: { ro: 'Încasat · 30 zile', ru: 'Поступило · 30 дней' }, value: num(ultimele30[0], 'total'), fmt: 'money' }
      ]
      if (late.length) {
        tiles.push({
          label: { ro: 'Plăți întârziate · 30 zile', ru: 'Просроченные платежи · 30 дней' },
          value: num(late[0], 'numar'),
          fmt: 'int',
          note: medie != null ? { ro: 'medie ' + medie + ' zile', ru: 'в среднем ' + medie + ' дн.' } : null
        })
      }
      return {
        tiles,
        chart: { type: 'bars-v', unit: s.currency, fmt: 'money', rows: rows.map(r => ({ key: r.luna, value: Number(r.total) })) },
        table: {
          head: [
            { ro: 'Luna', ru: 'Месяц' },
            { ro: 'Încasat (' + s.currency + ')', ru: 'Поступило (' + s.currency + ')' },
            { ro: 'Plăți', ru: 'Платежей' }
          ],
          rows: rows.map(r => [{ month: r.luna }, { v: Number(r.total), fmt: 'money' }, Number(r.numar)])
        }
      }
    }
  },

  raport: {
    title: { ro: 'Raport general', ru: 'Общий отчёт' },
    hint: { ro: 'Rata de colectare față de chiria contractată', ru: 'Собираемость относительно законтрактованной аренды' },
    async collect(q, s) {
      const clients = s.clientsTable || 'clients'
      const payments = s.revenueTable || 'payments'
      const amount = s.revenueAmountColumn || 'amount_eur'
      const dateCol = s.revenueDateColumn || 'date'
      const contract = await q(
        `SELECT COALESCE(SUM(rent_eur), 0) AS total, COUNT(*) AS numar FROM ${clients} WHERE status = 'activ'`
      )
      const contractat = num(contract[0], 'total')
      if (contractat === 0) return null
      const byMonth = await q(
        `SELECT strftime('%Y-%m', ${dateCol}) AS luna, COALESCE(SUM(${amount}), 0) AS total, COUNT(DISTINCT client_id) AS platitori
         FROM ${payments} WHERE strftime('%Y-%m', ${dateCol}) >= strftime('%Y-%m', 'now', '-5 months')
         GROUP BY luna ORDER BY luna`
      )
      const incasatLuna = byMonth.length ? Number(byMonth[byMonth.length - 1].total) : 0
      const restante = await q(
        `SELECT COALESCE(SUM(rent_eur), 0) AS total FROM ${clients}
         WHERE status = 'activ' AND julianday(due_date) < julianday('now')`
      )
      return {
        tiles: [
          { label: { ro: 'Încasat luna curentă', ru: 'Поступило в этом месяце' }, value: incasatLuna, fmt: 'money' },
          { label: { ro: 'Contractat lunar', ru: 'Законтрактовано в месяц' }, value: contractat, fmt: 'money' },
          { label: { ro: 'Rată de colectare', ru: 'Собираемость' }, value: pct(incasatLuna, contractat), fmt: 'pct' },
          { label: { ro: 'Restanțe curente', ru: 'Текущая задолженность' }, value: num(restante[0], 'total'), fmt: 'money' }
        ],
        chart: {
          type: 'bars-v',
          fmt: 'pct',
          rows: byMonth.map(r => ({ key: r.luna, value: pct(Number(r.total), contractat) || 0 }))
        },
        table: {
          head: [
            { ro: 'Luna', ru: 'Месяц' },
            { ro: 'Încasat (' + s.currency + ')', ru: 'Поступило (' + s.currency + ')' },
            { ro: 'Chiriași plătitori', ru: 'Заплатили арендаторов' },
            { ro: 'Rată de colectare', ru: 'Собираемость' }
          ],
          rows: byMonth.map(r => [
            { month: r.luna },
            { v: Number(r.total), fmt: 'money' },
            Number(r.platitori),
            { v: pct(Number(r.total), contractat), fmt: 'pct' }
          ])
        }
      }
    }
  },

  departamente: {
    title: { ro: 'Sarcini pe departamente', ru: 'Задачи по отделам' },
    hint: { ro: 'Sarcini finalizate · ultimele 30 de zile', ru: 'Выполненные задачи · последние 30 дней' },
    wide: true,
    async collect(q, s) {
      const emps = s.employeesTable || 'employees'
      const tasks = s.tasksTable || 'tasks'
      const empDept = "COALESCE(NULLIF(department, ''), 'Fără departament')"
      const eDept = "COALESCE(NULLIF(e.department, ''), 'Fără departament')"
      const empScope = scopeConds(s, { dept: empDept })
      const eScope = scopeConds(s, { dept: eDept })
      const empWhere = empScope.conds.length ? 'WHERE ' + empScope.conds.join(' AND ') : ''
      const taskWhere = eScope.conds.length ? 'WHERE ' + eScope.conds.join(' AND ') : ''
      const evalAnd = eScope.conds.length ? ' AND ' + eScope.conds.join(' AND ') : ''
      const empRows = await q(
        `SELECT ${empDept} AS departament, COUNT(*) AS angajati
         FROM ${emps} ${empWhere} GROUP BY departament`,
        empScope.args
      )
      if (!empRows.length) return null
      const taskRows = await q(
        `SELECT ${eDept} AS departament,
                SUM(CASE WHEN t.done = 0 THEN 1 ELSE 0 END) AS active,
                SUM(CASE WHEN t.done = 1 AND t.done_at IS NOT NULL AND date(t.done_at) >= date('now', '-29 days') THEN 1 ELSE 0 END) AS finalizate,
                SUM(CASE WHEN t.done = 1 AND t.done_at IS NOT NULL AND date(t.done_at) >= date('now', '-29 days') AND (t.deadline IS NULL OR t.deadline = '' OR t.done_at <= t.deadline) THEN 1 ELSE 0 END) AS laTimp
         FROM ${tasks} t LEFT JOIN ${emps} e ON e.id = t.employee_id ${taskWhere} GROUP BY departament`,
        eScope.args
      )
      const evalRows = await q(
        `SELECT ${eDept} AS departament, t.ai_evaluation AS evaluare
         FROM ${tasks} t LEFT JOIN ${emps} e ON e.id = t.employee_id
         WHERE t.ai_evaluation IS NOT NULL AND t.ai_evaluation != '' AND t.done_at IS NOT NULL
           AND date(t.done_at) >= date('now', '-29 days')${evalAnd}`,
        eScope.args
      )
      const noteByDep = new Map()
      for (const r of evalRows) {
        const m = /Nota\s+(\d+)\s*\/\s*10/i.exec(String(r.evaluare))
        if (!m) continue
        if (!noteByDep.has(r.departament)) noteByDep.set(r.departament, [])
        noteByDep.get(r.departament).push(Number(m[1]))
      }
      const byDep = new Map()
      for (const r of empRows) {
        byDep.set(r.departament, { departament: r.departament, angajati: Number(r.angajati), active: 0, finalizate: 0, laTimp: 0 })
      }
      for (const r of taskRows) {
        const row = byDep.get(r.departament) || { departament: r.departament, angajati: 0, active: 0, finalizate: 0, laTimp: 0 }
        row.active = Number(r.active || 0)
        row.finalizate = Number(r.finalizate || 0)
        row.laTimp = Number(r.laTimp || 0)
        byDep.set(r.departament, row)
      }
      const list = [...byDep.values()].sort((a, b) => b.finalizate - a.finalizate)
      return {
        tiles: [
          { label: { ro: 'Departamente', ru: 'Отделы' }, value: list.length, fmt: 'int' },
          { label: { ro: 'Sarcini active', ru: 'Активные задачи' }, value: list.reduce((a, r) => a + r.active, 0), fmt: 'int' },
          { label: { ro: 'Finalizate · 30 zile', ru: 'Выполнено · 30 дней' }, value: list.reduce((a, r) => a + r.finalizate, 0), fmt: 'int' }
        ],
        chart: {
          type: 'bars-h',
          fmt: 'int',
          rows: list.map(r => ({ label: label(DEPARTMENT_LABELS, r.departament), value: r.finalizate }))
        },
        table: {
          head: [
            { ro: 'Departament', ru: 'Отдел' },
            { ro: 'Angajați', ru: 'Сотрудники' },
            { ro: 'Sarcini active', ru: 'Активные задачи' },
            { ro: 'Finalizate 30 zile', ru: 'Выполнено 30 дней' },
            { ro: '% la timp', ru: '% в срок' },
            { ro: 'Nota AI', ru: 'Оценка ИИ' }
          ],
          rows: list.map(r => {
            const note = noteByDep.get(r.departament)
            const media = note && note.length ? +(note.reduce((a, b) => a + b, 0) / note.length).toFixed(1) : null
            return [
              label(DEPARTMENT_LABELS, r.departament),
              r.angajati,
              r.active,
              r.finalizate,
              { v: pct(r.laTimp, r.finalizate), fmt: 'pct' },
              media == null ? '—' : media + '/10'
            ]
          })
        }
      }
    }
  },

  angajati: {
    title: { ro: 'Angajați', ru: 'Сотрудники' },
    hint: { ro: 'Sarcini și disciplină · ultimele 30 de zile', ru: 'Задачи и дисциплина · последние 30 дней' },
    wide: true,
    async collect(q, s) {
      const emps = s.employeesTable || 'employees'
      const tasks = s.tasksTable || 'tasks'
      const eDept = "COALESCE(NULLIF(e.department, ''), 'Fără departament')"
      const scope = scopeConds(s, { dept: eDept, id: 'e.id', name: 'e.name' })
      const rowsWhere = scope.conds.length ? 'WHERE ' + scope.conds.join(' AND ') : ''
      const evalAnd = scope.conds.length ? ' AND ' + scope.conds.join(' AND ') : ''
      const rows = await q(
        `SELECT e.name AS nume, ${eDept} AS departament,
                SUM(CASE WHEN t.done = 0 AND t.id IS NOT NULL THEN 1 ELSE 0 END) AS active,
                SUM(CASE WHEN t.done = 1 AND t.done_at IS NOT NULL AND date(t.done_at) >= date('now', '-29 days') THEN 1 ELSE 0 END) AS finalizate,
                SUM(CASE WHEN t.done = 1 AND t.done_at IS NOT NULL AND date(t.done_at) >= date('now', '-29 days') AND (t.deadline IS NULL OR t.deadline = '' OR t.done_at <= t.deadline) THEN 1 ELSE 0 END) AS laTimp
         FROM ${emps} e LEFT JOIN ${tasks} t ON t.employee_id = e.id
         ${rowsWhere} GROUP BY e.id ORDER BY finalizate DESC, active DESC`,
        scope.args
      )
      if (!rows.length) return null
      const evalRows = await q(
        `SELECT e.name AS nume, t.ai_evaluation AS evaluare
         FROM ${tasks} t JOIN ${emps} e ON e.id = t.employee_id
         WHERE t.ai_evaluation IS NOT NULL AND t.ai_evaluation != '' AND t.done_at IS NOT NULL
           AND date(t.done_at) >= date('now', '-29 days')${evalAnd}`,
        scope.args
      )
      const noteByEmp = new Map()
      for (const r of evalRows) {
        const m = /Nota\s+(\d+)\s*\/\s*10/i.exec(String(r.evaluare))
        if (!m) continue
        if (!noteByEmp.has(r.nume)) noteByEmp.set(r.nume, [])
        noteByEmp.get(r.nume).push(Number(m[1]))
      }
      const totalFin = rows.reduce((a, r) => a + Number(r.finalizate || 0), 0)
      const totalTimp = rows.reduce((a, r) => a + Number(r.laTimp || 0), 0)
      return {
        tiles: [
          { label: { ro: 'Angajați', ru: 'Сотрудники' }, value: rows.length, fmt: 'int' },
          { label: { ro: 'Sarcini active', ru: 'Активные задачи' }, value: rows.reduce((a, r) => a + Number(r.active || 0), 0), fmt: 'int' },
          { label: { ro: 'Finalizate · 30 zile', ru: 'Выполнено · 30 дней' }, value: totalFin, fmt: 'int' },
          { label: { ro: 'Executate la timp', ru: 'Выполнено в срок' }, value: pct(totalTimp, totalFin), fmt: 'pct' }
        ],
        chart: {
          type: 'bars-h',
          fmt: 'int',
          rows: rows.slice(0, 10).map(r => ({ label: r.nume, value: Number(r.finalizate || 0) }))
        },
        table: {
          head: [
            { ro: 'Angajat', ru: 'Сотрудник' },
            { ro: 'Departament', ru: 'Отдел' },
            { ro: 'Sarcini active', ru: 'Активные задачи' },
            { ro: 'Finalizate 30 zile', ru: 'Выполнено 30 дней' },
            { ro: '% la timp', ru: '% в срок' },
            { ro: 'Nota AI', ru: 'Оценка ИИ' }
          ],
          rows: rows.map(r => {
            const note = noteByEmp.get(r.nume)
            const media = note && note.length ? +(note.reduce((a, b) => a + b, 0) / note.length).toFixed(1) : null
            return [
              r.nume,
              label(DEPARTMENT_LABELS, r.departament),
              Number(r.active || 0),
              Number(r.finalizate || 0),
              { v: pct(Number(r.laTimp || 0), Number(r.finalizate || 0)), fmt: 'pct' },
              media == null ? '—' : media + '/10'
            ]
          })
        }
      }
    }
  },

  leaduri: {
    title: { ro: 'Lead-uri noi pe zi', ru: 'Новые лиды по дням' },
    hint: { ro: 'Ultimele 30 de zile', ru: 'Последние 30 дней' },
    wide: true,
    async collect(q, s) {
      const day = dayExpr(s)
      const raw = await q(
        `SELECT ${day} AS zi, COUNT(*) AS numar FROM ${s.leadsTable}
         WHERE ${day} >= date('now', '-29 days') GROUP BY zi ORDER BY zi`
      )
      const perDay = fillMissingDays(raw, 30)
      const total = perDay.reduce((a, r) => a + r.value, 0)
      if (!total) return null
      const wonRows = await q(
        `SELECT COUNT(*) AS numar FROM ${s.leadsTable}
         WHERE ${s.statusColumn} IN (${placeholders(s.wonStatuses)}) AND ${day} >= date('now', '-29 days')`,
        s.wonStatuses
      )
      const won = num(wonRows[0], 'numar')
      return {
        tiles: [
          { label: { ro: 'Lead-uri noi · 30 zile', ru: 'Новые лиды · 30 дней' }, value: total, fmt: 'int' },
          { label: { ro: 'Câștigate · 30 zile', ru: 'Выиграно · 30 дней' }, value: won, fmt: 'int' },
          { label: { ro: 'Rată de conversie', ru: 'Конверсия' }, value: pct(won, total), fmt: 'pct' }
        ],
        chart: { type: 'line', fmt: 'int', rows: perDay },
        table: {
          head: [{ ro: 'Zi', ru: 'День' }, { ro: 'Lead-uri', ru: 'Лиды' }],
          rows: perDay.map(r => [{ day: r.key }, r.value])
        }
      }
    }
  },

  palnie: {
    title: { ro: 'Pâlnia de vânzări', ru: 'Воронка продаж' },
    hint: { ro: 'Lead-uri care au atins fiecare etapă · 90 de zile', ru: 'Лиды, достигшие каждого этапа · 90 дней' },
    async collect(q, s) {
      const day = dayExpr(s)
      const statusRows = await q(
        `SELECT ${s.statusColumn} AS stadiu, COUNT(*) AS numar FROM ${s.leadsTable}
         WHERE ${day} >= date('now', '-89 days') GROUP BY stadiu`
      )
      if (!statusRows.length) return null
      const countByStage = new Map(statusRows.map(r => [String(r.stadiu), Number(r.numar)]))
      const stages = normalizeStages(s)
      const rows = []
      let cumulative = 0
      const stageRu = s.stageLabelsRu || {}
      for (let i = stages.length - 1; i >= 0; i--) {
        cumulative += stages[i].statuses.reduce((acc, st) => acc + (countByStage.get(st) || 0), 0)
        const name = stages[i].label
        rows.unshift({
          label: stageRu[name] ? { ro: name, ru: stageRu[name] } : label(STAGE_LABELS, name),
          value: cumulative
        })
      }
      return {
        tiles: [],
        chart: { type: 'funnel', fmt: 'int', rows },
        table: {
          head: [{ ro: 'Etapă', ru: 'Этап' }, { ro: 'Lead-uri', ru: 'Лиды' }],
          rows: rows.map(r => [r.label, r.value])
        }
      }
    }
  },

  surse: {
    title: { ro: 'Surse de lead-uri', ru: 'Источники лидов' },
    hint: { ro: 'Ultimele 30 de zile', ru: 'Последние 30 дней' },
    async collect(q, s) {
      const day = dayExpr(s)
      const rows = await q(
        `SELECT COALESCE(NULLIF(${s.sourceColumn}, ''), 'necunoscut') AS sursa, COUNT(*) AS numar
         FROM ${s.leadsTable} WHERE ${day} >= date('now', '-29 days')
         GROUP BY sursa ORDER BY numar DESC LIMIT 8`
      )
      if (!rows.length) return null
      return {
        tiles: [],
        chart: {
          type: 'bars-h',
          fmt: 'int',
          rows: rows.map(r => ({ label: label(SOURCE_LABELS, r.sursa), value: Number(r.numar) }))
        },
        table: {
          head: [{ ro: 'Sursă', ru: 'Источник' }, { ro: 'Lead-uri', ru: 'Лиды' }],
          rows: rows.map(r => [label(SOURCE_LABELS, r.sursa), Number(r.numar)])
        }
      }
    }
  },

  callcenter: {
    title: { ro: 'Call center', ru: 'Колл-центр' },
    hint: { ro: 'Prelucrarea lead-urilor · ultimele 30 de zile', ru: 'Обработка лидов · последние 30 дней' },
    wide: true,
    async collect(q, s) {
      const c = {
        activitiesTable: 'lead_activities', employeesTable: 'employees',
        callAction: 'status_calling', contactAction: 'status_contacted', wonAction: 'status_won',
        newStatuses: ['new'], ...(s.callCenter || {})
      }
      const day = dayExpr(s)
      const actions = [c.callAction, c.contactAction, c.wonAction]
      const tot = await q(
        `SELECT SUM(CASE WHEN action = ? THEN 1 ELSE 0 END) AS apeluri,
                SUM(CASE WHEN action = ? THEN 1 ELSE 0 END) AS contactati,
                SUM(CASE WHEN action = ? THEN 1 ELSE 0 END) AS castigati
         FROM ${c.activitiesTable} WHERE date(created_at) >= date('now', '-29 days')`,
        actions
      )
      const apeluri = num(tot[0], 'apeluri')
      const contactati = num(tot[0], 'contactati')
      if (!apeluri && !contactati) return null
      const perAgent = await q(
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
      const reaction = await q(
        `SELECT AVG((julianday(fa.prima) - julianday(l.${s.createdAtColumn})) * 1440) AS minute
         FROM ${s.leadsTable} l
         JOIN (SELECT lead_id, MIN(created_at) AS prima FROM ${c.activitiesTable} GROUP BY lead_id) fa ON fa.lead_id = l.id
         WHERE ${day} >= date('now', '-29 days') AND julianday(fa.prima) >= julianday(l.${s.createdAtColumn})`
      )
      const processed = await q(
        `SELECT COUNT(*) AS total, SUM(CASE WHEN ${s.statusColumn} NOT IN (${placeholders(c.newStatuses)}) THEN 1 ELSE 0 END) AS procesate
         FROM ${s.leadsTable} WHERE ${day} >= date('now', '-29 days')`,
        c.newStatuses
      )
      return {
        tiles: [
          { label: { ro: 'Apeluri', ru: 'Звонки' }, value: apeluri, fmt: 'int' },
          { label: { ro: 'Contactați', ru: 'Связались' }, value: contactati, fmt: 'int', note: pct(contactati, apeluri) != null ? { ro: pct(contactati, apeluri) + '% din apeluri', ru: pct(contactati, apeluri) + '% от звонков' } : null },
          { label: { ro: 'Reacție medie la lead', ru: 'Средняя реакция на лид' }, value: reaction[0] && reaction[0].minute != null ? Math.round(Number(reaction[0].minute)) : null, fmt: 'min' },
          { label: { ro: 'Lead-uri preluate', ru: 'Лиды в работе' }, value: pct(num(processed[0], 'procesate'), num(processed[0], 'total')), fmt: 'pct' }
        ],
        chart: {
          type: 'bars-h',
          fmt: 'int',
          rows: perAgent.map(r => ({ label: r.agent, value: Number(r.apeluri) }))
        },
        table: {
          head: [
            { ro: 'Agent', ru: 'Агент' },
            { ro: 'Apeluri', ru: 'Звонки' },
            { ro: 'Contactați', ru: 'Связались' },
            { ro: 'Câștigați', ru: 'Выиграно' }
          ],
          rows: perAgent.map(r => [r.agent, Number(r.apeluri), Number(r.contactati), Number(r.castigati)])
        }
      }
    }
  },

  prospecti: {
    title: { ro: 'Prospecți', ru: 'Проспекты' },
    hint: { ro: 'Distribuția pe status · situația curentă', ru: 'Распределение по статусам · текущее состояние' },
    async collect(q, s) {
      const table = s.prospectsTable || 'prospects'
      const rows = await q(`SELECT status, COUNT(*) AS numar FROM ${table} GROUP BY status ORDER BY numar DESC`)
      const total = rows.reduce((a, r) => a + Number(r.numar), 0)
      if (!total) return null
      const inscrisi = rows.find(r => String(r.status) === 'INSCRIS')
      return {
        tiles: [
          { label: { ro: 'Prospecți total', ru: 'Всего проспектов' }, value: total, fmt: 'int' },
          { label: { ro: 'Înscriși', ru: 'Записаны' }, value: inscrisi ? Number(inscrisi.numar) : 0, fmt: 'int' },
          { label: { ro: 'Rată de înscriere', ru: 'Доля записавшихся' }, value: pct(inscrisi ? Number(inscrisi.numar) : 0, total), fmt: 'pct' }
        ],
        chart: {
          type: 'bars-h',
          fmt: 'int',
          rows: rows.map(r => ({ label: label(PROSPECT_LABELS, String(r.status)), value: Number(r.numar) }))
        },
        table: {
          head: [{ ro: 'Status', ru: 'Статус' }, { ro: 'Prospecți', ru: 'Проспекты' }],
          rows: rows.map(r => [label(PROSPECT_LABELS, String(r.status)), Number(r.numar)])
        }
      }
    }
  },

  venit1c: {
    title: { ro: 'Venit facturat în 1C', ru: 'Выставлено в 1С' },
    hint: { ro: 'Documente de vânzare din 1C · ultimele 6 luni', ru: 'Документы продаж из 1С · последние 6 месяцев' },
    async collect(q, s) {
      if (!s.oneCTable) return null
      const rows = await q(
        `SELECT strftime('%Y-%m', data) AS luna, SUM(suma) AS total FROM ${s.oneCTable}
         WHERE strftime('%Y-%m', data) >= strftime('%Y-%m', 'now', '-5 months') GROUP BY luna ORDER BY luna`
      )
      if (!rows.length) return null
      const rev = await q(`SELECT COALESCE(SUM(suma), 0) AS venit FROM ${s.oneCTable} WHERE date(data) >= date('now', '-29 days')`)
      return {
        tiles: [
          { label: { ro: 'Facturat · 30 zile', ru: 'Выставлено · 30 дней' }, value: num(rev[0], 'venit'), fmt: 'money' }
        ],
        chart: { type: 'bars-v', unit: s.currency, fmt: 'money', color: 'alt', rows: rows.map(r => ({ key: r.luna, value: Number(r.total) })) },
        table: {
          head: [{ ro: 'Luna', ru: 'Месяц' }, { ro: 'Facturat (' + s.currency + ')', ru: 'Выставлено (' + s.currency + ')' }],
          rows: rows.map(r => [{ month: r.luna }, { v: Number(r.total), fmt: 'money' }])
        }
      }
    }
  },

  clienti1c: {
    title: { ro: 'Top clienți în 1C', ru: 'Топ клиентов в 1С' },
    hint: { ro: 'După suma facturată · 90 de zile', ru: 'По сумме счетов · 90 дней' },
    async collect(q, s) {
      if (!s.oneCTable) return null
      const rows = await q(
        `SELECT COALESCE(NULLIF(client, ''), 'nespecificat') AS client, SUM(suma) AS total
         FROM ${s.oneCTable} WHERE date(data) >= date('now', '-89 days')
         GROUP BY client ORDER BY total DESC LIMIT 8`
      )
      if (!rows.length || !rows.some(r => r.client !== 'nespecificat')) return null
      return {
        tiles: [],
        chart: {
          type: 'bars-h',
          unit: s.currency,
          fmt: 'money',
          color: 'alt',
          rows: rows.map(r => ({ label: label(SOURCE_LABELS, r.client, r.client), value: Number(r.total) }))
        },
        table: {
          head: [{ ro: 'Client', ru: 'Клиент' }, { ro: 'Facturat (' + s.currency + ')', ru: 'Выставлено (' + s.currency + ')' }],
          rows: rows.map(r => [label(SOURCE_LABELS, r.client, r.client), { v: Number(r.total), fmt: 'money' }])
        }
      }
    }
  }
}

module.exports = { PANELS }
