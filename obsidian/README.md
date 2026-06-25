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

> **Notă pentru meniul în română:** Obsidian își traduce meniurile de bază, dar
> pluginul **Obsidian Git** rămâne în engleză (pluginurile comunitare nu sunt
> traduse). Mai jos pun ambele variante — meniul aplicației în română, opțiunile
> pluginului în engleză (cum apar la tine).

1. Instalează **Obsidian** pe fiecare dispozitiv (desktop / Android / iOS).
2. Instalează pluginul comunitar **Obsidian Git**:
   **Setări** (⚙️ stânga-jos) → **Pluginuri comunitare** → dezactivează „Mod
   restricționat" dacă e cazul → **Răsfoiește** → caută „Obsidian Git" →
   **Instalează** → **Activează**.
   (în engleză: Settings → Community plugins → Browse → Install → Enable)
3. Clonează acest repo și deschide folderul `obsidian/` ca vault, SAU folosește
   din Obsidian comanda (Ctrl/Cmd+P) **„Git: Clone an existing remote repo"** cu
   URL-ul repo-ului. *(Comenzile pluginului apar în engleză.)*
4. Deschide **Setări → Obsidian Git** și activează:
   - **Pull on startup** (trage notițele la pornire)
   - **Pull updates on interval** / **Auto pull interval (minutes)** = `10`

   Astfel, în fiecare zi după ce robotul scrie notițele, dispozitivele tale le
   trag automat. *(Aceste opțiuni rămân în engleză în plugin.)*

> Notițele sunt doar pentru **citire** — sunt rescrise de robot în fiecare zi.
> Dacă vrei note proprii, ține-le într-un folder separat (ex. `Personal/`),
> pe care robotul nu îl atinge.

## Cum funcționează (pe scurt)

- Workflow: `.github/workflows/obsidian-sync.yml` (rulează zilnic la 08:00, ora Chișinău).
- Generator: `scripts/obsidian-sync.sh` (activitate git + proiecte + snapshots).
- Rezumat AI: `scripts/obsidian-ai-summary.sh` (necesită secretul `ANTHROPIC_API_KEY`).

Vezi `scripts/README.md` pentru detalii de configurare.
