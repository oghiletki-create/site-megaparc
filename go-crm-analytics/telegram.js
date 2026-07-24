const nf = new Intl.NumberFormat('ro-RO')

function bar(value, max, width = 10) {
  const filled = max > 0 ? Math.round(value / max * width) : 0
  return '▰'.repeat(filled) + '▱'.repeat(width - filled)
}

function formatRaport(kpi) {
  const t = kpi.totals
  const lines = []
  lines.push('<b>📊 GO CRM — Raport ultimele 30 de zile</b>')
  lines.push('')
  lines.push(`👥 Lead-uri noi: <b>${nf.format(t.leads30d)}</b>`)
  lines.push(`✅ Vânzări încheiate: <b>${nf.format(t.won30d)}</b>`)
  lines.push(`📈 Rată de conversie: <b>${String(t.conversionRate).replace('.', ',')}%</b>`)
  lines.push(`💰 Venit: <b>${nf.format(t.revenue30d)} ${kpi.currency}</b>`)
  if (t.avgResponseMinutes != null) {
    lines.push(`⏱ Timp mediu de răspuns: <b>${nf.format(t.avgResponseMinutes)} min</b>`)
  }
  lines.push('')
  lines.push('<b>Pâlnia de vânzări (90 zile):</b>')
  const maxFunnel = kpi.funnel.length ? kpi.funnel[0].numar : 0
  for (const f of kpi.funnel) {
    lines.push(`${bar(f.numar, maxFunnel)} ${f.stadiu}: <b>${nf.format(f.numar)}</b>`)
  }
  if (kpi.topSources.length) {
    lines.push('')
    lines.push('<b>Top surse de lead-uri:</b>')
    for (const src of kpi.topSources) {
      lines.push(`• ${src.sursa}: <b>${nf.format(src.numar)}</b>`)
    }
  }
  return lines.join('\n')
}

module.exports = { formatRaport }
