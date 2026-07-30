"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import quotes from "../data/quotes.json";

const getQuoteForToday = () => {
  const daysSinceEpoch = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  const index = Math.floor(daysSinceEpoch / 2) % quotes.length;
  return quotes[index];
};

export default function CrossQuote() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setQuote(getQuoteForToday());
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-40 hidden max-w-[200px] flex-col items-center text-center md:flex">
      <Image
        src="/cross.jpg"
        alt="Cross"
        width={64}
        height={64}
        className="mb-2 h-16 w-16 object-contain"
      />
      <p className="text-xs leading-snug text-white/80 italic">
        &ldquo;{quote}&rdquo;
      </p>
    </div>
  );
}
