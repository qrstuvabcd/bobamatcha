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
      <body className="min-h-full flex flex-col font-sans">
        <main className="flex-grow">
          {children}
        </main>
        
        <footer className="footer-layout flex justify-center gap-6 pb-8 pt-4 text-sm font-medium text-[#5C4033]/70">
          <a href="/terms" className="hover:text-[#5C4033] transition-colors">Terms of Use</a>
          <a href="/privacy" className="hover:text-[#5C4033] transition-colors">Privacy Policy</a>
          <a href="mailto:hello@bobamatcha.xyz" className="hover:text-[#5C4033] transition-colors">Contact</a>
        </footer>
      </body>
    </html>
  );
}
