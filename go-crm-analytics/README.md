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

## Conectarea cu 1C (date automate din contabilitate)

Modulul `sync-1c.js` trage automat documentele de vânzare din 1C:Enterprise
(8.3+) în tabelul local `vanzari_1c`, iar dashboard-ul și raportul Telegram
afișează secțiunea 1C de la sine: venit facturat pe 30 de zile, venit pe lună
și top clienți. Sursa recomandată este interfața standard **OData** a 1C.

### Pasul A — publică OData în 1C (o singură dată, la administratorul 1C)

1. Baza 1C trebuie publicată pe un server web (Apache sau IIS): în
   Configurator → «Администрирование → Публикация на веб-сервере», cu bifa
   pentru interfața OData («Публиковать стандартный интерфейс OData»).
2. În modul enterprise, activează entitățile expuse: «Все функции →
   Обработки → Настройка состава стандартного интерфейса OData» și adaugă
   documentul de vânzări (în configurațiile tipice:
   `РеализацияТоваровУслуг`).
3. Creează un utilizator 1C dedicat, doar cu drept de citire pe documentele
   de vânzare — el va fi folosit de conector.
4. Verifică în browser:
   `http://server1c/numele_bazei/odata/standard.odata/Document_РеализацияТоваровУслуг?$format=json`
   — trebuie să întorci JSON, cu autentificarea utilizatorului creat.

### Pasul B — pornește sincronizarea în GO CRM

Conectorul are nevoie și de o funcție de scriere `execute(sql, params)`:

```js
const execute = async (sql, params = []) => db.prepare(sql).run(...params)
```

Apoi, în `bot.js`:

```js
const { start1cSync } = require('./go-crm-analytics/sync-1c')

start1cSync(execute, queryAll, {
  baseUrl: 'http://server1c/numele_bazei/odata/standard.odata',
  username: 'api_gocrm',
  password: process.env.ONEC_PASSWORD,
  intervalMinutes: 30
})
```

și adaugă în schema transmisă la `collectKpi` / `createDashboardServer`:

```js
const schema = { ...restul_mapării, oneCTable: 'vanzari_1c' }
```

Prima rulare aduce istoricul (implicit ~13 luni, `sinceDays: 400`), apoi la
fiecare 30 de minute aduce doar documentele noi sau modificate. Dacă numele
documentului sau al câmpurilor diferă în configurația voastră 1C, transmite-le
în opțiuni (`entity`, `amountField`, `dateField`, `numberField`). Câmpul
`clientField` funcționează doar cu un atribut text direct pe document; numele
clientului din referința `Контрагент` nu vine implicit prin OData — dacă îl
vrei în topul de clienți, folosește varianta CSV de mai jos, unde exportul din
1C poate include orice coloană.

### Alternativă fără server web: export CSV programat din 1C

Dacă baza 1C e „file-mode" și nu poate fi publicată pe web, configurează în 1C
un export programat (регламентное задание) care scrie un CSV cu separator `;`
și coloanele `id;numar;data;suma;client`, apoi importă-l periodic:

```js
const { import1cCsv } = require('./go-crm-analytics/sync-1c')
setInterval(() => {
  try { import1cCsv(execute, '/cale/spre/export_1c.csv') } catch {}
}, 30 * 60000)
```

### Securitatea conexiunii 1C

- Utilizatorul OData: doar drept de citire, doar pe obiectele necesare.
- Parola stă în variabila de mediu `ONEC_PASSWORD`, nu în cod.
- Dacă serverul 1C și GO CRM nu sunt în aceeași rețea, expune OData doar prin
  VPN sau tunel HTTPS — niciodată direct în internet fără TLS.

## Securitate

- Implicit serverul ascultă doar pe `127.0.0.1` — nu este expus în internet.
- Pentru acces de la distanță setează `DASHBOARD_TOKEN` și accesează cu
  `http://server:8090/?token=...`; fără token corect răspunsul este 403.
- Pentru un link permanent pentru client, pune serverul în spatele unui
  reverse proxy cu HTTPS (Caddy sau nginx) sau al unui tunel (Cloudflare Tunnel).

## Deschidere pe calculator, mereu actualizat

- Deschide în browser linkul primit de la comanda `/analitica` (sau
  `http://adresa:port/dashboard?token=...`). Pagina **reîmprospătează datele
  automat la fiecare 60 de secunde**, fără reîncărcare — poate sta deschisă
  permanent pe un monitor. Intervalul se schimbă din URL: `&refresh=30`
  (minim 15 secunde). Butonul „↻ Actualizează" forțează o actualizare imediată.
- Dacă serverul devine inaccesibil, pagina afișează „FĂRĂ CONEXIUNE · ultimele
  date HH:MM" și păstrează ultimele cifre; la revenirea conexiunii trece
  singură înapoi pe „DATE LIVE".
- Ca să arate ca o aplicație de sine stătătoare: în Chrome/Edge deschide
  linkul → meniul ⋮ → „Salvează și partajează" → „Creează scurtătură…" (bifează
  „Deschide ca fereastră"). Apare o iconiță pe desktop care deschide direct
  panoul, fără bara de browser.

## De ce așa și nu Power BI

Power BI ar cere licențe Pro (~14 $/utilizator/lună), export de date din SQLite
și un gateway de reîmprospătare. Modulul de față oferă exact rapoartele de care
are nevoie un director — direct din datele vii ale GO CRM, în Telegram și în
browser, la cost zero de licență. Este și un diferențiator comercial: „dashboard
live inclus" în oferta GO CRM.
