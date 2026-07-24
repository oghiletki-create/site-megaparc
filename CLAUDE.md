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

## Memorie — context clienți/prospecți

- **Art Granit (artgranit.md)** — prospect (blaturi piatră, reprezentant Cosentino).
  Nu a răspuns la propunere. Conținutul a fost eliminat din proiect la cererea lui Oleg.
  **A nu se mai pomeni public și a nu se mai lucra pe el** decât dacă Oleg cere explicit.
  Reținut doar ca memorie internă.

## Site publicat

- Netlify publică folderul **`lider/`** ca rădăcină (vezi `netlify.toml`).
  `lider/index.html` = pagina de candidatură a lui Oleg pentru holdingul Lider (bilingvă RU/RO).
