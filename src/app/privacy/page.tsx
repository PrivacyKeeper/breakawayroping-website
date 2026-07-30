import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | BreakawayRoping.pro",
  description:
    "How BreakawayRoping.pro collects, uses, and protects your data — including our additional protections for users under 18.",
  alternates: { canonical: "https://www.breakawayroping.pro/privacy" },
};

const sections = [
  {
    h: "1. Information We Collect",
    p: "We collect information you provide directly, including name, email, profile information, and payment details when you subscribe to premium features. We also collect competition and practice data such as run times, catch types, event entries, horse records, equipment check logs, location data (GPS), and app interactions.",
  },
  {
    h: "2. How We Use Your Information",
    p: "We use your information to provide and improve our services, process entries and transactions, send notifications about draws, results, and events, personalize your experience, and provide location-based features such as weather, arena finding, and nearby event discovery. We never sell your personal data to third parties.",
  },
  {
    h: "3. Users Under 18",
    p: "Breakaway roping has a large youth population and we apply additional protections by default. Profiles for users under 18 default to followers-only visibility. Location precision for minors is never shown below city level. Adults cannot direct message a minor outside of an established school, barn, or mentor relationship, and those relationships carry guardian visibility. Photo and video sharing for minors is controlled by a guardian setting on the account. A minor's recruiting profile does not become public automatically upon turning 18 — that requires an explicit action by the account holder.",
  },
  {
    h: "4. Location Data",
    p: "We collect GPS location data to provide weather information, severe weather alerts, arena and event discovery, route planning, and hauling features. You can disable location services at any time through your device settings, though some features will be limited. For accounts belonging to minors, location is never displayed to other users below city level regardless of device settings.",
  },
  {
    h: "5. Practice Data vs. Official Results",
    p: "Runs you record yourself are stored as practice data and are clearly labeled as hand-timed. Practice data is never merged into official results, standings, or public leaderboards. Official results originate from event producers and sanctioning bodies.",
  },
  {
    h: "6. Photos, Video, and Run Analysis",
    p: "Video you upload for run analysis is stored securely and processed to produce coaching metrics such as barrier margin, delivery timing, and loop shape. You control whether analyzed runs are shared. For accounts belonging to minors, guardian controls apply to all media sharing.",
  },
  {
    h: "7. Data Storage and Security",
    p: "Your data is stored securely using industry-standard encryption. We use Supabase for database management and authentication, and Stripe for payment processing, both of which maintain strict security standards.",
  },
  {
    h: "8. Your Rights",
    p: "You have the right to access, correct, or delete your personal data at any time. You can export your data or request account deletion in the app, or by contacting support@breakawayroping.pro. Guardians may exercise these rights on behalf of a minor.",
  },
  {
    h: "9. Third-Party Services",
    p: "We integrate with third-party services including payment processors (Stripe), mapping and places services (Google Maps), weather APIs, push notification providers, live video infrastructure, analytics providers, and cloud storage. These services have their own privacy policies governing their use of your data.",
  },
  {
    h: "10. Blocking, Reporting, and Moderation",
    p: "Block, report, and mute are available on every account from launch. Report categories include harassment and unwanted contact specifically. Reports are reviewed by our moderation team, and reported content may be retained for the duration of an investigation and any subsequent enforcement.",
  },
  {
    h: "11. Changes to This Policy",
    p: "We may update this policy as the product develops. Material changes will be communicated in the app and by email to the address on your account.",
  },
  {
    h: "12. Contact",
    p: "Questions about this policy or your data can be sent to support@breakawayroping.pro.",
  },
];

export default function Privacy() {
  return (
    <div className="arena-page arena-bg-2">
      <main className="mx-auto min-h-screen max-w-4xl px-6 py-16">
        <div className="arena-panel p-8 md:p-10">
          <Link
            href="/"
            className="mb-8 inline-block text-sm text-gold hover:underline"
          >
            &larr; Back to Home
          </Link>
          <h1 className="mb-2 text-4xl font-bold text-cream">Privacy Policy</h1>
          <p className="mb-10 text-sm text-muted">Last updated: July 2026</p>

          <div className="space-y-8 text-[#d3dae6]">
            {sections.map((s) => (
              <section key={s.h}>
                <h2 className="mb-2 text-xl font-bold text-gold">{s.h}</h2>
                <p className="leading-relaxed">{s.p}</p>
              </section>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
