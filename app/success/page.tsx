export default function Success() {
    return (
        <main className="min-h-screen bg-[var(--color-ditto-dark)] text-white overflow-hidden relative flex items-center justify-center">
            {/* GLOBAL NOISE */}
            <div className="noise-overlay" />

            <div className="absolute top-0 right-0 w-full h-[600px] bg-gradient-to-b from-[#181825] to-[var(--color-ditto-dark)] pointer-events-none z-0 opacity-50 blur-[100px]" />

            <div className="relative z-10 text-center flex flex-col items-center max-w-lg px-6 animate-fade-in">

                <div className="font-[var(--font-marker)] text-[var(--color-ditto-pink)] text-4xl transform rotate-[-8deg] mb-2">
                    you're in.
                </div>

                <h1 className="font-serif text-6xl md:text-8xl font-medium tracking-tighter drop-shadow-lg leading-none mb-6">
                    check your email
                </h1>

                <p className="text-gray-400 font-medium md:text-lg mb-12">
                    Your daily match will be dropped into your inbox today exactly at 12:00 PM.
                </p>

                <a
                    href="/"
                    className="border text-sm font-medium border-white/20 rounded-full px-8 py-3 ditto-glass hover:bg-white/10 transition-colors"
                >
                    Return Home
                </a>
            </div>
        </main>
    );
}
