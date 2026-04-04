import type { Metadata } from "next";
import { Fredoka, Caveat } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BobaMatcha — It's a Matcha 🍵",
  description:
    "The cutest AI matchmaker that sets you up on boba & matcha dates. Get matched every day at noon. No swiping — just boba and vibes.",
  openGraph: {
    title: "BobaMatcha — It's a Matcha",
    description:
      "AI-powered boba dates. Matched daily at noon. Grab matcha, find your person.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fredoka.variable} ${caveat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
