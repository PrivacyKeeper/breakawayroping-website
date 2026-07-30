import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Introducing BreakawayRoping.Pro",
  description:
    "Breakaway went from a high school event to a WPRA-sanctioned event with its own National Finals in about a decade — and it still has no system of record. Here is what we are building.",
  alternates: {
    canonical:
      "https://www.breakawayroping.pro/blog/introducing-breakawayroping-pro",
  },
};

export default function Post() {
  return (
    <article className="prose-arena">
      <p className="text-xs tracking-wider text-muted-dim uppercase">
        30 July 2026
      </p>
      <h1 className="mt-2 mb-6 text-3xl font-extrabold text-gold">
        Introducing BreakawayRoping.Pro
      </h1>

      <p>
        Breakaway roping is the fastest-growing event in rodeo. In roughly a
        decade it went from a high school and amateur event to a PRCA-approved,
        WPRA-sanctioned event with its own National Finals. The demographic is
        overwhelmingly women and girls, with a strong junior boys&apos; pipeline
        through Little Britches where breakaway is the stepping stone to
        tie-down.
      </p>

      <p>
        And it still has no system of record. Breakaway ropers track their runs
        in a notes app. They find out results from a Facebook group. Jackpot
        producers run divisional payouts on spreadsheets. For an event that has
        grown this fast, that is a strange gap — and it is the entire reason
        this app exists.
      </p>

      <h2>What we are building</h2>

      <p>
        BreakawayRoping.Pro is the complete platform for this event: entries,
        draws, live results, and divisional payouts on one side; practice logs,
        horse records, equipment checks, and run analysis on the other; and a
        community layer built specifically for the people who actually rope.
      </p>

      <p>Fourteen feature groups ship across the roadmap:</p>

      <ul>
        <li>Social feed, stories, messaging, and groups</li>
        <li>
          Women&apos;s and junior groups, mentor pairing, and the first-check
          board
        </li>
        <li>Events, entries, draws, live results, and divisional payouts</li>
        <li>A practice run log that keeps hand times out of official results</li>
        <li>Equipment check with photo capture of your string and flag</li>
        <li>Horse profiles with breakaway role, stop rating, and arena stats</li>
        <li>A marketplace built around breakaway gear, calves, and horses</li>
        <li>Travel, weather, hauling, and biosecurity</li>
        <li>A full rules reference with citations</li>
        <li>AI run analysis: barrier margin, delivery, loop shape, slack</li>
        <li>Equine health, vet records, and Coggins tracking</li>
        <li>Live streaming from any arena</li>
        <li>Youth, high school, college, coaches, and scholarships</li>
        <li>A producer console with the fastest scoring screen in rodeo</li>
      </ul>

      <h2>Three things we are being stubborn about</h2>

      <h3>Practice never contaminates official results</h3>
      <p>
        A phone timer cannot be authoritative — the official clock runs from the
        barrier flag to the string breaking off the horn, and no app can see
        either one. So hand-timed practice runs live in their own log, clearly
        labeled, and never touch standings or leaderboards. The practice log is
        the daily-use hook. The official results are the credibility. Merging
        them would destroy the credibility, so we do not.
      </p>

      <h3>Divisional payouts are recomputed, never incremented</h3>
      <p>
        D-format splits are relative to the fast time. That means every new fast
        time reshuffles every division and the whole payout. Increment that and
        you pay the wrong people. We recompute the entire class in one
        transaction every time a time goes in.
      </p>

      <h3>Every score cites its rule and its edition</h3>
      <p>
        Rodeo rulebooks turn over every year, and the WPRA amends continuously.
        A run has to be scored under the rules in force the day it happened,
        forever. So rules are stored as dated rule sets, resolved when the run
        is written and frozen there. &ldquo;10 second barrier, PRCA 2026 Rule
        Book&rdquo; is defensible. A bare number is not.
      </p>

      <h2>Built for this community first</h2>

      <p>
        In most rodeo apps the community layer is a module. Here it is a reason
        the product exists. Regional women&apos;s roping groups seeded by state.
        Mentor pairing with consent on both sides and guardian approval for
        minors. Barn and team groups with the coach as admin. A first-check
        board, because a roper winning her first check is a moment worth
        marking. Comeback threads for post-injury, post-pregnancy, and
        post-layoff returns, which are real and underserved.
      </p>

      <p>
        And because of who ropes this event, the safety defaults are tighter
        than the industry norm and they ship at launch, not in a later phase:
        profiles default to followers-only for anyone under 18, no adult-to-minor
        DMs outside a school, barn, or mentor relationship, location never below
        city level for minors, guardian-controlled photo and video sharing, and
        block, report, and mute from day one.
      </p>

      <h2>Get in early</h2>

      <p>
        The app is in build. If you rope, produce, coach, or haul kids to
        jackpots, get on the waitlist and we will bring you in as soon as there
        is something to put in your hands.
      </p>

      <p>
        <Link href="/#waitlist">Join the waitlist &rarr;</Link>
      </p>
    </article>
  );
}
