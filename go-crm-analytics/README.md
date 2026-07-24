# GO CRM — Modul de analitică (dashboard stil Power BI)

Panou analitic pentru GO CRM: KPI-uri live din baza de date SQLite a sistemului de
automatizare direct în Telegram, afișate într-un dashboard web interactiv și
într-un raport trimis direct în Telegram prin comanda `/raport`.

Fără licențe Power BI, fără servicii externe, fără dependențe noi de npm —
totul rulează în același proces Node.js ca GO CRM.

## Ce conține

| Fișier | Rol |
|---|---|
| `analytics.js` | Interogările SQL și calculul KPI-urilor (`collectKpi`) |
| `server.js` | Server HTTP minimal care servește dashboard-ul și `/api/kpi` |
| `telegram.js` | Formatarea raportului pentru mesaj Telegram (`formatRaport`) |
| `dashboard.html` | Dashboard-ul vizual (autonom, fără CDN-uri, temă luminoasă/întunecată) |

KPI-uri calculate: lead-uri noi pe zi (30 zile), rată de conversie, venit pe
30 de zile, pâlnia de vânzări pe etape (90 zile), venit pe lună (6 luni),
top 5 surse de lead-uri, timp mediu de răspuns (opțional).

Poți vedea dashboard-ul imediat, fără date reale: deschide `dashboard.html`
în browser — pornește în modul DEMO cu date exemplu.

## Integrare în GO CRM (4 pași)

### 1. Copiază folderul

Copiază folderul `go-crm-analytics/` în rădăcina proiectului GO CRM, lângă
`bot.js` și `db.js`.

### 2. Creează adaptorul de interogare

Modulul nu impune un driver de SQLite — primește o funcție `queryAll(sql, params)`
care întoarce rândurile ca listă de obiecte.

Pentru `better-sqlite3`:

```js
const Database = require('better-sqlite3')
const db = new Database('crm.db')
const queryAll = async (sql, params = []) => db.prepare(sql).all(...params)
```

Pentru `sqlite3` (API cu callback):

```js
const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('crm.db')
const queryAll = (sql, params = []) =>
  new Promise((resolve, reject) =>
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows))))
```

Dacă `db.js` exportă deja conexiunea, refolosește-o — nu deschide a doua conexiune.

### 3. Mapează schema reală

`analytics.js` are o schemă implicită (tabelul `leads` cu coloanele `created_at`,
`status`, `source`, `amount`). Dacă în GO CRM tabelul sau coloanele se numesc
altfel, transmite maparea la apel — nu modifica interogările:

```js
const schema = {
  leadsTable: 'clienti',
  createdAtColumn: 'data_crearii',
  statusColumn: 'etapa',
  sourceColumn: 'sursa',
  amountColumn: 'suma',
  timestampFormat: 'iso',
  stageOrder: ['nou', 'contactat', 'oferta', 'castigat'],
  stageLabels: { nou: 'Nou', contactat: 'Contactat', oferta: 'Ofertă', castigat: 'Câștigat' },
  wonStatuses: ['castigat'],
  firstContactColumn: null,
  currency: 'MDL'
}
```

Note:
- `timestampFormat`: `'iso'` pentru date tip `2026-07-24 10:30:00`, `'unix'`
  pentru timestamp-uri numerice (secunde).
- `stageOrder` trebuie să conțină valorile exacte din coloana de status, în
  ordinea pâlniei. Pâlnia se calculează cumulativ: un lead „câștigat" se numără
  și la etapele anterioare.
- `firstContactColumn`: dacă există o coloană cu momentul primului răspuns
  (ex. `contacted_at`), setează-o și apare KPI-ul „timp mediu de răspuns".

### 4. Pornește dashboard-ul și comanda /raport

În `bot.js` (sau `index.js`):

```js
const { createDashboardServer } = require('./go-crm-analytics/server')
const { collectKpi } = require('./go-crm-analytics/analytics')
const { formatRaport } = require('./go-crm-analytics/telegram')

createDashboardServer(queryAll, {
  port: 8090,
  schema,
  token: process.env.DASHBOARD_TOKEN
})

bot.onText(/\/raport/, async (msg) => {
  const kpi = await collectKpi(queryAll, schema)
  await bot.sendMessage(msg.chat.id, formatRaport(kpi), { parse_mode: 'HTML' })
})
```

Dashboard-ul devine disponibil la `http://127.0.0.1:8090/`, iar datele JSON la
`/api/kpi`. Pagina detectează singură API-ul: cu server pornit afișează
insigna „DATE LIVE", deschisă direct din fișier afișează „DEMO".

## Raport zilnic automat (opțional)

Trimite raportul în fiecare dimineață la 9:00 către administratori:

```js
const ADMIN_CHAT_ID = 123456789

setInterval(async () => {
  const now = new Date()
  if (now.getHours() === 9 && now.getMinutes() === 0) {
    const kpi = await collectKpi(queryAll, schema)
    await bot.sendMessage(ADMIN_CHAT_ID, formatRaport(kpi), { parse_mode: 'HTML' })
  }
}, 60000)
```

## Securitate

- Implicit serverul ascultă doar pe `127.0.0.1` — nu este expus în internet.
- Pentru acces de la distanță setează `DASHBOARD_TOKEN` și accesează cu
  `http://server:8090/?token=...`; fără token corect răspunsul este 403.
- Pentru un link permanent pentru client, pune serverul în spatele unui
  reverse proxy cu HTTPS (Caddy sau nginx) sau al unui tunel (Cloudflare Tunnel).

## De ce așa și nu Power BI

Power BI ar cere licențe Pro (~14 $/utilizator/lună), export de date din SQLite
și un gateway de reîmprospătare. Modulul de față oferă exact rapoartele de care
are nevoie un director — direct din datele vii ale GO CRM, în Telegram și în
browser, la cost zero de licență. Este și un diferențiator comercial: „dashboard
live inclus" în oferta GO CRM.
