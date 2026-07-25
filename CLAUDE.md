# Note de proiect (pentru Claude)

## ⚠️ REGULĂ GLOBALĂ — admini & separarea boților (Oleg, 2026-07-24)

Valabilă pentru TOATE proiectele/boții (crm-go-bot și orice instanță):

1. În codul de bază există un singur admin hardcodat: **Oleg**. Niciodată alte
   ID-uri de persoane în cod.
2. Adminii fiecărui bot/client îi adaugă **exclusiv Oleg, per instanță**, prin
   variabila de mediu `EXTRA_ADMIN_IDS` pe serviciul acelui client (Railway).
3. Clienții nu se amestecă între boți: Aurica + IMC Grup = doar instanța
   Megaparc; Alexandru Muravschi (416540704) = doar instanța Metalica Zuev.
4. La orice bot nou, lista de admini pornește goală — decide Oleg.

## ⚠️ REGULĂ GLOBALĂ — panoul analitic (Oleg, 2026-07-25)

Valabilă pentru TOATE proiectele/boții:

1. Panoul analitic (`go-crm-analytics/`, oglindit în `analytics/` la fiecare bot)
   face parte din **codul de bază**. E singura suprafață de raportare — nu se mai
   construiește un al doilea dashboard.
2. **Conținutul panoului = strict meniul din Telegram** al botului respectiv.
   Sursa unică: `menu.js` — același descriptor face butoanele din `/start` și
   secțiunile panoului.
3. **Boți noi**: panoul se activează implicit (Oleg setează `DASHBOARD_TOKEN`).
   **Boți existenți**: doar **A-casa** și **EcoFloor** (Metalica Zuev e deja făcut).
4. Panoul e aplicație web instalabilă (PWA) — se fixează în bara de activități.

## Memorie — context clienți/prospecți

- **Art Granit (artgranit.md)** — prospect (blaturi piatră, reprezentant Cosentino).
  Nu a răspuns la propunere. Conținutul a fost eliminat din proiect la cererea lui Oleg.
  **A nu se mai pomeni public și a nu se mai lucra pe el** decât dacă Oleg cere explicit.
  Reținut doar ca memorie internă.

## Site publicat

- Netlify publică folderul **`lider/`** ca rădăcină (vezi `netlify.toml`).
  `lider/index.html` = pagina de candidatură a lui Oleg pentru holdingul Lider (bilingvă RU/RO).
