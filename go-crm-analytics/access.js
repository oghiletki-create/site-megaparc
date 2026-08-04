const crypto = require('crypto')
const { MENU } = require('./menu')

const ROLES = ['ceo', 'head', 'employee']
const SECTION_IDS = MENU.map(s => s.id)

function b64url(buf) {
  return Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromB64url(str) {
  return Buffer.from(String(str).replace(/-/g, '+').replace(/_/g, '/'), 'base64')
}

function normList(raw) {
  if (raw == null) return []
  const list = Array.isArray(raw) ? raw : String(raw).split(',')
  return list.map(x => String(x).trim()).filter(Boolean)
}

function sign(payload, secret) {
  if (!secret) throw new Error('Lipsește cheia de semnare (PANEL_SECRET)')
  const body = b64url(Buffer.from(JSON.stringify(payload)))
  const mac = b64url(crypto.createHmac('sha256', String(secret)).update(body).digest())
  return body + '.' + mac
}

function verify(token, secret) {
  if (!secret || !token || typeof token !== 'string') return null
  const dot = token.indexOf('.')
  if (dot < 1 || dot === token.length - 1) return null
  const body = token.slice(0, dot)
  const mac = token.slice(dot + 1)
  const expected = b64url(crypto.createHmac('sha256', String(secret)).update(body).digest())
  const a = Buffer.from(mac)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null
  let payload
  try {
    payload = JSON.parse(fromB64url(body).toString('utf8'))
  } catch {
    return null
  }
  if (!payload || !ROLES.includes(payload.role)) return null
  if (payload.exp && Date.now() > Number(payload.exp) * 1000) return null
  return payload
}

function mint(claims, secret, opts = {}) {
  const role = ROLES.includes(claims.role) ? claims.role : 'employee'
  const payload = { role }
  const dept = claims.dept != null ? String(claims.dept).trim() : ''
  if (dept) payload.dept = dept
  if (claims.name) payload.name = String(claims.name).trim()
  if (claims.emp != null && claims.emp !== '') payload.emp = String(claims.emp).trim()
  const menu = normList(claims.menu)
  if (menu.length) payload.menu = menu
  const days = opts.days != null ? Number(opts.days) : 365
  if (days > 0) payload.exp = Math.floor(Date.now() / 1000) + Math.round(days * 86400)
  return sign(payload, secret)
}

function scopeFromClaims(claims) {
  if (!claims) return null
  if (claims.role === 'ceo') return { role: 'ceo' }
  return {
    role: claims.role,
    dept: claims.dept || null,
    emp: claims.emp != null ? claims.emp : null,
    name: claims.name || null,
    menu: Array.isArray(claims.menu) ? claims.menu : null
  }
}

function resolveScope(provided, opts = {}) {
  const claims = verify(provided, opts.secret)
  if (claims) return scopeFromClaims(claims)
  return null
}

function grantableSections() {
  return MENU.map(s => ({ id: s.id, ro: s.label, ru: s.labelRu }))
}

function capabilities(scope) {
  const all = grantableSections()
  if (!scope || (scope.role !== 'ceo' && scope.role !== 'head')) {
    return { role: scope ? scope.role : null, canGrant: false, sections: [] }
  }
  if (scope.role === 'ceo') {
    return { role: 'ceo', canGrant: true, canPickRole: true, canPickDept: true, dept: null, sections: all }
  }
  const allow = Array.isArray(scope.menu) && scope.menu.length ? new Set(scope.menu) : null
  const sections = allow ? all.filter(s => allow.has(s.id)) : all
  return { role: 'head', canGrant: true, canPickRole: false, canPickDept: false, dept: scope.dept || null, sections }
}

function delegate(caller, req, secret) {
  if (!caller || (caller.role !== 'ceo' && caller.role !== 'head')) {
    return { error: 'Nu ai dreptul să adaugi persoane.' }
  }
  if (!secret) return { error: 'Lipsește cheia de semnare (PANEL_SECRET).' }
  const name = req && req.name != null ? String(req.name).trim() : ''
  if (!name) return { error: 'Numele e obligatoriu.' }
  const reqMenu = normList(req.menu).filter(id => SECTION_IDS.includes(id))
  let role, dept, menu, days, emp

  if (caller.role === 'ceo') {
    role = req.role === 'employee' ? 'employee' : 'head'
    dept = req.dept != null ? String(req.dept).trim() : ''
    if (role === 'head' && !dept) return { error: 'Departamentul e obligatoriu pentru un director.' }
    menu = reqMenu
    emp = req.emp
    days = role === 'head' ? 365 : 180
  } else {
    if (!caller.dept) return { error: 'Contul tău nu are un departament setat, nu poți adăuga angajați.' }
    role = 'employee'
    dept = caller.dept
    const allowed = Array.isArray(caller.menu) && caller.menu.length ? caller.menu : SECTION_IDS
    menu = (reqMenu.length ? reqMenu : allowed).filter(id => allowed.includes(id))
    emp = req.emp
    days = 180
  }

  const token = mint({ role, dept, name, emp, menu }, secret, { days })
  return { ok: true, role, dept, name, menu, days, token }
}

if (require.main === module) {
  const args = process.argv.slice(2)
  const secret = process.env.PANEL_SECRET
  const get = (flag) => {
    const i = args.indexOf(flag)
    return i !== -1 && i + 1 < args.length ? args[i + 1] : null
  }
  const cmd = args[0]
  if (cmd === 'verify') {
    console.log(JSON.stringify(verify(args[1], secret), null, 2))
  } else if (cmd === 'sign' || cmd === 'mint' || ROLES.includes(cmd)) {
    if (!secret) {
      console.error('Setează PANEL_SECRET în mediu înainte de a genera un token.')
      process.exit(1)
    }
    const role = ROLES.includes(cmd) ? cmd : (get('--role') || 'employee')
    const menu = get('--menu')
    const badMenu = normList(menu).filter(id => !SECTION_IDS.includes(id))
    if (badMenu.length) {
      console.error('Atenție: module necunoscute în meniu: ' + badMenu.join(', '))
      console.error('Module valide: ' + SECTION_IDS.join(', '))
    }
    const token = mint(
      { role, dept: get('--dept'), name: get('--name'), emp: get('--emp'), menu },
      secret,
      { days: get('--days') != null ? Number(get('--days')) : 365 }
    )
    const base = process.env.PANEL_URL || process.env.PUBLIC_URL || 'https://<domeniul-botului>'
    console.log('token: ' + token)
    console.log('link:  ' + base.replace(/\/$/, '') + '/panou/?token=' + token)
  } else {
    console.log('Utilizare:')
    console.log('  PANEL_SECRET=... node access.js ceo')
    console.log('  PANEL_SECRET=... node access.js head --dept "Vânzări" --menu vanzari,angajati --name "Ion" --days 180')
    console.log('  PANEL_SECRET=... node access.js employee --dept "Vânzări" --emp 42 --menu sarcini --name "Ana"')
    console.log('  PANEL_SECRET=... node access.js verify <token>')
    console.log('')
    console.log('Roluri: ceo (vede tot), head (doar departamentul + meniul lui), employee (doar meniul lui, datele proprii)')
    console.log('Module valide pentru --menu: ' + SECTION_IDS.join(', '))
  }
}

module.exports = { sign, verify, mint, resolveScope, scopeFromClaims, capabilities, delegate, grantableSections, ROLES, SECTION_IDS }
