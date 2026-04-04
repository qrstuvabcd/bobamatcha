"use client";
// @ts-nocheck
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [question, setQuestion] = useState<string>("Loading today's question...");
  const [questionId, setQuestionId] = useState<string>("");

  const [answer, setAnswer] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [gender, setGender] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchQ() {
      try {
        const res = await fetch("/api/question");
        const data = await res.json();
        if (res.ok && data.question) {
          setQuestion(data.question.question_text);
          setQuestionId(data.question.id);
        } else {
          throw new Error("Missing question");
        }
      } catch (err) {
        setQuestion("What's your ultimate boba order and late night spot?");
        setQuestionId("fallback-id");
      }
    }
    fetchQ();
  }, []);

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;
    setShowModal(true);
  };

  const handleFinalSubmit = async () => {
    if (!email || !instagram || !gender) {
      setError("We need these 3 things to make the match! 🧋");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/drop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, instagram, gender, answer, questionId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      router.push("/success");
    } catch (err: any) {
      setError(err.message || "Failed to drop answer!");
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-dark)] text-white overflow-hidden relative">
      {/* NOISE OVERLAY */}
      <div className="noise-overlay" />

      {/* AMBIENT GLOW */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[#7cb342] opacity-[0.04] blur-[120px] pointer-events-none" />

      {/* ── NAV ── */}
      <nav className="fixed top-0 inset-x-0 z-40 py-5 px-6 md:px-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StickerBobaCup size={36} />
            <span className="text-xl font-bold tracking-tight text-[#3d2b1f]" style={{ fontFamily: "var(--font-serif)" }}>
              bobamatcha
            </span>
          </div>
          <div className="flex gap-3 items-center">
            <a href="#question" className="text-sm text-[#3d2b1f]/70 hover:text-[#3d2b1f] font-medium transition-colors hidden sm:block">Answer Today</a>
            <button className="text-sm font-bold border border-[#3d2b1f]/30 rounded-full px-5 py-2.5 bg-[#3d2b1f] text-white hover:bg-[#3d2b1f]/90 transition-all shadow-sm">
              Join Now
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full px-6 pt-20 pb-12">
        <div className="max-w-4xl w-full text-center relative flex flex-col items-center">

          {/* Floating Stickers */}
          <div className="absolute top-8 left-[5%] md:left-[10%] animate-[float_4s_ease-in-out_infinite]" style={{ "--rotate": "-12deg" } as any}>
            <StickerBobaCup size={72} />
          </div>
          <div className="absolute top-16 right-[5%] md:right-[8%] animate-[float_5s_ease-in-out_infinite_0.5s]" style={{ "--rotate": "8deg" } as any}>
            <StickerMatchaLeaf size={56} />
          </div>
          <div className="absolute bottom-[30%] left-[3%] animate-[float_6s_ease-in-out_infinite_1s]" style={{ "--rotate": "-6deg" } as any}>
            <StickerBobaPearls size={48} />
          </div>
          <div className="absolute bottom-[35%] right-[5%] animate-[sway_3s_ease-in-out_infinite]">
            <StickerHeart size={36} />
          </div>

          {/* Handwritten Tagline */}
          <div
            className="text-[var(--color-matcha)] text-3xl md:text-4xl mb-4 animate-fade-in"
            style={{ fontFamily: "var(--font-marker)", animationDelay: "0.1s" }}
          >
            Get your Boba Date with ABG/ABB
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight text-[#3d2b1f] drop-shadow-lg mb-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            get a boba date<br />
            <span className="italic text-[var(--color-matcha)]">every day</span>
          </h1>

          {/* Sub info */}
          <div className="flex flex-col items-center gap-2 mb-10 animate-fade-in" style={{ animationDelay: "0.35s" }}>
            <NoonCountdown />
            <p className="text-[#3d2b1f]/70 text-sm mt-2 font-medium">
              Next Match Drop: Today at 12:00 PM · <span className="text-[var(--color-matcha)] font-bold">4,200+</span> boba lovers joined
            </p>
          </div>

          {/* ── QUESTION CARD ── */}
          <div id="question" className="relative w-full max-w-lg z-30 mb-16 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            {!showModal ? (
              <form onSubmit={handleInitialSubmit} className="glass-card p-8 text-left relative">
                {/* Sticker accent */}
                <div className="absolute -top-6 -right-4 rotate-[12deg]">
                  <StickerBobaCup size={48} />
                </div>

                <h2 className="font-serif text-xl md:text-2xl font-medium mb-5 leading-snug text-[#3d2b1f]">
                  {question}
                </h2>
                <textarea
                  required
                  rows={2}
                  placeholder="Drop your most honest take here..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full glass-input resize-none mb-5 text-sm"
                ></textarea>
                <button type="submit" className="w-full matcha-button text-base">
                  Confirm Answer ✨
                </button>
              </form>
            ) : (
              <div className="glass-card p-8 text-left animate-pop-in relative">
                <div className="absolute -top-5 -right-5 rotate-[-8deg]">
                  <StickerHeart size={40} />
                </div>

                <h3 className="font-serif text-2xl font-medium mb-2">
                  Almost there.
                </h3>
                <p className="text-[#5C4033]/60 text-sm mb-6">We'll email you your match's Instagram handle at 12:00 PM.</p>

                {error && <p className="mb-4 text-xs font-bold text-red-700 bg-red-100 border border-red-200 p-3 rounded-xl">{error}</p>}

                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full glass-input text-sm"
                  />
                  <input
                    type="text"
                    placeholder="@instagram_handle"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="w-full glass-input text-sm"
                  />

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setGender('female')}
                      className={`flex-1 py-3.5 rounded-xl text-sm font-semibold border transition-all ${gender === 'female' ? 'bg-[var(--color-matcha)] border-[var(--color-matcha)] text-white' : 'bg-transparent border-[#5C4033]/20 text-[#5C4033]/50 hover:bg-white/20'}`}
                    >ABG 👸</button>
                    <button
                      type="button"
                      onClick={() => setGender('male')}
                      className={`flex-1 py-3.5 rounded-xl text-sm font-semibold border transition-all ${gender === 'male' ? 'bg-[var(--color-matcha)] border-[var(--color-matcha)] text-white' : 'bg-transparent border-[#5C4033]/20 text-[#5C4033]/50 hover:bg-white/20'}`}
                    >ABB 🧋</button>
                  </div>

                  <button
                    onClick={handleFinalSubmit}
                    disabled={submitting}
                    className="w-full matcha-button py-4 mt-2 text-base"
                  >
                    {submitting ? "Processing..." : "Join the Drop 🧋"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-[var(--color-matcha)] text-2xl mb-2" style={{ fontFamily: "var(--font-marker)" }}>
              super simple
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-medium tracking-tight">
              how it <span className="italic text-[var(--color-matcha)]">works</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-5">
            {[
              { num: "01", icon: "💬", title: "Answer the question", desc: "Every day we ask one fun, flirty question. Answer honestly — it reveals your personality." },
              { num: "02", icon: "🤖", title: "AI does its thing", desc: "At noon, our Gemini AI evaluates every answer and pairs you with someone who vibes." },
              { num: "03", icon: "📧", title: "Check your email", desc: "We email you your match's Instagram handle with a cute reasoning why you'd click." },
              { num: "04", icon: "📸", title: "Slide into DMs", desc: "Follow them, say hi, grab boba together. The rest is on you!" },
            ].map((step) => (
              <div key={step.num} className="glass-card p-6 text-center group hover:bg-white/40 transition-all">
                <div className="text-[var(--color-matcha)] text-xs font-bold mb-3 tracking-widest font-serif">{step.num}</div>
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{step.icon}</div>
                <h3 className="text-sm font-bold text-[#3d2b1f] mb-2">{step.title}</h3>
                <p className="text-[#5C4033]/60 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── YOUR AI MATCHMAKER ── */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-serif text-4xl md:text-5xl font-medium tracking-tight">
              your AI <span className="italic text-[var(--color-matcha)]">matchmaker</span>
            </h2>
            <p className="mt-3 text-[#5C4033]/60 text-sm">powered by magic (and a lot of math) ✨</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: "🧠", title: "Learns your taste", desc: "Not just in boba — in people. The more you interact, the smarter your matches get.", color: "var(--color-matcha)" },
              { icon: "🔍", title: "Scans everyone", desc: "Our AI checks every profile to find the one. Not random — intentional.", color: "var(--color-boba)" },
              { icon: "🎯", title: "One perfect match", desc: "Every day at noon. No swiping. No overwhelm. Just one curated person.", color: "var(--color-matcha)" },
            ].map((item) => (
              <div key={item.title} className="glass-card p-7 text-center hover:bg-white/40 transition-all">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-sm font-bold mb-2" style={{ color: item.color }}>{item.title}</h3>
                <p className="text-[#5C4033]/60 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-4">
            <h2 className="font-serif text-4xl md:text-5xl font-medium tracking-tight">
              real <span className="italic text-[var(--color-matcha)]">boba dates</span>
            </h2>
            <p className="mt-3 text-[#5C4033]/60 text-sm">matches made over matcha ♡</p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-4 mb-12 mt-8">
            {[
              { num: "4,200+", label: "dates" },
              { num: "89%", label: "second dates" },
              { num: "12", label: "cities" },
            ].map((s) => (
              <div key={s.label} className="px-6 py-3 rounded-full border border-[#5C4033]/15 bg-white/30 text-center">
                <span className="font-serif text-lg font-bold text-[var(--color-matcha)]">{s.num}</span>
                <span className="text-xs ml-1.5 text-[#5C4033]/60">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { name: "Jasmine", school: "Edinburgh", quote: "He ordered the exact same oat milk matcha as me. We've been together 3 months now 💚", emoji: "🍵" },
              { name: "Kevin", school: "UCLA", quote: "Way better than Hinge. She was actually cute AND we had stuff to talk about over boba.", emoji: "🧋" },
              { name: "Michelle", school: "NYU", quote: "The AI literally read my mind. He was tall, liked matcha, and had a golden retriever 😭", emoji: "✨" },
              { name: "Daniel", school: "Berkeley", quote: "She showed up in the cutest outfit and we ended up walking around for 3 hours after boba.", emoji: "💕" },
              { name: "Tina", school: "UofT", quote: "I'm literally an ABG and this app gets me. Taro milk tea + cute guy = perfect first date.", emoji: "💜" },
              { name: "Ryan", school: "Edinburgh", quote: "Met at Machi Machi. She ordered brown sugar boba. I knew she was the one right there.", emoji: "🤎" },
            ].map((t, i) => (
              <div key={i} className="glass-card p-5 relative hover:bg-white/40 transition-all">
                <div className="absolute top-3 right-4 text-lg opacity-30">{t.emoji}</div>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-matcha)] flex items-center justify-center text-xs font-bold text-white">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-bold">{t.name}</div>
                    <div className="text-[10px] text-[#5C4033]/40">@{t.school}</div>
                  </div>
                </div>
                <p className="text-sm text-[#5C4033]/70 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative z-10 py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          {/* Sticker accent */}
          <div className="flex justify-center mb-6 animate-[bounce-soft_3s_ease-in-out_infinite]">
            <StickerBobaCup size={80} />
          </div>

          <h2 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-3">
            your boba date is<br />
            <span className="italic text-[var(--color-matcha)]">one answer away</span>
          </h2>

          <p className="text-[#5C4033]/60 text-sm mb-8">
            join 4,200+ boba lovers already matching ♡
          </p>

          <a
            href="#question"
            className="inline-flex items-center gap-3 matcha-button px-10 py-4 text-lg"
          >
            🧋 Answer Today's Question
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 py-10 px-8 border-t border-[#5C4033]/10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5C4033]/40">
          <div className="flex items-center gap-2.5">
            <StickerBobaCup size={22} />
            <span className="font-bold text-[#5C4033]/70 font-serif text-sm">bobamatcha</span>
          </div>
          <p>made with 🧋 for boba lovers everywhere</p>
          <div className="flex gap-5">
            <span className="hover:text-[#3d2b1f] cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-[#3d2b1f] cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-[#3d2b1f] cursor-pointer transition-colors">Manifesto</span>
          </div>
        </div>
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
    ? [
      { val: pad(timeLeft.hours), label: "hrs" },
      { val: pad(timeLeft.minutes), label: "min" },
      { val: pad(timeLeft.seconds), label: "sec" },
    ]
    : [
      { val: "--", label: "hrs" },
      { val: "--", label: "min" },
      { val: "--", label: "sec" },
    ];

  return (
    <div className="inline-flex items-center gap-2.5">
      {display.map((t, i) => (
        <div key={i} className="flex items-center gap-2.5">
          <div className="text-center">
            <div
              className="font-serif text-3xl sm:text-4xl font-bold px-3.5 py-2 rounded-xl"
              style={{
                fontFamily: "var(--font-marker)",
                color: "var(--color-matcha)",
              }}
            >
              {t.val}
            </div>
            <div className="text-[10px] text-[#3d2b1f]/60 mt-0.5 font-bold uppercase tracking-wider">{t.label}</div>
          </div>
          {i < 2 && <span className="font-serif text-2xl text-[#5C4033]/20 font-bold -mt-4">:</span>}
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   SVG STICKER COMPONENTS — Hand-drawn boba illustrations
   kept from the original site, used as floating accents
   ══════════════════════════════════════════════════════ */

function StickerBobaCup({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" className="inline-block drop-shadow-lg">
      {/* Straw */}
      <rect x="44" y="4" width="5" height="28" rx="2.5" fill="#7cb342" transform="rotate(6 46 18)" />
      <circle cx="46" cy="5" r="4" fill="#7cb342" opacity="0.6" />

      {/* Cup lid */}
      <path d="M18 22 C18 19 22 17 40 17 C58 17 62 19 62 22 C62 25 58 27 40 27 C22 27 18 25 18 22Z" fill="#3d2b1f" stroke="#7cb342" strokeWidth="2" strokeLinejoin="round" />

      {/* Cup body */}
      <path d="M20 27 C20 27 21 60 23 65 C25 68 35 70 40 70 C45 70 55 68 57 65 C59 60 60 27 60 27" fill="#2a1f1a" stroke="#7cb342" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

      {/* Matcha liquid fill */}
      <path d="M22 35 C26 32 32 38 40 35 C48 32 54 38 58 35 L57 60 C56 64 48 67 40 67 C32 67 24 64 23 60 Z" fill="#7cb342" opacity="0.25" />

      {/* Boba pearls */}
      <circle cx="30" cy="58" r="4" fill="#6b4226" stroke="#4a2c17" strokeWidth="1" />
      <circle cx="40" cy="62" r="4" fill="#6b4226" stroke="#4a2c17" strokeWidth="1" />
      <circle cx="50" cy="58" r="3.5" fill="#6b4226" stroke="#4a2c17" strokeWidth="1" />
      <circle cx="35" cy="55" r="3" fill="#6b4226" stroke="#4a2c17" strokeWidth="1" />
      <circle cx="46" cy="55" r="3" fill="#6b4226" stroke="#4a2c17" strokeWidth="1" />
      {/* Pearl shines */}
      <circle cx="29" cy="56.5" r="1.2" fill="rgba(255,255,255,0.3)" />
      <circle cx="39" cy="60.5" r="1.2" fill="rgba(255,255,255,0.3)" />

      {/* Cute face - eyes */}
      <circle cx="33" cy="42" r="2.5" fill="white" />
      <circle cx="47" cy="42" r="2.5" fill="white" />
      {/* Eye dots */}
      <circle cx="34" cy="42" r="1" fill="#2a1f1a" />
      <circle cx="48" cy="42" r="1" fill="#2a1f1a" />

      {/* Blush */}
      <ellipse cx="28" cy="46" rx="4" ry="2.5" fill="#7cb342" opacity="0.3" />
      <ellipse cx="52" cy="46" rx="4" ry="2.5" fill="#7cb342" opacity="0.3" />

      {/* Smile */}
      <path d="M36 47 C38 50 42 50 44 47" fill="none" stroke="#5C4033" strokeWidth="1.5" strokeLinecap="round" />

      {/* Heart above */}
      <path d="M40 10 C40 8 38 6.5 36.5 6.5 C35 6.5 33 8 33 10 C33 13 40 16 40 16 C40 16 47 13 47 10 C47 8 45 6.5 43.5 6.5 C42 6.5 40 8 40 10Z" fill="#7cb342" stroke="#7cb342" strokeWidth="0.8" opacity="0.6" />
    </svg>
  );
}

function StickerMatchaLeaf({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="inline-block drop-shadow-lg">
      <path
        d="M24 6 C12 14 6 24 10 36 C14 44 20 44 24 40 C28 44 34 44 38 36 C42 24 36 14 24 6Z"
        fill="#7cb342"
        stroke="#558b2f"
        strokeWidth="2"
        strokeLinejoin="round"
        opacity="0.8"
      />
      <path d="M24 10 L24 36" stroke="#558b2f" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      <path d="M24 20 L16 26" stroke="#558b2f" strokeWidth="1" opacity="0.3" strokeLinecap="round" />
      <path d="M24 26 L32 22" stroke="#558b2f" strokeWidth="1" opacity="0.3" strokeLinecap="round" />
    </svg>
  );
}

function StickerBobaPearls({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="inline-block drop-shadow-lg">
      <circle cx="16" cy="24" r="8" fill="#6b4226" stroke="#4a2c17" strokeWidth="1.5" />
      <circle cx="32" cy="20" r="7" fill="#6b4226" stroke="#4a2c17" strokeWidth="1.5" />
      <circle cx="26" cy="34" r="6" fill="#6b4226" stroke="#4a2c17" strokeWidth="1.5" />
      {/* Shines */}
      <circle cx="14" cy="22" r="2" fill="rgba(255,255,255,0.2)" />
      <circle cx="30" cy="18" r="1.8" fill="rgba(255,255,255,0.2)" />
      <circle cx="24" cy="32" r="1.5" fill="rgba(255,255,255,0.2)" />
    </svg>
  );
}

function StickerHeart({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" className="inline-block drop-shadow-lg">
      <path
        d="M18 9 C18 6 15 3 12 3 C9 3 6 6 6 9 C6 15 18 24 18 24 C18 24 30 15 30 9 C30 6 27 3 24 3 C21 3 18 6 18 9Z"
        fill="#7cb342"
        stroke="#558b2f"
        strokeWidth="1.5"
        strokeLinejoin="round"
        opacity="0.7"
      />
    </svg>
  );
}
