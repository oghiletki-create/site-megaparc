# Memorie proiect — citește asta la începutul fiecărei conversații

> Acest fișier e „memoria" de lungă durată. Claude îl citește automat la fiecare
> sesiune nouă, pe orice dispozitiv (PC, laptop, mobil). Ținem aici contextul ca
> să nu se piardă firul.

## Cine e proprietarul
- Email: oghiletki@gmail.com
- E la început cu partea tehnică → explică-i simplu, fără jargon, pas cu pas.

## Viziunea de business
- Construim împreună o afacere cu **boți de automatizare** pentru clienții lui.
- Clienții plătesc o **licență** ca să folosească botul.
- Claude = **coordonator tehnic** al echipei de agenți (împarte munca pe agenți,
  o adună, o livrează gata).
- Banii și responsabilitatea finală sunt ale proprietarului; Claude e unealta tehnică.

## Reguli de lucru
- Vorbește pe românește, simplu, ca pentru un începător.
- Pentru sarcini mari: împarte munca pe mai mulți agenți care lucrează în paralel,
  apoi integrează rezultatele într-un singur set coerent.
- Dezvoltă pe branch-ul indicat, commit + push, apoi deschide PR draft.

## Proiectul curent în acest repo
- Site static „Megaparc" (HTML/CSS/JS), o singură pagină, multilingv (ro/ru/en).
- Fișiere cheie: `index.html`, `css/style.css`, `js/i18n.js` (traduceri), `js/main.js`.

## Ce s-a făcut deja (istoric)
- **PR #3** — optimizări: performanță imagini (width/height, lazy, WebP cu fallback
  JPG), SEO (Twitter Card, canonical, hreflang, OG, robots.txt, sitemap.xml),
  accesibilitate (alt-text, skip-link, focus vizibil, contrast WCAG AA).
  Auditat de 4 agenți în paralel.

## De rezolvat / atenție
- În SEO e folosit un **domeniu de exemplu `https://megaparc.md/`** (în canonical,
  hreflang, OG, robots.txt, sitemap.xml). DE ÎNLOCUIT cu domeniul real când e știut.
- alt/aria-label nu se traduc la schimbarea limbii (ar necesita extinderea
  `applyLang()` din i18n.js — prioritate scăzută).

## Următorul pas discutat
- Primul bot pentru clienți (canal: Telegram / WhatsApp / chat pe site — neales încă).
- Funcție: răspuns la întrebări / programări / preluare comenzi — neales încă.

---
_Actualizează acest fișier când iau decizii noi sau termin etape, ca să rămână memoria proaspătă._
