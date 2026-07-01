# Construcție & Finanțe — GO CRM pentru A-casa

Partea în care un dezvoltator câștigă sau pierde bani după ce a vândut: **încasarea graficului de rate** și **ținerea construcției în buget și în termen**.

---

## 1. Graficul de achitare — de la contract la bani în cont

La semnarea contractului, sistemul generează automat **graficul de rate** (avans + rate până la predare). Apoi:

- **Confirmare automată a plății.** AI-ul potrivește încasarea (din extras bancar / casă) cu rata corectă din grafic, marchează „achitat" și actualizează soldul clientului — fără ca cineva să bifeze manual.
- **Restanța, prinsă din prima zi.** O rată neplătită la scadență apare imediat pe radar, cu client, sumă și zile de întârziere — și poate declanșa un memento automat către client.
- **Soldul la zi**, mereu vizibil în fișa clientului: ce a plătit, ce mai are de plătit, când.

> **Beneficiu:** cash-flow previzibil, zero rate „uitate", vânzările nu mai sună contabilitatea „au intrat banii de la clientul X?".

---

## 2. Reconcilierea încasărilor

- Extrasul bancar se citește automat; fiecare încasare se leagă de contractul și rata corectă.
- Plățile în numerar (casă) intră în același flux.
- Ce nu se potrivește automat rămâne într-o listă scurtă „de verificat" pentru contabil — nu invers.

Țintă: **80–90% din încasări reconciliate automat**, restul verificate rapid manual.

---

## 3. Construcție / șantier — stadiu, buget, termen

Fiecare bloc are un tablou clar:

- **Stadiu pe etape:** fundație → structură → închideri → finisaje → predare, cu procent de avansare.
- **Buget planificat vs. cheltuit**, pe bloc și pe etapă — abaterile se văd din timp.
- **Termene și alerte de întârziere** — conducerea intervine înainte ca întârzierea să devină problemă cu clienții.
- **Legătura cu vânzările:** ritmul de construcție și ritmul de încasare se văd împreună — construiești din banii care intră, previzibil.

---

## 4. Vizibil și pentru client

Stadiul construcției apare și în asistentul de vânzări: la „când e gata blocul meu?", clientul primește procentul de avansare și termenul estimat — **fără să sune la birou**. Mai puține telefoane, mai multă încredere.

---

## 5. Tabloul executiv (pentru conducere)

Într-un singur ecran, la zi:

- încasări luna aceasta vs. grafic, cash-flow;
- restanțe (cine, cât, de când);
- absorbția pe proiect (% vândut din fiecare complex/bloc);
- stadiul și bugetul construcției pe blocuri;
- profitabilitate pe proiect.

Plus **raport executiv automat** în limbaj natural — fără să aștepți închiderea lunii.

---

## 6. Principiu

AI-ul **pregătește și propune** (potrivește plăți, semnalează restanțe, calculează grafice); **omul decide** (aprobă excepții, negociază, semnează). Construim peste sistemul contabil existent (ex. 1C), nu îl înlocuim.

---

*Date și fluxuri demo — se calibrează pe procesele reale A-casa în faza de descoperire. Concept, design și implementare = proprietatea GO CRM (Ghiletchi Consulting).*
