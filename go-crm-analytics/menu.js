const MENU = [
  {
    id: 'contabilitate',
    label: '🧾 Contabilitate',
    labelRu: '🧾 Бухгалтерия',
    callback: 'menu_contabilitate',
    defaultOn: true,
    items: [
      { id: 'clienti', label: '👥 Chiriași', labelRu: '👥 Арендаторы', callback: 'menu_clienti', panel: 'chiriasi' },
      { id: 'adauga_client', label: '➕ Adaugă Chiriaș', labelRu: '➕ Добавить арендатора', callback: 'menu_adauga_client', panel: null },
      { id: 'restante', label: '🔴 Restanțe', labelRu: '🔴 Задолженности', callback: 'menu_restante', panel: 'restante' },
      { id: 'scadente', label: '📅 Scadențe', labelRu: '📅 Сроки оплаты', callback: 'menu_scadente', panel: 'scadente' },
      { id: 'registru', label: '📒 Registru Încasări', labelRu: '📒 Реестр поступлений', callback: 'menu_registru', panel: 'incasari' },
      { id: 'reconciliere', label: '🔄 Reconciliere', labelRu: '🔄 Сверка', callback: 'menu_reconciliere', panel: null },
      { id: 'facturi', label: '🧾 Generează Factură', labelRu: '🧾 Выставить счёт', callback: 'menu_facturi', panel: null }
    ]
  },
  {
    id: 'sarcini',
    label: '📋 Sarcini',
    labelRu: '📋 Задачи',
    callback: 'menu_dashboard',
    defaultOn: false,
    panel: 'departamente'
  },
  {
    id: 'angajati',
    label: '👷 Angajați',
    labelRu: '👷 Сотрудники',
    callback: 'menu_angajati',
    defaultOn: false,
    panel: 'angajati'
  },
  {
    id: 'raport',
    label: '📊 Raport General',
    labelRu: '📊 Общий отчёт',
    callback: 'menu_raport_general',
    defaultOn: false,
    panel: 'raport'
  },
  {
    id: 'vanzari',
    label: '🎯 Vânzări',
    labelRu: '🎯 Продажи',
    callback: 'menu_vanzari',
    defaultOn: false,
    panelOnly: true,
    items: [
      { id: 'leaduri', label: '🆕 Lead-uri noi', labelRu: '🆕 Новые лиды', callback: 'menu_leaduri', panel: 'leaduri', panelOnly: true },
      { id: 'palnie', label: '🔻 Pâlnia de vânzări', labelRu: '🔻 Воронка продаж', callback: 'menu_palnie', panel: 'palnie', panelOnly: true },
      { id: 'surse', label: '📣 Surse', labelRu: '📣 Источники', callback: 'menu_surse', panel: 'surse', panelOnly: true },
      { id: 'callcenter', label: '📞 Call center', labelRu: '📞 Колл-центр', callback: 'menu_callcenter', panel: 'callcenter', panelOnly: true }
    ]
  },
  {
    id: 'prospecti',
    label: '🤝 Prospecți',
    labelRu: '🤝 Проспекты',
    callback: 'menu_prospecti',
    defaultOn: false,
    panel: 'prospecti',
    panelOnly: true
  },
  {
    id: 'unuc',
    label: '🧮 1C',
    labelRu: '🧮 1С',
    callback: 'menu_1c',
    defaultOn: false,
    panelOnly: true,
    items: [
      { id: 'venit1c', label: '💶 Venit facturat', labelRu: '💶 Выставлено', callback: 'menu_1c_venit', panel: 'venit1c', panelOnly: true },
      { id: 'clienti1c', label: '🏆 Top clienți', labelRu: '🏆 Топ клиентов', callback: 'menu_1c_clienti', panel: 'clienti1c', panelOnly: true }
    ]
  },
  {
    id: 'jurist',
    label: '⚖️ Jurist AI',
    labelRu: '⚖️ Юрист AI',
    callback: 'menu_jurist',
    defaultOn: false,
    panel: null
  }
]

function parseList(raw) {
  return String(raw || '').split(',').map(s => s.trim()).filter(Boolean)
}

function envModules() {
  const list = parseList(process.env.MODULES)
  return list.length ? list : null
}

function activeMenu(opts = {}) {
  const forced = opts.modules ? parseList(opts.modules.join ? opts.modules.join(',') : opts.modules) : envModules()
  const extra = opts.extra ? parseList(opts.extra.join ? opts.extra.join(',') : opts.extra) : []
  const off = opts.off ? parseList(opts.off.join ? opts.off.join(',') : opts.off) : []
  return MENU.filter(section => {
    if (off.includes(section.id)) return false
    if (extra.includes(section.id)) return true
    return forced ? forced.includes(section.id) : section.defaultOn
  })
}

function adminKeyboard(sections) {
  return sections.map(section => [{ text: section.label, callback_data: section.callback }])
}

function submenuKeyboard(section, backCallback) {
  const rows = (section.items || []).map(item => [{ text: item.label, callback_data: item.callback }])
  if (backCallback) rows.push([{ text: '◀️ Înapoi', callback_data: backCallback }])
  return rows
}

function panelsOf(sections) {
  const out = []
  for (const section of sections) {
    if (section.panel) {
      out.push({
        panel: section.panel,
        menuId: section.id,
        path: { ro: section.label, ru: section.labelRu }
      })
    }
    for (const item of section.items || []) {
      if (!item.panel) continue
      out.push({
        panel: item.panel,
        menuId: section.id + '.' + item.id,
        path: { ro: section.label + ' → ' + item.label, ru: section.labelRu + ' → ' + item.labelRu }
      })
    }
  }
  return out
}

function panelOnlyRoutes(sections) {
  const routes = {}
  for (const section of sections) {
    if (section.panelOnly) {
      routes[section.callback] = {
        panel: section.panel || null,
        label: section.label,
        items: (section.items || []).map(i => ({ text: i.label, callback_data: i.callback }))
      }
    }
    for (const item of section.items || []) {
      if (item.panelOnly) routes[item.callback] = { panel: item.panel || null, label: item.label, items: [] }
    }
  }
  return routes
}

function menuTree(sections) {
  return sections.map(section => ({
    id: section.id,
    label: { ro: section.label, ru: section.labelRu },
    items: (section.items || []).map(item => ({
      id: item.id,
      label: { ro: item.label, ru: item.labelRu },
      panel: item.panel || null
    })),
    panel: section.panel || null
  }))
}

module.exports = { MENU, activeMenu, adminKeyboard, submenuKeyboard, panelsOf, panelOnlyRoutes, menuTree }
