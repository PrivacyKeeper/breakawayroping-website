import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    template: "%s | BreakawayRoping.Pro Blog",
    default:
      "BreakawayRoping.Pro Blog - Breakaway Roping News, Rules & Tips",
  },
  description:
    "The official BreakawayRoping.Pro blog. Breakaway roping rules, equipment guides, divisional formats, training tips, and everything the breakaway community needs.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="arena-page arena-bg-2 min-h-screen">
      <header className="flex items-center justify-between border-b border-ink-border bg-[#070c15]/90 px-8 py-6 backdrop-blur-sm">
        <Link
          href="/"
          className="text-xl font-bold text-gold transition hover:text-gold-hover"
        >
          &larr; BreakawayRoping.Pro
        </Link>
        <nav className="flex gap-6 text-sm font-semibold">
          <Link href="/rules" className="text-muted transition hover:text-gold">
            Rules
          </Link>
          <Link href="/blog" className="text-gold">
            Blog
          </Link>
        </nav>
      </header>

      <main className="arena-panel mx-auto my-8 max-w-3xl px-6 py-8">
        {children}
      </main>

      <footer className="border-t border-ink-border bg-[#050910] px-8 py-8 text-center text-sm text-muted-dim">
        <p>&copy; 2026 Apps 1, LLC. All rights reserved.</p>
        <div className="mt-2 flex justify-center gap-4">
          <Link href="/terms" className="text-gold hover:underline">
            Terms
          </Link>
          <Link href="/privacy" className="text-gold hover:underline">
            Privacy
          </Link>
          <Link href="/refund" className="text-gold hover:underline">
            Refund Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}
