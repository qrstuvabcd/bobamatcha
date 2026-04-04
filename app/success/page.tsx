export default function Success() {
    return (
        <main className="min-h-screen bg-[var(--color-dark)] text-white overflow-hidden relative flex items-center justify-center">
            {/* NOISE OVERLAY */}
            <div className="noise-overlay" />

            {/* AMBIENT GLOW */}
            <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[var(--color-matcha)] opacity-[0.04] blur-[120px] pointer-events-none" />

            <div className="relative z-10 text-center flex flex-col items-center max-w-lg px-6 animate-fade-in">

                {/* Boba Sticker */}
                <div className="mb-6 animate-[bounce-soft_3s_ease-in-out_infinite]">
                    <svg width={80} height={80} viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
                        <rect x="44" y="4" width="5" height="28" rx="2.5" fill="#7cb342" transform="rotate(6 46 18)" />
                        <circle cx="46" cy="5" r="4" fill="#7cb342" opacity="0.6" />
                        <path d="M18 22 C18 19 22 17 40 17 C58 17 62 19 62 22 C62 25 58 27 40 27 C22 27 18 25 18 22Z" fill="#2a2a4a" stroke="#7cb342" strokeWidth="2" strokeLinejoin="round" />
                        <path d="M20 27 C20 27 21 60 23 65 C25 68 35 70 40 70 C45 70 55 68 57 65 C59 60 60 27 60 27" fill="#1e1e3a" stroke="#7cb342" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                        <path d="M22 35 C26 32 32 38 40 35 C48 32 54 38 58 35 L57 60 C56 64 48 67 40 67 C32 67 24 64 23 60 Z" fill="#7cb342" opacity="0.25" />
                        <circle cx="30" cy="58" r="4" fill="#6b4226" stroke="#4a2c17" strokeWidth="1" />
                        <circle cx="40" cy="62" r="4" fill="#6b4226" stroke="#4a2c17" strokeWidth="1" />
                        <circle cx="50" cy="58" r="3.5" fill="#6b4226" stroke="#4a2c17" strokeWidth="1" />
                        <circle cx="33" cy="42" r="2.5" fill="white" />
                        <circle cx="47" cy="42" r="2.5" fill="white" />
                        <circle cx="34" cy="42" r="1" fill="#1a1a2e" />
                        <circle cx="48" cy="42" r="1" fill="#1a1a2e" />
                        <ellipse cx="28" cy="46" rx="4" ry="2.5" fill="#7cb342" opacity="0.3" />
                        <ellipse cx="52" cy="46" rx="4" ry="2.5" fill="#7cb342" opacity="0.3" />
                        <path d="M36 47 C38 50 42 50 44 47" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </div>

                {/* Handwritten accent */}
                <div
                    className="text-[var(--color-matcha)] text-3xl transform rotate-[-6deg] mb-2"
                    style={{ fontFamily: "var(--font-marker)" }}
                >
                    you&apos;re in!
                </div>

                <h1 className="font-serif text-5xl md:text-7xl font-medium tracking-tighter drop-shadow-lg leading-none mb-6">
                    check your<br /><span className="italic text-[var(--color-matcha)]">email</span>
                </h1>

                <p className="text-white/40 font-medium md:text-lg mb-12">
                    Your daily match will be dropped into your inbox today at <span className="text-[var(--color-matcha)] font-bold">12:00 PM</span>.
                </p>

                <a
                    href="/"
                    className="text-sm font-medium border border-white/15 rounded-full px-8 py-3 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all"
                >
                    Return Home
                </a>
            </div>
        </main>
    );
}
