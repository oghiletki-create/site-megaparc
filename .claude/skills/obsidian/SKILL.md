---
name: obsidian
description: >-
  Work with an Obsidian vault — create and organize Markdown notes, wiki-links
  ([[note]]), tags, YAML frontmatter, daily notes, and Maps of Content (MOCs).
  Use when the user mentions Obsidian, a vault, `.md` notes, wiki-links,
  daily/periodic notes, backlinks, or asks to capture/organize/link notes in an
  Obsidian-compatible way.
---

# Obsidian

Help the user capture, structure, and link knowledge inside an **Obsidian
vault** — a plain folder of Markdown (`.md`) files. Everything Obsidian does is
just Markdown plus a few conventions, so the output stays portable and
git-friendly.

## Locate the vault first

Before writing notes, find the vault root. It is the folder that contains a
`.obsidian/` directory.

```bash
# Search downward from the current directory
find . -maxdepth 4 -type d -name ".obsidian" 2>/dev/null
```

- If exactly one is found, use its parent as the vault root.
- If none is found, ask the user for the vault path (or offer to treat the
  current directory as the vault).
- If several are found, ask which one.

Never assume a path. Confirm the vault before creating or moving files.

## Note anatomy

A well-formed note is: **YAML frontmatter → H1 title → body → links/tags**.

```markdown
---
title: Kickoff meeting — Acme Corp
created: 2026-07-01
tags: [meeting, client/acme]
aliases: [Acme kickoff]
---

# Kickoff meeting — Acme Corp

Notes about the meeting...

## Action items
- [ ] Send proposal to [[Acme Corp]]

See also: [[Meetings MOC]]
```

Conventions to follow:

- **Frontmatter** is optional YAML between `---` fences at the very top. Common
  keys: `title`, `created`, `updated`, `tags`, `aliases`, `cssclasses`. Use
  ISO dates (`YYYY-MM-DD`). Keep keys the vault already uses — inspect a couple
  of existing notes before inventing new ones.
- **Filenames** map to note identity. Prefer human-readable titles
  (`Acme Corp.md`) since Obsidian resolves `[[Acme Corp]]` by filename or alias.
  Avoid characters Obsidian forbids in links: `# ^ [ ] |`.
- **One idea per note.** Split large notes and link them rather than nesting
  deeply.

## Links

- **Wiki-link:** `[[Note name]]` — links by filename or alias.
- **Aliased link:** `[[Note name|shown text]]`.
- **Heading link:** `[[Note name#Heading]]`.
- **Block link:** `[[Note name#^blockid]]` (append `^blockid` to the target
  line).
- **Embed:** `![[Note name]]` or `![[image.png]]` to transclude content/media.

Prefer wiki-links over raw Markdown links inside the vault so backlinks work.
When you create a link to a note that doesn't exist yet, either create the
target note too or tell the user it will show as an unresolved ("orphan") link.

## Tags

- Inline: `#topic`, nested `#client/acme`, or in frontmatter `tags: [topic]`
  (no `#` in frontmatter).
- Reuse existing tags — grep the vault before introducing a new scheme:

```bash
grep -rho '#[A-Za-z0-9_/-]\+' --include='*.md' . | sort -u   # inline tags
```

Keep a shallow, consistent hierarchy (`area/subarea`). Don't tag and folder the
same axis twice unless the user wants both.

## Daily & periodic notes

Daily notes are dated files, usually `YYYY-MM-DD.md`, often in a `Daily/` or
`Journal/` folder. Match the vault's existing pattern and folder before
creating one. A simple template:

```markdown
---
created: 2026-07-01
tags: [daily]
---

# 2026-07-01

## Log

## Tasks
- [ ]

## Notes
```

## Maps of Content (MOC)

A MOC is a hub note that links related notes — Obsidian's answer to folders.
When a topic accumulates several notes, offer to create or update a
`<Topic> MOC.md` that links them, instead of deep folder nesting.

## Working rules

- **Inspect before writing.** Read 1–3 existing notes to match the vault's
  frontmatter keys, tag style, folder layout, and link conventions.
- **Plain Markdown only.** Don't introduce plugin-specific syntax (Dataview,
  Templater, etc.) unless you confirm the plugin is installed (check
  `.obsidian/plugins/` or `.obsidian/community-plugins.json`).
- **Preserve links on rename/move.** Renaming a note breaks `[[wiki-links]]`
  that point to it. Before renaming, grep for references and update them, or
  add the old name as an `alias` in frontmatter.

  ```bash
  grep -rl '\[\[Old name' --include='*.md' .
  ```

- **Never delete or overwrite notes without confirmation.** Vaults are the
  user's long-term memory. Prefer creating/appending; ask before destructive
  edits.
- Keep everything git-friendly: one note per file, stable filenames, ISO dates.
