# Scripturi — sincronizare Obsidian

Aceste scripturi alimentează folderul [`../obsidian/`](../obsidian/) cu tot la ce
se lucrează în repo, ca să fie disponibil pe orice dispozitiv (vezi
`obsidian/README.md` pentru partea de Obsidian Git).

| Fișier | Rol |
| --- | --- |
| `obsidian-sync.sh` | Generează notița zilnică, paginile de proiect și snapshots din git. Fără AI, gratuit. |
| `obsidian-ai-summary.sh` | Cere lui Claude un rezumat în limbaj clar al ultimelor 24h și îl inserează în notița zilnică. |

## Rulare manuală (local)

```bash
bash scripts/obsidian-sync.sh
# opțional, dacă ai cheia setată în mediu:
export ANTHROPIC_API_KEY=sk-ant-...
bash scripts/obsidian-ai-summary.sh
```

Necesită `git`, `bash`, și pentru rezumatul AI: `curl`, `jq`, `python3`.

## Rulare automată (zilnic, în cloud)

Workflow-ul [`.github/workflows/obsidian-sync.yml`](../.github/workflows/obsidian-sync.yml)
rulează în fiecare zi la ~08:00 (ora Chișinău) și face commit automat.

### Activare a rezumatului AI

Rezumatul scris de AI este **opțional**. Restul funcționează fără el. Ca să-l activezi:

1. Obține o cheie API de la <https://console.anthropic.com>.
2. În repo: **Settings → Secrets and variables → Actions → New repository secret**
   - Name: `ANTHROPIC_API_KEY`
   - Value: cheia ta
3. (Opțional) pentru cost mai mic, adaugă o **variabilă** (nu secret):
   - **Settings → Secrets and variables → Actions → Variables → New variable**
   - Name: `ANTHROPIC_MODEL`, Value: `claude-haiku-4-5`

Fără secret, notița zilnică se generează normal, doar secțiunea „Rezumat AI"
afișează un mesaj că este dezactivată.

> **Important:** pentru ca rularea programată (cron) să funcționeze, workflow-ul
> trebuie să existe pe ramura implicită (`main`). Cât timp e doar pe ramura de
> dezvoltare, îl poți porni manual din tab-ul **Actions → Obsidian Sync → Run workflow**.
