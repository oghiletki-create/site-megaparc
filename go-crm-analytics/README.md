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
    secret: process.env.PANEL_SECRET,
    company: COMPANY_NAME
  });
}
```

`schema` poate fi obiect sau funcție. Ca funcție, e reevaluată la fiecare cerere
— util când modulele se pot porni/opri din bot în timpul rulării.

Fără Express, pentru un proces separat:

```js
panou.createPanelServer(queryAll, { port: 8080, token: '…', secret: process.env.PANEL_SECRET, schema: schema });
```

## Variabile de mediu

| Variabilă | Efect |
|---|---|
| `DASHBOARD_TOKEN` | **obligatorie** — fără ea rutele nici nu se înregistrează, panoul nu există. E tokenul de **CEO** (vede tot). Poate conține mai multe tokene separate prin virgulă (`tok1,tok2`), ca să dai linkuri diferite unor persoane diferite și să revoci unul singur fără să le strici pe toate |
| `PANEL_SECRET` | opțională — cheia cu care se **semnează tokenele pe rol** (șef de departament, angajat). Fără ea funcționează doar tokenul de CEO |
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

## Acces pe roluri (CEO / șef de departament / angajat)

Panoul cunoaște trei niveluri de acces, în locul unui singur token care vede tot:

- **CEO** — vede tot. Folosește tokenul simplu `DASHBOARD_TOKEN` (linkul de până acum).
- **Șef de departament** — vede doar secțiunile din meniul lui, iar panourile de
  oameni (Angajați, Sarcini pe departamente) filtrate la **departamentul lui**.
- **Angajat** — vede doar secțiunile din meniul lui, iar datele de oameni filtrate
  la **el însuși**.

Rolul, departamentul și meniul permis sunt scrise într-un **token semnat
criptografic** (HMAC-SHA256 cu `PANEL_SECRET`) — nu se pot falsifica și nu se pot
modifica. Tokenul de CEO rămâne un secret simplu; nimic din linkurile existente nu
se strică.

### Auto-serviciu: fiecare își adaugă oamenii (recomandat)

În panou, sus, apare butonul **➕ Adaugă persoană** — doar pentru cine are dreptul:

- **CEO** adaugă **directori de departament** (alege departamentul și modulele) și,
  la nevoie, angajați.
- **Directorul** adaugă **angajați**, automat în departamentul lui și doar cu module
  din cele pe care le are el.
- **Angajatul** nu vede butonul.

Formularul generează pe loc linkul persoanei, gata de copiat sau de trimis pe
Telegram. Serverul **impune ierarhia**: un director nu poate crea alt director, nu
poate schimba departamentul și nu poate acorda module pe care el nu le are. Fără
bază de date separată — dreptul de a adăuga vine din tokenul semnat al fiecăruia.

Rute implicate (toate cer token valid): `/panou/acces` (pagina), `/panou/acces/api`
(ce poate acorda), `/panou/acces/nou` (generează tokenul noii persoane).

### Generarea unui link din linia de comandă (alternativă)

```
PANEL_SECRET=…  node access.js ceo
PANEL_SECRET=…  node access.js head     --dept "Vânzări"  --menu vanzari,angajati       --name "Ion"  --days 180
PANEL_SECRET=…  node access.js employee --dept "Vânzări"  --emp 42 --menu sarcini       --name "Ana"  --days 90
PANEL_SECRET=…  node access.js verify   <token>
```

Setează și `PANEL_URL` (sau `PUBLIC_URL`) ca să primești linkul complet, gata de
trimis. `--days 0` = token permanent (util doar pentru CEO).

Ce vede fiecare rol **în interiorul** panoului se decide prin `--menu` (lista de
module la care are acces) plus filtrarea automată pe departament/persoană a
panourilor de oameni. Modulele financiare nu sunt legate de departament — dacă un
șef nu trebuie să vadă cifrele firmei, pur și simplu nu i le pui în `--menu`.

Module valide pentru `--menu`: `contabilitate`, `sarcini`, `angajati`, `raport`,
`vanzari`, `prospecti`, `unuc`, `jurist`.

## Securitate

- **Tokenul se compară în timp constant** (nu se poate ghici caracter cu caracter
  după cât durează răspunsul).
- **Fail-closed:** dacă nu e configurat niciun token, panoul răspunde 403 la tot —
  nu se deschide public din greșeală.
- **Limită de încercări:** după prea multe tokene greșite de la același IP,
  serverul răspunde 429 pentru o vreme (oprește forța brută).
- **Anteturi:** răspunsurile cu token folosesc `Cache-Control: no-store`,
  `Referrer-Policy: no-referrer`, `X-Content-Type-Options: nosniff`,
  `X-Frame-Options: DENY` — tokenul din link nu se scurge prin Referer și
  paginile cu token nu se cachează de proxy-uri.
- **Service worker-ul nu salvează pe disc datele sensibile** (`/api`, manifestul):
  cifrele reale nu rămân în cache-ul browserului pe calculatoare partajate. Doar
  învelișul paginii se cachează pentru afișarea offline.

Rămâne o limitare de arhitectură: tokenul călătorește în link (`?token=`) și, la
aplicația instalată, ajunge în manifest. Tokenele pe rol au acum semnătură și
expirare (vezi mai sus), dar pentru identitate cu login clasic (utilizator +
parolă, sesiune) în locul linkului cu token e nevoie de un strat de autentificare
separat.

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
