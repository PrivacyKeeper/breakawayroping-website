import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SchemaMarkup from "./components/SchemaMarkup";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "BreakawayRoping.pro - #1 Breakaway Roping App | Events, Results & Community",
  description:
    "The complete breakaway roping app. Enter events, track every run, log practice, check your equipment, follow WPRA, NHSRA and NIRA standings, and connect with the women and juniors who make this sport. Divisional payouts, calf draws, AI run analysis, and a marketplace built for breakaway.",
  keywords:
    "breakaway roping, breakaway roping app, breakaway roping events, WPRA breakaway, breakaway roping results, breakaway roping jackpot, breakaway rope, breakaway honda, womens rodeo app, NHSRA breakaway, NIRA breakaway, NLBRA, little britches breakaway, breakaway roping horse, rodeo app, breakaway practice log, divisional breakaway, 1D 2D 3D breakaway",
  authors: [{ name: "BreakawayRoping.pro" }],
  creator: "BreakawayRoping.pro",
  publisher: "BreakawayRoping.pro",
  metadataBase: new URL("https://www.breakawayroping.pro"),
  alternates: {
    canonical: "https://www.breakawayroping.pro",
  },
  openGraph: {
    title: "BreakawayRoping.pro - #1 Breakaway Roping App",
    description:
      "Every run, every event, every division. The complete breakaway roping platform for ropers, producers, coaches, and families.",
    url: "https://www.breakawayroping.pro",
    siteName: "BreakawayRoping.pro",
    type: "website",
    images: [
      {
        url: "https://www.breakawayroping.pro/logo.png",
        width: 1200,
        height: 630,
        alt: "BreakawayRoping.pro",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "BreakawayRoping.pro - #1 Breakaway Roping App",
    description:
      "Every run, every event, every division. The complete breakaway roping platform.",
    images: ["https://www.breakawayroping.pro/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable + " antialiased"}>
        <SchemaMarkup />
        {children}
      </body>
    </html>
  );
}
