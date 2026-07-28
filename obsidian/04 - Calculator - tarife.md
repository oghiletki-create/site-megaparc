---
tags: [megaparc, calculator, todo]
data: 2026-06-25
status: de-completat
---

# 04 — Calculator: tarife pe imobil ⚠️

> [!warning] De completat de tine
> Valorile de acum sunt **orientative** (estimative pentru Chișinău), puse ca
> placeholder. Trebuie înlocuite cu **tarifele reale Megaparc**.

## ✍️ Tabel de completat
Scrie tariful real (sau intervalul) în €/m²/lună:

| Imobil | Tip | Tarif real (€/m²/lună) | Interval min–max |
|---|---|---|---|
| Dacia 31 | Centru comercial |  |  |
| Moscova 9 | Galerie comercială |  |  |
| Moscova 20 | Spații comerciale (demisol/parter) |  |  |
| Vasile Lupu 48 | Oficii |  |  |

- Pentru imobile cu **tarife diferite pe nivel/zonă** (parter vs. demisol,
  vitrină vs. interior) → pune un **interval** (min–max).
- **Vatra** (vile) și **Florilor** (în dezvoltare) sunt **excluse** din calculator
  (rezidențial / în pregătire, nu se închiriază la €/m²/lună).

## 🔧 Unde se editează în cod
Fișier: **`js/main.js`** — un singur loc, obiectul `BUILDINGS`:

```js
const BUILDINGS = {
  dacia31:      { rate: 15, min: 12, max: 22, type: 'proj.1t' }, // Centru comercial
  moscova9:     { rate: 14, min: 11, max: 20, type: 'proj.2t' }, // Galerie comercială
  moscova20:    { rate: 9,  min: 6,  max: 13, type: 'proj.3t' }, // Spații comerciale
  vasilelupu48: { rate: 11, min: 9,  max: 15, type: 'proj.4t' }  // Oficii
};
```
- `rate` = tariful implicit (unde stă slider-ul la început)
- `min` / `max` = capetele intervalului ajustabil din slider
- `type` = cheia tipului de spațiu (nu o schimba)

> [!tip]
> Dacă un imobil are tarif fix (fără interval), pune `min` și `max` egale cu `rate`.

## Formule din calculator (pentru context)
- Chirie lunară = `suprafață × tarif`
- Chirie anuală = `lunar × 12`
- Standard: fond garanție = `3 × lunar`; la semnare = `4 × lunar`
- Plată în avans: reducere = `10% × anual`; de achitat = `anual − reducere`
- Garanție bancară: la semnare = `1 × lunar` (fără depozit numerar)

Reducerea de 10% și fondul de 3 luni sunt și ele ușor de schimbat în `js/main.js`
(funcția `render`). Spune-mi dacă vrei alte valori → [[02 - Instrument financiar]].
