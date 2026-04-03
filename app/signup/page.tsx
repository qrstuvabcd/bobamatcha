"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [draftAnswer, setDraftAnswer] = useState("");
    const [draftQId, setDraftQId] = useState("");

    useEffect(() => {
        // Collect the answer they typed on the homepage
        const draft = localStorage.getItem("bobamatcha_draft");
        const qid = localStorage.getItem("bobamatcha_q_id");
        if (!draft || !qid) {
            router.push("/");
        } else {
            setDraftAnswer(draft);
            setDraftQId(qid);
        }
    }, [router]);

    const [form, setForm] = useState({
        name: "",
        email: "",
        gender: "",
        favorite_order: "",
        instagram: "",
        city: "",
    });

    const handleSubmit = async () => {
        if (!form.name || !form.email || !form.gender || !form.city) {
            setError("Please fill out all the required basics! ♡");
            return;
        }

        setLoading(true);
        setError("");
        try {
            // 1. Create the user
            const res = await fetch("/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();

            let userId = data.userId || data.user?.id;

            if (!res.ok && res.status !== 409) {
                throw new Error(data.error);
            }

            if (data.user) {
                localStorage.setItem("bobamatcha_user", JSON.stringify(data.user));
            } else if (res.status === 409) {
                // If email exists, we just proceed to submit their answer
                localStorage.setItem("bobamatcha_user", JSON.stringify({ id: userId, ...form }));
            }

            // 2. Submit their answer from the homepage to trigger the Connoisseur
            const answerRes = await fetch("/api/answer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: userId,
                    questionId: draftQId,
                    answerText: draftAnswer
                }),
            });

            const answerData = await answerRes.json();
            if (!answerRes.ok && answerData.error !== "You've already answered today's question!") {
                throw new Error(answerData.error);
            }

            // Clear draft
            localStorage.removeItem("bobamatcha_draft");
            localStorage.removeItem("bobamatcha_q_id");

            // Go to dashboard
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Something went wrong in the Vibe Check.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center p-4 overflow-hidden relative">
            <div className="absolute top-20 right-20 text-4xl animate-sway opacity-30">✨</div>
            <div className="absolute bottom-20 left-20 text-5xl animate-bounce-soft opacity-30">🧋</div>

            <div className="w-full max-w-md animate-fade-in-up chibi-container p-8 relative z-10">
                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-2xl text-sm font-bold text-center border-2 border-red-200">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-serif font-bold text-[var(--color-boba)]">Almost there</h2>
                        <p className="text-[var(--color-boba-light)] text-sm mt-1">who are you? 🧋</p>
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
                    <input
                        type="text"
                        placeholder="@instagram_handle"
                        value={form.instagram}
                        onChange={e => setForm({ ...form, instagram: e.target.value })}
                        className="chibi-input"
                    />

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setForm({ ...form, gender: 'female' })}
                            className={`flex-1 py-3 rounded-2xl font-bold border-2 transition-all ${form.gender === 'female' ? 'bg-[#f8bbd0] border-[#c2185b] text-[#880e4f]' : 'bg-transparent border-[var(--color-boba-light)] text-[var(--color-boba-light)]'}`}
                        >ABG 👸</button>
                        <button
                            type="button"
                            onClick={() => setForm({ ...form, gender: 'male' })}
                            className={`flex-1 py-3 rounded-2xl font-bold border-2 transition-all ${form.gender === 'male' ? 'bg-[#bbdefb] border-[#1976d2] text-[#0d47a1]' : 'bg-transparent border-[var(--color-boba-light)] text-[var(--color-boba-light)]'}`}
                        >ABB 🧋</button>
                    </div>

                    <button onClick={handleSubmit} disabled={loading} className="chibi-button w-full mt-4 flex justify-center disabled:opacity-50">
                        {loading ? "Approving Vibes..." : "Submit & Enter Club →"}
                    </button>

                    <p className="text-[10px] text-[var(--color-boba-light)] text-center mt-2 leading-tight">
                        By submitting, you agree to the Silent Social Audit by The Bouncer.
                    </p>
                </div>
            </div>
        </main>
    );
}
