import type { Metadata } from "next";
import { Fredoka, Caveat } from "next/font/google";
import Link from "next/link";
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
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "BobaMatcha — It's a Matcha",
    description:
      "AI-powered boba dates. Matched daily at noon. Grab matcha, find your person.",
    type: "website",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "BobaMatcha Logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fredoka.variable} ${caveat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <main className="flex-grow">
          {children}
        </main>
        
        <footer className="flex justify-center gap-6 pb-8 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#5C4033]/50">
          <Link href="/terms" className="hover:text-[#5C4033] transition-colors no-underline">Terms</Link>
          <Link href="/privacy" className="hover:text-[#5C4033] transition-colors no-underline">Privacy</Link>
          <Link href="/cookies" className="hover:text-[#5C4033] transition-colors no-underline">Cookies</Link>
        </footer>
      </body>
    </html>
  );
}
