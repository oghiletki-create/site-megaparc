# Asistentul de vânzări AI — GO CRM pentru A-casa

Front-office-ul: un asistent AI care vorbește cu cumpărătorul 24/7, îi găsește apartamentul potrivit, îi calculează ratele și programează vizionarea — înainte ca un agent să ridice telefonul.

> Există deja un **prototip funcțional** — vezi `demo/index.html`.

---

## 1. De ce contează pentru un dezvoltator

Un lead imobiliar costă bani și se răcește în minute. Seara, în weekend și în vârf de campanie, agenții nu pot răspunde tuturor. Asistentul AI:

- răspunde **instant, 24/7**, în **RO și RU**;
- **califică** lead-ul (buget, camere, termen, mod de plată) înainte să ajungă la agent;
- programează **vizionarea** direct în agendă;
- lasă agentului doar discuțiile care merită timpul lui.

Rezultat: din același buget de reclamă ies mai multe vizionări și contracte.

---

## 2. Ce știe să facă (meniu principal)

- **🔎 Caută apartament** — după camere, buget, etaj, orientare, complex. Arată exact ce e **disponibil în grilă**, cu preț la zi și preț pe m².
- **🧮 Calcul rate / ipotecă** — avans + rate lunare până la predare (plata în rate la dezvoltator) sau estimare de rată bancară.
- **📅 Programare vizionare** — alege ziua/ora, se rezervă în agenda agentului.
- **🏗️ Stadiul construcției** — „când e gata blocul meu?" cu procentul de avansare.
- **📄 Rezervările / contractul meu** — ce am rezervat, ce am semnat.
- **💰 Plățile mele** — graficul de rate cu statusul fiecărei rate (achitată / de plată).
- **📍 Contact & birou vânzări.**

---

## 3. Cum răspunde — inteligent, nu robotic

Exemplu de conversație:

> **Client:** „Vreau 2 camere până în 55 000 €, etaj mediu."
> **Asistent:** filtrează grila → arată 2–3 apartamente disponibile care se încadrează, cu preț, suprafață, etaj, orientare și preț pe m². Oferă calcul de rate și propune vizionare.

> **Client:** „Ce avans trebuie și cât plătesc lunar?"
> **Asistent:** calculează graficul (avans + rate lunare până la predare) pe apartamentul ales.

> **Client:** „Când e gata blocul?"
> **Asistent:** arată stadiul construcției blocului și termenul estimat de predare.

Dacă întrebarea depășește ce poate confirma cu certitudine (condiții juridice speciale, negocieri de preț), **conectează clientul cu un agent** — nu inventează.

---

## 4. De ce e de încredere

- **Ancorat în grila reală A-casa (RAG).** Disponibilitatea, prețul și condițiile vin din date, nu „din burtă". Un apartament vândut nu mai e oferit.
- **Prețul e blocat** pe nivelul din grilă; asistentul nu negociază și nu acordă discounturi — acelea rămân la directorul de vânzări.
- **Lead-ul intră automat în CRM**, cu tot ce a discutat — agentul preia o conversație, nu o pagină albă.

---

## 5. Canale

Web (widget pe site) + **WhatsApp / Viber / Telegram / Messenger** — clientul scrie unde îi e comod, răspunsul e același.

---

*Prototipul folosește un eșantion de grilă și logică simulată. În producție rulează pe LLM (Claude) + RAG peste grila și condițiile reale A-casa. Concept, design și implementare = proprietatea GO CRM (Ghiletchi Consulting).*
