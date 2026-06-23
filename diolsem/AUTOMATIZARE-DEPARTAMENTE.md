# Diolsem — Automatizare AI pe departamente: Vânzări · Producere · Achiziții

**Client:** S.C. „DIOLSEM" S.R.L. — **producător** autohton de îngrășăminte și produse de protecție a plantelor + cel mai mare magazin agricol din Moldova
**Scop:** harta completă de automatizare a companiei, nu doar a vânzării online — front-office (clienți) + back-office (cele 3 departamente) ca **un singur sistem**
**Document complementar:** `STRATEGIE-AUTOMATIZARE-AI.md` (sistemul automatizat de clienți), `REZUMAT-1-PAGINA.md`
**Versiune:** 1.0 · iunie 2026

---

## 1. Schimbarea de perspectivă

Sistemul automatizat pentru clienți (vezi documentul precedent) rezolvă **front-office-ul**. Dar Diolsem are un avantaj de producător: valoarea reală apare când legăm **cererea** (clienți + vânzări) de **producție** și de **achiziții** într-un singur flux.

Trecem de la „un sistem automatizat" la un **sistem nervos digital al companiei**: un strat comun de date peste care lucrează câte un **copilot AI** în fiecare departament. Fiecare departament rămâne stăpân pe munca lui, dar nu mai re-introduce date manual și nu mai ia decizii „pe orb".

```
        ┌──────────────── SEMNAL DE CERERE ────────────────┐
        │  Clienți (sistem automatizat, site, magazin) → Vânzări          │
        ▼                                                   │
   ┌──────────┐      ce se vinde       ┌──────────┐         │
   │ VÂNZĂRI  │ ───── trage ─────────► │ PRODUCERE│         │
   └──────────┘                        └──────────┘         │
        ▲                                   │               │
        │ disponibilitate, termene          │ ce materii    │
        │                                   ▼ trebuie       │
        │                              ┌──────────┐         │
        └───────── stoc finit ──────── │ ACHIZIȚII│ ◄───────┘
                                       └──────────┘
        TOATE pe același STRAT DE DATE (ERP + AI orchestration)
```

**Principiul director:** datele se introduc **o singură dată** și circulă singure; AI-ul **propune** decizii (ce, cât, când), omul **aprobă**. Pe domeniu reglementat (pesticide/îngrășăminte) — niciodată „AI decide singur", mereu „AI pregătește, omul semnează".

---

## 2. Departamentul VÂNZĂRI

Diolsem vinde pe mai multe canale: **B2B** (fermieri mari, distribuitori agro), **retail** (magazin fizic), **online** (diolsem.md) și **marketplace-uri** (agromag.md, desire.md, agrobiznes.md). Asta înseamnă oferte, comenzi și prețuri în multe locuri.

### 2.1 Puncte de fricțiune tipice
- Oferte B2B făcute manual în Excel/Word, lent și inconsecvent.
- Comenzi care vin pe telefon/WhatsApp/email și se re-tastează în sistem.
- Reprezentanții pe teren n-au în timp real stocul/prețul/istoricul clientului.
- Nu se știe „ce să împingem" înainte de sezon → vânzări reactive, nu proactive.

### 2.2 Automatizări + AI
| Funcție | Ce automatizăm | Unde intră AI |
|---|---|---|
| **Generator de oferte B2B** | ofertă/proformă în secunde din catalog, cu preț pe client și disponibilitate | AI compune oferta, sugerează produse asociate și discountul optim pe baza istoricului |
| **Captură comenzi omnicanal** | comenzile din sistem automatizat/telefon/WhatsApp/email intră automat în sistem | AI citește comanda din text/voce și o structurează (produs, cantitate, client) |
| **CRM viu** | fișa fiecărui client: istoric, culturi, sezon, sold | AI rezumă „unde am rămas cu clientul X" și ce să-i propun acum |
| **Copilot pentru reprezentanți** | app pe teren: stoc/preț/istoric instant | AI: „la ferma asta, anul trecut a luat erbicid X în mai — sună-l acum" |
| **Prognoză de vânzări** | pe produs/sezon/regiune | AI prezice cererea → alimentează direct Producția și Achizițiile |
| **Recuperare & up-sell** | follow-up automat la oferte și coșuri | AI personalizează mesajul pe cultura clientului |

### 2.3 KPI
Timp de la cerere la ofertă (de la ore la minute) · % comenzi intrate fără re-tastare · acuratețea prognozei · valoare medie comandă · venit/reprezentant.

---

## 3. Departamentul PRODUCERE

Aici e diferențiatorul Diolsem. Producția de îngrășăminte și produse de protecție înseamnă: **rețete/formulări**, **loturi**, **control de calitate**, **omologare**, **trasabilitate**, **termene de valabilitate** și **ambalare** — totul reglementat.

### 3.1 Puncte de fricțiune tipice
- Planul de producție făcut „după ureche" sau pe comenzi deja sosite (prea târziu pentru sezon).
- Documentația de lot (batch records), QC și omologarea — pe hârtie/Excel, greu de regăsit.
- Necorelare între ce se produce și ce cere piața → ori lipsă în vârf, ori stoc blocat.
- Trasabilitatea lotului (de la materie primă la clientul final) — lentă la nevoie (reclamații, control).

### 3.2 Automatizări + AI
| Funcție | Ce automatizăm | Unde intră AI |
|---|---|---|
| **Planificare producție pe cerere** | plan de producție generat din prognoza de vânzări + stoc + sezon | AI propune ce loturi și când, ca să prinzi vârful de sezon, nu să-l ratezi |
| **Rețete & calcul de șarjă** | calcul automat al materiilor prime pentru un lot de X tone | AI verifică disponibilitatea materiilor și semnalează lipsuri din timp |
| **Batch records digitale** | fișă de lot electronică (cine, când, ce, cât) | AI completează și verifică consistența, semnalează abateri |
| **Control de calitate (QC)** | înregistrare rezultate QC pe lot, blocare lot neconform | AI detectează tendințe de neconformitate înainte să devină problemă |
| **Trasabilitate lot** | de la materia primă → lot → client, în câteva secunde | AI răspunde la „unde a ajuns lotul 2024-07?" instant (util la reclamații/control) |
| **Conformitate & omologare** | registru de omologări, valabilități, etichete | AI verifică dacă eticheta/doza corespunde fișei omologate și alertează la expirări |
| **Mentenanță & întreruperi** | log echipamente | AI prezice mentenanța (mai puține opriri în plin sezon) |

### 3.3 Legătura critică
**Prognoza de vânzări (Dep. 2) → Planul de producție (Dep. 3) → Necesarul de materii (Dep. 4).** Aici un lanț automat aduce cel mai mare câștig: produci ce se va cere, **înainte** de sezon, fără supra-stoc.

### 3.4 KPI
% comenzi onorate din stoc în vârf de sezon · timp de regăsire a trasabilității unui lot · loturi neconforme · stoc de produs finit „mort" · respectarea termenelor de valabilitate.

---

## 4. Departamentul ACHIZIȚII

Achiziții alimentează producția (substanțe active, materii prime, ambalaje) și magazinul (produse de revânzare: semințe, unelte, echipament). Multe sunt **importate** → termene lungi, curs valutar, vamă.

### 4.1 Puncte de fricțiune tipice
- Comenzi de aprovizionare reactive („am rămas fără") în loc de planificate.
- Furnizori, prețuri și termene comparați manual.
- Risc de rupere de stoc fix în vârful sezonului (când livrarea durează).
- Lipsă de vizibilitate: „ce trebuie comandat acum ca să avem în martie?"

### 4.2 Automatizări + AI
| Funcție | Ce automatizăm | Unde intră AI |
|---|---|---|
| **Reaprovizionare predictivă** | propuneri de comandă pe baza planului de producție + sezon + termene de livrare | AI calculează *când* să comanzi ca să ai la timp, ținând cont de lead-time la import |
| **Necesar de materii din producție** | lista de materii pentru planul de producție, automat | AI consolidează necesarul și grupează comenzile pe furnizor |
| **Comparare furnizori** | preț, termen, istoric, fiabilitate | AI recomandă furnizorul optim (nu doar cel mai ieftin — și cel mai sigur la termen) |
| **Procesare facturi/documente** | citire automată facturi, avize, documente vamale | AI extrage datele și le pune în sistem (fără tastare) |
| **Alerte de risc** | curs valutar, întârzieri, rupturi de stoc iminente | AI: „substanța X are lead-time 6 săpt., comand-o acum pentru sezonul de primăvară" |

### 4.3 KPI
Rupturi de stoc în sezon · zile de stoc · cost mediu de achiziție · % comenzi planificate vs urgențe · timp de procesare a unei facturi.

---

## 5. Stratul comun — „sistemul nervos"

Departamentele se automatizează cu adevărat doar dacă vorbesc între ele. Componente:

1. **Sursa unică de adevăr (ERP/bază de date).** Catalog, stoc, comenzi, loturi, clienți, furnizori — un singur loc. Dacă Diolsem folosește deja un sistem (ex. 1C, foarte comun în regiune), construim **peste** el, nu îl înlocuim.
2. **Strat de integrare.** Conectează ERP ↔ site/e-commerce ↔ marketplace-uri ↔ sistem automatizat ↔ canale (WhatsApp/Viber). Datele curg automat.
3. **Orchestrator AI + copiloti.** Modelele Claude pun „inteligența" deasupra: rezumă, prezic, propun, redactează, extrag din documente. Câte un copilot per departament, plus agentul care leagă lanțul cerere→producție→achiziție.
4. **Tablou de bord pentru conducere.** O privire: ce se vinde, ce se produce, ce trebuie cumpărat, unde e riscul. Rapoarte generate de AI în limbaj natural.

```
   Canale & clienți ─┐
   Site / marketplace ─┤
   Telefon/WhatsApp ──┤        ┌─────────────────────────┐
                       ├──────► │  STRAT INTEGRARE + ERP  │
   Vânzări ────────────┤        │  (sursa unică de date)  │
   Producere ──────────┤        └────────────┬────────────┘
   Achiziții ──────────┘                      │
                                ┌─────────────▼─────────────┐
                                │  ORCHESTRATOR AI (Claude) │
                                │  copilot Vânzări          │
                                │  copilot Producere        │
                                │  copilot Achiziții        │
                                │  agent cerere→producție   │
                                └─────────────┬─────────────┘
                                              ▼
                                   Tablou de bord conducere
```

---

## 6. Copiloti AI per departament (pe scurt)

Fiecare echipă primește un asistent care „știe" contextul ei și lucrează în limbaj natural (RO/RU):

- **Copilot Vânzări** — „Fă o ofertă pentru ferma X cu produsele uzuale și 5% discount." → ofertă gata.
- **Copilot Producere** — „Câte tone de îngrășământ Y putem face cu materiile din stoc și ce ne lipsește?" → răspuns + listă de comandat.
- **Copilot Achiziții** — „Ce trebuie comandat azi ca să avem stoc complet pentru martie?" → listă prioritizată cu furnizori și termene.
- **Copilot Contabilitate** — „Confirmă achitările de azi și arată-mi ce nu s-a potrivit." → încasări reconciliate + listă de rezolvat. (vezi `CONTABILITATE-OFERTE-INCASARI.md`)
- **Copilot Conducere** — „Cum stăm față de sezonul trecut și unde e riscul?" → rezumat + cifre.

> **Nod financiar:** ciclul **ofertă → încasare** unește Vânzările cu Contabilitatea — confirmarea automată a achitărilor pe oferte, cu toate ofertele și plățile păstrate în fișa clientului. Detaliat în `CONTABILITATE-OFERTE-INCASARI.md`.

---

## 7. Roadmap integrat (ordinea recomandată)

| Etapă | Departament(e) | Livrabil | De ce întâi |
|---|---|---|---|
| **Q-win 1** | Vânzări + Clienți | Sistem automatizat clienți + generator oferte + captură comenzi | venit imediat, vizibil |
| **Q-win 2** | Achiziții | Procesare automată facturi/documente + alerte stoc | scapă de muncă manuală, fără risc mare |
| **Core 1** | toate | Strat de date comun + integrare ERP/site/marketplace | fundația tuturor |
| **Core 2** | Vânzări→Producere | Prognoză vânzări → plan de producție | cel mai mare câștig de profit |
| **Core 3** | Producere | Batch records + trasabilitate + QC digital | conformitate + viteză |
| **Core 4** | Producere→Achiziții | Reaprovizionare predictivă din planul de producție | închide lanțul, zero rupturi în sezon |
| **Plus** | conducere | Tablou de bord + copiloti pe departamente | decizii pe date |

**Recomandare:** începem cu cele 2 quick-wins (rezultat în 4–6 săptămâni, încredere câștigată), apoi construim stratul de date care leagă tot.

---

## 8. Riscuri, guvernanță, oameni

| Temă | Abordare |
|---|---|
| Domeniu reglementat (omologare/doze) | AI propune, **omul aprobă**; nimic publicat fără validare umană |
| Calitatea datelor existente | etapa „Core 1" curăță și unifică înainte de a automatiza decizii |
| Sistem existent (probabil 1C/ERP) | construim **peste**, prin integrare — nu impunem schimbare brutală |
| Adoptarea de către echipe | copiloti care **ajută**, nu înlocuiesc; instruire scurtă; pornim de la durerile lor reale |
| Securitatea datelor | acces pe roluri, hosting conform, jurnalizare |
| Dependența de „AI face tot" | AI = asistent + automatizare a muncii repetitive; expertiza Diolsem rămâne centrală |

---

## 9. Ce ne trebuie ca să proiectăm corect (descoperire)

Pentru fiecare departament, o discuție scurtă (30–45 min) ca să mapăm fluxul real:
1. **Vânzări:** cum intră o comandă azi, cum se face o ofertă, ce canale, ce CRM/Excel.
2. **Producere:** ce sistem de planificare/loturi există, cum se țin batch records și omologările.
3. **Achiziții:** cum se decide ce și când se comandă, lead-time la import, furnizori cheie.
4. **IT/sisteme:** ce ERP/contabilitate folosesc (1C?), ce se poate integra.
5. **Conducere:** ce decizii vor să ia mai rapid și pe ce cifre.

Rezultatul: o **hartă a fluxurilor + plan prioritizat** cu efort/impact pentru fiecare automatizare, ca să atacăm întâi ce aduce cel mai mult, cu cel mai mic risc.

---

## 10. Pasul următor

Un **workshop de descoperire pe departamente** (o jumătate de zi, împărțit pe cele 3 echipe) + livrarea hărții de automatizare cu roadmap și estimări. În paralel, quick-win-ul de Vânzări (sistemul automatizat + generatorul de oferte) poate porni imediat, ca să se vadă valoare concretă cât construim fundația.

---

*Acest document extinde propunerea de la sistemul automatizat de clienți la automatizarea întregii companii. Cifrele și fluxurile se confirmă în faza de descoperire, pe procesele reale Diolsem.*
