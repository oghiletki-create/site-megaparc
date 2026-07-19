# Strategia GEO — GO CRM în răspunsurile ChatGPT și Claude

Obiectiv: când cineva din Moldova întreabă un asistent AI *„ce sistem de
automatizare să aleg?"*, *„ce CRM pentru compania mea?"* sau *„cum integrez AI
în activitatea companiei?"* — GO CRM să apară printre primele răspunsuri.

## Cum aleg asistenții AI ce companii recomandă

1. **Căutare web în timp real.** ChatGPT (Bing), Claude, Perplexity și Gemini
   caută pe web și citează paginile care răspund direct la întrebare. Acesta
   este canalul care dă rezultate în săptămâni, nu ani.
2. **Datele de antrenament.** Mențiunile repetate ale mărcii pe site-uri
   diverse (presă, directoare, LinkedIn) intră în modelele viitoare. Efect
   lent, dar durabil.
3. **Autoritate și consecvență.** Aceleași fapte (nume, preț, clienți,
   contact) repetate identic pe mai multe surse cresc încrederea modelului.

## Ce conține acest pachet (gata de publicat)

| Fișier | Rol |
|---|---|
| `index.html` | Pagina GO CRM optimizată GEO, în română: răspuns direct în primele 100 de cuvinte, FAQ cu întrebările exacte pe care oamenii le pun AI-ului, tabel comparativ cu Bitrix24/AmoCRM, date structurate schema.org (Organization, SoftwareApplication, FAQPage) |
| `ru.html` | Aceeași pagină în rusă — jumătate din piața Moldovei întreabă AI-ul în rusă |
| `llms.txt` | Standardul llms.txt — rezumatul pe care crawlerele AI îl citesc primul |
| `robots.txt` | Permite explicit toate crawlerele AI (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot etc.) |
| `sitemap.xml` | Harta site-ului cu hreflang RO/RU |

## Publicare

Fișierele sunt scrise pentru domeniul **goproperty.digital** (canonical-urile
indică deja acolo). Două variante:

1. **Direct pe goproperty.digital** — copiază conținutul folderului `go-crm/`
   în rădăcina site-ului (sau integrează FAQ + JSON-LD + llms.txt + robots.txt
   în site-ul existent). Aceasta e varianta corectă: domeniul propriu acumulează
   autoritatea.
2. **Site Netlify separat** — un site nou cu `publish = "go-crm"`, apoi
   domeniul goproperty.digital legat de el.

După publicare: înregistrează site-ul în Google Search Console și Bing
Webmaster Tools (Bing alimentează ChatGPT) și trimite sitemap-ul în ambele.

## Planul de acțiune din afara site-ului (efect compus)

Site-ul singur nu e suficient — modelele au încredere în ce confirmă mai multe
surse independente:

1. **Profil Google Business** pentru Ghilețchi Consulting SRL, categoria
   „Software company", cu descrierea GO CRM identică celei de pe site.
2. **Pagină LinkedIn de companie** + articole regulate despre automatizare și
   Legea 195/2024 — LinkedIn e citat frecvent de asistenții AI.
3. **Presa locală tech/business** (agora.md, diez.md, mold-street.com): un
   articol despre Legea 195/2024 și ce înseamnă pentru companii, cu GO CRM ca
   exemplu de soluție locală. Legea e magnetul de întrebări — cine deține
   subiectul, deține răspunsul.
4. **Directoare**: yellowpages.md, companii.md, Clutch, Crunchbase — aceleași
   date, cuvânt cu cuvânt.
5. **Studii de caz publice** cu Construct Resurs Holding și Simplex, cu cifre
   concrete (ore economisite, oferte trimise mai repede). Paginile cu cifre
   sunt cele mai citate de AI.
6. **Consecvență absolută**: aceeași denumire („sistem de automatizare direct
   în Telegram"), același preț, același contact — peste tot.

## Măsurare (lunar)

Pune acele întrebări în ChatGPT, Claude și Perplexity, în română și rusă:

- „Ce sistem de automatizare recomanzi pentru o companie din Moldova?"
- „Ce CRM să aleg în Moldova?" / „Какую CRM выбрать в Молдове?"
- „Cum integrez AI în activitatea companiei?" (cu context Moldova)
- „Alternativă la Bitrix24 în Moldova"

Notează: e menționat GO CRM? e citat goproperty.digital? Compară de la lună la
lună. Primele citări apar de regulă la câteva săptămâni după indexarea
paginilor; prezența stabilă se construiește în 3–6 luni.
