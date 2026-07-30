import type { Metadata } from "next";
import Footer from "../components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Support | BreakawayRoping.pro",
  description:
    "Get help with BreakawayRoping.pro — account questions, entries, producer access, safety reports, and data requests.",
  alternates: { canonical: "https://www.breakawayroping.pro/support" },
};

const topics = [
  {
    h: "Account and billing",
    p: "Subscription changes, cancellations, and receipts. Purchases made through the App Store or Google Play must be refunded through those stores.",
    email: "support@breakawayroping.pro",
    subject: "Account%20and%20billing",
  },
  {
    h: "Entries, draws, and results",
    p: "Entry problems are usually fastest to solve with the event producer, since they control the class, the draw, and the payout. We can help you reach them.",
    email: "support@breakawayroping.pro",
    subject: "Entry%20or%20results%20question",
  },
  {
    h: "Producer access",
    p: "Running a jackpot, series, or rodeo and want the producer console — class builder, calf draw, scoring screen, and divisional payouts.",
    email: "support@breakawayroping.pro",
    subject: "Producer%20early%20access",
  },
  {
    h: "Safety, harassment, or unwanted contact",
    p: "Report it in the app for the fastest response — reports there reach our moderation team directly with the relevant context attached. You can also email us, and if a minor is involved, say so in the subject line so it is prioritized.",
    email: "support@breakawayroping.pro",
    subject: "Safety%20report",
  },
  {
    h: "Guardian requests",
    p: "Guardians can adjust a minor's visibility, messaging, media sharing, and location settings, and can export or delete the account's data.",
    email: "support@breakawayroping.pro",
    subject: "Guardian%20request",
  },
  {
    h: "Data export or account deletion",
    p: "You can export your data or delete your account in the app. If you would rather we handle it, email us from the address on the account.",
    email: "support@breakawayroping.pro",
    subject: "Data%20request",
  },
  {
    h: "Rules corrections",
    p: "If something in our rules reference is out of date or wrong, tell us. Include the association and the amendment date if you have it — we version rules by date and we would rather fix it quickly.",
    email: "support@breakawayroping.pro",
    subject: "Rules%20correction",
  },
];

export default function Support() {
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
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-extrabold tracking-tight text-cream">
          Support
        </h1>
        <p className="mt-4 text-lg text-muted">
          Email us at{" "}
          <a
            href="mailto:support@breakawayroping.pro"
            className="text-gold hover:underline"
          >
            support@breakawayroping.pro
          </a>{" "}
          and we will get back to you. Pick the closest topic below so it reaches
          the right person faster.
        </p>

        <div className="mt-10 space-y-4">
          {topics.map((t) => (
            <div
              key={t.h}
              className="rounded-xl border border-ink-border bg-ink-raised p-6"
            >
              <h2 className="text-lg font-semibold text-gold">{t.h}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#c8d4e4]">
                {t.p}
              </p>
              <a
                href={`mailto:${t.email}?subject=${t.subject}`}
                className="mt-3 inline-block text-sm font-semibold text-blue hover:underline"
              >
                Email about this &rarr;
              </a>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
