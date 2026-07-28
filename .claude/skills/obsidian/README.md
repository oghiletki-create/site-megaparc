# Skill „obsidian" — cum îl folosești

Acest skill ajută Claude Code să lucreze corect cu un **vault Obsidian**
(un dosar de fișiere Markdown `.md`): note, linkuri `[[wiki]]`, tag-uri,
frontmatter YAML, daily notes, MOC-uri — cu reguli de siguranță (nu șterge
nimic fără confirmare, păstrează linkurile la redenumire etc.).

Instrucțiunile complete sunt în `SKILL.md`.

## Important: unde rulează Claude contează

Un skill acționează doar asupra fișierelor pe care Claude le **vede** în sesiune.

- **Sesiune în cloud / web** (ca cea în care a fost creat skill-ul): Claude vede
  doar acest repo git. Nu are acces la discul tău local (`C:\...`), deci nu poate
  atinge un vault Obsidian de pe calculatorul tău.
- **Claude Code local pe Windows**: Claude vede fișierele de pe calculatorul tău,
  deci poate lucra direct pe vault-ul tău.

➡️ Ca să folosești skill-ul pe vault-ul tău real, rulează Claude Code **local**.

## Instalare pe Windows (ca skill-ul să meargă pe vault-ul tău)

1. **Instalează Claude Code** (app desktop sau CLI) de pe
   <https://claude.com/claude-code> și autentifică-te.

2. **Copiază skill-ul la nivel de utilizator**, ca să fie disponibil în orice
   sesiune (inclusiv când deschizi vault-ul):

   Copiază dosarul `obsidian/` (acest dosar) în:

   ```
   C:\Users\<numele-tău>\.claude\skills\obsidian\
   ```

   Structura finală trebuie să fie:

   ```
   C:\Users\<numele-tău>\.claude\skills\obsidian\SKILL.md
   C:\Users\<numele-tău>\.claude\skills\obsidian\README.md
   ```

3. **Pornește Claude Code din dosarul vault-ului tău.** În PowerShell:

   ```powershell
   cd "C:\Cale\Catre\Vault-ul-Tau"
   claude
   ```

   (sau deschide acel dosar în app-ul desktop).

4. **Verifică** — în sesiune scrie `/skills` (sau întreabă „ce skill-uri ai?").
   Ar trebui să apară `obsidian`.

## Cum îl folosești

Nu-l chemi manual — se activează singur când vorbești despre vault. Exemple:

- „Creează o notă Obsidian despre prospectul X, cu tag `client/x`."
- „Adaugă un daily note pentru azi cu task-urile astea."
- „Fă un MOC care leagă toate notele despre Megaparc."

Claude va găsi întâi vault-ul (caută dosarul `.obsidian/`), va imita stilul
notelor existente și va cere confirmare înainte de ștergeri sau suprascrieri.
