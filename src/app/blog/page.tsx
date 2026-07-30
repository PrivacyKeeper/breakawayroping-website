import type { Metadata } from "next";
import { posts } from "./posts";

export const metadata: Metadata = {
  title: "Breakaway Roping Blog - Rules, Gear & Training",
  description:
    "Breakaway roping rules explained, equipment guides, divisional format breakdowns, and training tips from BreakawayRoping.Pro.",
  alternates: { canonical: "https://www.breakawayroping.pro/blog" },
};

export default function BlogIndex() {
  return (
    <>
      <h1 className="text-3xl font-extrabold text-gold">
        BreakawayRoping.Pro Blog
      </h1>
      <p className="mt-3 text-muted">
        Rules, gear, formats, and training — written for people who actually
        back into the box.
      </p>

      <div className="mt-10 space-y-6">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="rounded-xl border border-ink-border bg-ink-raised/70 p-6 transition hover:border-gold"
          >
            <p className="text-xs tracking-wider text-muted-dim uppercase">
              {post.date}
            </p>
            <h2 className="mt-2 text-xl font-bold text-gold">
              <a href={`/blog/${post.slug}`} className="hover:underline">
                {post.title}
              </a>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#c8d4e4]">
              {post.excerpt}
            </p>
            <a
              href={`/blog/${post.slug}`}
              className="mt-4 inline-block text-sm font-semibold text-blue hover:underline"
            >
              Read more &rarr;
            </a>
          </article>
        ))}
      </div>
    </>
  );
}
