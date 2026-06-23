# Diolsem — Contabilitate, oferte și confirmarea achitărilor

### Fluxul „ofertă → încasare" (offer-to-cash), unit cu contabilitatea, cu toate ofertele în fișierul clientului

**Pentru:** S.C. „DIOLSEM" S.R.L.
**Complementar:** `PROPUNERE-DIOLSEM.md`, `AUTOMATIZARE-DEPARTAMENTE.md`
**Versiune:** 1.0 · iunie 2026

---

## 1. Ce rezolvăm

Azi, de cele mai multe ori: oferta se face într-un fișier, proforma în alt program, plata se verifică manual în extrasul bancar / în contabilitate, iar cineva „dă telefon" să confirme că banii au intrat. Ofertele vechi se pierd prin email-uri și foldere.

Propunem ca **întreg ciclul — de la ofertă la banii încasați — să fie un singur fir, automat, legat de contabilitate, iar fișa clientului să fie sursa unică unde stau toate ofertele, facturile și plățile lui.**

Două cerințe explicite, acoperite integral:
1. **Confirmarea automată a achitărilor pe oferte** — când intră plata, sistemul o potrivește singur cu oferta/proforma corectă și marchează „achitat".
2. **Toate ofertele rămân în fișierul clientului** — niciodată pierdute, mereu cu statusul la zi.

---

## 2. Fișierul clientului = sursa unică

Fiecare client (fermier, distribuitor, gospodărie) are o **fișă** în care se adună automat tot:

- **Ofertele** (toate, cu istoric și status) — trimise, acceptate, refuzate, expirate.
- **Proformele și facturile** emise.
- **Plățile** (avansuri, plăți parțiale, achitări integrale) și **soldul** curent.
- **Comenzile și livrările** legate de fiecare ofertă.
- **Istoricul** discuțiilor (inclusiv din botul de clienți) și culturile/sezonul clientului.

> Reprezentantul de vânzări sau contabilul deschide o singură fișă și vede instant: ce i-am oferit, ce a acceptat, ce a plătit, ce mai datorează, ce s-a livrat.

---

## 3. Ciclul ofertă → încasare (statusuri)

```
  [1] Ofertă întocmită ──► [2] Ofertă trimisă ──► [3] Acceptată de client
                                                          │
                                                          ▼
                                              [4] Proformă emisă (→ contabilitate)
                                                          │
                          plata intră în bancă / casă     ▼
                          ┌──────────────────► [5] ACHITARE CONFIRMATĂ automat
                          │                               │  (parțial / integral)
                  potrivire automată                      ▼
                  (AI reconciliere)              [6] Factură fiscală + livrare
                                                          │
                                                          ▼
                                                [7] Finalizat · totul în fișa clientului
```

Fiecare tranziție:
- **actualizează automat statusul** ofertei în fișa clientului,
- **notifică** persoana potrivită (reprezentant, contabil, client),
- **declanșează pasul următor** (ex. achitare confirmată → comanda intră la livrare/producție).

---

## 4. Confirmarea automată a achitărilor (miezul cererii)

### Cum funcționează
1. Din oferta acceptată se emite **proforma**, cu un identificator unic (ex. nr. proformă) care merge în contabilitate.
2. Plata sosește prin: **transfer bancar** (B2B, dominant), **card/online**, sau **numerar la casă**.
3. Sistemul preia automat încasările:
   - din **extrasul bancar** (import periodic sau conexiune cu banca),
   - din **gateway-ul de plată** online,
   - din **casa de marcat** a magazinului.
4. **AI-ul potrivește (reconciliază) plata cu oferta/proforma corectă** — după sumă, destinația plății / numărul proformei, numele plătitorului și soldul clientului. Inclusiv cazurile dificile: plată parțială, avans, o plată pentru mai multe proforme, sau referință scrisă greșit de client.
5. La potrivire: **„Achitare confirmată"** → statusul ofertei devine *achitată* (sau *parțial achitată* + sold rămas) în fișa clientului.
6. **Notificare automată**: reprezentantul vede „clientul X a achitat proforma Y", iar clientul poate primi confirmare pe canalul lui (Viber/WhatsApp/email).
7. Ce nu se potrivește singur (sumă neclară, plătitor necunoscut) → **marcat pentru contabil**, cu sugestia AI-ului, pentru un singur clic de aprobare.

### De ce contează
- Vânzările **nu mai sună** contabilitatea să întrebe „au intrat banii?".
- Livrarea/producția pornește **imediat** ce plata e confirmată, nu a doua zi.
- Soldurile clienților (cine cât datorează) sunt **mereu la zi**, nu la sfârșit de lună.

---

## 5. Integrarea cu contabilitatea

Construim **peste** sistemul contabil existent (în regiune, frecvent **1C**), prin integrare — nu îl înlocuim:

| Direcție | Ce circulă automat |
|---|---|
| Vânzări → Contabilitate | oferta acceptată generează proforma/factura, fără re-tastare |
| Bancă/Casă → Contabilitate | încasările intră și se reconciliază cu facturile |
| Contabilitate → Vânzări/CRM | statusul plății și soldul se reflectă în fișa clientului |
| Contabilitate → Conducere | creanțe (cine ne datorează), încasări, flux de numerar |

**AI-ul adaugă** peste contabilitate: reconcilierea automată plată↔factură, citirea facturilor de la furnizori (legătură cu Achiziții), detectarea discrepanțelor și rapoarte în limbaj natural („cine are facturi neachitate peste 30 de zile?").

> Notă privind reglementarea fiscală: documentele fiscale (factura fiscală, TVA) rămân emise prin sistemul contabil oficial; AI-ul **pregătește și reconciliază**, dar înregistrarea fiscală rămâne în contabilitate, cu validare umană.

---

## 6. Copilotul de Contabilitate / Finanțe

Un asistent care lucrează în limbaj natural (RO/RU) pentru echipa financiară:
- „Confirmă achitările de azi și arată-mi ce nu s-a potrivit." → listă scurtă de rezolvat.
- „Cine are sold restant peste 30 de zile?" → listă cu sume și contacte.
- „Câți bani am încasat săptămâna asta vs. săptămâna trecută?" → răspuns + grafic.
- „Generează situația creanțelor pentru ședință." → raport gata.

---

## 7. Beneficii și indicatori

| Indicator | Țintă orientativă |
|---|---|
| Timp de confirmare a unei achitări | de la ore/o zi la **minute, automat** |
| % încasări reconciliate automat | 80–90% |
| Oferte „pierdute" / fără urmărire | spre **zero** (toate în fișa clientului) |
| Întârziere livrare după plată | eliminată (pornește la confirmare) |
| Vizibilitate sold clienți | **timp real**, nu lunar |
| Timp de închidere lunară (contabilitate) | redus semnificativ |

---

## 8. Cum se leagă de restul sistemului

Acest flux este „nodul financiar" al sistemului nervos digital:

```
  Bot/Clienți → VÂNZĂRI → [OFERTĂ] → CONTABILITATE → [ACHITARE CONFIRMATĂ]
                                                              │
                                  ┌───────────────────────────┘
                                  ▼
                     PRODUCERE / livrare pornește la plată confirmată
                                  ▲
                     ACHIZIȚII ← facturile furnizorilor intră tot prin contabilitate
                                  │
                            Toate ofertele, facturile și plățile → FIȘA CLIENTULUI
```

- **Vânzări** câștigă viteză (ofertă → bani urmăriți singuri).
- **Producere/Livrare** pornesc exact când banii sunt confirmați.
- **Achiziții** beneficiază de citirea automată a facturilor furnizorilor.
- **Conducerea** vede fluxul de numerar și creanțele în timp real.

---

## 9. Ce ne trebuie ca să implementăm

- Cum se emit azi **ofertele și proformele** (în ce program/format).
- Ce **sistem contabil** folosiți (1C? altul?) și ce posibilități de integrare are.
- Cum se verifică azi **încasările** (extras bancar manual? legătură cu banca?).
- Băncile și, dacă există, **gateway-ul de plată online** și casa de marcat din magazin.
- Regulile de **plată parțială/avans** și de TVA/facturare fiscală.

---

## 10. Pasul următor

Includem acest flux în **workshop-ul de descoperire**, ca un fir dedicat „ofertă → încasare". Quick-win posibil devreme: **fișa clientului cu toate ofertele + confirmarea automată a achitărilor** — vizibilă imediat pentru Vânzări și Contabilitate, cu risc mic și impact mare.

---

*Documentele fiscale rămân în sistemul contabil oficial; AI-ul pregătește, potrivește și raportează, omul validează. Cifrele se confirmă în faza de descoperire pe procesele reale Diolsem.*
