"use client";
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
      setError("Please fill out all fields.");
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
    <main className="min-h-screen bg-[var(--color-ditto-dark)] text-white overflow-hidden relative">
      {/* GLobAL NOISE OVERLAY */}
      <div className="noise-overlay text-white" />

      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 right-0 w-full h-[600px] bg-gradient-to-b from-[#181825] to-[var(--color-ditto-dark)] pointer-events-none z-0 opacity-50 blur-[100px]" />

      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-50 py-6 px-8 flex items-center justify-between pointer-events-none">
        <div className="font-serif font-bold text-2xl tracking-tighter shadow-black drop-shadow-md">
          bobamatcha.
        </div>
        <div className="flex gap-4 pointer-events-auto">
          <button className="text-sm font-medium hover:text-[#F34182] transition-colors">Log In</button>
          <button className="text-sm font-medium border border-white/20 rounded-full px-5 py-2 ditto-glass hover:bg-white/10 transition-colors">
            Join Now
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full px-6 pt-20">
        <div className="max-w-4xl w-full text-center relative flex flex-col items-center">

          {/* Headline - Serifs with Pink Accents */}
          <div className="relative mb-8">
            <div className="absolute -top-12 -left-8 font-[var(--font-marker)] text-[var(--color-ditto-pink)] text-4xl rotate-[-12deg] opacity-90 animate-fade-in delay-100">
              only for boba lovers
            </div>

            <h1 className="font-serif text-6xl md:text-8xl lg:text-[110px] leading-[0.9] tracking-tighter text-white drop-shadow-xl animate-fade-in">
              get a boba date<br />every day
            </h1>
          </div>

          <p className="font-sans text-sm md:text-base text-gray-400 mb-10 max-w-sm mx-auto font-medium">
            Next Match Day: Today at 12:00 PM <br />
            Already Joined: 4,281
          </p>

          {/* POLAROID */}
          <div className="relative mb-12 animate-fade-in group z-20">
            <div className="bg-[#f0f0f0] p-3 pb-8 shadow-2xl rounded-sm transform rotate-3 hover:rotate-0 transition-transform duration-500 w-[240px] md:w-[280px]">
              <div className="w-full h-[260px] md:h-[300px] overflow-hidden bg-zinc-800">
                <img
                  src="https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600&auto=format&fit=crop"
                  alt="Boba Date"
                  className="w-full h-full object-cover filter contrast-[1.1] grayscale-[0.2]"
                />
              </div>
              <div className="absolute -bottom-2 right-4 font-[var(--font-marker)] text-[var(--color-ditto-pink)] text-3xl rotate-[-8deg]">
                matcha made ♡
              </div>
            </div>

            {/* Pink Drawn Heart near the polaroid */}
            <div className="absolute top-[40%] text-[var(--color-ditto-pink)] -left-12 rotate-[-15deg] font-[var(--font-marker)] text-5xl opacity-80 pointer-events-none">
              ♡
            </div>
          </div>

          {/* DYNAMIC FUNNEL MODAL */}
          <div className="relative w-full max-w-lg z-30 mb-20">
            {!showModal ? (
              <form onSubmit={handleInitialSubmit} className="ditto-glass rounded-[32px] p-8 text-left animate-fade-in relative backdrop-blur-2xl">
                <div className="font-[var(--font-marker)] text-[var(--color-ditto-pink)] text-2xl absolute -top-8 -right-6 rotate-[10deg]">
                  answer this!
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-medium mb-6 leading-tight drop-shadow-md">
                  {question}
                </h2>
                <textarea
                  required
                  rows={2}
                  placeholder="Tell us everything..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full p-4 rounded-2xl ditto-input resize-none mb-6 text-sm"
                ></textarea>
                <button type="submit" className="w-full ditto-button text-lg">
                  Submit
                </button>
              </form>
            ) : (
              <div className="ditto-glass rounded-[32px] p-8 text-left animate-fade-in relative backdrop-blur-2xl">
                <h3 className="font-serif text-3xl font-medium mb-2 drop-shadow-md">
                  Almost there.
                </h3>
                <p className="text-gray-400 text-sm mb-6 font-medium">Verify your profile so we can send your match at 12:00 PM.</p>

                {error && <p className="mb-4 text-xs font-bold text-red-400 bg-red-950/50 border border-red-900 p-3 rounded-xl">{error}</p>}

                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-4 rounded-xl ditto-input text-sm"
                  />
                  <input
                    type="text"
                    placeholder="@instagram_handle"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="w-full p-4 rounded-xl ditto-input text-sm"
                  />

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setGender('female')}
                      className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all ${gender === 'female' ? 'bg-[var(--color-ditto-pink)] border-[var(--color-ditto-pink)] text-white' : 'bg-transparent border-white/20 text-white/50 hover:bg-white/5'}`}
                    >Girl 👸</button>
                    <button
                      type="button"
                      onClick={() => setGender('male')}
                      className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all ${gender === 'male' ? 'bg-[var(--color-ditto-pink)] border-[var(--color-ditto-pink)] text-white' : 'bg-transparent border-white/20 text-white/50 hover:bg-white/5'}`}
                    >Guy 🧋</button>
                  </div>

                  <button
                    onClick={handleFinalSubmit}
                    disabled={submitting}
                    className="w-full ditto-button py-4 mt-4 disabled:opacity-50"
                  >
                    {submitting ? "Processing..." : "Get Matching"}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="font-serif text-gray-500 mb-8 italic">Verified. Private. Safe.</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 py-10 px-8 flex justify-between items-center text-xs text-gray-500 border-t border-white/5">
        <div className="font-serif text-xl text-white">bobamatcha</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Manifesto</a>
          <a href="#" className="hover:text-white transition-colors">Safety</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>
      </footer>
    </main>
  );
}
