import type { Metadata } from "next";
import Footer from "../components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Breakaway Roping Rules: Legal Catch, Barrier, Equipment & Penalties | BreakawayRoping.pro",
  description:
    "The complete breakaway roping rules reference. The one legal catch, every flag-out, the 10-second barrier penalty, WPRA equipment specification 12.10.9, divisional D-format, and the full penalty table. Current as of the 2026 season.",
  keywords:
    "breakaway roping rules, breakaway legal catch, bell collar catch, breakaway barrier penalty, WPRA 12.10.9, breakaway string rule, breakaway flag rule, breakaway roping penalties, breakaway disqualification, divisional breakaway, 1D 2D 3D 4D breakaway",
  alternates: { canonical: "https://www.breakawayroping.pro/rules" },
  openGraph: {
    title: "Breakaway Roping Rules — The Complete Reference",
    description:
      "The one legal catch, every flag-out, the barrier penalty, and the full WPRA equipment specification.",
    url: "https://www.breakawayroping.pro/rules",
    type: "article",
  },
};

const penalties = [
  {
    code: "BARRIER",
    result: "+10 seconds",
    rule: "Broken barrier",
    tone: "warn",
  },
  {
    code: "ILLEGAL_CATCH",
    result: "No time",
    rule: "Bell collar only",
    tone: "bad",
  },
  {
    code: "LEG_IN_LOOP",
    result: "No time",
    rule: "No extremities in the loop — only if before the flag drops",
    tone: "bad",
  },
  {
    code: "HEAD_NOT_THROUGH",
    result: "No time",
    rule: "The whole head must pass through the loop",
    tone: "bad",
  },
  { code: "NO_CATCH", result: "No time", rule: "Missed", tone: "bad" },
  {
    code: "STRING_NOT_BROKEN",
    result: "No time",
    rule: "The run ends on the string break",
    tone: "bad",
  },
  {
    code: "ROPE_NOT_RELEASED",
    result: "No time",
    rule: "The loop must be released from the hand",
    tone: "bad",
  },
  {
    code: "EQUIPMENT_STRING",
    result: "Disqualification",
    rule: "WPRA 12.10.9 — #18 string, minimum three knots",
    tone: "bad",
  },
  {
    code: "EQUIPMENT_FLAG",
    result: "Minor violation",
    rule: "WPRA 12.10.9 — 12x12 bright cloth",
    tone: "warn",
  },
  {
    code: "ROPE_THROUGH_TACK",
    result: "Disqualification",
    rule: "The rope may not pass through a bridle, tie-down, or neck rope",
    tone: "bad",
  },
  {
    code: "ROPE_BEFORE_FLAG",
    result: "Disqualification",
    rule: "No attempt to rope before the barrier flag drops",
    tone: "bad",
  },
  {
    code: "NOT_PRESENT",
    result: "Scratch",
    rule: "The name is called three times",
    tone: "warn",
  },
];

export default function RulesPage() {
  return (
    <div className="arena-page arena-bg-2 min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b border-ink-border bg-[#070c15]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="BreakawayRoping.pro"
              className="h-12 w-auto"
            />
            <span className="hidden text-base font-bold tracking-wide text-gold sm:block">
              BREAKAWAYROPING<span className="text-blue">.PRO</span>
            </span>
          </Link>
          <nav className="flex gap-6 text-sm font-semibold tracking-wider text-muted uppercase">
            <Link href="/" className="transition hover:text-gold">
              Home
            </Link>
            <Link href="/blog" className="transition hover:text-gold">
              Blog
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm font-semibold tracking-wider text-blue uppercase">
          Rules Reference
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-cream md:text-5xl">
          Breakaway Roping Rules
        </h1>
        <p className="mt-4 text-lg text-muted">
          The whole event is barrier timing plus one throw. That makes the rules
          short — and it makes knowing them exactly worth real money. This is
          the reference we build the app&apos;s scoring engine against.
        </p>

        <div className="mt-6 rounded-xl border border-ink-border bg-ink-raised/70 p-4 text-sm text-muted">
          <strong className="text-gold">Rules currency:</strong> verified 24 July
          2026 against the WPRA rolling digital rulebook and the 2026 PRCA Rule
          Book (revised 1 October 2025). Rodeo rules change annually and
          mid-season. In the app, every rule is configuration bound to a dated
          rule set — never hardcoded — so a run is always scored under the rules
          in force the day it happened.
        </div>

        <div className="prose-arena mt-10">
          <h2>The one legal catch</h2>
          <p>
            There is exactly one legal catch in breakaway roping: the{" "}
            <strong>bell collar</strong>, a clean catch around the neck. Three
            things must all be true.
          </p>
          <ul>
            <li>The calf&apos;s whole head must pass through the loop</li>
            <li>The loop must draw up around the neck</li>
            <li>No extremity may be in the loop</li>
          </ul>
          <p>Everything else is a flag-out:</p>
          <ul>
            <li>A front leg or legs in the loop</li>
            <li>
              A half head, a horn catch, or any catch that is not around the neck
            </li>
            <li>A figure eight</li>
            <li>Catching without releasing the loop from the hand</li>
          </ul>

          <h3>The detail that decides arguments</h3>
          <p>
            From the National Finals ground rules: if an extremity gets into the
            loop <strong>after the flagger has already dropped the flag</strong>,
            the run stands. The catch is judged at the moment of the flag, not
            afterward.
          </p>
          <p>
            This is the mirror image of the team roping rule, where a flagger may
            retroactively flag a team out. If you rope both events, do not carry
            the team roping assumption into the breakaway pen — and if you are
            building software for this sport, do not build a validator that flags
            it retroactively.
          </p>

          <h2>Timing</h2>
          <p>
            Time runs from the drop of the barrier flag to the break of the
            string from the saddle horn. The flag is what stops the clock, which
            is exactly why the 12-inch cloth exists — the timer has to see it.
          </p>
          <p>
            One practical consequence: a phone timer can never be authoritative.
            In the app, user-recorded times are presented as practice times,
            clearly labeled, and are never merged into official results or
            standings.
          </p>

          <h2>The barrier</h2>
          <ul>
            <li>
              <strong>Breaking the barrier is a 10-second penalty</strong> added
              to the raw time
            </li>
            <li>
              The neck rope on the calf connects to the barrier. When the calf
              runs far enough, the force releases the neck rope and the barrier
              drops — that is when the roper may leave
            </li>
            <li>
              The score line is set by show management according to arena
              conditions, and once set it does not change until the go-round is
              complete
            </li>
            <li>
              The barrier judge keeps a record of the length of the barrier trip
              rope, to assure the same start for every contestant
            </li>
            <li>
              Barrier equipment is inspected by the barrier judge before each
              timed event
            </li>
            <li>
              On a barrier malfunction, a barrier flagman is used and the animal
              is flagged when its nose reaches the starting or deadline
            </li>
          </ul>
          <p>
            The arithmetic is the simplest in rodeo:{" "}
            <strong>
              official time = raw time + (barrier broken ? 10 : 0)
            </strong>
            . One penalty, one legal catch. Get it exactly right and you are
            already more accurate than the spreadsheets most jackpots run on.
          </p>

          <h2>Equipment — and it is enforceable</h2>
          <p>
            This is WPRA rule 12.10.9, amended 1 October 2025 and current for the
            2026 season. Judges run random checks.
          </p>
          <ul>
            <li>
              The rope is tied at the end to the saddle horn with{" "}
              <strong>#18 brightly colored twisted or braided mason line</strong>
              , fully intact, secured with a{" "}
              <strong>minimum of three knots</strong>. Failure to use proper
              equipment is a disqualification
            </li>
            <li>
              A bright solid color cloth, <strong>minimum 12 inches by 12
              inches</strong>, must be attached to the end of the rope.
              Suggested colors are neon yellow, neon pink, neon orange, neon
              green, or clean bright white. Noncompliance is a minor rule
              violation which judges may turn in
            </li>
            <li>
              The rope may not pass through a bridle, tie-down, neck rope, or any
              other device
            </li>
            <li>
              Calf neck ropes must be tied with string, and an adjustable slide
              is used on all neck ropes for cattle used in breakaway
            </li>
          </ul>
          <p>
            An equipment disqualification lands <em>after</em> the run and after
            the time — it voids a time that has already been posted. It is the
            single most avoidable loss in the event, which is why the app ships a
            pre-run equipment check with photo capture of the flag and the knot
            count.
          </p>

          <h2>Loops and other rules</h2>
          <ul>
            <li>
              Loop count varies by event. Pro rodeo and the National Finals are
              typically one loop. Jackpots and amateur rodeos frequently allow
              two. Configure per class — never assume
            </li>
            <li>
              A second rope must still be attached to the horn with string to be
              usable. If the string already broke on the first throw, the rope
              cannot be rebuilt for a second throw
            </li>
            <li>
              A contestant may not attempt to rope before the barrier flag has
              dropped. Positioning the horse to rope from behind the barrier
              without leaving the box is a disqualification
            </li>
            <li>
              The contestant&apos;s name is called three times. If not present and
              ready, the contestant is scratched
            </li>
            <li>
              Two or more timekeepers, one or more field judges. Field judges may
              be mounted
            </li>
          </ul>
        </div>

        {/* Penalty table */}
        <h2 className="mt-14 mb-6 text-2xl font-bold text-gold">
          The penalty table
        </h2>
        <div className="overflow-x-auto rounded-xl border border-ink-border">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-ink-panel text-xs tracking-wider text-muted uppercase">
              <tr>
                <th className="px-4 py-3">Situation</th>
                <th className="px-4 py-3">Result</th>
                <th className="px-4 py-3">Rule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-border bg-ink-raised/60">
              {penalties.map((p) => (
                <tr key={p.code}>
                  <td className="px-4 py-3 font-mono text-xs text-cream">
                    {p.code}
                  </td>
                  <td
                    className={`px-4 py-3 font-semibold whitespace-nowrap ${
                      p.tone === "bad" ? "text-red-400" : "text-gold"
                    }`}
                  >
                    {p.result}
                  </td>
                  <td className="px-4 py-3 text-[#c8d4e4]">{p.rule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="prose-arena mt-14">
          <h2>Formats and divisions</h2>
          <p>
            Breakaway runs more formats than most events, and the divisional
            format is spreading fast.
          </p>
          <ul>
            <li>
              <strong>One-go</strong> — standard at rodeos
            </li>
            <li>
              <strong>Two-go average</strong> — common at jackpots
            </li>
            <li>
              <strong>Go-round plus short round</strong> — larger jackpots and
              finals
            </li>
            <li>
              <strong>Divisional / D-format</strong> — 1D, 2D, 3D, 4D split off
              the fastest time by a set interval, borrowed from barrel racing
            </li>
            <li>
              <strong>Sidepots</strong> — youth, senior, novice, incentive
            </li>
            <li>
              <strong>Age divisions</strong> — peewee, junior, youth, open,
              senior, legends
            </li>
            <li>
              <strong>Buckle series</strong> — season-long points across a series
            </li>
          </ul>

          <h3>How divisional splits work</h3>
          <p>
            The 1D is the fast time. Each division below it splits off at a set
            interval — commonly half a second or a full second — so a roper who
            cannot win the 1D can still win the 2D, 3D, or 4D. That is the whole
            reason the format spread: it puts money in more hands.
          </p>
          <p>
            It also has a consequence most spreadsheets get wrong. Because the
            splits are <em>relative to the fast time</em>, every new fast time
            reshuffles every division and the entire payout. The correct move is
            to recompute the whole class, not to increment it. The app does this
            in a single transaction every time a time is entered.
          </p>

          <h2>Sanctioning — check before you enter</h2>
          <p>
            WPRA rule dated 16 May 2025, current: members may not compete in an
            open or invitational breakaway held at a PRCA-approved rodeo without
            board approval. It is an easy infraction to take by accident, so
            event listings in the app surface sanctioning status before you pay
            an entry fee.
          </p>

          <h2>Ground rules override</h2>
          <p>
            Association rules are the baseline. Ground rules for a specific event
            override them for that event, and that is where most real variation
            lives. A producer running a five-second barrier is running a
            five-second barrier. The app lets producers state ground-rule
            overrides up front, bound to that event, and shows them to you before
            you enter.
          </p>

          <h2>Why every score in the app cites its rule</h2>
          <p>
            Rodeo rulebooks turn over on a schedule: the PRCA publishes annually
            in early October effective 1 January, NIRA publishes mid-summer,
            NHSRA runs a two-year cycle, and the WPRA amends continuously with
            dated amendments posted to members. Recomputing a 2026 average under
            2027 rules produces wrong history, wrong standings, and wrong money.
          </p>
          <p>
            So rules are resolved at write time and the binding is stored with
            the run, permanently. Every score explanation the app shows carries
            the citation and the edition. &ldquo;10 second barrier, PRCA 2026
            Rule Book&rdquo; is defensible. A bare number is not.
          </p>
        </div>

        <div className="mt-14 rounded-xl border border-ink-border bg-ink-raised p-6 text-sm text-muted">
          <p>
            <strong className="text-gold">A note on authority:</strong> this page
            is a plain-language reference, not a rulebook. Where it and an
            association&apos;s current rulebook disagree, the rulebook wins.
            Always check the current WPRA amendments, the PRCA rule book, and the
            ground rules for the specific event you are entering.
          </p>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/#waitlist"
            className="inline-block rounded-lg bg-gold px-8 py-4 font-bold tracking-wider text-[#070c15] uppercase shadow-lg shadow-gold/20 transition hover:bg-gold-hover"
          >
            Get Early Access
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
