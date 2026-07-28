# Sistemul de automatizare GO CRM — prezentare completă pentru A-casa

Un singur sistem, cu **un meniu diferit pentru fiecare rol**: Directorul General vede compania la nivel de decizie (bani, șantier, risc); fiecare departament — Vânzări, Contabilitate, Marketing/PR, Departament tehnic — vede exact ce-i trebuie lui ca să lucreze. Datele circulă automat între ele; nimeni nu introduce de două ori aceeași informație.

---

## 1. Principiul de arhitectură

```
                    ┌─────────────────────────────┐
                    │   DIRECTOR GENERAL           │
                    │   Bani · Șantier · Risc      │
                    │   (praguri, nu activitate)   │
                    └───────────────▲───────────────┘
                                    │  alimentează automat
        ┌───────────────┬──────────┴──────────┬───────────────┐
        │               │                     │               │
   💼 VÂNZĂRI     💰 CONTABILITATE      📣 MARKETING/PR   🏗️ TEHNIC
   (grilă, lead-uri, (facturi, rate,    (campanii, ROI,   (șantier, deviz,
   agenți, contracte)  reconciliere)     conținut, PR)     subantreprenori)
```

Fiecare departament lucrează în meniul lui. Directorul general **nu** vede lead-uri individuale sau facturi una câte una — el vede rezultatul agregat și **doar ce depășește un prag de alertă**. Restul rămâne la nivelul departamentului, cu responsabilul lui.

---

## 2. Panoul Directorului General

Nu un tablou cu tot ce mișcă în companie, ci **doi indicatori pe care supraviețuiește** plus un radar de excepții.

### 💵 Bani
- Sold de cont azi vs. plăți scadente în următoarele 14 zile
- Încasat ieri/azi vs. cheltuit (furnizori, subantreprenori)
- **Prognoză de cash-flow pe 3 luni**, actualizată automat cu ritmul real de vânzări și de cheltuială
- Restanțe de la clienți — sumă, vechime, proiect

### 🏗️ Șantier
- Stadiu fizic vs. graficul de execuție, pe fiecare bloc — nu procent vag, ci poziția reală („turnat planșeu 4, întârziere 3 zile")
- Deviz cheltuit vs. planificat, cumulat, pe proiect
- Ce e blocat și de ce (material, aviz, subantreprenor)

### ⚠️ Radar de risc — praguri, nu activitate
O singură listă, alimentată automat din toate departamentele, care arată **doar ce a depășit un prag**:
- abatere de buget > X% pe o poziție de deviz
- întârziere > N zile față de grafic
- restanță client > 30 de zile
- act adițional peste o valoare stabilită, în așteptarea aprobării lui

**Regula de delegare aplicată tehnic:** fiecare responsabil de departament are un prag definit. Sub prag, sistemul nu-l deranjează pe director — decide responsabilul. Peste prag, alerta ajunge automat la director, cu context, nu doar cu cifra goală.

> *„Nu vreau să mă întrebi — vreau să știu singur, de la sistem, exact când pragul meu e depășit."*

---

## 3. Meniul departamentului Vânzări

Pentru directorul de vânzări și agenți — tot ce ține de transformarea unui lead în contract.

- **Pâlnie de lead-uri** — captate automat din site, reclame, portaluri, WhatsApp; distribuție + follow-up automat
- **Grila de apartamente (șahmatca)** — statut unic (disponibil/rezervat/vândut), preț unic, sincronizat cu site-ul
- **Rezervări & contracte** — rezervare cu termen, contract generat automat din rezervare
- **Agenți** — clasament, comisioane calculate automat din contracte confirmate
- **Guvernanța prețului** — prețul e blocat pe grilă; discountul îl aprobă doar directorul de vânzări, jurnalizat

*Ce urcă la Director General:* doar ritmul de vânzare per proiect (pentru cash-flow) și alertele de stoc blocat — nu lead-urile individuale.

---

## 4. Meniul departamentului Contabilitate

Pentru contabilul-șef — banii, la zi, fără muncă de reconciliere manuală.

- **Grafic de rate per client** — generat automat la semnarea contractului
- **Confirmare automată a plăților** — extrasul bancar se citește singur, plata se potrivește cu rata corectă
- **Radar de restanțe** — cine datorează, cât, de câte zile, cu memento automat către client
- **Facturare** — emise/primite, citite automat din documente (furnizori, subantreprenori)
- **Flux de numerar** — sold, scadențe, prognoză — exact ce alimentează panoul directorului
- **Rapoarte fiscale** — pregătite automat pentru închiderea lunii/TVA

*Ce urcă la Director General:* soldul de cont, scadențele pe 14 zile, restanțele peste prag — automat, fără raport manual.

---

## 5. Meniul departamentului Marketing/PR

Pentru responsabilul de marketing — de la campanie la lead calificat, cu ROI real.

- **Campanii pe proiect** — Meta/Google Ads, portaluri imobiliare (999.md, makler), cu buget și rezultate
- **ROI pe sursă de lead** — ce reclamă aduce contracte, nu doar click-uri (legat direct de pâlnia de vânzări)
- **Conținut & social media** — descrieri, randări, calendar de postări
- **PR & evenimente** — lansări de proiect, comunicate de presă, parteneriate
- **Reputație** — recenzii și feedback de la clienți post-predare, urmărite automat

*Ce urcă la Director General:* nimic direct — Marketingul alimentează Vânzările (surse de lead), iar Vânzările alimentează cash-flow-ul.

---

## 6. Meniul departamentului Tehnic (construcție/șantier)

Pentru directorul tehnic și diriginții de șantier — inima operațională a unui dezvoltator.

- **Stadiu pe bloc și pe etapă** — fundație → structură → închideri → finisaje → predare, cu grafic vs. real
- **Deviz general vs. cheltuit** — pe poziții, cu abaterea semnalată devreme, nu la final
- **Subantreprenori** — contracte, termene, garanții de bună execuție, istoricul fiecăruia
- **Aprovizionare materiale** — stoc pe șantier, comenzi, termene de livrare
- **Autorizații & avize** — construcție, urbanism, racorduri utilități, cu alerte de expirare
- **Recepții** — parțiale și la terminarea lucrărilor, documentate digital
- **Calitate & siguranță (NTS)** — control digital, abateri semnalate imediat

*Ce urcă la Director General:* stadiul fizic vs. grafic și abaterea de buget, pe fiecare bloc — restul rămâne la nivel operațional, cu diriginte responsabil.

---

## 7. Cum se leagă totul — fără muncă dublă

Fiecare departament introduce datele o singură dată, la sursă:
- Vânzările marchează o rezervare → Contabilitatea primește automat graficul de rate
- Contabilitatea confirmă o plată → Directorul General vede cash-flow-ul actualizat
- Tehnicul bifează un stadiu → Directorul General vede abaterea de grafic
- Marketingul rulează o campanie → Vânzările văd sursa lead-ului în CRM

Nimeni nu recompletează Excel-uri paralele. Directorul General nu cere rapoarte — sistemul i le pune în față, doar pe ce depășește pragul lui.

---

## 8. Principiul general

**Sistemul pregătește și propune, omul decide.** Fiecare responsabil de departament are un prag de alertă clar — sub prag, lucrează liber; peste prag, sistemul anunță automat, cu context. Directorul General conduce pe excepții, nu pe activitate brută — timpul lui se duce pe deciziile care chiar îi cer atenția: bani, șantier, risc.

---

*Document de prezentare. Denumirea vizibilă pentru client este întotdeauna „Sistem de automatizare GO CRM" (nu „bot"). Concept, design și implementare = proprietatea GO CRM (Ghiletchi Consulting).*
