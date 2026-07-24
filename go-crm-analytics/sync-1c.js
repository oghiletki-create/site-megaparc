const fs = require('fs')

const defaultOptions = {
  baseUrl: '',
  username: '',
  password: '',
  entity: 'Document_РеализацияТоваровУслуг',
  idField: 'Ref_Key',
  numberField: 'Number',
  dateField: 'Date',
  amountField: 'СуммаДокумента',
  clientField: null,
  postedOnly: true,
  sinceDays: 400,
  intervalMinutes: 30,
  table: 'vanzari_1c',
  logger: console
}

async function ensureTable(execute, table) {
  await execute(`CREATE TABLE IF NOT EXISTS ${table} (
    id TEXT PRIMARY KEY,
    numar TEXT,
    data TEXT,
    suma REAL,
    client TEXT
  )`)
}

function buildUrl(o, sinceIso) {
  const select = [o.idField, o.numberField, o.dateField, o.amountField, o.clientField, o.postedOnly ? 'Posted' : null]
    .filter(Boolean).join(',')
  const filters = [`${o.dateField} ge datetime'${sinceIso}'`]
  if (o.postedOnly) filters.push('Posted eq true')
  const params = new URLSearchParams({
    '$format': 'json',
    '$select': select,
    '$filter': filters.join(' and '),
    '$orderby': o.dateField
  })
  return `${o.baseUrl.replace(/\/$/, '')}/${o.entity}?${params.toString()}`
}

async function fetch1c(o, sinceIso) {
  const url = buildUrl(o, sinceIso)
  const res = await fetch(url, {
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${o.username}:${o.password}`).toString('base64'),
      Accept: 'application/json'
    }
  })
  if (!res.ok) throw new Error(`1C OData a răspuns cu HTTP ${res.status} la ${o.entity}`)
  const body = await res.json()
  return body.value || []
}

async function upsertRows(execute, o, rows) {
  let scrise = 0
  for (const r of rows) {
    const id = r[o.idField]
    if (!id) continue
    await execute(
      `INSERT INTO ${o.table} (id, numar, data, suma, client) VALUES (?,?,?,?,?)
       ON CONFLICT(id) DO UPDATE SET numar=excluded.numar, data=excluded.data, suma=excluded.suma, client=excluded.client`,
      [
        id,
        r[o.numberField] != null ? String(r[o.numberField]) : null,
        String(r[o.dateField]).replace('T', ' ').slice(0, 19),
        Number(r[o.amountField]) || 0,
        o.clientField ? (r[o.clientField] != null ? String(r[o.clientField]) : null) : null
      ]
    )
    scrise++
  }
  return scrise
}

async function sync1cOnce(execute, queryAll, overrides = {}) {
  const o = { ...defaultOptions, ...overrides }
  if (!o.baseUrl) throw new Error('Lipsește baseUrl pentru 1C OData')
  await ensureTable(execute, o.table)
  const last = await queryAll(`SELECT MAX(data) AS ultima FROM ${o.table}`)
  const fallback = new Date(Date.now() - o.sinceDays * 86400000)
  const since = last[0] && last[0].ultima
    ? new Date(new Date(last[0].ultima.replace(' ', 'T')).getTime() - 86400000)
    : fallback
  const sinceIso = since.toISOString().slice(0, 19)
  const rows = await fetch1c(o, sinceIso)
  const scrise = await upsertRows(execute, o, rows)
  o.logger.log(`Sincronizare 1C: ${scrise} documente actualizate (de la ${sinceIso})`)
  return scrise
}

function start1cSync(execute, queryAll, overrides = {}) {
  const o = { ...defaultOptions, ...overrides }
  const run = () => sync1cOnce(execute, queryAll, o).catch(err => o.logger.error('Sincronizare 1C eșuată:', err.message))
  run()
  return setInterval(run, o.intervalMinutes * 60000)
}

async function import1cCsv(execute, filePath, overrides = {}) {
  const o = { ...defaultOptions, ...overrides }
  await ensureTable(execute, o.table)
  const text = fs.readFileSync(filePath, 'utf8').replace(/^﻿/, '')
  const lines = text.split(/\r?\n/).filter(l => l.trim())
  let scrise = 0
  for (const line of lines) {
    const [id, numar, data, suma, client] = line.split(';').map(c => c.trim())
    if (!id || id.toLowerCase() === 'id') continue
    await execute(
      `INSERT INTO ${o.table} (id, numar, data, suma, client) VALUES (?,?,?,?,?)
       ON CONFLICT(id) DO UPDATE SET numar=excluded.numar, data=excluded.data, suma=excluded.suma, client=excluded.client`,
      [id, numar || null, data, Number(String(suma).replace(',', '.')) || 0, client || null]
    )
    scrise++
  }
  return scrise
}

module.exports = { sync1cOnce, start1cSync, import1cCsv, defaultOptions }
