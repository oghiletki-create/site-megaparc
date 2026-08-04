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

## ⚠️ REGULĂ GLOBALĂ — conținutul se face pe meseria clientului (Oleg, 2026-07-26)

Valabilă pentru TOATE proiectele/boții:

1. **Forma e una singură, conținutul se schimbă.** Coloristica, tipografia și
   ritmul vin din goproperty.digital pentru toți clienții, fără excepție (vezi
   regula de brandbook). Ce se schimbă de la client la client sunt **rapoartele,
   indicatorii și cuvintele** — după domeniul lui de activitate.
2. Exemple de citit ca reper, nu ca listă închisă:
   - **comerț cu metal / import** (Metalica Zuev): loturi la vamă, termen de
     depozitare temporară, dovezi de origine, cost real de intrare, creanțe;
   - **dezvoltator imobiliar**: unități libere/rezervate/vândute, rate de la
     cumpărători, drumul cumpărătorului, încasări pe luni;
   - **montaj / pardoseli** (EcoFloor): metri pătrați montați, echipe pe șantier,
     termene, materiale consumate.
3. **Datele de demonstrație urmează aceeași regulă.** Un dezvoltator căruia îi
   arăți „Tablă zincată 0,5 mm” nu se recunoaște în produs. Generatorul de
   demonstrație (`src/lib/panou/demo.js` în gocrm-base) e deocamdată scris pentru
   comerțul cu metal — la primul client din alt domeniu se face setul lui.
4. Regula de la 2026-07-25 rămâne: secțiunile panoului ies din **modulele active**
   ale acelui bot. Domeniul de activitate se alege prin ce module îi pui, nu prin
   cod paralel pentru fiecare client.

## ⚠️ REGULĂ GLOBALĂ — coloristica & brandbook (Oleg, 2026-07-26)

Valabilă pentru TOATE proiectele, boții, panourile, ofertele și prezentările:

1. **Sursa unică a identității vizuale: [goproperty.digital](https://goproperty.digital/)**
   — site-ul lui Oleg. Culorile, fonturile și ritmul de acolo se aplică la tot ce
   producem. Nu există a doua paletă.
2. **Nu se inventează palete** și **nu se împrumută de la clienți**. Materialele
   unui client (site, logo, documente) descriu clientul, nu produsul nostru.
   Greșeala de evitat: pe 2026-07-26 panoul a fost stilizat după site-ul Megaparc
   pentru că „site-ul meu” a fost citit greșit — Megaparc e client, nu brandul nostru.
3. Când o sarcină cere culori și paleta exactă nu e la îndemână, **se cere lui Oleg**
   (captură de ecran sau codurile hex). Nu se ghicește din alte materiale — în repo
   există cel puțin patru palete vechi, contradictorii (oferte, prezentări, panou).
4. Valorile exacte se scriu **aici**, în secțiunea de mai jos, prima dată când sunt
   confirmate — ca să nu se mai ceară a doua oară.

### Paleta goproperty.digital

> **De completat.** Mediul de execuție are domeniul blocat prin politica de rețea
> (`connect_rejected` la `goproperty.digital:443` — verificat prin WebFetch, curl și
> Chromium). Se completează din ce trimite Oleg: fundal, text, accent, fonturi.

## 📋 CE EXISTĂ DEJA în codul de bază (2026-07-26)

Documentul complet: **`IMPLEMENTARE-BOTI.md` din repo-ul `gocrm-base`** — ce s-a
construit, ce variabilă pornește fiecare lucru, ce e verificat și ce nu. Se citește
ÎNAINTE de a promite ceva unui client sau de a rescrie ceva ce există deja.

**Ce se pune la toți boții: PANOUL. Atât.** Restul din tabel sunt module și se aleg
după meseria clientului — nu toți au nevoie de tot ce are Metalica Zuev. Panoul n-are
conținut propriu: secțiunile lui ies din modulele active, deci se configurează
modulele, iar panoul urmează. Greșeala de evitat: să se copieze setul lui Metalica la
alt client „ca să aibă și el” — iese un panou plin de ecrane goale, iar directorul
care deschide de trei ori un raport fără cifre nu-l mai deschide niciodată.

| ce | la cine | se pornește cu | stare |
|---|---|---|---|
| Panoul directorului (server-rendered, grafice reale, o pagină per modul) | la toți | `PANEL_TOKEN` + `PANEL_URL` | ✅ |
| Panoul în Telegram, pe tot ecranul, buton în bara de jos | la toți | vine cu `PANEL_TOKEN` | ✅ |
| Acces limitat pe departament, semnat criptografic | la toți | automat, după organigramă | ✅ |
| Date de demonstrație (firmă inventată, bandă roșie) | la toți, cât timp CRM-ul e gol | `PANEL_DEMO=on` | ✅ |
| Import & vamă (termene, origine, cost real de intrare) | doar firmele care importă | `MODULES_ON=import` | ✅ |
| Eligibilitate de plată, inclusiv calificarea clienților noi | doar unde se vinde pe credit | modulul `clients` | ✅ |
| Verificare juridică cu evidență + reverificare săptămânală | doar unde se vinde pe credit | modulul `clients` | ✅ |
| Supraveghere automată a registrelor publice | doar unde se vinde pe credit | `VERIF_AUTO=on` | ⚠️ **neconfirmată** |

**Ultima linie contează:** supravegherea automată e scrisă și probată pe pagini
fabricate, dar citirea registrelor reale **nu s-a putut verifica** — domeniile sunt
blocate din mediul de dezvoltare. Nu se prezintă clientului ca funcțională până nu
trece proba `/verifdiag <firmă>` pe serverul lui.

**Ordinea de implementare la un bot existent:** `git pull` → `railway up` →
variabilele în Railway → `/start` (pune butonul din bara de jos) → `/panou` (linkul,
doar conducerii) → `/verifdiag` (decide dacă se pornește supravegherea).

**Varianta web:** panoul e deja HTML randat pe server, fără cod care rulează în
browser. Varianta web e același cod fără învelișul de Telegram — rămâne de decis doar
autentificarea (linkul cu token ține loc de parolă; merge pentru conducere, nu pentru
zeci de utilizatori).

## Memorie — context clienți/prospecți

- **Art Granit (artgranit.md)** — prospect (blaturi piatră, reprezentant Cosentino).
  Nu a răspuns la propunere. Conținutul a fost eliminat din proiect la cererea lui Oleg.
  **A nu se mai pomeni public și a nu se mai lucra pe el** decât dacă Oleg cere explicit.
  Reținut doar ca memorie internă.

## ⚠️ REGULĂ GLOBALĂ — integrare 1С (Oleg, 2026-08-04)

Valabilă pentru TOATE proiectele/boții:

1. Datele din 1С se iau prin **interfața standard OData** a platformei (REST,
   fără cod pe partea 1С). Referința: **`INTEGRARE-1C-ODATA.md`** — conspect
   complet după textul integral al articolului Infostart nr. 1570140 „Работа с
   1С через протокол OData" (textul l-a furnizat Oleg; site-ul e blocat din
   mediul de dezvoltare). Se citește înainte de orice lucrare pe date din 1С.
2. Capcana nr. 1: după publicare lista de obiecte OData e GOALĂ până când
   1С-istul clientului rulează `УстановитьСоставСтандартногоИнтерфейсаOData`
   (la configurațiile tipice e deseori deja activată — se verifică cu
   `ПолучитьСоставСтандартногоИнтерфейсаOData`).
3. Produsul de la clienți: **„1С:Управление компанией"** (confirmat de Oleg,
   2026-08-04) — ediția localizată (Moldova) din familia УНФ / „Управление
   нашей фирмой" (internațional 1C:Drive). Configurație tipică pe platforma
   8.3, ERP pentru firme mici: vânzări, comenzi, clienți, stoc, bani, salarii,
   producție. OData funcționează pe ea ca în referință; ediția/versiunea exactă
   se confirmă din „Despre program" la client.
4. Context client (2026-08-04): clientul discutat ține datele în 1С УНФ și azi
   le **exportă manual în Excel → Power BI**. Deci OData probabil NU e publicat
   la el — checklist-ul din `INTEGRARE-1C-ODATA.md` se aplică integral. Aceleași
   date se extrag prin OData și pentru sistemul nostru (aceeași sursă → cifrele
   coincid cu Power BI); același OData le poate alimenta și Power BI-ul direct,
   fără Excel. Argument de vânzare: la ei raportul e vechi de la ultimul export,
   la noi cifrele sunt de acum, în Telegram.

## Site publicat

- Netlify publică folderul **`lider/`** ca rădăcină (vezi `netlify.toml`).
  `lider/index.html` = pagina de candidatură a lui Oleg pentru holdingul Lider (bilingvă RU/RO).
