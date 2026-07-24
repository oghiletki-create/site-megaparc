const http = require('http')
const fs = require('fs')
const path = require('path')
const { collectKpi } = require('./analytics')

function createDashboardServer(queryAll, options = {}) {
  const port = options.port || 8090
  const host = options.host || '127.0.0.1'
  const schema = options.schema || {}
  const token = options.token || null
  const htmlPath = path.join(__dirname, 'dashboard.html')

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`)
    if (token && url.searchParams.get('token') !== token) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' })
      res.end('Acces interzis')
      return
    }
    if (url.pathname === '/api/kpi') {
      try {
        const kpi = await collectKpi(queryAll, schema)
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
        res.end(JSON.stringify(kpi))
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' })
        res.end(JSON.stringify({ error: err.message }))
      }
      return
    }
    if (url.pathname === '/' || url.pathname === '/dashboard') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end(fs.readFileSync(htmlPath))
      return
    }
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('Pagina nu există')
  })

  server.listen(port, host, () => {
    console.log(`Panou analitic GO CRM: http://${host}:${port}/`)
  })
  return server
}

module.exports = { createDashboardServer }
