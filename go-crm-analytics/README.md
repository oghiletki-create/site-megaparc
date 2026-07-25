# Panou analitic GO CRM

Panou web de tip Power BI pentru boții GO CRM. Citește direct baza SQLite a
botului, se reîmprospătează singur și se instalează pe desktop ca aplicație
(fixabilă în bara de activități).

**Principiu de bază: panoul afișează exact modulele active în meniul din
Telegram.** Meniul și panoul au o singură sursă de adevăr — `menu.js`. Dacă un
modul nu e în meniul botului, secțiunea lui nu apare în panou.

## Fișiere

| Fișier | Rol |
|---|---|
| `menu.js` | descriptorul unic al meniului (butoane Telegram + secțiuni panou) |
| `panels.js` | colectorii de date, câte unul per raport |
| `analytics.js` | `collectKpi()` — parcurge meniul activ și adună secțiunile |
| `panou.html` | pagina web (bilingvă RO/RU, temă auto/luminoasă/întunecată) |
| `server.js` | rutele web + PWA (manifest, service worker, iconițe) |
| `telegram.js` | același raport, formatat pentru chat |
| `sync-1c.js` | sincronizare opțională cu 1C (OData sau CSV) |
| `icons.js` | iconițele PNG ale aplicației |

## Integrare într-un bot

```js
const meniu = require('./analytics/menu');
const panou = require('./analytics/server');

function queryAll(sql, params) {
  const st = db.prepare(sql);
  return Promise.resolve(st.all.apply(st, params || []));
}

function schema() {
  return {
    currency: 'EUR',
    company: COMPANY_NAME,
    clientsTable: 'clients',
    revenueTable: 'payments',
    revenueDateColumn: 'date',
    revenueAmountColumn: 'amount_eur',
    menu: meniu.activeMenu()
  };
}

if (process.env.DASHBOARD_TOKEN) {
  panou.registerPanelRoutes(app, queryAll, {
    schema: schema,
    token: process.env.DASHBOARD_TOKEN,
    company: COMPANY_NAME
  });
}
```

`schema` poate fi obiect sau funcție. Ca funcție, e reevaluată la fiecare cerere
— util când modulele se pot porni/opri din bot în timpul rulării.

Fără Express, pentru un proces separat:

```js
panou.createPanelServer(queryAll, { port: 8080, token: '…', schema: schema });
```

## Variabile de mediu

| Variabilă | Efect |
|---|---|
| `DASHBOARD_TOKEN` | **obligatorie** — fără ea rutele nici nu se înregistrează, panoul nu există |
| `MODULES` | listă separată prin virgulă cu modulele active (implicit: `contabilitate`) |
| `PUBLIC_URL` / `RAILWAY_PUBLIC_DOMAIN` | domeniul folosit în linkul trimis în Telegram |
| `ONEC_ODATA_URL`, `ONEC_USER`, `ONEC_PASSWORD` | conectorul 1C (opțional) |

Module disponibile: `contabilitate`, `sarcini`, `angajati`, `raport`, `vanzari`,
`prospecti`, `unuc` (1C), `jurist`.

## Rute

| Rută | Ce face |
|---|---|
| `/panou/` | pagina panoului (cere `?token=`) |
| `/panou/api` | datele în JSON |
| `/panou/manifest.webmanifest` | manifestul aplicației, cu tokenul în `start_url` |
| `/panou/sw.js` | service worker (cache offline) |
| `/panou/icon-192.png`, `/panou/icon-512.png` | iconițele aplicației |
| `/dashboard` | redirecționează la `/panou/` (linkuri vechi) |

Totul în afară de service worker și iconițe cere tokenul; fără el răspunde 403.

## Instalare pe desktop

1. Deschide linkul primit în Telegram (`/panou` sau `/analitica`) în Chrome sau Edge.
2. Apasă butonul **⊕ Instalează** din panou, sau meniul `⋮` → *Instalează aplicația*.
3. Aplicația apare ca program separat; clic dreapta pe pictogramă → *Fixează în bara de activități*.

Odată instalată, pornește direct în panou (tokenul e în manifest), fără bară de
adresă, și păstrează ultimele date când conexiunea cade — badge-ul arată atunci
„FĂRĂ CONEXIUNE · ultimele date HH:MM".

## Adăugarea unui raport nou

1. În `panels.js`, adaugă o intrare în `PANELS` cu `title`, `hint` (ambele RO+RU)
   și un `collect(queryAll, schema)` care întoarce `{ tiles, chart, table }`.
2. În `menu.js`, leagă raportul de un buton de meniu prin câmpul `panel`.

Atât — pagina web nu se atinge: `panou.html` desenează orice secțiune primește.
Tipurile de grafic acceptate sunt `line`, `bars-v`, `bars-h` și `funnel`.
Etichetele trimise ca `{ ro, ru }` se traduc singure la schimbarea limbii.

## 1C

Cu `ONEC_ODATA_URL` setat, `sync-1c.js` importă periodic documentele de vânzare
în tabela `vanzari_1c`, iar modulul `unuc` apare automat în meniu și în panou.
Publicarea serviciului OData în 1C: *Administrare → Publicare pe server web →
Serviciu OData*, apoi se dă acces la `Document_РеализацияТоваровУслуг`.
Alternativă fără acces la server: `import1cCsv()` cu fișier
`id;numar;data;suma;client`.
