import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund Policy | BreakawayRoping.pro",
  description:
    "Refund terms for BreakawayRoping.pro subscriptions, and how event entry fee refunds are handled.",
  alternates: { canonical: "https://www.breakawayroping.pro/refund" },
};

const sections = [
  {
    h: "1. Subscriptions",
    p: "Premium subscriptions are billed monthly or annually and renew automatically until cancelled. You may cancel at any time; cancellation takes effect at the end of your current billing period and you keep premium access until then.",
  },
  {
    h: "2. App Store Purchases",
    p: "Subscriptions purchased through the Apple App Store or Google Play are governed by that store's refund policy and must be requested directly from Apple or Google. We cannot issue refunds for store-processed purchases on their behalf.",
  },
  {
    h: "3. Purchases Made Directly",
    p: "For subscriptions purchased directly through us, contact support@breakawayroping.pro within 14 days of the charge and we will review the request. Refunds are issued to the original payment method.",
  },
  {
    h: "4. Event Entry Fees",
    p: "Entry fees are collected on behalf of event producers and are subject to that producer's own entry, draw-out, and refund terms — including any office charge, which is typically non-refundable. Requests to withdraw an entry must go to the producer. We can help you reach them, but we cannot override a producer's refund terms.",
  },
  {
    h: "5. Cancelled or Postponed Events",
    p: "If a producer cancels or postpones an event, refunds are handled by that producer under their stated terms. Where an event is cancelled for biosecurity or venue reasons, we will surface the producer's notice and refund instructions in the app as soon as we receive them.",
  },
  {
    h: "6. Marketplace Transactions",
    p: "Marketplace sales are between buyer and seller. We are not a party to those transactions and do not issue refunds for them.",
  },
  {
    h: "7. Contact",
    p: "Refund questions can be sent to support@breakawayroping.pro.",
  },
];

export default function Refund() {
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
          <h1 className="mb-2 text-4xl font-bold text-cream">Refund Policy</h1>
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
