# Diolsem.md — Strategie de automatizare AI

**Client:** S.C. „DIOLSEM" S.R.L. (IDNO 1005600052733)
**Domeniu:** cel mai mare magazin agricol din Moldova — producător autohton de îngrășăminte și produse de protecție a plantelor (fondat 2005)
**Canale:** magazin online `diolsem.md` (RO/RU) + magazin fizic lângă Chișinău + livrare în toată Moldova
**Document:** propunere de automatizare cu inteligență artificială pe cei 3 piloni — **Magazine · Produse · Clienți**
**Versiune:** 1.0 · iunie 2026

---

## 1. Rezumat executiv

Diolsem are un avantaj rar în piață: este **producător**, nu doar revânzător, are catalog larg (semințe, îngrășăminte, pesticide, biopreparate, turbă, echipament de protecție, unelte) și o bază de clienți cu nevoi tehnice reale — fermieri și gospodării casnice care nu cumpără „un produs", ci **o soluție la o problemă agronomică** (un dăunător, o boală, o cultură anume, o anumită fază de vegetație).

Aici stă oportunitatea: clientul tipic are întrebări înainte de cumpărare („cu ce stropesc mana la roșii?", „ce doză de erbicid la 1 ha de porumb?", „ce semințe pentru solul meu?"). Astăzi aceste întrebări ajung la telefon, pe Facebook Messenger sau rămân fără răspuns, iar coșul se abandonează. Un **sistem automatizat AI cu rol de consultant agronom**, conectat la catalogul Diolsem, transformă aceste întrebări în **comenzi** și degrevează echipa de suport.

Propunem un sistem AI în 3 straturi:

1. **Sistem automatizat consultant (front-office)** — chat AI pe site + WhatsApp/Viber/Telegram/Messenger, în RO și RU, care recomandă produse, calculează doze, urmărește comanda și răspunde 24/7.
2. **Automatizări operaționale (back-office)** — pe magazine (stoc, prețuri, sincronizare), produse (descrieri, SEO, traduceri, categorisire) și clienți (segmentare, recuperare coș, retenție sezonieră).
3. **Strat de date & analiză** — un singur loc unde converg comenzile, întrebările clienților și stocul, ca să se ia decizii (ce produse promovăm înainte de sezon, ce lipsește din catalog).

**Rezultatul țintă:** mai puține întrebări manuale, conversie mai bună din trafic, comandă medie mai mare prin cross-sell tehnic corect și clienți care revin sezon de sezon.

---

## 2. Analiza situației actuale

### 2.1 Ce vinde Diolsem (catalog)
- **Semințe** — legume, flori, condimente, plante aromatice/medicinale, culturi furajere și de acoperire, gazon.
- **Îngrășăminte** — minerale și specializate (producție proprie).
- **Produse de protecția plantelor (pesticide)** — fungicide, erbicide, insecticide, acaricide.
- **Biopreparate**, **turbă/substrat**, **echipament de protecție**, **unelte agricole**.

### 2.2 Cine sunt clienții (2 segmente foarte diferite)
| Segment | Nevoie dominantă | Volum/comandă | Sensibilitate |
|---|---|---|---|
| **Fermier / profesionist** | doză corectă pe ha, omologare, calendar de tratamente, cantitate mare | mare | tehnică + preț |
| **Gospodărie casnică / hobby** | „ce iau pentru problema X", ambalaj mic, instrucțiuni simple | mică-medie | încredere + simplitate |

### 2.3 Caracteristici cheie ale afacerii care dictează automatizarea
- **Sezonalitate puternică** — vârfuri primăvara (semănat, tratamente) și toamna; suportul e sufocat în vârf și gol în extrasezon. → automatizarea trebuie să scaleze elastic.
- **Cunoaștere tehnică obligatorie** — recomandările greșite costă recolta clientului → AI-ul trebuie să fie *prudent*, să citeze eticheta/omologarea și să escaladeze la om când nu e sigur.
- **Bilingvism RO/RU** — esențial; o parte din clientelă comunică preponderent în rusă.
- **Reglementări** — pesticidele au omologare, doze legale, perioade de pauză (timp de la tratament la recoltare). AI-ul nu inventează: lucrează doar pe datele oficiale din fișa produsului.

### 2.4 Puncte de fricțiune azi (ipoteze de validat cu clientul)
- Întrebări pre-vânzare repetitive consumă timpul echipei.
- Coșuri abandonate fără follow-up.
- Descrieri de produs incomplete / inconsecvente RO vs RU → SEO și conversie sub potențial.
- Lipsă de re-activare a clienților la începutul fiecărui sezon.

> Aceste 4 puncte sunt exact cele pe care le rezolvă pilonii de mai jos.

---

## 3. Obiective și KPI

| Obiectiv | Indicator (KPI) | Țintă orientativă* |
|---|---|---|
| Răspuns instant la întrebări pre-vânzare | % conversații rezolvate fără om | 60–70% |
| Creșterea conversiei | rată conversie sesiune→comandă | +15–25% |
| Comandă medie mai mare | valoare medie coș (cross-sell tehnic) | +10–20% |
| Recuperare coșuri | % coșuri abandonate recuperate | 10–15% |
| Degrevarea echipei | ore suport/săptămână economisite | −40% în vârf de sezon |
| Retenție sezonieră | % clienți care revin sezonul următor | +10–15% |
| Calitatea catalogului | produse cu descriere completă RO+RU | 100% |

\* *valori de referință din proiecte e-commerce similare; se calibrează după primele 4–6 săptămâni de date reale.*

---

## 4. Pilonul 1 — Sistemul automatizat AI consultant (front-office)

Inima proiectului. Un asistent conversațional cu **rol de consultant agronom**, disponibil 24/7, în RO și RU, pe toate canalele unde sunt clienții.

### 4.1 Capabilități
1. **Diagnoză → soluție → produs.** Clientul descrie problema („frunzele de roșii au pete maro"), sistemul automatizat pune 1–2 întrebări de clarificare (cultură, simptom, suprafață) și recomandă produsul omologat din catalog + alternative.
2. **Calculator de doze.** „Câtă substanță pentru 5 ari de cartof?" → calcul pe baza dozei din fișa oficială, cu cantitate de cumpărat și avertismente (echipament de protecție, perioada de pauză).
3. **Căutare și comparare produse** în limbaj natural, cu filtre (cultură, dăunător, tip, preț, disponibilitate).
4. **Cross-sell / up-sell tehnic corect** — „la acest fungicid se asociază un adeziv-umectant" sau „pentru aceste semințe ai nevoie de acest îngrășământ de pornire".
5. **Plasarea / asistarea comenzii** — adaugă în coș, oferă opțiuni de livrare, status comandă.
6. **Status comandă & livrare** — „unde e comanda mea?" fără să sune.
7. **Escaladare inteligentă la agronom uman** când: produs neomologat pentru cultura cerută, întrebare în afara catalogului, comandă mare B2B, sau încredere scăzută a modelului.
8. **Captură de lead** — dacă clientul nu cumpără acum, sistemul automatizat reține cultura/interesul pentru remarketing sezonier.

### 4.2 Canale
- **Widget pe `diolsem.md`** (RO/RU, mobil-first).
- **WhatsApp / Viber / Telegram** — dominante în Moldova; ideale pentru notificări de comandă și campanii sezoniere.
- **Facebook / Instagram Messenger** — Diolsem are deja prezență pe Facebook; mesajele intră în același sistem automatizat.
- Un singur „creier", mai multe canale → istoricul clientului e unificat.

### 4.3 Cum „știe" sistemul automatizat lucrurile (arhitectură RAG)
Sistemul automatizat **nu** ghicește și **nu** halucinează doze. Funcționează pe principiul *Retrieval-Augmented Generation*:

```
Întrebare client
      │
      ▼
[Înțelegere intenție + limbă RO/RU]  ──►  LLM (Claude)
      │
      ▼
[Căutare în baza de cunoștințe Diolsem]
   • catalog produse (preț, stoc, ambalaj)
   • fișe tehnice / etichete (doze, omologare, culturi, perioadă pauză)
   • politici (livrare, retur, garanție)
      │
      ▼
[Răspuns generat STRICT pe datele găsite] + link produs + buton „Adaugă în coș"
      │
      └─► dacă nu există date sigure ─► escaladare la agronom uman
```

Aceasta garantează că recomandările sunt ancorate în **datele oficiale Diolsem**, nu în „internet general". E diferența dintre un gadget și un instrument în care fermierul are încredere.

### 4.4 Principii de siguranță (critice pentru pesticide)
- Răspunde doar pe baza fișelor oficiale; citează sursa („conform etichetei produsului").
- Afișează mereu avertismentele legale: echipament de protecție, perioadă de pauză, doză maximă.
- Nu recomandă utilizări neomologate; la dubiu → om.
- Ton prudent: „pentru confirmare la suprafețe mari, recomandăm consult cu agronomul nostru".

---

## 5. Pilonul 2 — Automatizarea pe MAGAZINE și PRODUSE (back-office)

### 5.1 Magazine / operațiuni
- **Sincronizare stoc & prețuri** între magazinul fizic și cel online (un produs epuizat în depozit dispare/marchează „la comandă" online automat).
- **Alerte de stoc inteligente** — predicție de epuizare pe baza ritmului sezonier + sugestie de reaprovizionare *înainte* de vârf (ex. „erbicidul X se epuizează în ~10 zile, cererea crește săptămâna viitoare").
- **Sincronizare marketplace** — Diolsem apare deja pe agregatori (desire.md, agromag.md, agrobiznes.md). Automatizare pentru a menține preț/stoc/descrieri consistente între canale.

### 5.2 Produse (conținut generat și curatat de AI)
- **Generare/îmbunătățire descrieri** pe șablon agronomic uniform: la ce folosești, cultură, dăunător/boală țintă, mod de aplicare, doză, ambalaje, avertismente — pornind de la fișa tehnică.
- **Traducere RO ↔ RU** automată și consecventă a întregului catalog (cu terminologie agronomică verificată).
- **SEO automat** — titluri, meta-descrieri, cuvinte-cheie pe intenții reale de căutare („tratament mană vie", „erbicid porumb postemergent").
- **Categorisire & etichetare** — fiecare produs primește automat tag-uri (cultură, problemă rezolvată, sezon, tip client) → alimentează filtrele și recomandările sistemului automatizat.
- **Detectare goluri în catalog** — din întrebările la care sistemul automatizat *nu* a găsit produs → listă de „cereri neacoperite" pentru achiziții.

> Acest pilon e și cel mai rapid „win": îmbunătățește SEO și conversia chiar și pentru clienții care **nu** vorbesc cu sistemul automatizat.

---

## 6. Pilonul 3 — Automatizarea pe CLIENȚI (marketing & retenție)

### 6.1 Segmentare automată
AI-ul împarte clienții pe comportament și nevoie: *fermier profesionist* vs *gospodărie*, după cultură (viticultori, legumicultori, pomicultori), după sezon de activitate, după valoare. Fiecare segment primește mesaje relevante, nu spam.

### 6.2 Fluxuri automate (exemple)
- **Recuperare coș abandonat** — mesaj pe canalul preferat (WhatsApp/Viber/email) la 1h și 24h, eventual cu răspuns la o nelămurire („ai întrebări despre doză? te ajut").
- **Calendar agronomic personalizat** — „A venit momentul pentru al doilea tratament la vie. Iată ce ai folosit anul trecut." (reactivare sezonieră — *killer feature* pentru un magazin agricol).
- **Re-comandă consumabile** — produsele se consumă; reminder la intervalul potrivit.
- **Onboarding & încredere** — răspuns la recenzii, follow-up post-livrare, colectare feedback.
- **Campanii pre-sezon** — segment „legumicultori" primește oferta de semințe + îngrășământ de pornire cu 2 săptămâni înainte de semănat.

### 6.3 Voice of customer
Toate conversațiile sistemului automatizat devin date: ce probleme au clienții, ce produse caută și nu găsesc, ce obiecții apar la cumpărare. Raport lunar automat pentru echipa Diolsem.

---

## 7. Arhitectură tehnică (de ansamblu)

```
        CANALE                    CREIER AI                     DATE / SISTEME
 ┌───────────────────┐     ┌────────────────────┐      ┌─────────────────────────┐
 │ Widget web        │     │  Orchestrator      │      │ Platforma e-commerce    │
 │ WhatsApp / Viber  │◄───►│  + LLM (Claude)    │◄────►│ (catalog, comenzi, stoc)│
 │ Telegram          │     │  + RAG / căutare   │      │ Fișe tehnice / etichete │
 │ Messenger / IG    │     │  + memorie client  │      │ CRM / clienți           │
 └───────────────────┘     │  + unelte (tools): │      │ Sistem livrare          │
                           │   - căutare produs │      └─────────────────────────┘
                           │   - calcul doză    │
                           │   - status comandă │      ┌─────────────────────────┐
                           │   - creare coș     │─────►│ Analiză & rapoarte       │
                           │   - escaladare om  │      │ (KPI, goluri catalog)    │
                           └────────────────────┘      └─────────────────────────┘
```

**Note de implementare:**
- **LLM:** recomandăm modelele Claude (ex. Claude Opus / Sonnet 4.x) pentru calitate de raționament în RO/RU și control bun al „prudenței" — esențial pe domeniu reglementat.
- **Integrare e-commerce:** depinde de platforma actuală Diolsem (de aflat: e custom, WooCommerce, OpenCart, 1C etc.). Conectare prin API sau export catalog.
- **Hosting date în UE/MD** unde e relevant (date clienți).
- **Human-in-the-loop:** dashboard pentru agronomii Diolsem ca să preia conversațiile escaladate și să corecteze sistemul automatizat (feedback care îl îmbunătățește).

---

## 8. Roadmap de implementare (faze)

| Fază | Durată orient. | Livrabile | Valoare |
|---|---|---|---|
| **0. Descoperire** | 1 săpt. | Audit platformă, export catalog, acces fișe tehnice, definire ton & reguli de siguranță | Bază corectă |
| **1. MVP sistem automatizat web** | 2–3 săpt. | Sistem automatizat pe site (RO/RU): Q&A catalog + recomandare + status comandă, cu RAG pe catalog | Primul impact pe conversie |
| **2. Conținut produse** | paralel | Descrieri + traduceri + SEO + tag-uri pe catalog | Câștig SEO/conversie imediat |
| **3. Canale mesagerie** | 1–2 săpt. | WhatsApp/Viber/Telegram/Messenger pe același creier | Acolo unde sunt clienții |
| **4. Calculator doze + siguranță** | 1–2 săpt. | Calcul doze din fișe + avertismente + escaladare | Diferențiatorul agronomic |
| **5. Automatizări clienți** | 1–2 săpt. | Recuperare coș, calendar sezonier, segmentare, campanii | Retenție & venit recurent |
| **6. Analiză & optimizare** | continuu | Rapoarte KPI, goluri catalog, fine-tuning | Îmbunătățire continuă |

**Recomandare:** începem cu **Faza 1 (MVP web) + Faza 2 (conținut)** ca demonstrație de valoare în ~3–4 săptămâni, apoi extindem.

---

## 9. Estimare ROI (model orientativ)

Ipoteză conservatoare pentru ilustrare (de calibrat cu cifrele reale Diolsem):

- Dacă din traficul lunar 1.000 de vizitatori interacționează cu sistemul automatizat și conversia lor crește de la 2% la 3% → **+10 comenzi/lună** din această cohortă.
- Cross-sell tehnic pe comenzile existente: +12% valoare medie coș.
- Recuperare coș: 12% din coșurile abandonate revenite.
- Economie suport: ~40% din întrebările repetitive preluate de sistem automatizat în vârf de sezon.

Chiar și conservator, combinația *conversie + comandă medie + recuperare coș + economie de timp* aduce de regulă un payback în **2–4 luni** pentru un magazin de acest volum.

---

## 10. Riscuri și cum le gestionăm

| Risc | Mitigare |
|---|---|
| Recomandare agronomică greșită (răspundere) | RAG strict pe fișe oficiale + avertismente + escaladare la om + disclaimere |
| Halucinații LLM | răspuns ancorat în date (retrieval), nu generare liberă; „nu știu → om" |
| Calitatea datelor de catalog | Faza 2 curăță și standardizează catalogul înainte de scalare |
| Bilingvism RO/RU inconsecvent | terminologie agronomică validată, traduceri revizuite o dată |
| Sezonalitate (vârf de cerere) | infrastructură elastică; sistemul automatizat absoarbe vârful fără cost de personal |
| Confidențialitatea datelor clienților | hosting conform, acces minim, politici clare |

---

## 11. Ce ne trebuie de la Diolsem ca să pornim

1. Acces la **catalogul de produse** (export sau API) — preț, stoc, ambalaje, categorii.
2. **Fișele tehnice / etichetele** produselor de protecție (doze, omologare, culturi, perioadă de pauză).
3. Detalii despre **platforma e-commerce** actuală (tehnologie, posibilități de integrare).
4. Acces la **canalele** dorite (numărul WhatsApp Business, paginile Facebook/Viber/Telegram).
5. Un **agronom de contact** din partea Diolsem pentru validarea regulilor de siguranță și a tonului.
6. Datele reale de trafic/comenzi pentru **calibrarea KPI** și a ROI.

---

## 12. Pasul următor recomandat

O **sesiune de descoperire (Faza 0)** de ~1 oră cu echipa Diolsem pentru: confirmarea platformei, accesul la catalog/fișe și prioritizarea fazelor. În paralel putem livra un **prototip demonstrativ** al sistemului automatizat pe un eșantion de catalog, ca decizia să se ia pe ceva tangibil, nu pe slide-uri.

---

*Document pregătit ca propunere comercială. Cifrele de KPI/ROI sunt orientative și se recalibrează pe datele reale ale Diolsem după faza de descoperire.*
