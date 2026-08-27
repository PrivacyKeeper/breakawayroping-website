"use client";

import { useState } from "react";
import CrossQuote from "./components/CrossQuote";
import Footer from "./components/Footer";
import Link from "next/link";

/**
 * Feature groups mirror the screens that actually ship in the app, adapted
 * from the BarrelConnect inventory. Free tiers are listed first, premium
 * after, so the page reads as "here is what you get today".
 */
const features = [
  {
    id: "social",
    icon: "👥",
    title: "Social & Community",
    desc: "Share Your Runs. Connect With Your Roping Family.",
    detail: [
      "Post photos and video of your runs straight to your feed",
      "Stories that disappear in 24 hours",
      "Like, comment, bookmark, and repost",
      "Follow the ropers you look up to and build your own following",
      "Fan pages with their own privacy controls",
      "Group chats for your barn, your team, or your travel partners",
      "Direct messaging with read receipts",
      "Search and discover ropers near you",
      "Earn badges for milestones and achievements",
      "Block, report, and mute — available from day one",
    ],
  },
  {
    id: "women-juniors",
    icon: "⭐",
    title: "Women's & Junior Groups",
    desc: "Built For This Community First, Not Bolted On",
    detail: [
      "Regional women's roping groups, seeded by state and found on signup",
      "Mentor pairing with an experienced roper — consent on both sides, guardian approval for minors",
      "Barn and team groups with your coach or trainer as admin",
      "First-check board to celebrate a roper winning her first check",
      "Comeback threads: post-injury, post-pregnancy, post-layoff",
      "Consistency challenges — catches in a row, dummy roping streaks for the kids",
      "Profiles default to followers-only for anyone under 18",
      "No adult-to-minor DMs outside a school, barn, or mentor relationship",
      "Location never shown below city level for minors",
      "Guardian-controlled photo and video sharing",
    ],
  },
  {
    id: "competition",
    icon: "🏆",
    title: "Competition & Events",
    desc: "Everything Competition, One Place",
    detail: [
      "Browse and enter events, filtered by division, D-format, age bracket, and distance",
      "Divisional splits — 1D, 2D, 3D, 4D — calculated off the fast time",
      "Sidepots for youth, senior, novice, and incentive",
      "Draw position and calf number, pushed to your phone",
      "Live results as the times are entered",
      "Average and short-round standings",
      "Payouts by division, including ground money",
      "Entry fees paid in the app",
      "Sanctioning status shown before you enter, so you never take an accidental infraction",
      "Season standings: WPRA, NHSRA, NIRA, and buckle series",
    ],
  },
  {
    id: "practice",
    icon: "⏱️",
    title: "Practice Pen",
    desc: "The Log That Actually Gets Used On A Tuesday",
    detail: [
      "Log a practice run in seconds, from the pen, one-handed",
      "Hand-timed practice stays completely separate from official results",
      "Catch type on every run: bell collar, leg in loop, half head, horn, figure eight",
      "Catch percentage and average time trends over the season",
      "Tag the horse and the calf you were on",
      "Attach video to any run",
      "Streaks and consistency challenges",
      "Progress measured against your own baseline, not against a pro's",
    ],
  },
  {
    id: "equipment",
    icon: "🪢",
    title: "Equipment Check",
    desc: "Never Lose Another Run To Your String",
    detail: [
      "Pre-run checklist for the most avoidable disqualification in the event",
      "#18 mason line, minimum three knots — recorded and photographed",
      "12x12 bright flag check with color and size logged",
      "Photo log of your knot count and flag, timestamped",
      "Second-rope reminder for two-loop classes",
      "Judge-ready record when a random equipment check comes",
      "The full WPRA 12.10.9 specification, in plain language, in your pocket",
    ],
  },
  {
    id: "horses",
    icon: "🐴",
    title: "Horse Management",
    desc: "Your Horse's Complete Digital Life",
    detail: [
      "Unlimited horse profiles with photos and video",
      "Breakaway role: breakaway, calf horse, both, or prospect",
      "Run style: runs hard, rates, or reads the calf",
      "Score rating, stop rating, and honest-in-the-box flags",
      "Arena-specific stats, because score length changes everything",
      "Full pedigree and bloodline tracking",
      "Performance history and times by arena",
      "Horse resume ready for sale or lease",
      "One horse profile that also reads in BarrelConnect and TieDown",
    ],
  },
  {
    id: "marketplace",
    icon: "🛒",
    title: "Marketplace",
    desc: "Buy & Sell With Confidence",
    detail: [
      "Breakaway horses, prospects, youth-safe horses, leases, and broodmares",
      "Ropes by lay and length, kids ropes, practice ropes, by brand",
      "Breakaway hondas, quick-release systems, string, flags, horn knobs",
      "Saddles, breast collars, bits, reins, tie-downs, boots and wraps",
      "Trailers and rigs",
      "Dummies, sleds, chutes, timers, and barrier systems",
      "Breakaway calves and practice calf leases",
      "Lessons, clinics, hauling, farrier, vet, and training",
      "Seller ratings, saved listings, and direct messaging",
      "Report suspicious listings, with review votes from the community",
    ],
  },
  {
    id: "travel",
    icon: "🚗",
    title: "Travel & Safety",
    desc: "Travel Safe, Arrive Ready",
    detail: [
      "Route planner with stops, built around where you are actually hauling",
      "Arena finder along your route, with reviews from other ropers",
      "Real-time weather and severe weather alerts",
      "Emergency alert system with one-tap contacts",
      "Hauler directory with reviews, and transport you can book",
      "Coggins and health certificate expiry warnings before you leave",
      "Event biosecurity status and entry requirements surfaced at entry time",
      "Outbreak alerts along a planned route",
      "Gas, feed, and rest stop finder",
    ],
  },
  {
    id: "rules",
    icon: "📖",
    title: "Rules & Officiating",
    desc: "Know The Call Before It Gets Made",
    detail: [
      "The one legal catch, and every flag-out, explained plainly",
      "Full WPRA equipment specification with amendment dates",
      "Barrier, score line, and the 10-second penalty",
      "Every score explanation cites the rule and the rulebook edition",
      "Rules versioned by date — a 2026 run is always scored under 2026 rules",
      "Producer ground-rule overrides stated up front, before you pay",
      "Loop counts configured per class, never assumed",
    ],
  },
  {
    id: "training",
    icon: "🎯",
    title: "Training & AI",
    desc: "Two Seconds, Fully Analyzed (Premium)",
    detail: [
      "Barrier margin in milliseconds, tracked across a whole season",
      "Delivery consistency — the single best predictor of catch percentage",
      "Loop shape at the calf: open, collapsed, or tipped",
      "Slack and stop timing, from catch to string break",
      "Side-by-side against your own reference run",
      "Predicted catch percentage and average time trend",
      "Drill library: dummy work, ground work, box work, barrier timing",
      "Calf welfare and humane handling education",
      "Book coaching sessions and clinics in the app",
    ],
  },
  {
    id: "health",
    icon: "❤️",
    title: "Equine Health & Care",
    desc: "Complete Health Management (Premium)",
    detail: [
      "Health dashboard at a glance",
      "Vet records and full visit history",
      "Vaccination schedules with reminders",
      "Coggins, health certificates, brand inspection, and import permits",
      "Expiry alerts before they cost you an entry at the gate",
      "Medication schedules with alerts",
      "Nutrition logs and feeding plans",
      "Care scheduler with reusable templates",
      "Farrier visit tracking",
      "Upload and store vet documents",
    ],
  },
  {
    id: "streaming",
    icon: "📺",
    title: "Live Streaming",
    desc: "Go Live From Any Arena (Premium)",
    detail: [
      "Broadcast your runs in real time",
      "Watch parties with friends and family who could not make the haul",
      "Spectator mode for the big ones",
      "Live chat with your viewers",
      "Live results ticker running alongside the stream",
      "Record, save, and share streams back to your feed",
      "Real-time viewer counts",
    ],
  },
  {
    id: "youth",
    icon: "🎓",
    title: "Youth, School & College",
    desc: "The Deepest Pipeline In Rodeo",
    detail: [
      "NLBRA, NJHSRA, NHSRA, and NIRA standings and qualification tracking",
      "Coach dashboards with roster, entries, travel, and eligibility status",
      "School event calendars and region standings",
      "Scholarship board with deadlines and requirements",
      "Recruiting profile with highlight reel, coaches-only by default for minors",
      "GPA band and eligibility flag only — never a transcript",
      "Progression pathways: dummy roping, first catch, first check, first buckle",
      "Team challenges and school leaderboards",
      "A minor's recruiting profile never goes public automatically at 18",
    ],
  },
  {
    id: "producers",
    icon: "💼",
    title: "Producers & Pros",
    desc: "The Fastest Scoring Screen In Rodeo (Premium)",
    detail: [
      "One time field, one catch selector, one barrier toggle — under three taps per run",
      "A full go-round entered without ever leaving one screen",
      "Class builder with divisional splits, age brackets, and sidepots",
      "Score line and barrier trip rope length recorded and locked for the go-round",
      "Calf draw and calf tracking with speed, duck, and stop flags",
      "Equipment check log for judges running random string and flag checks",
      "Divisional payouts with ground money and office charge",
      "Day sheet, draw order, and back numbers",
      "Trainer and clinician profiles with booking",
      "Sponsorship hub with deliverable tracking and analytics",
    ],
  },
];

const pricing = [
  {
    name: "Free",
    price: "$0",
    period: "/forever",
    perks: [
      "Roper profile and community feed",
      "Event discovery and entries",
      "Practice run log",
      "Equipment check",
      "Horse profiles",
      "Marketplace access",
      "Rules reference",
      "Weather and arena finder",
    ],
  },
  {
    name: "Premium",
    price: "$4.99",
    period: "/mo",
    featured: true,
    perks: [
      "Everything in Free",
      "AI run analysis and barrier margin tracking",
      "Video breakdown and side-by-side comparison",
      "Drill library and coaching bookings",
      "Equine health dashboard and vet records",
      "Live streaming",
      "Sponsorship hub",
      "Priority support",
    ],
  },
  {
    name: "Annual",
    price: "$49.99",
    period: "/yr",
    best: true,
    perks: [
      "Everything in Premium",
      "Save $10 versus monthly",
      "Early access to new features",
      "Exclusive community badge",
    ],
  },
];

export default function Home() {
  const [openModal, setOpenModal] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  // Honeypot. Hidden from real visitors, so anything here came from a bot.
  const [company, setCompany] = useState("");

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error ?? "");
      }
      setStatus("success");
      setEmail("");
    } catch (err) {
      // Prefer the server's reason when it gave one: "that address has a typo"
      // and "the mail service is down" need very different things from the
      // visitor, and the generic line tells them neither.
      setErrorMessage(err instanceof Error ? err.message : "");
      setStatus("error");
    }
  };

  return (
    <div className="arena-page arena-bg-1 min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b border-ink-border bg-[#070c15]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="BreakawayRoping.pro"
              className="h-14 w-auto"
            />
            <span className="hidden text-lg font-bold tracking-wide text-gold sm:block">
              BREAKAWAYROPING<span className="text-blue">.PRO</span>
            </span>
          </Link>
          <nav className="hidden gap-8 text-sm font-semibold tracking-wider text-muted uppercase md:flex">
            <a href="#features" className="transition hover:text-gold">
              Features
            </a>
            <Link href="/rules" className="transition hover:text-gold">
              Rules
            </Link>
            <a href="#pricing" className="transition hover:text-gold">
              Pricing
            </a>
            <Link href="/blog" className="transition hover:text-gold">
              Blog
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 py-20 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="BreakawayRoping.pro crest"
          className="w-[300px] drop-shadow-2xl md:w-[400px]"
        />
        <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-cream md:text-5xl">
          Every Run. Every Event.{" "}
          <span className="text-blue">Every Division.</span>
        </h1>
        <p className="mt-4 text-xl font-bold tracking-wide text-gold italic md:text-2xl">
          &ldquo;Two seconds to prove it.&rdquo;
        </p>
        <p className="mt-6 max-w-2xl text-lg text-muted md:text-xl">
          Breakaway ropers track their runs in a notes app and find out results
          from a Facebook group. There has never been a system of record for
          this event. This is it — entries, draws, live results, divisional
          payouts, practice logs, horses, rules, and the community that made
          breakaway the fastest-growing event in rodeo.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <div className="relative">
            <div className="flex cursor-default items-center gap-3 rounded-xl border border-ink-border bg-ink-raised px-6 py-3 opacity-70">
              <svg viewBox="0 0 384 512" className="h-8 w-8 fill-cream">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
              </svg>
              <div className="text-left">
                <p className="text-[10px] leading-tight text-muted uppercase">
                  Download on the
                </p>
                <p className="text-lg leading-tight font-semibold text-cream">
                  App Store
                </p>
              </div>
            </div>
            <span className="absolute -top-3 -right-3 rounded-full bg-blue-deep px-2 py-1 text-[10px] font-bold text-white uppercase shadow-lg">
              Coming Soon
            </span>
          </div>
          <div className="relative">
            <div className="flex cursor-default items-center gap-3 rounded-xl border border-ink-border bg-ink-raised px-6 py-3 opacity-70">
              <svg viewBox="0 0 512 512" className="h-8 w-8 fill-cream">
                <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
              </svg>
              <div className="text-left">
                <p className="text-[10px] leading-tight text-muted uppercase">
                  Get it on
                </p>
                <p className="text-lg leading-tight font-semibold text-cream">
                  Google Play
                </p>
              </div>
            </div>
            <span className="absolute -top-3 -right-3 rounded-full bg-blue-deep px-2 py-1 text-[10px] font-bold text-white uppercase shadow-lg">
              Coming Soon
            </span>
          </div>
        </div>

        <a
          href="#waitlist"
          className="mt-8 rounded-lg bg-gold px-8 py-4 text-lg font-bold tracking-wider text-[#070c15] uppercase shadow-lg shadow-gold/20 transition hover:bg-gold-hover"
        >
          Join the Waitlist
        </a>
      </section>

      {/* Who it is for */}
      <section className="mx-auto max-w-6xl px-6 pb-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Ropers", note: "Open, youth, senior, novice" },
            { label: "Producers", note: "Jackpots, series, rodeos" },
            { label: "Coaches", note: "High school, college, barns" },
            { label: "Families", note: "Parents, guardians, fans" },
          ].map((who) => (
            <div
              key={who.label}
              className="rounded-xl border border-ink-border bg-ink-raised/70 p-4 text-center"
            >
              <p className="text-sm font-bold tracking-wider text-gold uppercase">
                {who.label}
              </p>
              <p className="mt-1 text-xs text-muted">{who.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold tracking-wider text-gold uppercase">
          What&apos;s Inside
        </h2>
        <p className="mx-auto mt-4 mb-14 max-w-2xl text-center text-muted">
          Fourteen feature groups, built for the way this event actually runs.
          Tap any card for the full list.
        </p>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <button
              key={f.id}
              onClick={() => setOpenModal(i)}
              className="group rounded-xl border border-ink-border bg-ink-raised p-6 text-left transition-all hover:border-gold hover:shadow-lg hover:shadow-gold/10"
            >
              <div className="mb-4 text-4xl">{f.icon}</div>
              <h3 className="text-xl font-semibold text-gold group-hover:underline">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{f.desc}</p>
              <p className="mt-3 text-xs font-semibold text-blue">
                See all {f.detail.length}{" "}features &rarr;
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Feature modal */}
      {openModal !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setOpenModal(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-ink-border bg-ink-panel p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 text-5xl">{features[openModal].icon}</div>
            <h3 className="text-2xl font-bold text-gold">
              {features[openModal].title}
            </h3>
            <p className="mt-1 text-sm text-muted">{features[openModal].desc}</p>
            <ul className="mt-4 space-y-2">
              {features[openModal].detail.map((item, j) => (
                <li key={j} className="flex items-start gap-2 text-[#c8d4e4]">
                  <span className="mt-0.5 text-blue">&#10003;</span>
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setOpenModal(null)}
              className="mt-6 rounded-lg bg-gold px-6 py-2 font-semibold text-[#070c15] transition hover:bg-gold-hover"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Why it is different */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-14 text-center text-3xl font-bold tracking-wider text-gold uppercase">
          Why Breakaway Needed Its Own App
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              t: "Barrier margin is where the money goes",
              d: "Ropers lose more money to the 10-second penalty than to bad throws. We show you the margin in milliseconds, and the trend across the whole season.",
            },
            {
              t: "Practice never contaminates official results",
              d: "A phone timer cannot be authoritative. Hand-timed practice runs live in their own log, clearly labeled, and never touch standings or leaderboards.",
            },
            {
              t: "Divisional payouts computed correctly",
              d: "D splits are relative to the fast time, so a new fast time reshuffles everything. We recompute the whole class every time — never increment.",
            },
          ].map((c) => (
            <div
              key={c.t}
              className="rounded-xl border border-ink-border bg-ink-raised p-6"
            >
              <h3 className="text-lg font-semibold text-blue">{c.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-14 text-center text-3xl font-bold tracking-wider text-gold uppercase">
          Pricing
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {pricing.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl border p-8 ${
                plan.featured
                  ? "border-gold bg-ink-panel shadow-lg shadow-gold/15"
                  : "border-ink-border bg-ink-raised"
              }`}
            >
              {plan.featured && (
                <p className="mb-2 text-xs font-bold tracking-wider text-blue uppercase">
                  Most Popular
                </p>
              )}
              {plan.best && (
                <p className="mb-2 text-xs font-bold tracking-wider text-gold uppercase">
                  Best Value
                </p>
              )}
              <h3 className="text-xl font-bold text-gold">{plan.name}</h3>
              <div className="mt-4">
                <span className="text-4xl font-extrabold text-cream">
                  {plan.price}
                </span>
                <span className="text-muted">{plan.period}</span>
              </div>
              <ul className="mt-6 space-y-3">
                {plan.perks.map((p) => (
                  <li
                    key={p}
                    className="flex items-start gap-2 text-sm text-[#c8d4e4]"
                  >
                    <span className="mt-0.5 text-blue">&#10003;</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="mx-auto max-w-xl px-6 py-20 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-wider text-gold uppercase">
          Get Early Access
        </h2>
        <p className="mb-8 text-muted">
          Drop your email and be the first to know when BreakawayRoping.pro
          launches.
        </p>
        {status === "success" ? (
          <p className="text-lg font-semibold text-gold">
            &#127881; You&apos;re on the list! Check your inbox.
          </p>
        ) : (
          <form
            onSubmit={handleWaitlist}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <input
              type="text"
              name="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 rounded-lg border border-ink-border bg-ink-raised px-4 py-3 text-cream placeholder-muted-dim focus:border-gold focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-lg bg-gold px-6 py-3 font-bold tracking-wider text-[#070c15] uppercase shadow-lg shadow-gold/20 transition hover:bg-gold-hover disabled:opacity-50"
            >
              {status === "loading" ? "Submitting..." : "Notify Me"}
            </button>
          </form>
        )}
        {status === "error" && (
          <p className="mt-4 text-sm text-red-400">
            {errorMessage || "Something went wrong. Try again."}
          </p>
        )}
      </section>

      <Footer />
      <CrossQuote />
    </div>
  );
}
