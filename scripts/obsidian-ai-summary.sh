#!/usr/bin/env bash
#
# obsidian-ai-summary.sh — completează marcajul <!--AI_SUMMARY--> din notița
# zilnică cu un rezumat scris de Claude despre activitatea ultimelor 24h.
#
# Necesită: ANTHROPIC_API_KEY (secret), curl, jq.
# Opțional: ANTHROPIC_MODEL (implicit claude-opus-4-8; pune claude-haiku-4-5
#           pentru cost mai mic).
#
# Dacă cheia lipsește, scrie un mesaj informativ și iese fără eroare —
# restul sincronizării rămâne funcțional.
#
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
DATE="$(date +%Y-%m-%d)"
DAILY="$REPO_ROOT/obsidian/Zilnic/$DATE.md"
MODEL="${ANTHROPIC_MODEL:-claude-opus-4-8}"

[ -f "$DAILY" ] || { echo "Notița $DAILY nu există; rulează întâi obsidian-sync.sh."; exit 0; }

replace_marker() {
  # $1 = textul care înlocuiește <!--AI_SUMMARY-->
  python3 - "$DAILY" "$1" <<'PY'
import sys
note_path, replacement = sys.argv[1], sys.argv[2]
text = open(note_path, encoding="utf-8").read()
text = text.replace("<!--AI_SUMMARY-->", replacement.strip())
open(note_path, "w", encoding="utf-8").write(text)
PY
}

if [ -z "${ANTHROPIC_API_KEY:-}" ]; then
  replace_marker "_Rezumat AI dezactivat: lipsește secretul \`ANTHROPIC_API_KEY\`. Vezi scripts/README.md._"
  echo "ℹ️  ANTHROPIC_API_KEY nu este setat; rezumat AI omis."
  exit 0
fi

# Materialul pe care îl rezumăm: log-ul git din ultimele 24h (cu diff, trunchiat).
ACTIVITY="$(git log --since='24 hours ago' --all --stat -p 2>/dev/null | head -c 60000 || true)"

if [ -z "$ACTIVITY" ]; then
  replace_marker "_Nicio activitate de raportat în ultimele 24h._"
  echo "ℹ️  Nicio activitate; apel API omis."
  exit 0
fi

PROMPT="Ești un asistent care scrie un rezumat zilnic concis, în limba română, pentru proprietarul (non-tehnic) al unui proiect web. Pe baza log-ului git de mai jos (ultimele 24h), scrie 3-6 puncte clare despre la ce s-a lucrat și ce înseamnă pentru proiect. Fără jargon. Folosește bullet points Markdown.

=== LOG GIT (ultimele 24h) ===
$ACTIVITY"

BODY="$(jq -n --arg model "$MODEL" --arg content "$PROMPT" \
  '{model: $model, max_tokens: 1024, messages: [{role: "user", content: $content}]}')"

RESP="$(curl -sS https://api.anthropic.com/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d "$BODY" || true)"

SUMMARY="$(printf '%s' "$RESP" | jq -r '.content[]? | select(.type=="text") | .text' 2>/dev/null || true)"

if [ -z "$SUMMARY" ]; then
  ERR="$(printf '%s' "$RESP" | jq -r '.error.message // empty' 2>/dev/null || true)"
  replace_marker "_Rezumatul AI nu a putut fi generat${ERR:+ ($ERR)}._"
  echo "⚠️  Apel API eșuat sau răspuns gol."
  exit 0
fi

replace_marker "$SUMMARY"
echo "✅ Rezumat AI adăugat în $DAILY (model: $MODEL)."
