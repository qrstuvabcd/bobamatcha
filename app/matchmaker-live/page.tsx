"use client";
import { useEffect, useState } from "react";
import { StickerBobaCup, StickerHeart } from "@/components/Stickers";

export default function MatchmakerLive() {
    const [drops, setDrops] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [simulating, setSimulating] = useState(false);
    const [simResults, setSimResults] = useState<any>(null);
    const [period, setPeriod] = useState("");

    const fetchDrops = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/drops");
            const data = await res.json();
            if (data.drops) {
                setDrops(data.drops);
                setPeriod(data.period);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const runSimulation = async () => {
        setSimulating(true);
        try {
            const res = await fetch("/api/admin/simulate", { method: "POST" });
            const data = await res.json();
            setSimResults(data);
        } catch (err) {
            console.error(err);
        } finally {
            setSimulating(false);
        }
    };

    useEffect(() => {
        fetchDrops();
    }, []);

    return (
        <main className="min-h-screen bg-[var(--color-dark)] text-[#3d2b1f] overflow-hidden relative p-6 md:p-12">
            <div className="noise-overlay" />

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <StickerBobaCup size={40} />
                            <h1 className="font-serif text-4xl font-bold">Matchmaker Live</h1>
                        </div>
                        <p className="text-[#3d2b1f]/60 text-sm">Monitoring daily drops for period: <span className="font-bold">{period}</span></p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={fetchDrops}
                            className="text-sm font-bold border border-[#3d2b1f]/20 rounded-full px-6 py-2.5 bg-white/30 backdrop-blur-md hover:bg-white/50 transition-all"
                        >
                            🔄 Refresh Drops
                        </button>
                        <button
                            onClick={runSimulation}
                            disabled={simulating || drops.length < 2}
                            className="matcha-button px-6 py-2.5 text-sm"
                        >
                            {simulating ? "🤖 Simulating..." : "🚀 Simulate Matching"}
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* LEFT: Participant Feed */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-serif text-2xl font-medium">Participant Feed ({drops.length})</h2>
                        </div>

                        {loading ? (
                            <div className="glass-card p-12 text-center text-[#3d2b1f]/40 italic">Loading drops...</div>
                        ) : drops.length === 0 ? (
                            <div className="glass-card p-12 text-center text-[#3d2b1f]/40 italic">No drops yet for this period.</div>
                        ) : (
                            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                                {drops.map((drop) => (
                                    <div key={drop.id} className="glass-card p-5 hover:bg-white/40 transition-all border-l-4" style={{ borderColor: drop.users.gender === 'female' ? '#7cb342' : '#3d2b1f' }}>
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <div className="font-bold text-sm">@{drop.users.instagram}</div>
                                                <div className="text-[10px] text-[#3d2b1f]/40 truncate max-w-[200px]">{drop.users.email}</div>
                                            </div>
                                            <div className="text-[10px] font-bold uppercase py-1 px-2 rounded-full bg-white/50 border border-[#3d2b1f]/10">
                                                {drop.users.gender === 'female' ? '👸 ABG' : '🧋 ABB'}
                                            </div>
                                        </div>
                                        <div className="text-sm italic leading-relaxed bg-[#3d2b1f]/5 p-3 rounded-xl border border-[#3d2b1f]/5">
                                            &ldquo;{drop.answer_text}&rdquo;
                                        </div>
                                        <div className="text-[9px] text-[#3d2b1f]/30 mt-3 text-right">
                                            Dropped at {new Date(drop.created_at).toLocaleTimeString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT: AI Console */}
                    <div className="space-y-6">
                        <h2 className="font-serif text-2xl font-medium">AI Simulation Console</h2>

                        {!simResults ? (
                            <div className="glass-card p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                                <div className="text-4xl mb-4">🧠</div>
                                <p className="text-[#3d2b1f]/40 max-w-sm mx-auto">
                                    Click context <b>Simulate Matching</b> to see how Gemini pairs current participants based on their answers.
                                </p>
                            </div>
                        ) : (
                            <div className="glass-card p-8 space-y-8 animate-pop-in border-2 border-[var(--color-matcha)]/30">
                                <div className="p-4 bg-[var(--color-matcha)]/10 rounded-2xl border border-[var(--color-matcha)]/20">
                                    <div className="text-[10px] font-bold text-[var(--color-matcha)] uppercase tracking-widest mb-1">Today's Question</div>
                                    <div className="font-serif text-lg leading-snug">&ldquo;{simResults.questionContext}&rdquo;</div>
                                </div>

                                {simResults.simulatedPairs && simResults.simulatedPairs.length > 0 ? (
                                    <div className="space-y-6">
                                        <div className="text-[10px] font-bold text-[#3d2b1f]/40 uppercase tracking-widest">Generated Pairs ({simResults.simulatedPairs.length})</div>
                                        {simResults.simulatedPairs.map((pair: any, i: number) => (
                                            <div key={i} className="space-y-3 p-5 bg-white/40 rounded-2xl border border-[#3d2b1f]/10 shadow-sm">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-center">
                                                            <div className="text-xs font-bold text-[#3d2b1f]">@{pair.maleName}</div>
                                                            <div className="text-[8px] text-[#3d2b1f]/40">ABB</div>
                                                        </div>
                                                        <div className="text-xl">❤️</div>
                                                        <div className="text-center">
                                                            <div className="text-xs font-bold text-[var(--color-matcha)]">@{pair.femaleName}</div>
                                                            <div className="text-[8px] text-[var(--color-matcha)]/60">ABG</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-[10px] font-bold text-[var(--color-matcha)] px-2 py-1 bg-[var(--color-matcha)]/10 rounded-lg">Match!</div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3 mb-2">
                                                    <div className="bg-[#3d2b1f]/5 p-2 rounded-lg text-[9px] italic border border-[#3d2b1f]/5">&ldquo;{pair.maleAnswer}&rdquo;</div>
                                                    <div className="bg-[#7cb342]/5 p-2 rounded-lg text-[9px] italic border border-[#7cb342]/5">&ldquo;{pair.femaleAnswer}&rdquo;</div>
                                                </div>

                                                <div className="p-3 bg-white/60 rounded-xl text-xs leading-relaxed border-l-4 border-[var(--color-matcha)] shadow-inner">
                                                    <span className="font-bold text-[var(--color-matcha)]">Gemini: </span>
                                                    {pair.reasoning}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-12 text-center text-[#3d2b1f]/40 italic bg-white/20 rounded-2xl border border-dashed border-[#3d2b1f]/10">
                                        {simResults.message || "No pairs could be generated."}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(61, 43, 31, 0.1); border-radius: 99px; }
            `}</style>
        </main>
    );
}
