# Bot Telegram „răspunde la întrebări" — ghid pentru începători

Acesta este primul bot. Răspunde automat la întrebările clienților
(program, prețuri, adresă, servicii). Pentru fiecare client nou schimbi
doar fișierul `config.json` — codul rămâne la fel.

---

## Ce-ți trebuie
- Un calculator cu **Python 3** instalat (verifici scriind în terminal: `python3 --version`).
- Aplicația **Telegram** pe telefon.

---

## Pasul 1 — Creează botul în Telegram (2 minute)
1. Deschide Telegram și caută contactul **@BotFather** (cel cu bifă albastră).
2. Scrie-i `/newbot` și apasă Enter.
3. Îți cere un **nume** (ex: `Salon Demo`) și apoi un **username** care
   trebuie să se termine în `bot` (ex: `salon_demo_bot`).
4. La final îți dă un **token** — un cod lung de forma:
   `123456789:AAH...`. **Copiază-l și păstrează-l** (e ca o parolă, nu-l da nimănui).

## Pasul 2 — Spune-i botului tău token-ul
În terminal, pe linia de comandă, scrie (înlocuiește cu token-ul tău):

```bash
export BOT_TOKEN="123456789:AAH-token-ul-tau-aici"
```

## Pasul 3 — Pornește botul
Tot în terminal, intră în folderul proiectului și scrie:

```bash
python3 bot/bot.py
```

Dacă vezi mesajul `Botul '...' a pornit.` — gata, **funcționează!** 🎉
Acum deschide Telegram, caută botul tău după username și scrie-i `/start`.

Ca să-l oprești, apeși `Ctrl + C` în terminal.

---

## Cum îl personalizezi pentru un client
Deschizi fișierul **`config.json`** și schimbi:
- `nume_bot` — numele afacerii clientului;
- `mesaj_bun_venit` — mesajul de salut;
- lista `intrebari` — fiecare are:
  - `buton` — textul de pe buton;
  - `cuvinte` — cuvintele după care botul recunoaște întrebarea;
  - `raspuns` — răspunsul trimis clientului.

Salvezi fișierul și repornești botul. Atât!

---

## Important de știut
- Botul merge **doar cât timp e pornit** pe un calculator/server. Pentru a
  merge non-stop (24/24), îl punem mai târziu pe un **server** ieftin din cloud.
- Token-ul este secret — nu-l pune niciodată pe internet public.

> Următorul pas posibil: programări direct prin bot, sau sistem de licență
> (fiecare client plătitor primește o cheie care activează botul lui).
