# 🗂️ Caiet Obsidian — Megaparc

Acest folder este un **vault Obsidian** generat și actualizat automat în fiecare zi
de un GitHub Action. Conține tot la ce se lucrează în acest repo, ca să ai informația
disponibilă pe **orice dispozitiv** unde folosești Claude / Obsidian.

## Ce se generează zilnic

| Folder | Conținut |
| --- | --- |
| `Zilnic/` | O notiță pe zi: activitate git, fișiere modificate, **rezumat scris de AI** |
| `Proiecte/` | Starea fiecărui proiect (Diolsem, Birovits…): fișiere, ultima modificare |
| `Snapshots/` | Copii ale documentelor cheie `.md` pentru citire offline |
| `Dashboard.md` | Pagina de pornire — legături către tot |

## Cum îl folosești pe toate dispozitivele (Obsidian Git)

1. Instalează **Obsidian** pe fiecare dispozitiv (desktop / Android / iOS).
2. Instalează pluginul comunitar **Obsidian Git**
   (Settings → Community plugins → Browse → „Obsidian Git").
3. Clonează acest repo și deschide folderul `obsidian/` ca vault, SAU folosește
   comanda Obsidian Git → „Clone an existing repo" cu URL-ul repo-ului.
4. În setările Obsidian Git activează **Pull on startup** și un interval de
   auto-pull (ex. 10 min). Astfel, în fiecare zi după ce Action-ul scrie notițele,
   dispozitivele tale le trag automat.

> Notițele sunt doar pentru **citire** — sunt rescrise de robot în fiecare zi.
> Dacă vrei note proprii, ține-le într-un folder separat (ex. `Personal/`),
> pe care robotul nu îl atinge.

## Cum funcționează (pe scurt)

- Workflow: `.github/workflows/obsidian-sync.yml` (rulează zilnic la 08:00, ora Chișinău).
- Generator: `scripts/obsidian-sync.sh` (activitate git + proiecte + snapshots).
- Rezumat AI: `scripts/obsidian-ai-summary.sh` (necesită secretul `ANTHROPIC_API_KEY`).

Vezi `scripts/README.md` pentru detalii de configurare.
