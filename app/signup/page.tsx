"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const VIBE_QUESTIONS = [
    "What's your most controversial boba take?",
    "Hotpot at home or 2 AM late night K-town eats?",
    "Who is your favorite artist to listen to on a late night drive?",
    "What is the single biggest red flag on a first date?",
    "If money was no object, what's your ultimate flex?",
];

export default function SignupPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        name: "",
        email: "",
        gender: "",
        favorite_order: "",
        instagram: "",
        city: "",
        answers: ["", "", "", "", ""]
    });

    const updateAnswer = (index: number, val: string) => {
        const newAnswers = [...form.answers];
        newAnswers[index] = val;
        setForm({ ...form, answers: newAnswers });
    };

    const handleNext = () => {
        setError("");
        if (step === 1 && (!form.name || !form.email || !form.gender || !form.city)) {
            setError("Please fill out your basic info first! ♡");
            return;
        }
        if (step > 1 && step <= 6 && !form.answers[step - 2].trim()) {
            setError("We need to hear your vibe! Please answer the question.");
            return;
        }
        setStep(step + 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();

            if (res.status === 409) {
                localStorage.setItem("bobamatcha_user", JSON.stringify({ id: data.userId, ...form }));
                router.push("/dashboard");
                return;
            }

            if (!res.ok) throw new Error(data.error);

            localStorage.setItem("bobamatcha_user", JSON.stringify(data.user));
            setStep(8); // Show Final Success State
            setTimeout(() => router.push("/dashboard"), 3000);
        } catch (err: any) {
            setError(err.message || "Something went wrong in the Vibe Check.");
            setStep(1);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center p-4 overflow-hidden relative">
            {/* Background doodles */}
            <div className="absolute top-20 right-20 text-4xl animate-sway opacity-30">✨</div>
            <div className="absolute bottom-20 left-20 text-5xl animate-bounce-soft opacity-30">🧋</div>

            <div className="w-full max-w-md animate-fade-in-up">
                {/* Progress Bar */}
                {step < 8 && (
                    <div className="mb-6 px-2">
                        <div className="h-2 w-full bg-[var(--color-cream-dark)] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[var(--color-matcha)] transition-all duration-500 ease-out"
                                style={{ width: `${(step / 7) * 100}%` }}
                            ></div>
                        </div>
                        <p className="text-right text-xs mt-1 text-[var(--color-boba-light)] font-bold uppercase tracking-widest">
                            Vibe Check {step}/7
                        </p>
                    </div>
                )}

                <div className="chibi-container p-8 animate-pop-in relative z-10">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-2xl text-sm font-bold text-center border-2 border-red-200">
                            {error}
                        </div>
                    )}

                    {/* STEP 1: Basic Profile */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="text-center mb-6">
                                <h2 className="text-3xl font-serif font-bold text-[var(--color-boba)]">Private Club</h2>
                                <p className="text-[var(--color-boba-light)] text-sm mt-1">the basics. who are you? 🧋</p>
                            </div>

                            <input
                                type="text"
                                placeholder="Name"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                className="chibi-input"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                className="chibi-input"
                            />
                            <input
                                type="text"
                                placeholder="City (e.g. Los Angeles)"
                                value={form.city}
                                onChange={e => setForm({ ...form, city: e.target.value })}
                                className="chibi-input"
                            />
                            <input
                                type="text"
                                placeholder="Go-to Boba Order"
                                value={form.favorite_order}
                                onChange={e => setForm({ ...form, favorite_order: e.target.value })}
                                className="chibi-input"
                            />

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setForm({ ...form, gender: 'female' })}
                                    className={`flex-1 py-3 rounded-2xl font-bold border-2 transition-all ${form.gender === 'female' ? 'bg-[#f8bbd0] border-[#c2185b] text-[#880e4f]' : 'bg-transparent border-[#e0cbb0] text-[var(--color-boba-light)]'}`}
                                >ABG 👸</button>
                                <button
                                    type="button"
                                    onClick={() => setForm({ ...form, gender: 'male' })}
                                    className={`flex-1 py-3 rounded-2xl font-bold border-2 transition-all ${form.gender === 'male' ? 'bg-[#bbdefb] border-[#1976d2] text-[#0d47a1]' : 'bg-transparent border-[#e0cbb0] text-[var(--color-boba-light)]'}`}
                                >ABB 🧋</button>
                            </div>

                            <button onClick={handleNext} className="chibi-button w-full mt-4">Begin Vibe Check →</button>
                        </div>
                    )}

                    {/* STEPS 2-6: The 5 Questions */}
                    {step > 1 && step <= 6 && (
                        <div className="space-y-6 text-center animate-pop-in" key={`step-${step}`}>
                            <div className="w-16 h-16 bg-[#e8f5e9] rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[var(--color-matcha)]">
                                <span className="text-2xl">🌱</span>
                            </div>
                            <h3 className="font-serif text-2xl font-bold text-[var(--color-boba)] leading-snug">
                                {VIBE_QUESTIONS[step - 2]}
                            </h3>
                            <p className="text-xs text-[var(--color-boba-light)]">
                                The Connoisseur is listening. Be brutally honest.
                            </p>

                            <textarea
                                rows={4}
                                placeholder="Spill the tea..."
                                value={form.answers[step - 2]}
                                onChange={e => updateAnswer(step - 2, e.target.value)}
                                className="chibi-input resize-none"
                                autoFocus
                            ></textarea>

                            <button onClick={handleNext} className="chibi-button w-full">Next Question</button>
                        </div>
                    )}

                    {/* STEP 7: Instagram & Final Submit */}
                    {step === 7 && (
                        <div className="text-center space-y-6 animate-pop-in">
                            <div className="text-5xl animate-bounce-soft mb-2">📸</div>
                            <h3 className="font-serif text-2xl font-bold text-[var(--color-boba)]">The Final Check</h3>
                            <p className="text-[var(--color-boba-light)] text-sm px-4">
                                The Bouncer needs to silently audit your Instagram to verify your club eligibility.
                            </p>

                            <input
                                type="text"
                                placeholder="@instagram_handle"
                                value={form.instagram}
                                onChange={e => setForm({ ...form, instagram: e.target.value })}
                                className="chibi-input"
                            />

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="chibi-button w-full flex justify-center items-center gap-2 disabled:opacity-50"
                            >
                                {loading ? "Analyzing Vibes..." : "Submit to Council ✨"}
                            </button>
                        </div>
                    )}

                    {/* STEP 8: Success Transition */}
                    {step === 8 && (
                        <div className="text-center py-8 animate-pop-in">
                            <div className="text-6xl mb-4 animate-sway inline-block">🍵</div>
                            <h2 className="font-serif text-2xl font-bold text-[var(--color-boba)] mb-2">Vibes Secured.</h2>
                            <p className="text-[var(--color-boba-light)]">Taking you to the drop zone...</p>
                        </div>
                    )}

                </div>
            </div>
        </main>
    );
}
