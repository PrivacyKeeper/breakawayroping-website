@AGENTS.md

# BreakawayRoping.pro — website

The marketing site and waitlist for BreakawayRoping.pro. Next 16 App Router,
React 19, Tailwind v4, TypeScript, Resend. **No database and no auth** — that
is deliberate, built to the BullRider.pro pattern. The app itself lives in
`breakawayroping-mobile-app`.

21 routes. Build green, lint clean on `main`. Keep both true.

## Commands

```bash
npm run dev     # local dev server
npm run build   # must pass before pushing
npm run lint    # must pass before pushing
```

There is no test suite; `build` and `lint` are the gate.

## Layout

```
src/app/
  layout.tsx          root metadata, Inter font, SchemaMarkup
  page.tsx            landing page — 14 feature groups, 121 features
  globals.css         brand tokens (:root) + Tailwind @theme inline
  api/waitlist/       the only server logic on the site
  blog/
    posts.ts          the registry — a post not listed here is unreachable
    <slug>/page.tsx
  components/         CrossQuote, Footer, SchemaMarkup
  data/quotes.json
  rules/ events/ support/ terms/ privacy/ refund/
  sitemap.ts robots.ts
```

## Rules that are easy to get wrong

- **`www` is primary.** Every canonical URL, sitemap entry, and OG tag uses
  `https://www.breakawayroping.pro`; the apex redirects. Use `metadataBase`
  rather than repeating the origin.
- **A new page needs a `sitemap.ts` entry**, and a new blog post needs a
  `posts.ts` entry. Otherwise it did not really ship.
- **Style from the brand tokens**, never raw hex or stock Tailwind palette
  classes. The palette comes from the crest — electric blue `#2eb3ec`, rope
  gold `#d4af37`, cream `#f2e8d5` on near-black navy `#070c15`. The build map
  said "hot coral and gold on charcoal plum"; the logo won, and that is settled.
- **The waitlist route reports real outcomes.** A failed Resend send answers
  `502` rather than pretending the signup worked. Do not simplify it into an
  always-200 handler. Its permissive email pattern, its in-memory per-IP
  throttle, and its deliberately-named honeypot field (named so browser
  autofill will not trip it) are all considered decisions, not oversights.
- **JSON-LD goes through `SchemaMarkup.tsx`.** Extend the existing graph for
  the app, the site, and the rules FAQ; do not add a second competing one.

## Known gaps — not bugs to work around

- `public/logo.png` and `public/cross.jpg` are referenced but absent, so they
  render as broken image boxes. Waiting on the owner. Do not remove the
  references. Optional: `public/backgrounds/arena-1.jpg` and `arena-2.jpg`
  switch on the `.arena-page` backdrop.
- Deployment is not done: Vercel import, `RESEND_API_KEY`, DNS for
  `breakawayroping.pro`, and Resend sending-domain verification are all
  outstanding. Until Resend verifies the domain, no waitlist email can leave.
- Waitlist signups go to email only. There is no database row for them yet,
  even though a Supabase project now exists.

## Claude Code setup in this repo

The `rodeo-apps` plugin is committed at `.claude/plugins/rodeo-apps/` and
enabled through `.claude/settings.json`. It carries the skills, commands, and
review agents shared with the mobile repo — see
`.claude/plugins/rodeo-apps/README.md`.
