const { PANELS } = require('./panels')
const { activeMenu, panelsOf, menuTree } = require('./menu')

const defaultSchema = {
  leadsTable: 'leads',
  createdAtColumn: 'created_at',
  statusColumn: 'status',
  sourceColumn: 'source',
  timestampFormat: 'iso',
  stageOrder: ['nou', 'contactat', 'oferta', 'castigat'],
  stageLabels: { nou: 'Nou', contactat: 'Contactat', oferta: 'Ofertă', castigat: 'Câștigat' },
  wonStatuses: ['castigat'],
  clientsTable: 'clients',
  employeesTable: 'employees',
  tasksTable: 'tasks',
  prospectsTable: 'prospects',
  revenueTable: 'payments',
  revenueDateColumn: 'date',
  revenueAmountColumn: 'amount_eur',
  oneCTable: null,
  callCenter: null,
  menu: null,
  company: null,
  currency: 'EUR'
}

async function collectKpi(queryAll, overrides = {}) {
  const s = { ...defaultSchema, ...overrides }
  const menu = s.menu && s.menu.length ? s.menu : activeMenu()
  const sections = []
  for (const entry of panelsOf(menu)) {
    const def = PANELS[entry.panel]
    if (!def) continue
    let data = null
    try {
      data = await def.collect(queryAll, s)
    } catch {
      data = null
    }
    if (!data) continue
    sections.push({
      id: entry.panel,
      menuId: entry.menuId,
      path: entry.path,
      title: def.title,
      hint: def.hint,
      wide: !!def.wide,
      tiles: data.tiles || [],
      chart: data.chart || null,
      table: data.table || null
    })
  }
  return {
    generatedAt: new Date().toISOString(),
    currency: s.currency,
    company: s.company,
    menu: menuTree(menu),
    sections
  }
}

module.exports = { collectKpi, defaultSchema }
