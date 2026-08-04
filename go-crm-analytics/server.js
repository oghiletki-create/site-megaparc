const fs = require('fs')
const http = require('http')
const path = require('path')
const crypto = require('crypto')
const { collectKpi } = require('./analytics')
const { ICON_192, ICON_512 } = require('./icons')

const html = fs.readFileSync(path.join(__dirname, 'panou.html'), 'utf8')

const SW = `const CACHE = 'go-crm-panou-v2'
const SHELL = './'

function isSensitive(url) {
  const p = new URL(url).pathname
  return p.endsWith('/api') || p === '/api/kpi' || p.endsWith('/manifest.webmanifest')
}

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
  if (isSensitive(req.url)) {
    event.respondWith(fetch(req))
    return
  }
  event.respondWith(
    fetch(req).then(res => {
      const copy = res.clone()
      caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {})
      return res
    }).catch(() => caches.match(req).then(hit => hit || caches.match(SHELL)))
  )
})
`

function validTokens(token) {
  const list = Array.isArray(token) ? token : String(token == null ? '' : token).split(',')
  return list.map(t => String(t).trim()).filter(Boolean)
}

function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest()
  const hb = crypto.createHash('sha256').update(String(b)).digest()
  return crypto.timingSafeEqual(ha, hb)
}

function tokenOk(token, provided) {
  const valid = validTokens(token)
  if (!valid.length) return false
  if (provided == null || provided === '') return false
  return valid.some(t => safeEqual(t, provided))
}

function clientIp(req) {
  const fwd = req.headers && req.headers['x-forwarded-for']
  if (fwd) return String(fwd).split(',')[0].trim()
  return (req.socket && req.socket.remoteAddress) || (req.connection && req.connection.remoteAddress) || 'unknown'
}

function createRateLimiter({ max = 20, windowMs = 60000 } = {}) {
  const hits = new Map()
  const state = ip => {
    const now = Date.now()
    let s = hits.get(ip)
    if (!s || now - s.start > windowMs) { s = { start: now, count: 0 }; hits.set(ip, s) }
    return s
  }
  return {
    blocked(ip) { return state(ip).count >= max },
    fail(ip) { if (hits.size > 5000) hits.clear(); state(ip).count++ },
    reset(ip) { hits.delete(ip) }
  }
}

function secureHeaders(setter) {
  setter('Cache-Control', 'no-store')
  setter('Referrer-Policy', 'no-referrer')
  setter('X-Content-Type-Options', 'nosniff')
  setter('X-Frame-Options', 'DENY')
}

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

function queryOf(originalUrl) {
  const i = originalUrl.indexOf('?')
  return i === -1 ? '' : originalUrl.slice(i)
}

function registerPanelRoutes(app, queryAll, options = {}) {
  const opts = { basePath: '/panou', ...options }
  const base = opts.basePath
  const limiter = createRateLimiter()
  const guard = (req, res, next) => {
    const ip = clientIp(req)
    if (limiter.blocked(ip)) {
      secureHeaders((k, v) => res.set(k, v))
      return res.status(429).type('text/plain').send('429')
    }
    if (tokenOk(opts.token, req.query.token)) {
      limiter.reset(ip)
      secureHeaders((k, v) => res.set(k, v))
      return next()
    }
    limiter.fail(ip)
    secureHeaders((k, v) => res.set(k, v))
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
  const limiter = createRateLimiter()
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost')
    const p = url.pathname
    const send = (code, type, body, headers) => {
      res.writeHead(code, { 'Content-Type': type, ...(headers || {}) })
      res.end(body)
    }
    if (p === base + '/sw.js') return send(200, 'application/javascript', SW)
    if (p === base + '/icon-192.png') return send(200, 'image/png', Buffer.from(ICON_192, 'base64'))
    if (p === base + '/icon-512.png') return send(200, 'image/png', Buffer.from(ICON_512, 'base64'))
    const secure = {}
    secureHeaders((k, v) => { secure[k] = v })
    const ip = clientIp(req)
    if (limiter.blocked(ip)) return send(429, 'text/plain', '429', secure)
    if (!tokenOk(opts.token, url.searchParams.get('token'))) {
      limiter.fail(ip)
      return send(403, 'text/plain', '403', secure)
    }
    limiter.reset(ip)
    if (p === base || p === '/dashboard') {
      res.writeHead(302, { Location: base + '/' + (url.search || ''), ...secure })
      return res.end()
    }
    if (p === base + '/') return send(200, 'text/html; charset=utf-8', html, secure)
    if (p === base + '/manifest.webmanifest') {
      return send(200, 'application/manifest+json', JSON.stringify(manifestFor(url.search.replace(/^\?/, ''), opts)), secure)
    }
    if (p === base + '/api' || p === '/api/kpi') {
      try {
        return send(200, 'application/json', JSON.stringify(await collectKpi(queryAll, schemaOf(opts))), secure)
      } catch (err) {
        return send(500, 'application/json', JSON.stringify({ error: String((err && err.message) || err) }), secure)
      }
    }
    send(404, 'text/plain', '404', secure)
  })
  server.listen(opts.port, opts.host)
  return server
}

module.exports = {
  registerPanelRoutes,
  createPanelServer,
  registerDashboardRoutes: registerPanelRoutes,
  createDashboardServer: createPanelServer,
  tokenOk,
  validTokens
}
