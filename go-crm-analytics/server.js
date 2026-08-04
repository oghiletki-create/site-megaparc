const fs = require('fs')
const http = require('http')
const path = require('path')
const crypto = require('crypto')
const { collectKpi } = require('./analytics')
const { resolveScope, capabilities, delegate } = require('./access')
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

const ACCESS_PAGE = `<!doctype html><html lang="ro"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>GO CRM · Acces</title>
<style>
:root{--bg:#f9f9f7;--card:#fff;--text:#1a1a1a;--muted:#6b7280;--line:#e5e7eb;--accent:#2a78d6;--ok:#137a4b;--err:#b42318}
@media(prefers-color-scheme:dark){:root{--bg:#16171a;--card:#1f2126;--text:#f2f2f2;--muted:#9aa0a6;--line:#33363c;--accent:#5aa0ef}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:16px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
main{max-width:560px;margin:0 auto;padding:24px 18px}
h1{font-size:22px;margin:0 0 4px}.muted{color:var(--muted)}
label{display:block;margin:14px 0 4px;font-weight:600}
input,select{width:100%;padding:10px 12px;border:1px solid var(--line);border-radius:10px;background:var(--card);color:var(--text);font:inherit}
fieldset{margin:16px 0;border:1px solid var(--line);border-radius:12px;padding:10px 14px}
legend{padding:0 6px;color:var(--muted);font-size:14px}
.chk{font-weight:400;display:flex;align-items:center;gap:8px;margin:6px 0}.chk input{width:auto}
button{margin-top:18px;padding:12px 18px;border:0;border-radius:10px;background:var(--accent);color:#fff;font:inherit;font-weight:600;cursor:pointer}
a.tg{display:inline-block;margin-left:8px;padding:12px 18px;border-radius:10px;background:#229ed9;color:#fff;text-decoration:none;font-weight:600}
textarea{width:100%;margin-top:10px;padding:10px 12px;border:1px solid var(--line);border-radius:10px;background:var(--card);color:var(--text);font:14px/1.4 ui-monospace,monospace}
.ok{color:var(--ok)}.err{color:var(--err)}.row{margin-top:10px;display:flex;align-items:center;flex-wrap:wrap;gap:8px}
.card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px 18px;margin-top:16px}
</style></head><body><main id="app"><p class="muted">Se încarcă…</p></main>
<script>
(function(){
  var params=new URLSearchParams(location.search);var token=params.get('token')||'';
  var app=document.getElementById('app');
  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function api(path,extra){var u=path+'?token='+encodeURIComponent(token)+(extra||'');return fetch(u,{cache:'no-store'}).then(function(r){return r.json().then(function(j){return {ok:r.ok,j:j};},function(){return {ok:false,j:{}};});});}
  api('acces/api').then(function(res){var c=res.j;if(!res.ok||!c||!c.canGrant){app.innerHTML='<h1>Acces</h1><p class="muted">Nu ai drept de administrare aici.</p>';return;}render(c);}).catch(function(){app.innerHTML='<p class="err">Eroare de conexiune.</p>';});
  function render(c){
    var h='<h1>Adaugă persoană</h1>';
    if(c.role==='ceo'){
      h+='<label for="role">Tip</label><select id="role"><option value="head">Director de departament</option><option value="employee">Angajat</option></select>';
      h+='<label for="dept">Departament</label><input id="dept" placeholder="ex: Vânzări">';
    } else {
      h+='<p class="muted">Adaugi angajați în departamentul <b>'+esc(c.dept||'—')+'</b>.</p>';
    }
    h+='<label for="name">Nume</label><input id="name" placeholder="ex: Ion Popescu">';
    h+='<fieldset><legend>Ce module vede</legend>';
    (c.sections||[]).forEach(function(s){h+='<label class="chk"><input type="checkbox" name="menu" value="'+esc(s.id)+'"> '+esc(s.ro)+'</label>';});
    h+='</fieldset><button id="go">Generează link</button><div id="out"></div>';
    app.innerHTML=h;
    document.getElementById('go').addEventListener('click',function(){submit(c);});
  }
  function submit(c){
    var name=(document.getElementById('name').value||'').trim();
    if(!name){alert('Scrie numele.');return;}
    var menu=Array.prototype.slice.call(document.querySelectorAll('input[name=menu]:checked')).map(function(x){return x.value;});
    var extra='&name='+encodeURIComponent(name)+'&menu='+encodeURIComponent(menu.join(','));
    if(c.role==='ceo'){
      extra+='&role='+encodeURIComponent(document.getElementById('role').value);
      extra+='&dept='+encodeURIComponent((document.getElementById('dept').value||'').trim());
    }
    api('acces/nou',extra).then(function(res){
      var out=document.getElementById('out');
      if(!res.ok||!res.j||res.j.error){out.innerHTML='<p class="err">'+esc((res.j&&res.j.error)||'Eroare')+'</p>';return;}
      var basePath=location.pathname.replace(/\\/acces\\/?$/,'');
      var link=location.origin+basePath+'/?token='+encodeURIComponent(res.j.token);
      out.innerHTML='<div class="card"><p class="ok">Link pentru <b>'+esc(res.j.name)+'</b> — trimite-i-l:</p>'+
        '<textarea id="lnk" readonly rows="3">'+esc(link)+'</textarea>'+
        '<div class="row"><button id="copy" type="button">Copiază</button>'+
        '<a class="tg" target="_blank" rel="noopener" href="https://t.me/share/url?url='+encodeURIComponent(link)+'">Trimite pe Telegram</a></div></div>';
      document.getElementById('copy').addEventListener('click',function(){
        var t=document.getElementById('lnk');t.select();try{document.execCommand('copy');}catch(e){}
        if(navigator.clipboard){navigator.clipboard.writeText(link).catch(function(){});}
        this.textContent='Copiat ✓';
      });
    });
  }
})();
</script></body></html>`

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

function authScope(opts, provided) {
  if (tokenOk(opts.token, provided)) return { role: 'ceo' }
  return resolveScope(provided, { secret: opts.secret })
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
    secureHeaders((k, v) => res.set(k, v))
    if (limiter.blocked(ip)) {
      return res.status(429).type('text/plain').send('429')
    }
    const scope = authScope(opts, req.query.token)
    if (scope) {
      limiter.reset(ip)
      req.panelScope = scope
      return next()
    }
    limiter.fail(ip)
    res.status(403).type('text/plain').send('403')
  }
  const sendKpi = async (req, res) => {
    try {
      res.set('Cache-Control', 'no-store')
      res.json(await collectKpi(queryAll, schemaOf(opts), req.panelScope))
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
  app.get(base + '/acces', guard, (req, res) => res.type('html').send(ACCESS_PAGE))
  app.get(base + '/acces/api', guard, (req, res) => res.json(capabilities(req.panelScope)))
  app.get(base + '/acces/nou', guard, (req, res) => {
    const out = delegate(req.panelScope, req.query, opts.secret)
    res.status(out.error ? 400 : 200).json(out)
  })
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
    const scope = authScope(opts, url.searchParams.get('token'))
    if (!scope) {
      limiter.fail(ip)
      return send(403, 'text/plain', '403', secure)
    }
    limiter.reset(ip)
    if (p === base || p === '/dashboard') {
      res.writeHead(302, { Location: base + '/' + (url.search || ''), ...secure })
      return res.end()
    }
    if (p === base + '/') return send(200, 'text/html; charset=utf-8', html, secure)
    if (p === base + '/acces') return send(200, 'text/html; charset=utf-8', ACCESS_PAGE, secure)
    if (p === base + '/acces/api') {
      return send(200, 'application/json', JSON.stringify(capabilities(scope)), secure)
    }
    if (p === base + '/acces/nou') {
      const params = {
        role: url.searchParams.get('role'),
        dept: url.searchParams.get('dept'),
        name: url.searchParams.get('name'),
        emp: url.searchParams.get('emp'),
        menu: url.searchParams.get('menu')
      }
      const out = delegate(scope, params, opts.secret)
      return send(out.error ? 400 : 200, 'application/json', JSON.stringify(out), secure)
    }
    if (p === base + '/manifest.webmanifest') {
      return send(200, 'application/manifest+json', JSON.stringify(manifestFor(url.search.replace(/^\?/, ''), opts)), secure)
    }
    if (p === base + '/api' || p === '/api/kpi') {
      try {
        return send(200, 'application/json', JSON.stringify(await collectKpi(queryAll, schemaOf(opts), scope)), secure)
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
