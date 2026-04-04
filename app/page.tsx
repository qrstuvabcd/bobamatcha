"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { StickerBobaCup, StickerMatchaLeaf, StickerBobaPearls, StickerHeart } from "@/components/Stickers";

export default function Home() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [questionId, setQuestionId] = useState("");
  const [answer, setAnswer] = useState("");
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [gender, setGender] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchQuestion() {
      try {
        const res = await fetch("/api/question");
        const data = await res.json();
        const qText = data.question?.question_text || data.question || "What's your go-to boba order and what does it say about you as a partner? 🧋";
        const qId = data.question?.id || null;
        setQuestion(qText);
        setQuestionId(qId);
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
      // Pass the questionId now!
      const bodyPayload = { email, instagram, gender, answer, questionId };
      const res = await fetch("/api/drop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
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
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#E8F5E9] selection:bg-[var(--color-matcha)] selection:text-white relative overflow-hidden">
      
      {/* ── BACKGROUND STICKERS ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-20 lg:opacity-30">
        <StickerBobaCup size={280} className="absolute -top-10 -left-10 rotate-[15deg] animate-bounce-soft" />
        <StickerMatchaLeaf size={180} className="absolute top-[40%] -right-10 rotate-[-15deg] animate-bounce-soft" style={{ animationDelay: "1s" }} />
        <StickerBobaPearls size={120} className="absolute bottom-[5%] left-[5%] rotate-[25deg] animate-bounce-soft" style={{ animationDelay: "2s" }} />
        <StickerHeart size={100} className="absolute top-[10%] right-[10%] rotate-[-10deg] animate-pulse" />
      </div>

      <div className="w-full max-w-3xl mx-auto space-y-6 animate-pop-in relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl md:text-6xl font-black text-[#5C4033] tracking-tight leading-none" style={{ fontFamily: "var(--font-marker)" }}>
            Get Your Boba<span className="text-[#A4C639]">Match</span>a
          </h1>
          <p className="text-xl font-bold text-[#5C4033] leading-snug">
            The AI dating match for ABGs and ABBs at 12PM.
          </p>
        </div>

        {/* The Daily Drop Card */}
        <div className="max-w-[420px] mx-auto bg-[#FDFBF7] border-4 border-[#5C4033] rounded-[2rem] shadow-[6px_6px_0px_#5C4033] p-8 flex flex-col gap-6 relative">
          <div className="absolute -top-5 -right-5 rotate-[15deg] z-20">
             <StickerBobaCup size={60} />
          </div>

          {/* Timer Badge */}
          <div className="text-center">
            <div className="inline-block bg-[#E8F5E9] border-2 border-[#5C4033] rounded-full px-8 py-3 shadow-[3px_3px_0px_#5C4033] text-6xl font-black text-[#5C4033]">
              Next Drop: <NoonCountdown />
            </div>
          </div>

          {/* Form Step Content */}
          {step === 1 ? (
            <div className="flex flex-col gap-5 animate-pop-in">
              <h2 className="text-2xl font-black text-[#5C4033] leading-tight text-center">
                “{question}”
              </h2>
              
              <input
                placeholder="Drop your answer..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full p-3 rounded-xl border-2 border-[#5C4033] bg-white text-lg font-medium focus:outline-none focus:border-[#A4C639]"
              />

              <button
                onClick={handleSubmitAnswer}
                disabled={!answer.trim()}
                className="w-full py-4 mt-4 mb-4 bg-[#5C4033] text-[#A4C639] text-xl font-black rounded-xl border-4 border-[#5C4033] shadow-[6px_6px_0px_#A4C639] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#A4C639] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                NEXT ➔
              </button>
            </div>
          ) : (
            <form onSubmit={handleFinalSubmit} className="flex flex-col gap-5 animate-pop-in">
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="self-start text-[#5C4033]/50 hover:text-[#5C4033] font-bold text-sm tracking-widest uppercase transition-colors"
               >
                ← Back
              </button>

              {error && (
                <p className="p-3 bg-red-50 border-2 border-red-200 text-red-600 rounded-xl text-sm font-bold text-center">
                  {error}
                </p>
              )}

              <input
                placeholder="Your Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 rounded-xl border-2 border-[#5C4033] bg-white text-lg font-medium focus:outline-none focus:border-[#A4C639]"
                required
              />
              <input
                placeholder="Instagram Handle (e.g. @bobalover)"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full p-4 rounded-xl border-2 border-[#5C4033] bg-white text-lg font-medium focus:outline-none focus:border-[#A4C639]"
                required
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`flex-1 p-3 font-bold border-2 rounded-xl text-sm transition-all focus:outline-none ${gender === 'female' ? 'bg-[#A4C639] text-white border-[#5C4033]' : 'bg-white text-[#5C4033] border-[#5C4033]/30'}`}
                >🤴 ABG</button>
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`flex-1 p-3 font-bold border-2 rounded-xl text-sm transition-all focus:outline-none ${gender === 'male' ? 'bg-[#A4C639] text-white border-[#5C4033]' : 'bg-white text-[#5C4033] border-[#5C4033]/30'}`}
                >🧋 ABB</button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-6 mb-2 bg-[#5C4033] text-[#A4C639] text-xl font-black rounded-xl border-4 border-[#5C4033] shadow-[6px_6px_0px_#A4C639] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#A4C639] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Matching..." : "Join Drop ✨"}
              </button>
            </form>
          )}
        </div>

        {/* Footer Link */}
        <div className="text-center pt-2">
          <Link href="/about" className="text-sm font-bold text-[#5C4033] underline hover:text-[#5C4033]/70 transition-colors">
            Wait, how does the 12 PM drop work?
          </Link>
        </div>

      </div>
    </main>
  );
}

/* ── NOON COUNTDOWN ── */
function NoonCountdown() {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setMounted(true);
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
    return <span>00:00:00</span>;
  }

  const pad = (n: number) => n.toString().padStart(2, "0");
  const timeString = `${pad(timeLeft.hours)}:${pad(timeLeft.minutes)}:${pad(timeLeft.seconds)}`;

  return <span>{timeString}</span>;
}
