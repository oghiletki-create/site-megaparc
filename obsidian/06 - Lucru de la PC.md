---
tags: [megaparc, ghid, git]
data: 2026-06-25
---

# 06 — Cum lucrez de la PC (mâine)

## 1. Ia ultima versiune
```bash
git clone https://github.com/oghiletki-create/site-megaparc.git
cd site-megaparc
git checkout claude/megapark-website-strategy-hqsfiv
git pull origin claude/megapark-website-strategy-hqsfiv
```
Dacă ai deja repo-ul clonat, doar:
```bash
git checkout claude/megapark-website-strategy-hqsfiv
git pull
```

## 2. Deschide notele în Obsidian
- Obsidian → **Open folder as vault** → alege folderul `obsidian/` din repo.
- Începe cu [[00 - START AICI]].

## 3. Vezi site-ul local
Nu are nevoie de build. Cea mai simplă variantă:
```bash
# din folderul repo:
python3 -m http.server 8000
# apoi deschide în browser: http://localhost:8000
```
Sau pur și simplu deschide `index.html` direct în browser (dublu-click).

## 4. Editează tarifele
- Fișier: `js/main.js` → obiectul `BUILDINGS` (vezi [[04 - Calculator - tarife]]).
- Salvezi, dai refresh în browser, gata.

## 5. Salvează modificările
```bash
git add -A
git commit -m "Actualizez tarifele reale pe imobil"
git push origin claude/megapark-website-strategy-hqsfiv
```

## 6. PR
- PR draft: https://github.com/oghiletki-create/site-megaparc/pull/14
- Când totul e gata, scoți PR-ul din „draft" și îl dai spre merge în `main`.

> [!tip] Lucru cu mine
> Poți să-mi scrii direct tarifele sau ce vrei modificat și le aplic eu,
> apoi tu doar faci `git pull`. Vezi întrebările din [[05 - Pasi urmatori]].
