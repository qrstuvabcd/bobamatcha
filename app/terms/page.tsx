import React from 'react';

export default function TermsPage() {
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
              Terms of Use
            </h1>
            <p className="text-sm font-bold opacity-60 uppercase tracking-widest mt-2">
              Last Updated: April 2026
            </p>
          </header>

          <section className="space-y-4">
            <p className="text-lg font-medium">
              By accessing or using BobaMatcha, you agree to be bound by these Terms of Use.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-black">1. Age Requirement</h2>
            <p className="font-medium underline decoration-[#A4C639] decoration-4 underline-offset-4 decoration-opacity-100">
              BobaMatcha is strictly for users who are 18 years of age or older. By using this service, you represent and warrant that you are at least 18 years old.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-black">2. User Conduct</h2>
            <p>
              You agree to use BobaMatcha respectfully. You may not use the service to harass, abuse, or harm another person. You must provide your actual Instagram handle; fake profiles or impersonation will result in an immediate ban from the service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-black text-red-600">3. Limitation of Liability and Offline Interactions</h2>
            <div className="p-4 bg-orange-50 border-2 border-orange-200 rounded-2xl italic font-medium">
              BobaMatcha is a platform designed to facilitate an initial online match. We do not conduct criminal background checks on our users. You agree that BobaMatcha is not responsible for the conduct of any user, either online or offline. You are solely responsible for your interactions with other users. If you choose to meet a match in person for boba, coffee, or any other activity, you do so entirely at your own risk. Always use common sense and prioritize your safety.
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-black">4. Service Availability</h2>
            <p>
              The BobaMatcha "Daily Drop" occurs at 12:00 PM local time. We reserve the right to modify, suspend, or discontinue the service at any time without notice.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
