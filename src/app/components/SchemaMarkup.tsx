export default function SchemaMarkup() {
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "BreakawayRoping.pro",
    applicationCategory: "SportsApplication",
    operatingSystem: "iOS, Android",
    description:
      "The complete breakaway roping app. Enter events, track every run, log practice, check your equipment, follow WPRA, NHSRA and NIRA standings, and connect with the breakaway community. Divisional payouts, calf draws, AI run analysis, and a marketplace built for breakaway.",
    url: "https://www.breakawayroping.pro",
    offers: [
      {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        name: "Free",
      },
      {
        "@type": "Offer",
        price: "4.99",
        priceCurrency: "USD",
        name: "Premium Monthly",
      },
      {
        "@type": "Offer",
        price: "49.99",
        priceCurrency: "USD",
        name: "Premium Annual",
      },
    ],
    author: {
      "@type": "Organization",
      name: "BreakawayRoping.pro",
      url: "https://www.breakawayroping.pro",
      email: "support@breakawayroping.pro",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BreakawayRoping.pro",
    url: "https://www.breakawayroping.pro",
    description:
      "The complete breakaway roping platform. Events, entries, results, practice logs, horses, rules, and community in one app.",
    potentialAction: {
      "@type": "SearchAction",
      target:
        "https://www.breakawayroping.pro/blog?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  // The rules reference is the page most likely to earn a featured snippet,
  // so the common questions are marked up explicitly.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is a legal catch in breakaway roping?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "There is exactly one legal catch in breakaway roping: the bell collar, a clean catch around the neck. The calf's whole head must pass through the loop, the loop must draw up around the neck, and no extremity may be in the loop. A front leg in the loop, a half head, a horn catch, a figure eight, or catching without releasing the loop from the hand are all flag-outs.",
        },
      },
      {
        "@type": "Question",
        name: "What is the barrier penalty in breakaway roping?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Breaking the barrier carries a 10-second penalty added to the raw time. The score line is set by show management according to arena conditions and does not change once the go-round has started.",
        },
      },
      {
        "@type": "Question",
        name: "What string and flag does the WPRA require for breakaway roping?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "WPRA rule 12.10.9 requires the rope to be tied to the saddle horn with #18 brightly colored twisted or braided mason line string, fully intact, secured with a minimum of three knots. A bright solid color cloth of at least 12 inches by 12 inches must be attached to the end of the rope. Failure to use proper equipment is a disqualification, and judges may run random checks.",
        },
      },
      {
        "@type": "Question",
        name: "How does divisional or D-format breakaway roping work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Divisional breakaway borrows the format from barrel racing. The 1D is the fast time, and each additional division splits off at a set interval below it, commonly half a second or a full second. A roper who cannot win the 1D can still win the 2D, 3D, or 4D, which is why the format has spread so quickly through breakaway jackpots.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
