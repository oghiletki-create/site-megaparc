---
tags: [megaparc, web, implementat]
data: 2026-06-25
---

# 03 — Ce s-a implementat pe site

Toate modificările sunt pe branch `claude/megapark-website-strategy-hqsfiv`
și în PR-ul draft **#14**.

## 1. Layout premium — un singur scroll
- Înainte: site „pe pagini" (vedeai o singură secțiune odată, dădeai click).
- Acum: **scroll unic**, toate secțiunile vizibile de la început, una sub alta.
- Meniul face **scroll lin** la secțiune; secțiunea curentă se **subliniază
  automat** (scroll-spy).
- Fișiere: `js/main.js` (eliminat routing-ul pe pagini, adăugat scroll-spy),
  `css/style.css` (eliminat sistemul de pagini, adăugat `scroll-margin`).

## 2. Pagina „Istoric de succes"
- Mesaj de longevitate: *„Nu am apărut ieri. Aproape 20 de ani de construit."*
- **Timeline** în 5 etape: Fondare 2005 → Creștere (Dacia 31) → Extindere
  (Moscova 9 & 20) → Diversificare (Vasile Lupu 48, Vatra) → Prezent (Florilor
  + digitalizare).
- **4 piloni de încredere**: management de calitate, administrare 100% internă,
  locații cu trafic, relații pe termen lung.
- Bazat pe [[01 - Strategia site]] punctul 2.

## 3. Calculatorul de chirie & garanție
- Selector pe **imobil** (Dacia 31 / Moscova 9 / Moscova 20 / Vasile Lupu 48)
  care setează automat tariful și intervalul + tipul spațiului (tradus).
- Slidere: **suprafață** și **tarif** (ajustabil în intervalul imobilului).
- Cele **3 scheme** (Standard / Plată în avans / Garanție bancară) afișate
  **comparativ, una lângă alta**, fiecare cu explicație + cifre live.
- „Plată în avans" marcată ca **Recomandat**.
- Deasupra: chiria de bază (lunar / anual). Dedesubt: CTA „Solicită o ofertă".
- Logica financiară: [[02 - Instrument financiar]].
- Config tarife (de editat): [[04 - Calculator - tarife]].
- Fișiere: `index.html` (secțiunea `#calculator`), `js/main.js` (IIFE calculator),
  `css/style.css` (`.calc-*`, `.scheme-card`).

## 4. Trilingv RO / RU / EN
- Toate textele noi traduse în 3 limbi.
- Fișier: `js/i18n.js`. Comutatorul de limbă reține alegerea în `localStorage`.

## Structura fișierelor site
```
index.html        → conținutul tuturor secțiunilor
css/style.css     → tot stilul
js/i18n.js        → textele în RO/RU/EN
js/main.js        → interacțiuni: scroll-spy, reveal, calculator, etc.
img/              → imagini
```
