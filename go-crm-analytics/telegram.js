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
  if (kpi.callCenter) {
    const cc = kpi.callCenter
    lines.push('')
    lines.push('<b>☎️ Call center (30 zile):</b>')
    lines.push(`📞 Apeluri: <b>${nf.format(cc.apeluri30d)}</b> · Contactați: <b>${nf.format(cc.contactati30d)}</b>${cc.rataContactare != null ? ' (' + cc.rataContactare + '%)' : ''}`)
    const calitate = []
    if (cc.reactieMedieMinute != null) calitate.push(`⚡ Reacție medie la lead: <b>${nf.format(cc.reactieMedieMinute)} min</b>`)
    if (cc.procesatePct != null) calitate.push(`📥 Lead-uri preluate: <b>${cc.procesatePct}%</b>`)
    if (calitate.length) lines.push(calitate.join(' · '))
    for (const a of cc.perAgent.slice(0, 5)) {
      lines.push(`• ${a.agent}: <b>${nf.format(a.apeluri)}</b> apeluri, <b>${nf.format(a.contactati)}</b> contactați, <b>${nf.format(a.castigati)}</b> câștigați`)
    }
  }
  if (kpi.departments && kpi.departments.length) {
    lines.push('')
    lines.push('<b>🏬 Departamente (30 zile):</b>')
    for (const d of kpi.departments) {
      const parts = [`<b>${nf.format(d.finalizate30d)}</b> sarcini finalizate`]
      if (d.rataLaTimp != null) parts.push(`<b>${d.rataLaTimp}%</b> la timp`)
      if (d.notaMedie != null) parts.push(`nota AI <b>${String(d.notaMedie).replace('.', ',')}</b>`)
      parts.push(`${nf.format(d.sarciniActive)} active`)
      lines.push(`• ${d.departament}: ` + parts.join(', '))
    }
  }
  if (kpi.oneC) {
    lines.push('')
    lines.push(`🏢 Venit facturat în 1C (30 zile): <b>${nf.format(kpi.oneC.revenue30d)} ${kpi.currency}</b>`)
    if (kpi.oneC.topClients.length) {
      lines.push('<b>Top clienți 1C (90 zile):</b>')
      for (const c of kpi.oneC.topClients) {
        lines.push(`• ${c.client}: <b>${nf.format(c.total)} ${kpi.currency}</b>`)
      }
    }
  }
  return lines.join('\n')
}

module.exports = { formatRaport }
