"use client";
// @ts-nocheck
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StickerBobaCup, StickerMatchaLeaf, StickerBobaPearls, StickerHeart } from "@/components/Stickers";

export default function Home() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [gender, setGender] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLearnMore, setShowLearnMore] = useState(false);

  useEffect(() => {
    async function fetchQuestion() {
      try {
        const res = await fetch("/api/question");
        const data = await res.json();
        const qText = data.question?.question_text || data.question || "";
        setQuestion(qText);
      } catch (err) {
        setQuestion("What's your go-to boba order and what does it say about you as a partner? 🧋");
      }
    }
    fetchQuestion();
  }, []);

  const handleSubmitAnswer = () => {
    if (!answer.trim()) return;
    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !instagram || !gender) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/drop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, instagram, gender, answer }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      router.push("/success");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-x-hidden selection:bg-[var(--color-matcha)] selection:text-white pb-20">
      <div className="noise-overlay" />

      {/* ── BACKGROUND STICKERS ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-20 lg:opacity-40">
        <StickerBobaCup size={280} className="absolute -top-20 -left-20 rotate-[15deg] animate-bounce-soft" />
        <StickerMatchaLeaf size={180} className="absolute top-[40%] -right-10 rotate-[-15deg] animate-bounce-soft" style={{ animationDelay: "1s" }} />
        <StickerBobaPearls size={120} className="absolute bottom-[10%] left-[5%] rotate-[25deg] animate-bounce-soft" style={{ animationDelay: "2s" }} />
        <StickerHeart size={100} className="absolute top-[10%] right-[15%] rotate-[-10deg] animate-pulse" />
      </div>

      {/* ── HEADER ── */}
      <nav className="relative z-50 w-full px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StickerBobaCup size={40} />
          <span className="text-2xl font-bold tracking-tight text-[#5C4033]">bobamatcha</span>
        </div>
        <button
          onClick={() => setShowLearnMore(!showLearnMore)}
          className="neubrutalism-button px-6 py-2.5 text-sm"
        >
          {showLearnMore ? "Close Info" : "Learn More"}
        </button>
      </nav>

      {/* ── HERO / POLAROID SECTION ── */}
      <section className="relative z-10 flex flex-col items-center justify-center pt-10 pb-20 px-6 w-full">
        <div className="w-full max-w-[450px] mx-auto flex flex-col items-stretch">
          {/* Title */}
          <div className="text-center mb-10 animate-pop-in" style={{ animationDelay: "0.2s" }}>
            <h1 className="text-6xl md:text-7xl lg:text-8xl leading-[0.8] tracking-tighter text-[#5C4033]" style={{ fontFamily: "var(--font-marker)" }}>
              Get Your Boba<br />
              <span className="font-bold">
                <span className="text-[var(--color-matcha)]">Match</span>a
              </span>
            </h1>
            <p className="mt-6 text-lg font-bold text-[#5C4033]/60 leading-relaxed px-4">
              The exclusive 12 PM daily drop for <span className="text-[var(--color-matcha)]">ABGs and ABBs</span>. One question, one IG handle.
            </p>
          </div>

          {/* The Polaroid Card */}
          <div className="neubrutalism-card w-full bg-white p-8 md:p-10 relative animate-pop-in" style={{ animationDelay: "0.4s" }}>
            <div className="absolute -top-6 -right-6 rotate-[15deg] z-20">
              <StickerHeart size={60} />
            </div>

            {/* Countdown Wrapper */}
            <div className="flex flex-col items-center mb-8 pb-8 border-b-4 border-[#5C4033]/10 border-dashed">
              <NoonCountdown />
              <p className="text-[#5C4033]/60 text-[10px] mt-4 font-bold uppercase tracking-[0.2em]">Next Match Drop: Today at 12:00 PM</p>
            </div>

            {/* Step 1: Answer Today */}
            {step === 1 ? (
              <div className="animate-pop-in">
                <div className="flex items-center gap-3 mb-6">
                  <span className="neubrutalism-button w-10 h-10 rounded-full bg-[var(--color-matcha)] text-white shadow-none border-2 text-sm">1</span>
                  <h2 className="text-xl font-extrabold uppercase tracking-tight">Daily Question</h2>
                </div>

                <div className="p-5 bg-[#E8F5E9]/50 rounded-[1.5rem] border-2 border-[#5C4033]/10 mb-6">
                  <p className="text-lg font-bold leading-snug italic text-[var(--color-matcha)]">&ldquo;{question}&rdquo;</p>
                </div>

                <textarea
                  placeholder="Drop your answer..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="neubrutalism-input min-h-[100px] mb-6 text-base"
                />

                <button
                  onClick={handleSubmitAnswer}
                  disabled={!answer.trim()}
                  className="matcha-button w-full py-4 text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  NEXT ➔
                </button>
              </div>
            ) : (
              /* Step 2: Final Details */
              <form onSubmit={handleFinalSubmit} className="animate-pop-in">
                <div className="flex items-center gap-3 mb-6">
                  <button type="button" onClick={() => setStep(1)} className="text-[#5C4033]/40 hover:text-[#5C4033] transition-colors font-bold text-sm">← Back</button>
                  <div className="flex items-center gap-3">
                    <span className="neubrutalism-button w-10 h-10 rounded-full bg-[var(--color-matcha)] text-white shadow-none border-2 text-sm">2</span>
                    <h2 className="text-xl font-extrabold uppercase tracking-tight">Details</h2>
                  </div>
                </div>

                {error && <p className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-600 rounded-2xl text-xs font-bold leading-tight">{error}</p>}

                <div className="space-y-4">
                  <input
                    placeholder="Your Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="neubrutalism-input py-3"
                    required
                  />
                  <input
                    placeholder="Instagram Handle (e.g. @bobalover)"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="neubrutalism-input py-3"
                    required
                  />

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setGender('female')}
                      className={`flex-1 py-3 neubrutalism-button border-4 text-sm ${gender === 'female' ? 'bg-[var(--color-matcha)] text-white border-[#5C4033]' : 'bg-white opacity-60'}`}
                    >👸 ABG</button>
                    <button
                      type="button"
                      onClick={() => setGender('male')}
                      className={`flex-1 py-3 neubrutalism-button border-4 text-sm ${gender === 'male' ? 'bg-[var(--color-matcha)] text-white border-[#5C4033]' : 'bg-white opacity-60'}`}
                    >🧋 ABB</button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="matcha-button w-full py-4 text-xl mt-8"
                >
                  {loading ? "Matching..." : "Join Drop ✨"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── LEARN MORE / CONDITIONAL SECTIONS ── */}
      {showLearnMore && (
        <div className="relative z-20 px-6 max-w-5xl mx-auto space-y-24 animate-pop-in">

          {/* How It Works */}
          <div className="neubrutalism-card bg-white p-12">
            <h2 className="text-4xl font-bold text-center mb-12">how it works</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { num: "01", icon: <StickerHeart size={40} />, title: "The Daily Question", desc: "Every day at noon, we drop a fresh question. Answer it to join the pool." },
                { num: "02", icon: <StickerBobaCup size={40} />, title: "AI Matchmaking", desc: "Our Gemini AI reads every answer to find your cultural counterpart." },
                { num: "03", icon: <StickerMatchaLeaf size={40} />, title: "The Noon Drop", desc: "At exactly 12:00 PM PST, matches are sent directly to your inbox." },
                { num: "04", icon: <StickerBobaPearls size={40} />, title: "Slide into DMs", desc: "You get their IG handle. The rest of the vibe check is on you." },
              ].map((step) => (
                <div key={step.num} className="flex gap-5 p-6 bg-[#E8F5E9]/30 rounded-3xl border-2 border-[#5C4033]/5">
                  <div className="shrink-0">{step.icon}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{step.title}</h3>
                    <p className="text-[#5C4033]/60 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial Placeholder Card */}
          <div className="neubrutalism-card bg-[#5C4033] text-white p-12 text-center">
            <StickerHeart size={80} className="mx-auto mb-6 opacity-30" />
            <h2 className="text-3xl font-bold mb-4">4,200+ matches made</h2>
            <p className="text-white/60 mb-8 italic">&ldquo;Way better than Hinge. The AI actually gets the boba culture vibe.&rdquo;</p>
            <div className="flex justify-center gap-2">
              <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-white/10" />
              <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-white/10" />
              <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-white/10" />
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer className="relative z-10 py-12 px-8 text-center text-[#5C4033]/40 text-sm font-bold">
        <div className="flex items-center justify-center gap-3 mb-4">
          <StickerBobaCup size={30} />
          <span className="font-bold">bobamatcha</span>
        </div>
        <p>&copy; 2026 BobaMatcha — Keep it 🧋</p>
      </footer>
    </main>
  );
}

/* ── NOON COUNTDOWN ── */
function NoonCountdown() {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setMounted(true);
    // Move all date logic into the effect to be 100% client-side
    const getNextNoon = () => {
      const now = new Date();
      const noon = new Date(now);
      noon.setHours(12, 0, 0, 0);
      if (noon <= now) noon.setDate(noon.getDate() + 1);
      return noon;
    };

    const target = getNextNoon();
    const tick = () => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      if (diff <= 0) return;
      setTimeLeft({
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="inline-flex items-center gap-6 opacity-0">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-6xl md:text-7xl font-bold tracking-tighter" style={{ fontFamily: "var(--font-marker)" }}>00</div>
          </div>
        </div>
      </div>
    );
  }

  const pad = (n: number) => n.toString().padStart(2, "0");
  const display = [
    { val: pad(timeLeft.hours), label: "hrs" },
    { val: pad(timeLeft.minutes), label: "min" },
    { val: pad(timeLeft.seconds), label: "sec" },
  ];

  return (
    <div className="inline-flex items-center gap-6">
      {display.map((t, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-6xl md:text-7xl font-bold tracking-tighter" style={{ fontFamily: "var(--font-marker)" }}>
              {t.val}
            </div>
            <div className="text-[12px] font-bold uppercase tracking-widest text-[#5C4033]/40">{t.label}</div>
          </div>
          {i < 2 && <span className="text-4xl font-bold text-[#5C4033]/20">:</span>}
        </div>
      ))}
    </div>
  );
}
