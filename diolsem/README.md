# Diolsem.md — propunere de automatizare AI

Materiale de pitch pentru **S.C. „DIOLSEM" S.R.L.** (cel mai mare magazin agricol online din Moldova).

> Notă: aceste materiale sunt găzduite temporar în repo-ul `site-megaparc`, într-un folder dedicat, deoarece sesiunea curentă nu are permisiunea de a crea un repository nou. Pot fi mutate ușor într-un repo propriu `diolsem-ai-automatizare`.

## Conținut
- [`PROPUNERE-DIOLSEM.md`](./PROPUNERE-DIOLSEM.md) — **propunerea unificată pentru conducere**: documentul de pitch principal care leagă Clienți + Vânzări + Producere + Achiziții, cu beneficii, plan pe etape și model de colaborare. *Începe de aici.*
- [`AUTOMATIZARE-DEPARTAMENTE.md`](./AUTOMATIZARE-DEPARTAMENTE.md) — **automatizarea întregii companii**: departamentele Vânzări · Producere · Achiziții legate într-un singur sistem (cerere → producție → achiziție), cu copiloti AI pe fiecare echipă.
- [`CONTABILITATE-OFERTE-INCASARI.md`](./CONTABILITATE-OFERTE-INCASARI.md) — fluxul **ofertă → încasare** unit cu **contabilitatea**: confirmarea automată a achitărilor pe oferte, cu toate ofertele și plățile păstrate în **fișa clientului**.
- [`STRATEGIE-AUTOMATIZARE-AI.md`](./STRATEGIE-AUTOMATIZARE-AI.md) — partea de **front-office**: bot consultant agronom + automatizare pe magazine / produse / clienți, arhitectură, roadmap, KPI/ROI, riscuri.
- [`REZUMAT-1-PAGINA.md`](./REZUMAT-1-PAGINA.md) — varianta scurtă, de o pagină, pentru prima întâlnire.
- [`demo/index.html`](./demo/index.html) — **prototip demonstrativ funcțional** al botului (se deschide direct în browser, fără instalare).

## Cum rulezi demo-ul
Deschide `demo/index.html` în orice browser. Încearcă: „pete pe roșii", „gândaci la cartof", „buruieni la porumb", „vreau semințe", „unde e comanda mea?" — sau comută pe **RU**. Botul recomandă produse, calculează doza pe suprafață și face cross-sell. Logica e simulată pentru demo; în producție rulează pe LLM (Claude) + RAG peste catalogul real Diolsem.

## Pe scurt
Bot AI (consultant agronom, RO/RU, 24/7) pe web + WhatsApp/Viber/Telegram/Messenger, ancorat în catalogul și fișele tehnice Diolsem (RAG), care transformă întrebările pre-vânzare în comenzi — plus automatizări de back-office (stoc, descrieri, SEO, traduceri) și de retenție (coș abandonat, calendar agronomic sezonier).
