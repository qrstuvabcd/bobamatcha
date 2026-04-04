import Link from "next/link";
import { StickerBobaCup, StickerMatchaLeaf, StickerBobaPearls, StickerHeart } from "@/components/Stickers";

export default function About() {
  const steps = [
    { num: "01", icon: <StickerHeart size={40} />, title: "The Daily Question", desc: "Every day at noon, we drop a fresh question. Answer it to join the pool." },
    { num: "02", icon: <StickerBobaCup size={40} />, title: "AI Matchmaking", desc: "Our Gemini AI reads every answer to find your cultural counterpart." },
    { num: "03", icon: <StickerMatchaLeaf size={40} />, title: "The Noon Drop", desc: "At exactly 12:00 PM PST, matches are sent directly to your inbox." },
    { num: "04", icon: <StickerBobaPearls size={40} />, title: "Slide into DMs", desc: "You get their IG handle. The rest of the vibe check is on you." },
  ];

  return (
    <main className="min-h-screen bg-[#E8F5E9] p-6 text-[#5C4033] pb-20">
      <div className="w-full max-w-[450px] mx-auto space-y-8 animate-pop-in">
        
        {/* Top Nav */}
        <div className="pt-6">
          <Link href="/">
            <button className="neubrutalism-button px-6 py-3 text-sm font-bold bg-white text-[#5C4033]">
              ← Back to the Drop
            </button>
          </Link>
        </div>

        {/* Title Area */}
        <div className="text-center pt-8 mb-4">
          <h1 className="text-4xl font-black tracking-tighter mb-2">how it works</h1>
          <p className="text-[#5C4033]/60 font-bold italic px-4">
            The rules of engagement for the 12 PM drop.
          </p>
        </div>

        {/* The Rules / Steps */}
        <div className="space-y-6">
          {steps.map((step) => (
            <div key={step.num} className="bg-white border-4 border-[#5C4033] rounded-3xl p-6 shadow-[4px_4px_0px_#5C4033] flex gap-5 animate-pop-in relative">
              {/* Absolute Number Badge */}
              <div className="absolute -top-3 -right-3 bg-[var(--color-matcha)] text-white font-black border-2 border-[#5C4033] rounded-full w-8 h-8 flex items-center justify-center shadow-[2px_2px_0px_#5C4033] text-sm">
                {step.num}
              </div>

              <div className="shrink-0">{step.icon}</div>
              <div>
                <h3 className="font-black text-xl mb-1">{step.title}</h3>
                <p className="text-[#5C4033]/70 text-sm leading-relaxed font-medium">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Area */}
        <div className="text-center pt-10">
           <p className="text-[#5C4033]/40 text-sm font-bold">
             &copy; 2026 BobaMatcha — Keep it 🧋
           </p>
        </div>

      </div>
    </main>
  );
}
