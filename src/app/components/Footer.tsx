import Link from "next/link";
export default function Footer() {
  return (
    <footer className="border-t border-ink-border bg-[#050910]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center gap-10 text-center md:flex-row md:items-start md:justify-between md:text-left">
          <div>
            <h4 className="mb-3 text-sm font-bold tracking-wider text-gold uppercase">
              BreakawayRoping.pro
            </h4>
            <p className="max-w-xs text-sm text-muted">
              Two seconds. One loop. Every run that ever mattered, in one place.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-bold tracking-wider text-gold uppercase">
              Explore
            </h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/events" className="text-muted transition hover:text-gold">
                Events
              </Link>
              <Link href="/rules" className="text-muted transition hover:text-gold">
                Rules &amp; Penalties
              </Link>
              <Link href="/blog" className="text-muted transition hover:text-gold">
                Blog
              </Link>
              <Link href="/support" className="text-muted transition hover:text-gold">
                Support
              </Link>
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-bold tracking-wider text-gold uppercase">
              Legal
            </h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/privacy" className="text-muted transition hover:text-gold">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-muted transition hover:text-gold">
                Terms of Service
              </Link>
              <Link href="/refund" className="text-muted transition hover:text-gold">
                Refund Policy
              </Link>
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-bold tracking-wider text-gold uppercase">
              Contact
            </h4>
            <a
              href="mailto:support@breakawayroping.pro"
              className="text-sm text-muted transition hover:text-gold"
            >
              support@breakawayroping.pro
            </a>
          </div>
        </div>
        <div className="mt-10 border-t border-ink-border pt-6 text-sm text-muted-dim">
          <span>&copy; 2026 Apps 1, LLC. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
