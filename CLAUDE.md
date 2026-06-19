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

## Primul bot — FĂCUT (în folderul `bot/`)
- Bot **Telegram** simplu, „răspunde la întrebări" (FAQ), în Python pur (fără
  dependențe — rulează cu `python3 bot/bot.py`).
- **Pe configurări**: pentru fiecare client nou se schimbă doar `bot/config.json`
  (nume, mesaje, listă întrebări/cuvinte-cheie/răspunsuri). Cod neschimbat.
- Potrivire inteligentă: prinde începutul cuvântului (terminații RO) și alege
  cuvântul-cheie cel mai specific. Testat cu mai multe formulări.
- Token-ul se ia din variabila de mediu `BOT_TOKEN`. Ghid: `bot/README.md`.

## Următorii pași posibili (de discutat)
- Punerea botului pe un **server** ca să meargă 24/24 (acum merge doar cât e pornit).
- **Programări direct prin bot** (acum trimite la telefon/WhatsApp).
- **Sistem de licență**: fiecare client plătitor primește o cheie care îi
  activează botul lui.
- Extindere pe alte canale (WhatsApp / chat pe site) folosind același config.

---
_Actualizează acest fișier când iau decizii noi sau termin etape, ca să rămână memoria proaspătă._
