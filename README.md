# BreakawayRoping.pro — Website

Marketing site for the BreakawayRoping.pro mobile app. Built to the same
pattern as the other Rodeo Apps sites (BullRider.pro, BarrelConnect):
Next.js App Router, Tailwind v4, Resend for the waitlist, no database and no
auth.

## Commands

- `npm run dev` — development server (http://localhost:3000)
- `npm run build` — production build
- `npm start` — serve the production build
- `npx eslint .` — lint

## Stack

Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4,
Resend. Path alias `@/*` maps to `./src/*`.

## Required assets

Two files are referenced by the site and are **not** in the repo yet. Drop
them into `public/` before deploying:

| File | Used by | Notes |
| --- | --- | --- |
| `public/logo.png` | Header and hero on every page, OG/Twitter card | The Breakaway crest |
| `public/cross.jpg` | `CrossQuote` widget | Same asset as the other Rodeo Apps sites |

Optional: `public/backgrounds/arena-1.jpg` and `arena-2.jpg` switch on the
blurred arena backdrop behind the content (`.arena-page` in `globals.css`).
Without them the pages render on the flat near-black background, which is a
deliberate no-op rather than a broken state.

## Environment

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Waitlist confirmation + team notification email |

Copy `.env.example` to `.env.local` for local development, and set the same
variable in the hosting provider's project settings for preview and production.

Without it, `POST /api/waitlist` returns 503 and the form shows an error. The
build and every other page work fine without it.

The sending domain `breakawayroping.pro` must also be verified in Resend, otherwise
every send fails and the route answers 502 rather than reporting a signup that
never actually went out. The
build and every other page work fine without it.

## Structure

```
src/app/
  page.tsx                  Landing — 14 feature groups, pricing, waitlist
  rules/                    Full breakaway rules reference (SEO + authority)
  events/                   Event types and producer console pitch
  blog/                     7 SEO posts; index reads from blog/posts.ts
  support/                  Support topics
  terms/ privacy/ refund/   Legal
  api/waitlist/route.ts     Resend handler
  robots.ts  sitemap.ts     SEO
  components/
    SchemaMarkup.tsx        JSON-LD: SoftwareApplication, WebSite, FAQPage
    CrossQuote.tsx          Rotating verse, matches the other sites
    Footer.tsx
  data/quotes.json
```

## Brand

Palette is taken from the Breakaway crest and defined in
`src/app/globals.css`: electric blue `#2eb3ec`, rope gold `#d4af37`, cream
`#f2e8d5`, on near-black navy `#070c15`.

Note this differs from the "hot coral and gold on charcoal plum" in the
original build map — the crest is the source of truth.

## Adding a blog post

1. Create `src/app/blog/<slug>/page.tsx` with a `metadata` export and an
   `<article className="prose-arena">` body.
2. Add the entry to `src/app/blog/posts.ts` (drives the index).
3. Add the slug to `blogSlugs` in `src/app/sitemap.ts`.
