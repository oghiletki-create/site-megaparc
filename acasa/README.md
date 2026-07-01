# A-casa — propunere GO CRM (automatizare AI pentru dezvoltator imobiliar)

Materiale de pitch pentru compania de dezvoltare imobiliară **A-casa**, din partea **GO CRM (Ghiletchi Consulting)**.

> Notă: aceste materiale sunt găzduite temporar în repo-ul `site-megaparc`, într-un folder dedicat, deoarece sesiunea curentă nu are permisiunea de a crea un repository nou. Pot fi mutate ușor într-un repo propriu (ex. `acasa-go-crm`).

## Conținut

- [`PROPUNERE-ACASA.md`](./PROPUNERE-ACASA.md) — **propunerea unificată pentru conducere**: leagă Clienți + Vânzări + Contracte + Încasări + Construcție, cu beneficii, plan pe etape și model de colaborare. *Începe de aici.*
- [`PREZENTARE-GO-CRM.md`](./PREZENTARE-GO-CRM.md) — **prezentarea completă a sistemului**: panoul Directorului General (bani, șantier, radar de risc pe praguri, delegare) + meniul separat pe fiecare departament (Vânzări, Contabilitate, Marketing/PR, Departament tehnic).
- [`VANZARI-SI-CRM.md`](./VANZARI-SI-CRM.md) — **pâlnia lead → contract**, grila de apartamente (șahmatca) vie, agenți/comisioane și **guvernanța prețului** (discountul îl aprobă doar directorul de vânzări).
- [`ASISTENT-CLIENTI.md`](./ASISTENT-CLIENTI.md) — **asistentul de vânzări AI** (front-office): găsește apartamentul, calculează ratele, programează vizionarea, califică lead-ul. 24/7, RO/RU.
- [`CONSTRUCTIE-FINANTE.md`](./CONSTRUCTIE-FINANTE.md) — **graficul de rate** cu confirmare automată a plăților + reconciliere + **stadiul construcției** (buget/termen) + tabloul executiv.
- [`REZUMAT-1-PAGINA.md`](./REZUMAT-1-PAGINA.md) — varianta scurtă, de o pagină, pentru prima întâlnire.
- [`index.html`](./index.html) — **pagina de intrare** către cele 3 demo-uri.
- [`demo/index.html`](./demo/index.html) — **demo asistent de vânzări pentru CLIENȚI** (caută apartament, calcul rate, vizionare, stadiu construcție).
- [`demo-ceo/index.html`](./demo-ceo/index.html) — **demo PANOU Director General (CEO)**: vedere executivă (finanțe, vânzări pe proiecte, construcție, stoc apartamente, risc) + „ce aș automatiza ca director general".
- [`demo-director/index.html`](./demo-director/index.html) — **demo PANOU Director Vânzări**: proiecte/complexe, pâlnie de lead-uri, rezervări & contracte, agenți (clasament + comisioane), departamente.

## Cum rulezi demo-urile
Deschide `index.html` în orice browser și alege un panou. În asistentul de client încearcă: „2 camere până în 55 000 €", „ce avans și ce rate?", „când e gata blocul?", „vreau să văd un apartament" — sau comută pe **RU**. Logica e simulată pentru demo; în producție rulează pe LLM (Claude) + RAG peste grila reală A-casa.

## Pe scurt
Un singur sistem — **GO CRM** — care duce clientul de la primul lead până la predarea cheilor: asistent de vânzări AI 24/7, grilă de apartamente vie, CRM cu pâlnie și comisioane, preț blocat, grafic de rate cu confirmare automată a plăților și tablou de construcție + executiv pentru conducere. **AI-ul pregătește și propune, omul decide.**
