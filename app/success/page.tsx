// @ts-nocheck

export default function SuccessPage() {
    return (
        <main className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center p-4">
            <div className="absolute top-20 right-20 text-4xl animate-sway opacity-30">✨</div>
            <div className="absolute bottom-20 left-20 text-5xl animate-bounce-soft opacity-30">🧋</div>

            <div className="chibi-container max-w-sm w-full p-8 text-center animate-pop-in relative z-10 shadow-2xl">
                <div className="flex justify-center mb-6 animate-bounce-soft">
                    <svg width="64" height="64" viewBox="0 0 120 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Cup */}
                        <path d="M20 30 L30 130 C32 140 38 145 50 145 L70 145 C82 145 88 140 90 130 L100 30 Z" fill="#FFF4E6" stroke="#5C4033" strokeWidth="6" strokeLinejoin="round" />
                        {/* Liquid */}
                        <path d="M25 50 L28 125 C30 135 35 140 50 140 L70 140 C85 140 90 135 92 125 L95 50 C80 55 60 45 40 55 C30 58 25 50 25 50 Z" fill="#A4C639" />
                        {/* Pearls */}
                        <circle cx="45" cy="130" r="8" fill="#5C4033" />
                        <circle cx="70" cy="125" r="9" fill="#5C4033" />
                        <circle cx="58" cy="115" r="7" fill="#5C4033" />
                        <circle cx="35" cy="115" r="8" fill="#5C4033" />
                        <circle cx="82" cy="112" r="7" fill="#5C4033" />
                        {/* Straw */}
                        <path d="M85 10 L60 140" stroke="#5C4033" strokeWidth="8" strokeLinecap="round" />
                        {/* Lid */}
                        <path d="M15 30 C15 15 105 15 105 30 Z" fill="#FFF4E6" stroke="#5C4033" strokeWidth="6" strokeLinejoin="round" />
                    </svg>
                </div>

                <h2 className="font-serif text-3xl font-bold text-[var(--color-boba)] mb-2 leading-tight">
                    Vibe successfully dropped!
                </h2>

                <p className="text-[var(--color-boba-light)] text-sm mb-6 mt-4">
                    The Connoisseur AI is evaluating your answers alongside everyone else.
                </p>

                <div className="bg-[#e8f5e9] p-4 rounded-2xl border border-[#c5e1a5]">
                    <p className="text-sm font-bold text-[var(--color-matcha-dark)]">
                        Check your email at exactly 12:00 PM for your match's IG. 🍵
                    </p>
                </div>
            </div>
        </main>
    );
}
