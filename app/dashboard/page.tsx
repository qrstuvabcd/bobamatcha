"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [match, setMatch] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem("bobamatcha_user");
        if (!stored) {
            router.push("/signup");
            return;
        }
        const u = JSON.parse(stored);
        setUser(u);

        async function loadMatch() {
            try {
                const res = await fetch(`/api/match?userId=${u.id}`);
                const data = await res.json();
                if (data.match) setMatch(data.match);
            } catch (err) {
                console.error("Match error:", err);
            } finally {
                setLoading(false);
            }
        }
        loadMatch();
    }, [router]);

    if (loading) {
        return (
            <main className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center">
                <div className="text-center animate-bounce-soft">
                    <div className="text-5xl mb-4">🧋</div>
                    <p className="text-[var(--color-boba-light)] font-serif">Checking the list...</p>
                </div>
            </main>
        );
    }

    // State 1: Waitlisted
    if (user?.status === "waitlisted") {
        return (
            <main className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center p-4 overflow-hidden relative">
                <div className="absolute top-10 left-10 text-4xl animate-sway opacity-30">✋</div>
                <div className="chibi-container max-w-md w-full p-8 text-center animate-pop-in">
                    <div className="text-5xl mb-4">🚪</div>
                    <h2 className="font-serif text-3xl font-bold text-[var(--color-boba)] mb-2">Waitlisted.</h2>
                    <p className="text-[var(--color-boba-light)] text-sm mb-6">
                        The Connoisseur flagged your vibe as a bit too "normie". The Private Club is currently full for your demographic.
                    </p>
                    <div className="bg-[var(--color-cream-dark)] rounded-2xl p-4 border-2 border-[var(--color-boba-light)]/20">
                        <p className="text-xs text-[var(--color-boba)] font-bold">Try applying again next season.</p>
                    </div>
                </div>
            </main>
        );
    }

    // State 2: Matched!
    if (match) {
        return (
            <main className="min-h-screen bg-[var(--color-matcha-pale)] flex items-center justify-center p-4 overflow-hidden relative">
                <div className="chibi-container max-w-md w-full p-8 text-center animate-pop-in shadow-2xl relative" style={{ borderColor: 'var(--color-matcha)' }}>
                    {/* Confetti element */}
                    <div className="absolute -top-6 -right-6 text-5xl animate-wiggle">🎉</div>

                    <h2 className="font-serif text-3xl font-bold text-[var(--color-matcha)] mb-1">It's a Matcha!</h2>
                    <p className="text-[var(--color-boba)] font-bold mb-6">Match Chemistry: {match.hang_the_dj_score}%</p>

                    {/* Core Info */}
                    <div className="bg-white rounded-3xl p-6 border-2 border-[var(--color-matcha)] shadow-sm mb-6">
                        <p className="text-sm text-[var(--color-boba-light)] mb-1">you are matching with</p>
                        <h3 className="font-serif text-4xl text-[var(--color-boba)] font-bold mb-4">{match.partner.name}</h3>

                        <div className="flex flex-col gap-3 text-left">
                            <div className="bg-[var(--color-cream)] rounded-xl p-3 border-2 border-[var(--color-cream-dark)]">
                                <span className="text-[10px] uppercase font-bold text-[var(--color-matcha)] tracking-wider">Their Go-To Order</span>
                                <p className="font-bold text-[var(--color-boba)] text-sm mt-0.5">{match.partner.favorite_order}</p>
                            </div>
                            <div className="bg-[#f3e5f5] rounded-xl p-3 border-2 border-[#e1bee7]">
                                <span className="text-[10px] uppercase font-bold text-[#8e24aa] tracking-wider">The Connoisseur's Notes</span>
                                <p className="font-bold text-[#4a148c] text-sm italic mt-0.5">"{match.reasoning}"</p>
                            </div>
                        </div>
                    </div>

                    {/* Venue & Secret Code */}
                    <div className="bg-[var(--color-boba)] text-white rounded-3xl p-6 shadow-inner relative overflow-hidden mb-6">
                        <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🔒</div>
                        <div className="mb-4">
                            <span className="block text-[10px] uppercase tracking-widest text-[#d7ccc8] mb-1">Meeting Spot</span>
                            <p className="font-bold text-lg">{match.venue_name}</p>
                            <a href={match.maps_link} target="_blank" rel="noopener noreferrer" className="text-xs text-[#ffcc80] hover:underline">
                                Open in Maps →
                            </a>
                        </div>

                        <div className="border-t border-[#8d6e63] pt-4 mt-4">
                            <span className="block text-[10px] uppercase tracking-widest text-[#d7ccc8] mb-2">Verification Code</span>
                            <div className="bg-[#3e2723] rounded-xl py-3 px-4 flex justify-center gap-3">
                                {match.secret_code.split('').map((digit: string, i: number) => (
                                    <span key={i} className="text-3xl font-bold font-mono text-[var(--color-matcha)] bg-black/20 rounded-lg w-10 h-14 flex items-center justify-center">
                                        {digit}
                                    </span>
                                ))}
                            </div>
                            <p className="text-[9px] text-[#bcaaa4] mt-2">The Bouncer requires this code to verify identity IRL.</p>
                        </div>
                    </div>

                    {match.partner.instagram && (
                        <a
                            href={`https://instagram.com/${match.partner.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="chibi-button w-full block"
                        >📸 STALK IG: @{match.partner.instagram.replace('@', '')}</a>
                    )}
                </div>
            </main>
        );
    }

    // State 3: Pending Drop
    return (
        <main className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center p-4 overflow-hidden relative">
            <div className="absolute top-20 right-20 text-4xl animate-sway opacity-30">✨</div>
            <div className="absolute bottom-20 left-20 text-5xl animate-bounce-soft opacity-30">🧋</div>

            <div className="chibi-container max-w-sm w-full p-8 text-center animate-pop-in relative z-10">
                <h2 className="font-serif text-2xl font-bold text-[var(--color-boba)] mb-6">Welcome to the Club.</h2>

                <div className="bg-[var(--color-cream-dark)] rounded-3xl p-6 border-2 border-[var(--color-boba-light)]/20 mb-6">
                    <p className="text-[10px] font-bold text-[var(--color-boba-light)] uppercase tracking-widest mb-3">Next Match Drop</p>
                    <NoonCountdown />
                </div>

                <p className="text-sm text-[var(--color-boba-light)] font-medium">
                    The Connoisseur is evaluating profiles. Check back at 12:00 PM.
                </p>
            </div>
        </main>
    );
}

// Re-using the Countdown component logic, matching Kawaii design
function NoonCountdown() {
    const [mounted, setMounted] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        setMounted(true);
        function getNextNoon() {
            const now = new Date();
            const noon = new Date(now);
            noon.setHours(12, 0, 0, 0);
            if (noon <= now) noon.setDate(noon.getDate() + 1);
            return noon;
        }
        const target = getNextNoon();

        function tick() {
            const now = new Date();
            const diff = target.getTime() - now.getTime();
            if (diff <= 0) return;
            setTimeLeft({
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / (1000 * 60)) % 60),
                seconds: Math.floor((diff / 1000) % 60),
            });
        }

        tick();
        const timer = setInterval(tick, 1000);
        return () => clearInterval(timer);
    }, []);

    const pad = (n: number) => n.toString().padStart(2, "0");

    const display = mounted
        ? [pad(timeLeft.hours), pad(timeLeft.minutes), pad(timeLeft.seconds)]
        : ["--", "--", "--"];

    return (
        <div className="flex justify-center items-center gap-2">
            {display.map((num, i) => (
                <div key={i} className="flex items-center gap-2">
                    <div className="bg-white border-2 border-[var(--color-boba)] rounded-xl w-14 h-16 flex items-center justify-center text-2xl font-black font-serif text-[var(--color-boba)] shadow-[0_4px_0_var(--color-boba)]">
                        {num}
                    </div>
                    {i < 2 && <span className="text-xl font-black text-[var(--color-boba-light)]">:</span>}
                </div>
            ))}
        </div>
    );
}
