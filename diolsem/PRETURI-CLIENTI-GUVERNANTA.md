# Diolsem — Niveluri de preț pe client și guvernanța prețului

### Retail · Fermier · Angro — cu regula: prețul îl poate modifica doar directorul de vânzări

**Pentru:** S.C. „DIOLSEM" S.R.L.
**Complementar:** `AUTOMATIZARE-DEPARTAMENTE.md` (Vânzări), `CONTABILITATE-OFERTE-INCASARI.md`, `BOT-INTELIGENTA-AGRONOMICA.md`
**Versiune:** 1.0 · iunie 2026

---

## 1. Cele trei niveluri de preț

Diolsem vinde aceluiași catalog de produse la categorii diferite de clienți, cu **liste de preț distincte**:

| Nivel | Cine | Logica de preț |
|---|---|---|
| **Retail** | gospodării, clienți de magazin/online | preț de listă (cel mai mare) |
| **Fermier** | fermieri înregistrați, clienți recurenți | preț preferențial intermediar |
| **Angro** | distribuitori, revânzători, volume mari | cel mai bun preț, pe volum |

Fiecare client din sistem are atașat **nivelul lui**, iar prețul corect se aplică **automat** peste tot:
- în **bot** (clientul identificat vede prețul categoriei lui),
- în **ofertele** generate de Vânzări,
- în **proformele și facturile** din Contabilitate,
- în **magazinul online** (după autentificare/identificare).

> Un singur produs, trei prețuri — aplicate corect, fără ca cineva să le caute manual.

---

## 2. Regula de guvernanță (cerință fermă)

> **Prețul îl poate modifica doar directorul de vânzări.**

Sistemul aplică această regulă **tehnic**, nu doar pe hârtie:

- Listele de preț (Retail / Fermier / Angro) și orice **modificare de preț** sau **discount special** sunt **blocate** pentru:
  - bot,
  - reprezentanții de vânzări,
  - personalul de magazin,
  - contabilitate.
- Ei pot **doar aplica** prețul aprobat al nivelului clientului — nu îl pot schimba.
- Orice abatere (preț special, discount peste nivel, excepție pentru un client) **necesită aprobarea directorului de vânzări**, printr-un flux clar:

```
  Reprezentant cere preț special ──► CERERE intră la Directorul de vânzări
                                            │
                              aprobă / respinge (cu motiv)
                                            │
                       dacă aprobă ─► prețul special se aplică DOAR pe acea ofertă,
                                       înregistrat cu cine a aprobat și când
```

- Fiecare modificare de preț e **jurnalizată** (cine a cerut, cine a aprobat, când, pentru ce client) → transparență totală și control.

**Rolul AI-ului aici:** botul și copiloții **respectă** regula — pot calcula, propune produse și întocmi oferte, dar **nu pot modifica prețul**. Cel mult, copilotul Vânzări poate *pregăti* o cerere de preț special către director, cu o justificare (volum, istoric, concurență) — decizia rămâne a omului.

---

## 3. Cum se leagă de bot și de inteligența agronomică

Botul recomandă **varianta optimă** agronomic (vezi `BOT-INTELIGENTA-AGRONOMICA.md`) și afișează prețul **conform nivelului clientului**:
- client **Retail** neidentificat → preț de listă;
- client **Fermier/Angro** identificat (cont/telefon) → prețul categoriei lui.

Astfel, recomandarea e mereu corectă agronomic **și** corectă comercial, fără ca cineva să intervină manual și fără riscul de a „scăpa" un preț greșit.

---

## 4. Cum se leagă de oferte și contabilitate

- Generatorul de **oferte** ia automat prețul nivelului clientului → ofertă corectă din prima.
- **Proforma și factura** moștenesc același preț → fără neconcordanțe.
- Confirmarea **achitării** (vezi `CONTABILITATE-OFERTE-INCASARI.md`) se face pe oferta cu prețul aprobat.
- Dacă a fost un **preț special aprobat de director**, el apare pe ofertă **cu urma aprobării** (cine/când).

---

## 5. Magazinul online — aceeași politică de preț, fără excepții

Diolsem are și **magazin online** (diolsem.md). Online-ul **nu** are prețuri proprii: e doar încă un canal alimentat din **aceeași listă unică de preț**. Politica de preț **persistă identic** și online.

- **Vizitator neidentificat** (guest) → preț **Retail** (de listă).
- **Client autentificat** (cont Fermier/Angro) → prețul **nivelului lui**, afișat automat la logare.
- **Sincronizare în timp real:** o modificare de preț — făcută **doar de directorul de vânzări** — se reflectă **instant** și pe site, și în magazinele fizice, și în oferte/contabilitate. Niciun canal nu rămâne cu un preț vechi sau divergent.
- **Promoțiile online** trec tot prin politică: o reducere pe site = un preț special **aprobat de director**, jurnalizat — nu o setare independentă a echipei de e-commerce.
- **Nicio cale de ocolire:** platforma online nu permite publicarea unui preț în afara listei aprobate.

> Rezultat: clientul vede **același preț corect**, indiferent că intră în magazin, sună un agent, primește o ofertă sau cumpără de pe site. Un singur adevăr de preț, un singur decident.

---

## 6. Beneficii

- **Prețuri corecte automat** pe fiecare categorie — zero erori manuale.
- **Control total al directorului de vânzări** asupra prețului, fără să blocheze viteza echipei.
- **Trasabilitate**: orice excepție de preț e justificată și jurnalizată.
- **Coerență** între bot, oferte, magazin și contabilitate — același preț peste tot.

---

## 7. Ce ne trebuie ca să implementăm

1. Cele trei **liste de preț** (Retail / Fermier / Angro) și cum se stabilesc azi.
2. Cum se **clasifică** un client într-un nivel (criterii) și cine decide.
3. Regulile de **discount** permise (dacă există) și pragul de la care e nevoie de director.
4. Confirmarea fluxului de **aprobare** dorit de directorul de vânzări (cum vrea să primească și să aprobe cererile).
5. Detalii despre **platforma magazinului online** (cum se gestionează azi prețurile și logarea clienților), ca să sincronizăm aceeași politică de preț și acolo.

---

*Regula „prețul îl modifică doar directorul de vânzări" este aplicată tehnic prin permisiuni și flux de aprobare, cu jurnalizare. AI-ul respectă regula — propune, dar nu decide prețul.*
