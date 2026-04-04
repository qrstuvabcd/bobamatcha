import React from 'react';

export default function PrivacyPage() {
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
        <div className="space-y-6 text-[#5C4033] leading-relaxed">
          <header className="border-b-4 border-[#5C4033] pb-4 mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight" style={{ fontFamily: "var(--font-marker)" }}>
              Privacy Policy
            </h1>
            <p className="text-sm font-bold opacity-60 uppercase tracking-widest mt-2">
              Last Updated: April 2026
            </p>
          </header>

          <section className="space-y-4">
            <p className="text-lg font-medium">
              Welcome to BobaMatcha. We respect your privacy and are committed to protecting your personal data in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-black">1. Information We Collect</h2>
            <p>To facilitate our daily 12 PM matching service, we collect the following information:</p>
            <ul className="list-disc pl-5 space-y-2 font-medium">
              <li>Your Instagram Handle (to connect you with matches).</li>
              <li>Your responses to our daily vibe check questions.</li>
              <li>Basic usage data and device information to keep the app running smoothly.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-black">2. How We Use Your Information</h2>
            <p>
              Your data is used strictly to provide the BobaMatcha service. Your Instagram handle and daily answer will only be shared with the one specific user you are matched with for that day. We do not sell, rent, or trade your personal data to third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-black">3. Data Retention and Your Rights</h2>
            <p>
              We store your data securely. Under UK GDPR, you have the right to access, rectify, or erase your personal data (the "right to be forgotten").
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-black">4. Requesting Data Deletion</h2>
            <p>
              If you wish to have your profile, Instagram handle, and past answers completely removed from our database, please email us at <a href="mailto:privacy@bobamatcha.xyz" className="underline font-bold decoration-2 hover:text-[#A4C639] transition-colors">privacy@bobamatcha.xyz</a> with the subject line "Data Deletion Request." We will process your request within 30 days.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
