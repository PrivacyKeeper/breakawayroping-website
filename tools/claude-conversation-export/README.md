# Claude conversation archive → Word documents

Turns a Claude data export into **one `.docx` per conversation**, plus an index
document and a CSV manifest.

Built for exactly one situation: you want your whole Claude history in a
portable, readable format that outlives any particular platform or account.

- **No dependencies.** Stock Python 3.8+. No `pip install`, nothing to set up.
- **No network.** Runs entirely on your machine; nothing is uploaded anywhere.
- **Handles both archives.** Your claude.ai chats *and* your local Claude Code
  sessions.

---

## Step 1 — get your data out of Claude

Nobody can pull your conversation history for you, including Claude itself. You
have to request it from your account:

1. Open **claude.ai** in a browser and sign in.
2. Click your name/initials in the bottom-left corner → **Settings**.
3. Go to **Privacy** → **Export data** (wording may differ slightly by plan).
4. Confirm the request.
5. Anthropic emails a download link to your account address. It usually arrives
   within a few minutes, but can take up to 24 hours. **The link expires**, so
   download it reasonably promptly.

You'll get a `.zip` containing `conversations.json` (everything you said and
everything Claude said), `projects.json`, and `users.json`.

> Do this *before* you leave the platform. An export can only be requested from
> an account you can still log into.

## Step 2 — turn it into Word documents

Put the downloaded `.zip` next to this script and run:

```bash
python3 claude_export_to_docx.py data-2026-09-05.zip
```

That's it. You'll get a `ClaudeConversations/` folder with one Word file per
conversation. Point it somewhere specific with `-o`:

```bash
python3 claude_export_to_docx.py data-2026-09-05.zip -o ~/Documents/ClaudeArchive
```

You can also hand it the `conversations.json` directly if you've already
unzipped:

```bash
python3 claude_export_to_docx.py conversations.json
```

On Windows, use `python` instead of `python3`.

## Step 3 (optional) — your Claude Code sessions

Terminal and IDE sessions are stored locally and are **not** part of the
claude.ai export. To archive those too, point the script at the folder:

```bash
# macOS / Linux
python3 claude_export_to_docx.py ~/.claude/projects -o ~/Documents/ClaudeCodeArchive

# Windows
python claude_export_to_docx.py %USERPROFILE%\.claude\projects -o ClaudeCodeArchive
```

Each session becomes a document titled after your opening prompt. Tool calls and
internal reasoning are left out by default, so it reads as a conversation; add
`--include-tool-calls` if you want the full working record.

---

## What each document looks like

- Conversation title as the document title, with date, message count, project,
  and a link back to the original chat.
- Each turn labelled **You** / **Claude** with a timestamp.
- Claude's markdown rendered as real Word formatting: headings, bold, italics,
  bullet and numbered lists, blockquotes, clickable links, shaded code blocks in
  a monospace font, and markdown tables as actual Word tables.
- Uploaded file names noted per message (`--include-attachment-text` also embeds
  their extracted text).

Two extra files land in the output folder:

- `000 Index of conversations.docx` — every conversation grouped by month.
- `000 Index of conversations.csv` — the same as a spreadsheet, for sorting and
  searching in Excel.

## Options

| Flag | What it does |
|------|--------------|
| `-o`, `--out FOLDER` | Where to write (default `./ClaudeConversations`) |
| `--datestamp` | Prefix filenames with the date so they sort chronologically |
| `--folders-by-month` | Group output into `YYYY-MM/` subfolders |
| `--since YYYY-MM-DD` | Only conversations created on or after this date |
| `--until YYYY-MM-DD` | Only conversations created before this date |
| `--search TEXT` | Only conversations whose title or body contains TEXT |
| `--limit N` | Stop after N conversations — good for a quick trial run |
| `--skip-empty` | Skip conversations with no messages |
| `--include-tool-calls` | Include tool / code-execution blocks |
| `--include-attachment-text` | Embed the extracted text of uploaded files |
| `--include-sidechains` | Claude Code only: include subagent side conversations |
| `--no-message-times` | Omit per-message timestamps |
| `--no-index` | Skip the index document and CSV |
| `--overwrite` | Rewrite documents that already exist |

Try a small batch first if you have a large history:

```bash
python3 claude_export_to_docx.py export.zip --limit 5 -o test-run
```

## Good to know

- **Re-running is safe.** Existing documents are skipped, so an interrupted run
  picks up where it left off. Use `--overwrite` to force a rebuild.
- **Speed.** Roughly 2,000 conversations in about 5 seconds.
- **Filenames** are `Conversation title [abc12345].docx`, where the bracketed
  part is the start of the conversation ID — it keeps same-titled chats apart
  and lets you trace any document back to its original.
- **Undated conversations** are always kept, even when `--since` / `--until` are
  set, so nothing silently disappears from your archive.
- **A bad conversation can't sink the run.** Anything that fails to convert is
  reported by name at the end; everything else still gets written.
- **Images** are not in the export — attachments appear by filename, and text
  documents you uploaded can be embedded with `--include-attachment-text`.

## Verifying the archive

The CSV manifest lists every conversation with its message count and ID. Compare
its row count against the conversation count printed at the end of the run, and
against what you see in Claude, to confirm nothing was missed.
