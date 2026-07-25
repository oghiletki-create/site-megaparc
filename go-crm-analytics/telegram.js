const nf = new Intl.NumberFormat('ro-RO')

function bar(value, max, width = 10) {
  const filled = max > 0 ? Math.max(0, Math.round(value / max * width)) : 0
  return '▰'.repeat(Math.min(filled, width)) + '▱'.repeat(Math.max(0, width - filled))
}

function ro(o) {
  if (o == null) return ''
  return typeof o === 'string' ? o : (o.ro || '')
}

function fmtValue(value, fmt, currency) {
  if (value == null) return '—'
  if (fmt === 'money') return nf.format(Math.round(value)) + ' ' + currency
  if (fmt === 'pct') return value + '%'
  if (fmt === 'min') return nf.format(value) + ' min'
  if (fmt === 'days') return nf.format(value) + ' zile'
  return nf.format(value)
}

function cell(c, currency) {
  if (c == null) return '—'
  if (typeof c === 'number') return nf.format(c)
  if (typeof c === 'string') return c
  if (c.month) return c.month
  if (c.day) return c.day
  if (c.v !== undefined) return fmtValue(c.v, c.fmt, currency)
  return ro(c)
}

function formatRaport(kpi) {
  const currency = kpi.currency || 'EUR'
  const when = new Date(kpi.generatedAt).toLocaleString('ro-RO', {
    day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
  })
  let out = '📊 <b>PANOU ANALITIC</b>\n<i>' + when + '</i>\n'
  if (!kpi.sections || !kpi.sections.length) {
    return out + '\nNiciun modul activ în meniu. Activează un modul și raportul îl include automat.'
  }
  for (const section of kpi.sections) {
    out += '\n<b>' + ro(section.title).toUpperCase() + '</b>\n'
    out += '<i>' + ro(section.hint) + '</i>\n'
    for (const tile of section.tiles || []) {
      out += '• ' + ro(tile.label) + ': <b>' + fmtValue(tile.value, tile.fmt, currency) + '</b>'
      if (tile.note) out += ' <i>(' + ro(tile.note) + ')</i>'
      out += '\n'
    }
    const chart = section.chart
    if (chart && chart.rows && chart.rows.length && (chart.type === 'bars-h' || chart.type === 'funnel')) {
      const max = Math.max(...chart.rows.map(r => r.value), 1)
      for (const row of chart.rows.slice(0, 6)) {
        out += '  <code>' + bar(row.value, max) + '</code> ' + ro(row.label) +
          ' — ' + fmtValue(row.value, chart.fmt, currency) + '\n'
      }
    } else if (chart && chart.rows && chart.rows.length && chart.type === 'bars-v') {
      const rows = chart.rows.slice(-6)
      const max = Math.max(...rows.map(r => r.value), 1)
      for (const row of rows) {
        out += '  <code>' + bar(row.value, max) + '</code> ' + row.key +
          ' — ' + fmtValue(row.value, chart.fmt, currency) + '\n'
      }
    } else if (chart && chart.type === 'line' && chart.rows.length) {
      const total = chart.rows.reduce((a, r) => a + r.value, 0)
      const best = chart.rows.reduce((b, r) => r.value > b.value ? r : b, chart.rows[0])
      out += '  Total 30 zile: <b>' + nf.format(total) + '</b> · vârf ' + best.key + ': <b>' + nf.format(best.value) + '</b>\n'
    }
    if (!section.tiles.length && !chart && section.table) {
      for (const row of section.table.rows.slice(0, 6)) {
        out += '  • ' + row.map(c => cell(c, currency)).join(' · ') + '\n'
      }
    }
  }
  return out
}

module.exports = { formatRaport }
