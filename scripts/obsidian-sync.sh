#!/usr/bin/env bash
#
# obsidian-sync.sh — generează notițele Obsidian din starea repo-ului.
# Părți deterministe (fără AI): activitate git, stare proiecte, snapshots.
# Rezumatul AI este completat separat de scripts/obsidian-ai-summary.sh,
# care înlocuiește marcajul <!--AI_SUMMARY--> din notița zilnică.
#
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
VAULT="$REPO_ROOT/obsidian"
DATE="$(date +%Y-%m-%d)"
NOW="$(date +'%Y-%m-%d %H:%M %Z')"

mkdir -p "$VAULT/Zilnic" "$VAULT/Proiecte" "$VAULT/Snapshots"

# Directoare care NU sunt proiecte (active, sistem, vault).
is_asset_dir() {
  case "$1" in
    obsidian|scripts|css|js|img|.git|.github|node_modules) return 0 ;;
    *) return 1 ;;
  esac
}

# ----------------------------------------------------------------------------
# 1) Notița zilnică
# ----------------------------------------------------------------------------
DAILY="$VAULT/Zilnic/$DATE.md"

COMMITS="$(git log --since='24 hours ago' --all \
  --pretty='- `%h` %s — _%an, %ad_' --date=format:'%H:%M' 2>/dev/null || true)"
[ -z "$COMMITS" ] && COMMITS="_Niciun commit în ultimele 24h._"

FILES="$(git log --since='24 hours ago' --all --name-only --pretty=format: 2>/dev/null \
  | sort -u | sed '/^$/d;s/^/- /' || true)"
[ -z "$FILES" ] && FILES="_Niciun fișier modificat în ultimele 24h._"

BRANCHES="$(git for-each-ref --sort=-committerdate \
  --format='- `%(refname:short)` — _%(committerdate:short)_' \
  refs/heads refs/remotes/origin 2>/dev/null | grep -v 'origin/HEAD' || true)"
[ -z "$BRANCHES" ] && BRANCHES="_(fără ramuri)_"

# Legături către proiecte
PROJ_LINKS=""
for dir in "$REPO_ROOT"/*/; do
  name="$(basename "$dir")"
  is_asset_dir "$name" && continue
  PROJ_LINKS="$PROJ_LINKS [[${name}]]"
done
[ -z "$PROJ_LINKS" ] && PROJ_LINKS="_(niciun proiect detectat)_"

cat > "$DAILY" <<EOF
---
date: $DATE
tags: [zilnic, megaparc]
---
# 📅 $DATE

> Generat automat: $NOW

## 🧠 Rezumat AI

<!--AI_SUMMARY-->

## 📊 Activitate Git (ultimele 24h)

$COMMITS

## 📁 Fișiere modificate (ultimele 24h)

$FILES

## 🌿 Ramuri

$BRANCHES

## 🔗 Legături

- [[Dashboard]]
- Proiecte:$PROJ_LINKS
EOF

# ----------------------------------------------------------------------------
# 2) Pagini de proiect + snapshots
# ----------------------------------------------------------------------------
PROJECT_ROWS=""
for dir in "$REPO_ROOT"/*/; do
  name="$(basename "$dir")"
  is_asset_dir "$name" && continue

  last_commit="$(git log -1 --pretty='%ad — %s' --date=short -- "$name" 2>/dev/null || true)"
  [ -z "$last_commit" ] && last_commit="_(necunoscut)_"

  # Fișiere urmărite de git din acest proiect
  tracked="$(git ls-files "$name" 2>/dev/null || true)"
  md_files="$(printf '%s\n' "$tracked" | grep -i '\.md$' || true)"
  all_count="$(printf '%s\n' "$tracked" | sed '/^$/d' | wc -l | tr -d ' ')"

  # Lista fișierelor (max utile)
  file_list="$(printf '%s\n' "$tracked" | sed '/^$/d;s/^/- `/;s/$/`/' || true)"
  [ -z "$file_list" ] && file_list="_(fără fișiere urmărite)_"

  # Snapshots: copiază fiecare .md în Snapshots/<proiect>__<fisier>.md
  snap_links=""
  if [ -n "$md_files" ]; then
    while IFS= read -r mdf; do
      [ -z "$mdf" ] && continue
      base="$(basename "$mdf")"
      snap_name="${name}__${base}"
      {
        echo "> 📎 Snapshot din \`$mdf\` — $NOW"
        echo ""
        cat "$REPO_ROOT/$mdf"
      } > "$VAULT/Snapshots/$snap_name"
      snap_links="$snap_links\n- [[${snap_name%.md}]]"
    done <<< "$md_files"
  fi
  [ -z "$snap_links" ] && snap_links="\n_(fără documente .md)_"

  cat > "$VAULT/Proiecte/${name}.md" <<EOF
---
tags: [proiect, megaparc]
proiect: $name
---
# 📦 ${name^}

> Actualizat automat: $NOW

- **Ultima modificare:** $last_commit
- **Fișiere urmărite:** $all_count

## Fișiere

$file_list

## Documente (snapshots offline)
$(printf '%b' "$snap_links")

## 🔗 Legături

- [[Dashboard]]
- [[$DATE]] (notița de azi)
EOF

  PROJECT_ROWS="$PROJECT_ROWS| [[${name}]] | $last_commit | $all_count |\n"
done

# ----------------------------------------------------------------------------
# 3) Dashboard
# ----------------------------------------------------------------------------
LAST_DAILIES="$(ls -1 "$VAULT/Zilnic" 2>/dev/null | sed 's/\.md$//' | sort -r | head -7 \
  | sed 's/^/- [[/;s/$/]]/' || true)"
[ -z "$LAST_DAILIES" ] && LAST_DAILIES="_(încă nicio notiță)_"

cat > "$VAULT/Dashboard.md" <<EOF
---
tags: [dashboard, megaparc]
---
# 🏠 Dashboard — Megaparc

> Actualizat automat: $NOW

## 📅 Ultimele notițe zilnice

$LAST_DAILIES

## 📦 Proiecte

| Proiect | Ultima modificare | Fișiere |
| --- | --- | --- |
$(printf '%b' "$PROJECT_ROWS")

## ℹ️ Despre

Vault generat automat din repo-ul **site-megaparc**.
Vezi [[README]] pentru cum îl sincronizezi pe toate dispozitivele.
EOF

echo "✅ Notițe Obsidian generate pentru $DATE."
