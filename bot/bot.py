#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Bot Telegram simplu, care răspunde la întrebări (FAQ).

Cum funcționează, pe scurt:
- Citește întrebările și răspunsurile din fișierul `config.json`.
- Când un client scrie botului, caută în text cuvintele-cheie și
  trimite răspunsul potrivit.
- Pentru fiecare client nou schimbi DOAR `config.json` — codul rămâne la fel.

Nu are nevoie de programe instalate suplimentar: rulează doar cu Python 3.
Token-ul botului se ia din variabila de mediu BOT_TOKEN (vezi README.md).
"""

import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
import urllib.error

# --- Configurare ---------------------------------------------------------
AICI = os.path.dirname(os.path.abspath(__file__))
CONFIG_PATH = os.path.join(AICI, "config.json")

TOKEN = os.environ.get("BOT_TOKEN", "").strip()
if not TOKEN:
    print("EROARE: nu am găsit token-ul botului.")
    print("Setează-l mai întâi cu:  export BOT_TOKEN=\"token-ul-tau\"")
    print("(Vezi bot/README.md pentru pași simpli.)")
    sys.exit(1)

API = "https://api.telegram.org/bot{}/".format(TOKEN)


def incarca_config():
    """Citește config.json (întrebări, răspunsuri, mesaje)."""
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


# --- Comunicarea cu Telegram --------------------------------------------
def api(metoda, parametri):
    """Trimite o cerere către Telegram și întoarce răspunsul (dict)."""
    url = API + metoda
    date = urllib.parse.urlencode(parametri).encode("utf-8")
    try:
        with urllib.request.urlopen(url, data=date, timeout=60) as r:
            return json.loads(r.read().decode("utf-8"))
    except urllib.error.URLError as e:
        print("Avertisment rețea:", e)
        return {"ok": False}


def tastatura(cfg):
    """Construiește butoanele (inline keyboard) din întrebările din config."""
    randuri = [[{"text": q["buton"], "callback_data": q["id"]}]
               for q in cfg["intrebari"]]
    return json.dumps({"inline_keyboard": randuri})


def trimite(chat_id, text, cfg, cu_butoane=True):
    p = {"chat_id": chat_id, "text": text, "parse_mode": "Markdown"}
    if cu_butoane:
        p["reply_markup"] = tastatura(cfg)
    api("sendMessage", p)


def gaseste_raspuns(text, cfg):
    """Caută în textul clientului cuvintele-cheie și întoarce răspunsul.

    - Potrivirea se face pe ÎNCEPUTUL cuvântului, ca să prindă și
      terminațiile din română („program" prinde și „programul").
    - Dacă se potrivesc mai multe, câștigă cuvântul-cheie cel mai lung
      (cel mai specific), ca „programare" să nu fie confundat cu „program".
    """
    t = text.lower()
    cel_mai_bun = None
    lungime_max = 0
    for q in cfg["intrebari"]:
        for cuvant in q["cuvinte"]:
            cuvant = cuvant.lower()
            tipar = r"\b" + re.escape(cuvant)
            if re.search(tipar, t) and len(cuvant) > lungime_max:
                lungime_max = len(cuvant)
                cel_mai_bun = q["raspuns"]
    return cel_mai_bun


# --- Tratarea mesajelor --------------------------------------------------
def trateaza_mesaj(msg, cfg):
    chat_id = msg["chat"]["id"]
    text = msg.get("text", "")

    if text.startswith("/start"):
        bun_venit = "*{}*\n\n{}".format(cfg["nume_bot"], cfg["mesaj_bun_venit"])
        trimite(chat_id, bun_venit, cfg)
        return

    if text.startswith("/ajutor"):
        lista = "\n".join("• " + q["buton"] for q in cfg["intrebari"])
        trimite(chat_id, "Vă pot răspunde la:\n" + lista, cfg)
        return

    raspuns = gaseste_raspuns(text, cfg)
    trimite(chat_id, raspuns if raspuns else cfg["mesaj_necunoscut"], cfg)


def trateaza_buton(cbq, cfg):
    """Când clientul apasă un buton."""
    chat_id = cbq["message"]["chat"]["id"]
    ales = cbq["data"]
    api("answerCallbackQuery", {"callback_query_id": cbq["id"]})
    for q in cfg["intrebari"]:
        if q["id"] == ales:
            trimite(chat_id, q["raspuns"], cfg)
            return


# --- Bucla principală (ascultă mesajele) --------------------------------
def main():
    cfg = incarca_config()
    print("Botul '{}' a pornit. Apasă Ctrl+C ca să-l oprești.".format(cfg["nume_bot"]))
    offset = 0
    while True:
        rezultat = api("getUpdates", {"offset": offset, "timeout": 30})
        if not rezultat.get("ok"):
            time.sleep(3)
            continue
        for update in rezultat.get("result", []):
            offset = update["update_id"] + 1
            if "message" in update:
                trateaza_mesaj(update["message"], cfg)
            elif "callback_query" in update:
                trateaza_buton(update["callback_query"], cfg)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nBot oprit. La revedere! 👋")
