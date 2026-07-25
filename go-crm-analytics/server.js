const fs = require('fs')
const http = require('http')
const path = require('path')
const { collectKpi } = require('./analytics')
const { ICON_192, ICON_512 } = require('./icons')

const html = fs.readFileSync(path.join(__dirname, 'panou.html'), 'utf8')

const SW = `const CACHE = 'go-crm-panou-v1'
const SHELL = './'

self.addEventListener('install', event => {
  self.skipWaiting()
  event.waitUntil(caches.open(CACHE).then(c => c.add(SHELL)).catch(() => {}))
})

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()))
})

self.addEventListener('fetch', event => {
  const req = event.request
  if (req.method !== 'GET') return
  event.respondWith(
    fetch(req).then(res => {
      const copy = res.clone()
      caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {})
      return res
    }).catch(() => caches.match(req).then(hit => hit || caches.match(SHELL)))
  )
})
`

function manifestFor(query, opts) {
  const suffix = query ? '?' + query : ''
  const company = opts.company && !/^go\s*crm$/i.test(String(opts.company).trim()) ? opts.company : null
  return {
    name: (company ? company + ' — ' : '') + 'GO CRM · Panou analitic',
    short_name: 'GO CRM',
    description: 'Raportare live din CRM-ul din Telegram',
    start_url: './' + suffix,
    scope: './',
    display: 'standalone',
    orientation: 'any',
    background_color: '#f9f9f7',
    theme_color: '#2a78d6',
    lang: 'ro',
    icons: [
      { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
    ]
  }
}

function schemaOf(opts) {
  return typeof opts.schema === 'function' ? opts.schema() : (opts.schema || {})
}

function tokenOk(token, provided) {
  return !token || String(provided || '') === String(token)
}

function queryOf(originalUrl) {
  const i = originalUrl.indexOf('?')
  return i === -1 ? '' : originalUrl.slice(i)
}

function registerPanelRoutes(app, queryAll, options = {}) {
  const opts = { basePath: '/panou', ...options }
  const base = opts.basePath
  const guard = (req, res, next) => {
    if (tokenOk(opts.token, req.query.token)) return next()
    res.status(403).type('text/plain').send('403')
  }
  const sendKpi = async (req, res) => {
    try {
      res.set('Cache-Control', 'no-store')
      res.json(await collectKpi(queryAll, schemaOf(opts)))
    } catch (err) {
      res.status(500).json({ error: String((err && err.message) || err) })
    }
  }

  app.get(base, (req, res, next) => {
    if (req.path !== base) return next()
    res.redirect(302, base + '/' + queryOf(req.originalUrl))
  })
  app.get(base + '/', guard, (req, res) => res.type('html').send(html))
  app.get(base + '/api', guard, sendKpi)
  app.get(base + '/manifest.webmanifest', guard, (req, res) => {
    res.type('application/manifest+json')
    res.send(JSON.stringify(manifestFor(queryOf(req.originalUrl).replace(/^\?/, ''), opts)))
  })
  app.get(base + '/sw.js', (req, res) => res.type('application/javascript').send(SW))
  app.get(base + '/icon-192.png', (req, res) => res.type('png').send(Buffer.from(ICON_192, 'base64')))
  app.get(base + '/icon-512.png', (req, res) => res.type('png').send(Buffer.from(ICON_512, 'base64')))

  app.get('/dashboard', (req, res) => res.redirect(302, base + '/' + queryOf(req.originalUrl)))
  app.get('/api/kpi', guard, sendKpi)
}

function createPanelServer(queryAll, options = {}) {
  const opts = { port: 8080, host: '0.0.0.0', basePath: '/panou', ...options }
  const base = opts.basePath
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost')
    const p = url.pathname
    const send = (code, type, body) => { res.writeHead(code, { 'Content-Type': type }); res.end(body) }
    if (p === base + '/sw.js') return send(200, 'application/javascript', SW)
    if (p === base + '/icon-192.png') return send(200, 'image/png', Buffer.from(ICON_192, 'base64'))
    if (p === base + '/icon-512.png') return send(200, 'image/png', Buffer.from(ICON_512, 'base64'))
    if (!tokenOk(opts.token, url.searchParams.get('token'))) return send(403, 'text/plain', '403')
    if (p === base || p === '/dashboard') {
      res.writeHead(302, { Location: base + '/' + (url.search || '') })
      return res.end()
    }
    if (p === base + '/') return send(200, 'text/html; charset=utf-8', html)
    if (p === base + '/manifest.webmanifest') {
      return send(200, 'application/manifest+json', JSON.stringify(manifestFor(url.search.replace(/^\?/, ''), opts)))
    }
    if (p === base + '/api' || p === '/api/kpi') {
      try {
        return send(200, 'application/json', JSON.stringify(await collectKpi(queryAll, schemaOf(opts))))
      } catch (err) {
        return send(500, 'application/json', JSON.stringify({ error: String((err && err.message) || err) }))
      }
    }
    send(404, 'text/plain', '404')
  })
  server.listen(opts.port, opts.host)
  return server
}

module.exports = {
  registerPanelRoutes,
  createPanelServer,
  registerDashboardRoutes: registerPanelRoutes,
  createDashboardServer: createPanelServer
}
