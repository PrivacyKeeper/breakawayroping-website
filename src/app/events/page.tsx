import type { Metadata } from "next";
import Footer from "../components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Breakaway Roping Events Near You | Jackpots, Rodeos & Series | BreakawayRoping.pro",
  description:
    "Find breakaway roping events, jackpots, and rodeos near you. Filter by division, D-format, age bracket, and distance. Entries, draws, live results, and divisional payouts in one app.",
  keywords:
    "breakaway roping events, breakaway jackpot near me, breakaway roping near me, WPRA breakaway events, breakaway roping schedule, breakaway series, youth breakaway events",
  alternates: { canonical: "https://www.breakawayroping.pro/events" },
};

const eventTypes = [
  {
    title: "Jackpots",
    desc: "Weekly and weekend jackpots, one-go or two-go average, with sidepots and divisional splits.",
  },
  {
    title: "Divisional / D-Format",
    desc: "1D, 2D, 3D, and 4D classes split off the fast time so more ropers can win money.",
  },
  {
    title: "Rodeos",
    desc: "WPRA-sanctioned and PRCA-approved rodeos, with sanctioning status shown before you enter.",
  },
  {
    title: "Buckle Series",
    desc: "Season-long points races across a series of jackpots, with running standings.",
  },
  {
    title: "Youth & School",
    desc: "NLBRA, junior high, high school, and college events with region standings.",
  },
  {
    title: "Clinics & Schools",
    desc: "Roping clinics, private lessons, and schools from clinicians near you.",
  },
];

export default function EventsPage() {
  return (
    <div className="arena-page arena-bg-1 min-h-screen">
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
            <Link href="/rules" className="transition hover:text-gold">
              Rules
            </Link>
            <Link href="/blog" className="transition hover:text-gold">
              Blog
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16">
        <p className="text-sm font-semibold tracking-wider text-blue uppercase">
          Events
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-cream md:text-5xl">
          Find Breakaway Events Near You
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Right now, most breakaway ropers find out about a jackpot from a
          Facebook group and find out the results the same way. The app replaces
          both — browse and filter events, enter and pay, get your draw position
          and calf number pushed to your phone, and watch results come in live.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {eventTypes.map((t) => (
            <div
              key={t.title}
              className="rounded-xl border border-ink-border bg-ink-raised p-6"
            >
              <h2 className="text-lg font-semibold text-gold">{t.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {t.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="arena-panel mt-14 p-8">
          <h2 className="text-2xl font-bold text-gold">
            What you get on every event
          </h2>
          <ul className="mt-4 space-y-2">
            {[
              "Filter by division, D-format, age bracket, and distance from you",
              "Added money, entry fees, and office charge stated up front",
              "Sanctioning status, so you never take an accidental infraction",
              "Ground-rule overrides from the producer, before you pay",
              "Equipment check reminder attached to your entry",
              "Draw position and calf number with a push notification",
              "Live results as times are entered",
              "Divisional placings and payouts the moment the class finalizes",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-[#c8d4e4]">
                <span className="mt-0.5 text-blue">&#10003;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-14 rounded-xl border border-ink-border bg-ink-raised p-8 text-center">
          <h2 className="text-xl font-bold text-gold">
            Producing a breakaway event?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            The producer console builds classes with divisional splits, age
            brackets, and sidepots, runs your calf draw, and gives your timer a
            scoring screen with one time field, one catch selector, and one
            barrier toggle — a full go-round entered without ever leaving one
            screen.
          </p>
          <a
            href="mailto:support@breakawayroping.pro?subject=Producer%20early%20access"
            className="mt-6 inline-block rounded-lg bg-gold px-8 py-3 font-bold tracking-wider text-[#070c15] uppercase shadow-lg shadow-gold/20 transition hover:bg-gold-hover"
          >
            Get Producer Access
          </a>
        </div>

        <div className="mt-14 text-center">
          <p className="text-muted">
            Event listings go live with the app. Join the waitlist to get in
            first.
          </p>
          <Link
            href="/#waitlist"
            className="mt-6 inline-block rounded-lg border border-gold px-8 py-3 font-bold tracking-wider text-gold uppercase transition hover:bg-gold hover:text-[#070c15]"
          >
            Join the Waitlist
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
