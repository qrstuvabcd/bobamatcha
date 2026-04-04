import React from 'react';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#E8F5E9] p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl mt-4 mb-4">
        <a 
          href="/" 
          className="inline-flex items-center gap-2 text-[#5C4033] font-bold py-2 px-4 rounded-full border-2 border-[#5C4033] bg-white shadow-[4px_4px_0px_#5C4033] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
        >
          ← Back to Drop
        </a>
      </div>

      <div className="w-full max-w-2xl bg-white border-4 border-[#5C4033] rounded-[2rem] shadow-[8px_8px_0px_#5C4033] p-8 md:p-12 mb-12">
        <div className="space-y-6 text-[#5C4033] leading-relaxed font-sans">
          <header className="border-b-4 border-[#5C4033] pb-4 mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight" style={{ fontFamily: "var(--font-marker)" }}>
              Cookie Policy
            </h1>
            <p className="text-sm font-bold opacity-60 uppercase tracking-widest mt-2">
              Last Updated: April 2026
            </p>
          </header>

          <section className="space-y-3">
            <h2 className="text-2xl font-black">1. Essential Cookies Only</h2>
            <p>
              BobaMatcha only uses "strictly necessary" cookies. These are tiny text files saved to your device that are required for the app to function properly. For example, we use them to remember your session so you don't get logged out right before the 12 PM drop.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-black">2. No Creepy Tracking</h2>
            <p>
              We do not use third-party advertising cookies, cross-site trackers, or pixel tags. We don't run ads, so we don't need to track your behavior across the internet.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-black">3. Your Consent</h2>
            <p>
              Because we only use essential cookies required to provide the service you requested, we do not need a massive, annoying cookie banner. By using BobaMatcha, you agree to the use of these necessary session cookies.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
