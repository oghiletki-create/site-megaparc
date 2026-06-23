# Diolsem.md — propunere de automatizare AI

Materiale de pitch pentru **S.C. „DIOLSEM" S.R.L.** (cel mai mare magazin agricol online din Moldova).

> Notă: aceste materiale sunt găzduite temporar în repo-ul `site-megaparc`, într-un folder dedicat, deoarece sesiunea curentă nu are permisiunea de a crea un repository nou. Pot fi mutate ușor într-un repo propriu `diolsem-ai-automatizare`.

## Conținut
- [`PROPUNERE-DIOLSEM.md`](./PROPUNERE-DIOLSEM.md) — **propunerea unificată pentru conducere**: documentul de pitch principal care leagă Clienți + Vânzări + Producere + Achiziții, cu beneficii, plan pe etape și model de colaborare. *Începe de aici.*
- [`AUTOMATIZARE-DEPARTAMENTE.md`](./AUTOMATIZARE-DEPARTAMENTE.md) — **automatizarea întregii companii**: departamentele Vânzări · Producere · Achiziții legate într-un singur sistem (cerere → producție → achiziție), cu copiloti AI pe fiecare echipă.
- [`CONTABILITATE-OFERTE-INCASARI.md`](./CONTABILITATE-OFERTE-INCASARI.md) — fluxul **ofertă → încasare** unit cu **contabilitatea**: confirmarea automată a achitărilor pe oferte, cu toate ofertele și plățile păstrate în **fișa clientului**.
- [`STRATEGIE-AUTOMATIZARE-AI.md`](./STRATEGIE-AUTOMATIZARE-AI.md) — partea de **front-office**: sistem automatizat consultant agronom + automatizare pe magazine / produse / clienți, arhitectură, roadmap, KPI/ROI, riscuri.
- [`INTELIGENTA-AGRONOMICA.md`](./INTELIGENTA-AGRONOMICA.md) — **inteligența de agronom** a sistemului automatizat: conștiență climatică (Moldova, pe regiuni), alegerea **variantei optime** din listă, managementul rezistenței și tratarea **produselor de import**.
- [`PRETURI-CLIENTI-GUVERNANTA.md`](./PRETURI-CLIENTI-GUVERNANTA.md) — niveluri de preț **Retail / Fermier / Angro** aplicate automat + regula de guvernanță: **prețul îl poate modifica doar directorul de vânzări**.
- [`REZUMAT-1-PAGINA.md`](./REZUMAT-1-PAGINA.md) — varianta scurtă, de o pagină, pentru prima întâlnire.
- [`demo/index.html`](./demo/index.html) — **demo sistem automatizat pentru CLIENȚI** (consultant agronom + meniu + comenzi), se deschide direct în browser.
- [`demo-ceo/index.html`](./demo-ceo/index.html) — **demo PANOU pentru DIRECTORUL GENERAL (CEO)**: vedere executivă pe toată compania (finanțe, vânzări, producere, stoc, risc) + „ce aș automatiza ca director general".
- [`demo-director/index.html`](./demo-director/index.html) — **demo PANOU pentru Directorul de Vânzări**: magazine separate + fiecare departament (angajați, sarcini, automatizări) + agenți (clasament + comisioane).

## Cum rulezi demo-ul
Deschide `demo/index.html` în orice browser. Încearcă: „pete pe roșii", „gândaci la cartof", „buruieni la porumb", „vreau semințe", „unde e comanda mea?" — sau comută pe **RU**. Sistemul automatizat recomandă produse, calculează doza pe suprafață și face cross-sell. Logica e simulată pentru demo; în producție rulează pe LLM (Claude) + RAG peste catalogul real Diolsem.

## Pe scurt
Sistem automatizat AI (consultant agronom, RO/RU, 24/7) pe web + WhatsApp/Viber/Telegram/Messenger, ancorat în catalogul și fișele tehnice Diolsem (RAG), care transformă întrebările pre-vânzare în comenzi — plus automatizări de back-office (stoc, descrieri, SEO, traduceri) și de retenție (coș abandonat, calendar agronomic sezonier).
