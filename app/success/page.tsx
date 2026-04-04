"use client";
import React from "react";
import { StickerBobaCup, StickerHeart } from "@/components/Stickers";

export default function Success() {
    return (
        <main className="min-h-screen bg-[var(--color-matcha-soft)] text-[#5C4033] overflow-hidden relative flex items-center justify-center p-6">
            <div className="noise-overlay" />

            {/* AMBIENT GLOW */}
            <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[var(--color-matcha)] opacity-[0.05] blur-[120px] pointer-events-none" />

            <div className="neubrutalism-card bg-white p-12 max-w-lg w-full relative text-center animate-pop-in">

                {/* Boba Sticker */}
                <div className="mb-8 flex justify-center animate-bounce-soft">
                    <StickerBobaCup size={120} />
                </div>

                {/* Handwritten subtitle */}
                <div
                    className="text-[var(--color-matcha)] text-4xl mb-4"
                    style={{ fontFamily: "var(--font-marker)" }}
                >
                    you&apos;re in!
                </div>

                <h1 className="text-5xl md:text-6xl font-bold tracking-tighter leading-none mb-8">
                    check your<br /><span className="text-[var(--color-matcha)]">email</span>
                </h1>

                <p className="text-[#5C4033]/60 font-bold text-lg mb-12">
                    Your daily match will be dropped into your inbox today at <span className="text-[var(--color-matcha)]">12:00 PM PST</span>.
                </p>

                <a
                    href="/"
                    className="neubrutalism-button w-full py-4 text-lg"
                >
                    Return Home ➔
                </a>

                {/* Decorative Heart */}
                <div className="absolute -bottom-6 -left-6 rotate-[-15deg]">
                    <StickerHeart size={60} />
                </div>
            </div>
        </main>
    );
}
