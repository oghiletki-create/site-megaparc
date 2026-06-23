# Diolsem — Inteligența agronomică a botului + conștiență climatică + produse de import

**Pentru:** S.C. „DIOLSEM" S.R.L.
**Complementar:** `STRATEGIE-AUTOMATIZARE-AI.md`, `PROPUNERE-DIOLSEM.md`
**Versiune:** 1.0 · iunie 2026

---

## 1. Obiectiv

Botul nu trebuie să fie un simplu „motor de căutare în catalog", ci un **agronom digital** care:
1. **înțelege zona climaterică** în care se află clientul (Republica Moldova, pe regiuni),
2. ține cont de **cultură, sol, sezon, fază de vegetație și problemă**,
3. recomandă **varianta optimă** din lista de produse Diolsem — inclusiv din **produsele de import** — nu prima care se potrivește.

Pe scurt: din mai multe produse care „merg", botul îl alege pe **cel mai bun pentru situația concretă a clientului**.

---

## 2. Conștiența climatică — Republica Moldova

Botul lucrează cu un **profil agro-climatic** al țării, pe regiuni:

| Regiune | Specific climatic | Culturi dominante | Riscuri agronomice |
|---|---|---|---|
| **Nord** (stepa Bălți) | mai umed, ierni mai reci | cereale, sfeclă de zahăr, soia | boli foliare (umiditate), îngheț târziu |
| **Centru** (Codru) | deluros, precipitații mai bune | livezi, viță-de-vie, legume | mană/boli fungice (umiditate), grindină |
| **Sud** (Bugeac) | cald, secetos | viță-de-vie, floarea-soarelui, culturi rezistente la secetă | **secetă**, arșiță, stres hidric |

Elemente pe care le ia în calcul:
- **Sol predominant cernoziom** (sol fertil, ~70% din terenul agricol) — relevant pentru îngrășăminte.
- **Sezonalitate**: perioade de semănat, ferestre de tratament, îngheț târziu de primăvară, secetă de vară.
- **Zona de rezistență la frig** (~6a–7a) — relevant pentru semințe/soiuri și termene.

> Astfel, la aceeași problemă, recomandarea poate diferi: în **Centru** (umed) contează rezistența la spălare a tratamentului; în **Sud** (secetos) contează stresul hidric și momentul aplicării.

---

## 3. Cum alege botul „varianta optimă"

Când mai multe produse din catalog rezolvă aceeași problemă, botul le **ierarhizează** după criterii agronomice reale, nu la întâmplare:

```
Problemă + cultură + regiune + sezon + suprafață
                    │
                    ▼
   Produse-candidat din catalogul Diolsem (in stock + import)
                    │
        ┌───────────┴───────────────────────────┐
        ▼ criterii de optimizare:
  1. Eficacitate pe ținta exactă (boală/dăunător + cultură)
  2. Potrivire cu clima/regiunea (umed vs secetos, temperatură)
  3. Faza de vegetație și momentul aplicării
  4. Perioada de pauză vs. momentul recoltării
  5. Managementul rezistenței (rotația grupelor de substanțe – FRAC/IRAC)
  6. Disponibilitate: în stoc acum vs. import (termen de livrare)
  7. Cost / nivel de preț al clientului (Retail/Fermier/Angro)
                    │
                    ▼
   Recomandare optimă + 1–2 alternative, cu MOTIVAREA alegerii
```

Exemplu de răspuns:
> „Pentru mana la viță în zona Centru (umed), recomand **Produsul A** — rezistent la spălare de ploaie și omologat pe viță. Alternativă: **Produsul B** (mai ieftin, dar de reaplicat după ploaie). Pentru a evita rezistența, alternează cu o grupă diferită la tratamentul următor."

**Important — managementul rezistenței:** botul nu recomandă mereu același produs; ține cont de **rotația substanțelor active** (grupe FRAC pentru fungicide / IRAC pentru insecticide), ca tratamentele să rămână eficiente în timp. E un sfat de agronom adevărat, nu de vânzător.

---

## 4. De unde „știe" botul (surse, fără halucinații)

Cunoștințele de agronom sunt **ancorate în date oficiale**, nu inventate:
- **Fișele tehnice / etichetele** produselor Diolsem (omologare, culturi, ținte, doze, perioadă de pauză, grupă de rezistență).
- **Catalogul** (stoc, ambalaje, preț pe nivel de client, origine — autohton/import).
- **Profilul agro-climatic** al Moldovei pe regiuni (bază de cunoștințe curată, validată cu agronomul Diolsem).
- **Istoricul clientului** (cultură, regiune, ce a folosit) din fișa lui.

La orice dubiu sau situație neomologată → **escaladare la agronomul Diolsem**. Pe pesticide, prudența nu e opțională.

---

## 5. Produse de import — tratare specială

Diolsem comercializează și **produse de import**, nu doar producție proprie. Botul și sistemul le tratează corect:

| Aspect | Cum îl gestionăm |
|---|---|
| **Origine** | fiecare produs e marcat „autohton (Diolsem)" sau „import" + țara |
| **Omologare în Moldova** | botul recomandă din import **doar** produse omologate local pentru cultura cerută |
| **Disponibilitate** | „în stoc acum" vs. „import, termen ~X" — botul spune clar, ca să propună o alternativă în stoc dacă clientul se grăbește |
| **Preț & curs valutar** | prețul de import depinde de cursul valutar → legătură cu Achiziții și Contabilitate (vezi documentele respective) |
| **Reaprovizionare** | termenele lungi de import intră în reaprovizionarea predictivă (comandă din timp pentru sezon) |

> Astfel, dacă produsul optim e din import și are termen de livrare, botul propune fie să-l rezerve, fie o alternativă echivalentă din stoc — în funcție de urgența clientului.

---

## 6. Niveluri de preț pe client — pe scurt

Recomandarea optimă ține cont și de **nivelul de preț al clientului** (Retail / Fermier / Angro): aceeași soluție agronomică, dar prețul afișat e cel corect pentru categoria lui. Regula completă (și guvernanța: **prețul îl poate modifica doar directorul de vânzări**) este detaliată în `PRETURI-CLIENTI-GUVERNANTA.md`.

---

## 7. Ce ne trebuie ca să construim inteligența agronomică

1. **Fișele tehnice complete** ale produselor (autohtone + import): culturi, ținte, doze, perioadă de pauză, grupă de rezistență (FRAC/IRAC).
2. **Marcarea origine** (autohton/import + țară) și a **omologării** pe produs.
3. Validarea **profilului agro-climatic** pe regiuni împreună cu un **agronom Diolsem**.
4. Regulile de **preferință** ale Diolsem (ex. când să prioritizeze producția proprie vs. importul).
5. Datele de **stoc și termene de import** (legătură cu Achiziții).

---

## 8. Beneficii

- Recomandări **de nivel de agronom**, adaptate regiunii și sezonului → mai multă încredere, mai multe vânzări.
- **Diferențiere reală** față de orice magazin care doar listează produse.
- Folosirea inteligentă a **stocului vs. importului** → mai puține comenzi pierdute, gestiune mai bună.
- Sfaturi de **rotație/anti-rezistență** → clientul are rezultate, revine sezon de sezon.

---

*Cunoștințele agronomice sunt ancorate în datele oficiale Diolsem și validate cu un agronom al companiei; pe situații neomologate sau incerte, botul escaladează la om. Profilul climatic se rafinează în faza de descoperire.*
