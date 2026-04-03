"use client";

import { useEffect, useState } from "react";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-[#fef6ee] text-[#3d2b1f] overflow-hidden relative">
      {/* ── DOODLE BACKGROUND PATTERN ── */}
      <div className="fixed inset-0 z-0 opacity-[0.04] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="doodles" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              {/* tiny hearts */}
              <path d="M30 20 C30 17 27 15 25 15 C23 15 20 17 20 20 C20 25 30 30 30 30 C30 30 40 25 40 20 C40 17 37 15 35 15 C33 15 30 17 30 20Z" fill="#6b4226" opacity="0.3" />
              {/* tiny leaf */}
              <path d="M120 80 C115 75 108 78 110 85 C112 90 118 92 120 88 C122 92 128 90 130 85 C132 78 125 75 120 80Z" fill="#7cb342" opacity="0.3" />
              {/* tiny star */}
              <path d="M170 40 L172 46 L178 46 L173 50 L175 56 L170 52 L165 56 L167 50 L162 46 L168 46Z" fill="#6b4226" opacity="0.25" />
              {/* tiny circle (boba pearl) */}
              <circle cx="60" cy="140" r="5" fill="#6b4226" opacity="0.2" />
              <circle cx="80" cy="160" r="4" fill="#6b4226" opacity="0.15" />
              {/* tiny squiggle */}
              <path d="M140 150 C145 145 150 155 155 150 C160 145 165 155 170 150" fill="none" stroke="#7cb342" strokeWidth="1.5" opacity="0.25" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#doodles)" />
        </svg>
      </div>

      {/* ── NAV ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#fef6ee]/90 backdrop-blur-sm" style={{ borderBottom: "2.5px solid #f0e0cc" }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CuteBobaCup size={32} />
            <span className="text-lg font-bold tracking-tight text-[#6b4226]" style={{ fontFamily: "var(--font-serif)" }}>
              BobaMatcha
            </span>
          </div>
          <a
            href="https://wa.me/1XXXXXXXXXX?text=Hi%20BobaMatcha%20🧋"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-full bg-[#6b4226] text-white text-sm font-semibold hover:bg-[#4a2c17] transition-all duration-200 hover:scale-105"
            style={{ borderRadius: "50px", border: "2px solid #4a2c17" }}
          >
            Join Now 🧋
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center pt-32 pb-16 px-6 min-h-screen">
        {/* Floating doodle elements */}
        <div className="absolute top-24 left-[8%] animate-sway opacity-70">
          <DoodleHeart size={40} color="#c9a0dc" />
        </div>
        <div className="absolute top-32 right-[10%] animate-wiggle opacity-60">
          <DoodleLeaf size={44} />
        </div>
        <div className="absolute bottom-32 left-[12%] animate-float opacity-50" style={{ animationDelay: "1.5s" }}>
          <DoodleStar size={32} color="#6b4226" />
        </div>
        <div className="absolute bottom-40 right-[15%] animate-bounce-soft opacity-50" style={{ animationDelay: "0.8s" }}>
          <DoodleBobaPearl size={28} />
        </div>
        <div className="absolute top-[45%] left-[5%] animate-wiggle opacity-40" style={{ animationDelay: "2s" }}>
          <DoodleStar size={24} color="#7cb342" />
        </div>
        <div className="absolute top-[50%] right-[6%] animate-sway opacity-40" style={{ animationDelay: "1s" }}>
          <DoodleHeart size={28} color="#f8bbd0" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Main cute boba illustration */}
          <div className="animate-bounce-soft mb-6">
            <CuteBobaCup size={100} />
          </div>

          {/* Title: "It's a Matcha" with Match highlighted */}
          <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl font-bold leading-[1.1] tracking-tight animate-fade-in-up">
            <span className="text-[#6b4226]">It&apos;s a </span>
            <span className="relative inline-block">
              <span className="text-[#7cb342]">Match</span>
              <span className="text-[#6b4226]">a</span>
              {/* Hand-drawn underline */}
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none">
                <path d="M3 9 C20 4 40 6 60 5 C80 4 100 7 120 5 C140 3 160 6 180 4 C190 3 195 5 197 6" stroke="#7cb342" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5" />
              </svg>
            </span>
          </h1>

          {/* Hand-drawn sparkles around title */}
          <div className="flex justify-center gap-2 mt-2 mb-4">
            <DoodleSparkle size={16} />
            <DoodleSparkle size={12} />
            <DoodleSparkle size={16} />
          </div>

          <p className="text-lg sm:text-xl text-[#a0714f] max-w-xl mx-auto leading-relaxed animate-fade-in-up delay-200" style={{ fontFamily: "var(--font-serif)" }}>
            Let AI find your Boba Date🧋 The daily 12 PM dating app for ABGs and ABBs
          </p>

          {/* Countdown to noon */}
          <div className="mt-8 animate-fade-in-up delay-300">
            <NoonCountdown />
          </div>

          <p className="mt-3 text-xs text-[#a0714f]/60">
            Next Match Drop: Today at 12:00 PM · <span className="text-[#7cb342] font-semibold">4,200+</span> boba lovers joined
          </p>

          {/* CTA */}
          <a
            id="cta-hero"
            href="https://wa.me/1XXXXXXXXXX?text=Hi%20BobaMatcha%20🍵"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-3 bg-[#6b4226] text-white text-lg font-bold px-11 py-4.5 hover:bg-[#4a2c17] transition-all duration-300 hover:scale-105 cursor-pointer"
            style={{ borderRadius: "50px", border: "3px solid #4a2c17", boxShadow: "0 4px 0 #4a2c17" }}
          >
            <WhatsAppIcon size={22} color="#25D366" />
            Message Us to Join
          </a>

          <p className="mt-4 text-xs text-[#a0714f]/50">
            via WhatsApp · 100% free · matched daily 🍵
          </p>
        </div>

        {/* Wavy hand-drawn divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full">
            <path d="M0 40 C80 20 160 60 240 40 C320 20 400 60 480 40 C560 20 640 60 720 40 C800 20 880 60 960 40 C1040 20 1120 60 1200 40 C1280 20 1360 60 1440 40 V80 H0Z" fill="#fff8f0" stroke="#f0e0cc" strokeWidth="2" />
          </svg>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative z-10 py-20 px-6 bg-[#fff8f0]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#6b4226] mb-2">
              How it <span className="italic text-[#7cb342]">works</span>
              <span className="inline-block ml-2 animate-wiggle"><DoodleLeaf size={28} /></span>
            </h2>
            <p className="text-[#a0714f] text-sm">four steps to your boba date ♡</p>
          </div>

          <div className="grid md:grid-cols-4 gap-5">
            {[
              { num: "01", emoji: "💬", title: "Text us your vibe", desc: "Send a WhatsApp message with your name and go-to order. That's your whole profile!", color: "#6b4226" },
              { num: "02", emoji: "🤖", title: "AI does its thing", desc: "Every day at noon, our AI picks one perfect match for you based on vibes, not looks.", color: "#7cb342" },
              { num: "03", emoji: "📍", title: "We pick the café", desc: "A cute boba spot halfway between you two. Open, highly rated, aesthetic-approved.", color: "#c9a0dc" },
              { num: "04", emoji: "🧋", title: "Show up & sip", desc: "Grab your matcha, meet your date, see if there's a spark. No pressure, just tea!", color: "#6b4226" },
            ].map((item) => (
              <div key={item.num} className="cute-card p-6 text-center">
                <div className="text-[10px] font-bold mb-2" style={{ color: item.color, fontFamily: "var(--font-serif)" }}>
                  {item.num}
                </div>
                <div className="text-3xl mb-3">{item.emoji}</div>
                <h3 className="font-bold text-sm mb-2 text-[#3d2b1f]">{item.title}</h3>
                <p className="text-[#a0714f] text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hand-drawn connector line */}
        <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 w-[60%] -translate-y-4 z-0 pointer-events-none">
          <svg viewBox="0 0 800 20" fill="none" className="w-full">
            <path d="M10 10 C100 5 150 15 200 10 C250 5 300 15 400 10 C500 5 550 15 600 10 C650 5 700 15 790 10" stroke="#f0e0cc" strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round" />
          </svg>
        </div>
      </section>

      {/* ── Hand-drawn wavy divider ── */}
      <div className="relative z-10 bg-[#fef6ee]">
        <svg viewBox="0 0 1440 50" fill="none" className="w-full -mb-1">
          <path d="M0 25 C60 10 120 40 180 25 C240 10 300 40 360 25 C420 10 480 40 540 25 C600 10 660 40 720 25 C780 10 840 40 900 25 C960 10 1020 40 1080 25 C1140 10 1200 40 1260 25 C1320 10 1380 40 1440 25 V50 H0Z" fill="#fff8f0" stroke="#f0e0cc" strokeWidth="1.5" />
        </svg>
      </div>

      {/* ── SOCIAL PROOF / TESTIMONIALS ── */}
      <section className="relative z-10 py-20 px-6 bg-[#fef6ee]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-4">
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#6b4226]">
              Real <span className="italic text-[#7cb342]">Boba Dates</span>
              <span className="inline-block ml-2 animate-sway"><DoodleHeart size={24} color="#f8bbd0" /></span>
            </h2>
            <p className="mt-2 text-[#a0714f] text-sm">matches made over matcha ♡</p>
          </div>

          {/* Stats in cute hand-drawn pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-12 mt-8">
            {[
              { num: "4,200+", label: "dates", color: "#6b4226", bg: "#f5e6d3" },
              { num: "89%", label: "second dates", color: "#7cb342", bg: "#e8f5e9" },
              { num: "12", label: "cities", color: "#c9a0dc", bg: "#f3e5f5" },
            ].map((s) => (
              <div key={s.label} className="px-6 py-3 text-center" style={{ backgroundColor: s.bg, borderRadius: "50px", border: `2px solid ${s.color}40` }}>
                <span className="font-serif text-xl font-bold" style={{ color: s.color }}>{s.num}</span>
                <span className="text-xs ml-1.5" style={{ color: s.color }}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { name: "Jasmine", school: "Edinburgh", quote: "He ordered the exact same oat milk matcha as me. We've been together 3 months now 💚", emoji: "🍵", border: "#7cb342" },
              { name: "Kevin", school: "UCLA", quote: "Way better than Hinge. She was actually cute AND we had stuff to talk about over boba.", emoji: "🧋", border: "#6b4226" },
              { name: "Michelle", school: "NYU", quote: "The AI literally read my mind. He was tall, liked matcha, and had a golden retriever 😭", emoji: "✨", border: "#c9a0dc" },
              { name: "Daniel", school: "Berkeley", quote: "She showed up in the cutest outfit and we ended up walking around for 3 hours after boba.", emoji: "💕", border: "#f8bbd0" },
              { name: "Tina", school: "UofT", quote: "I'm literally an ABG and this app gets me. Taro milk tea + cute guy = perfect first date.", emoji: "💜", border: "#c9a0dc" },
              { name: "Ryan", school: "Edinburgh", quote: "Met at Machi Machi. She ordered brown sugar boba. I knew she was the one right there.", emoji: "🤎", border: "#6b4226" },
            ].map((t, i) => (
              <div key={i} className="cute-card p-5 relative">
                {/* Hand-drawn corner doodle */}
                <div className="absolute top-2 right-3 text-lg opacity-40">{t.emoji}</div>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: t.border }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#3d2b1f]">{t.name}</div>
                    <div className="text-[10px] text-[#a0714f]">@{t.school}</div>
                  </div>
                </div>
                <p className="text-sm text-[#6b4226] leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOBA TICKER MARQUEE ── */}
      <section className="relative z-10 py-4 overflow-hidden bg-[#f5e6d3]" style={{ borderTop: "2px dashed #e0cbb0", borderBottom: "2px dashed #e0cbb0" }}>
        <div className="flex animate-ticker whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-10 mr-10">
              {[
                "🍵 matcha latte", "🤎 brown sugar boba", "💜 taro milk tea",
                "✨ hojicha vibes", "🧋 oat milk matcha", "💕 ube boba",
                "🫧 jasmine green", "🍓 strawberry matcha", "☁️ cheese foam",
                "🍵 ceremonial grade", "🤎 thai tea date", "💜 mochi donuts",
              ].map((item, j) => (
                <span key={j} className="text-[#6b4226]/40 text-sm font-medium tracking-wide">
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── YOUR AI MATCHMAKER ── */}
      <section className="relative z-10 py-20 px-6 bg-[#fff8f0]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#6b4226]">
              Your AI <span className="italic text-[#c9a0dc]">Matchmaker</span>
              <span className="inline-block ml-2 animate-bounce-soft"><DoodleStar size={24} color="#6b4226" /></span>
            </h2>
            <p className="mt-2 text-[#a0714f] text-sm">powered by magic (and a lot of math) ✨</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { emoji: "🧠", title: "Learns your taste", desc: "Not just in boba — in people. The more you interact, the smarter your matches get.", color: "#7cb342" },
              { emoji: "🔍", title: "Scans everyone nearby", desc: "Our AI checks every profile in your area to find the one. Not random — intentional.", color: "#6b4226" },
              { emoji: "🎯", title: "One perfect match", desc: "Every day at noon. No swiping. No overwhelm. Just one curated person worth meeting.", color: "#c9a0dc" },
            ].map((item) => (
              <div key={item.title} className="cute-card p-7 text-center">
                <div className="text-4xl mb-4">{item.emoji}</div>
                <h3 className="font-bold text-sm mb-2" style={{ color: item.color }}>{item.title}</h3>
                <p className="text-[#a0714f] text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON ── */}
      <section className="relative z-10 py-20 px-6 bg-[#fef6ee]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#6b4226] mb-12">
            tired of swiping? <span className="italic text-[#c9a0dc]">same.</span>
            <span className="inline-block ml-1">😮‍💨</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="cute-card p-7 text-left" style={{ borderColor: "#7cb34240" }}>
              <div className="flex items-center gap-2 mb-5">
                <CuteBobaCup size={28} />
                <span className="font-bold text-[#7cb342]" style={{ fontFamily: "var(--font-serif)" }}>BobaMatcha</span>
              </div>
              <ul className="space-y-3 text-sm">
                {["One curated date daily at noon", "AI picks the perfect boba spot", "No photos required, no swiping", "Real vibes, real matcha, real dates", "Built for boba lovers & ABGs"].map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-[#3d2b1f]">
                    <span className="text-[#7cb342] mt-0.5">✓</span> {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="cute-card p-7 text-left opacity-50" style={{ borderColor: "#f0e0cc" }}>
              <div className="flex items-center gap-2 mb-5">
                <span className="text-xl">📱</span>
                <span className="font-bold text-[#a0714f]">Other Apps</span>
              </div>
              <ul className="space-y-3 text-sm">
                {["Endless swiping & burnout", "Awkward coffee shop DMs", "Judged entirely by photos", "Small talk for days", "Generic, no personality"].map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-[#a0714f]">
                    <span className="text-red-300 mt-0.5">✗</span> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT'S YOUR ORDER ── */}
      <section className="relative z-10 py-20 px-6 bg-[#fff8f0]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#6b4226]">
              What&apos;s your <span className="italic text-[#c9a0dc]">order?</span>
            </h2>
            <p className="mt-2 text-[#a0714f] text-sm">your boba order says everything ♡</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { emoji: "🍵", name: "Matcha Latte", vibe: "main character energy", color: "#7cb342" },
              { emoji: "🧋", name: "Brown Sugar Boba", vibe: "classic ABG", color: "#6b4226" },
              { emoji: "💜", name: "Taro Milk Tea", vibe: "soft & mysterious", color: "#c9a0dc" },
              { emoji: "🤎", name: "Thai Tea", vibe: "bold & spicy", color: "#a0714f" },
              { emoji: "🫧", name: "Jasmine Green", vibe: "chill vibes only", color: "#7cb342" },
              { emoji: "🔮", name: "Ube Boba", vibe: "different & proud", color: "#c9a0dc" },
              { emoji: "☁️", name: "Cheese Foam", vibe: "high maintenance", color: "#6b4226" },
              { emoji: "🍓", name: "Strawberry Matcha", vibe: "it-girl energy", color: "#f8bbd0" },
            ].map((d) => (
              <div key={d.name} className="cute-card p-4 text-center cursor-pointer group">
                <div className="text-3xl mb-2 group-hover:scale-125 transition-transform duration-300">{d.emoji}</div>
                <div className="text-xs font-bold" style={{ color: d.color }}>{d.name}</div>
                <div className="text-[10px] text-[#a0714f]/60 mt-0.5 italic">{d.vibe}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SAFETY ── */}
      <section className="relative z-10 py-20 px-6 bg-[#fef6ee]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#6b4226] mb-3">
            Safe & <span className="italic text-[#7cb342]">Sound</span> 🔒
          </h2>
          <p className="text-[#a0714f] text-sm mb-10">so you can focus on the tea ♡</p>

          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { emoji: "🔒", title: "Verified via WhatsApp", desc: "Real phone numbers only. No catfish, no fakes.", color: "#6b4226" },
              { emoji: "📍", title: "Public cafés only", desc: "Every date is at a busy, well-reviewed spot. Always safe.", color: "#7cb342" },
              { emoji: "🚫", title: "Cancel anytime", desc: "Not feeling it? Text CANCEL. We handle everything.", color: "#c9a0dc" },
            ].map((item) => (
              <div key={item.title} className="cute-card p-6 text-center">
                <div className="text-3xl mb-3">{item.emoji}</div>
                <h3 className="font-bold text-sm mb-1" style={{ color: item.color }}>{item.title}</h3>
                <p className="text-[#a0714f] text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative z-10 py-24 px-6 text-center bg-[#fff8f0]">
        <div className="max-w-2xl mx-auto">
          {/* Floating doodles */}
          <div className="flex justify-center gap-3 mb-4">
            <DoodleHeart size={20} color="#f8bbd0" />
            <DoodleLeaf size={22} />
            <DoodleHeart size={18} color="#c9a0dc" />
          </div>

          <div className="animate-bounce-soft mb-5">
            <CuteBobaCup size={64} />
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#6b4226] mb-3">
            your boba date is
            <br />
            <span className="italic text-[#7cb342]">one text away</span>
          </h2>
          <p className="text-[#a0714f] text-sm mb-8">
            join 4,200+ boba lovers already matching ♡
          </p>
          <a
            id="cta-bottom"
            href="https://wa.me/1XXXXXXXXXX?text=Hi%20BobaMatcha%20🧋"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#6b4226] text-white text-lg font-bold px-11 py-4.5 hover:bg-[#4a2c17] transition-all duration-300 hover:scale-105"
            style={{ borderRadius: "50px", border: "3px solid #4a2c17", boxShadow: "0 4px 0 #4a2c17" }}
          >
            <WhatsAppIcon size={22} color="#25D366" />
            Message Us to Join
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 py-8 px-6 bg-[#f5e6d3]" style={{ borderTop: "2.5px dashed #e0cbb0" }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#a0714f]">
          <div className="flex items-center gap-2">
            <CuteBobaCup size={20} />
            <span className="font-bold text-[#6b4226]" style={{ fontFamily: "var(--font-serif)" }}>BobaMatcha</span>
          </div>
          <p>made with 🧋 for boba lovers everywhere</p>
          <div className="flex gap-4 text-[#a0714f]/60">
            <span className="hover:text-[#6b4226] cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-[#6b4226] cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-[#6b4226] cursor-pointer transition-colors">Manifesto</span>
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
      if (noon <= now) {
        noon.setDate(noon.getDate() + 1);
      }
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

  // Render "00" on server to avoid hydration mismatch
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
    <div className="inline-flex items-center gap-3">
      {display.map((t, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="text-center">
            <div
              className="font-serif text-4xl sm:text-5xl font-bold text-[#6b4226] px-4 py-2"
              style={{ backgroundColor: "#f5e6d3", borderRadius: "16px", border: "2.5px solid #e0cbb0" }}
            >
              {t.val}
            </div>
            <div className="text-[10px] text-[#a0714f] mt-1">{t.label}</div>
          </div>
          {i < 2 && <span className="font-serif text-3xl text-[#a0714f] font-bold -mt-4">:</span>}
        </div>
      ))}
    </div>
  );
}

/* ── SVG DOODLE COMPONENTS ── */

function WhatsAppIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/* Cute hand-drawn boba cup with face */
function CuteBobaCup({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" className="inline-block">
      {/* Straw */}
      <rect x="44" y="4" width="5" height="28" rx="2.5" fill="#7cb342" transform="rotate(6 46 18)" />
      <circle cx="46" cy="5" r="4" fill="#7cb342" opacity="0.6" />

      {/* Cup lid — sketchy */}
      <path d="M18 22 C18 19 22 17 40 17 C58 17 62 19 62 22 C62 25 58 27 40 27 C22 27 18 25 18 22Z" fill="#f5e6d3" stroke="#6b4226" strokeWidth="2.5" strokeLinejoin="round" />

      {/* Cup body — slightly wobbly hand-drawn look */}
      <path d="M20 27 C20 27 21 60 23 65 C25 68 35 70 40 70 C45 70 55 68 57 65 C59 60 60 27 60 27" fill="#fff8f0" stroke="#6b4226" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

      {/* Matcha liquid fill — wavy top */}
      <path d="M22 35 C26 32 32 38 40 35 C48 32 54 38 58 35 L57 60 C56 64 48 67 40 67 C32 67 24 64 23 60 Z" fill="#7cb342" opacity="0.3" />

      {/* Boba pearls */}
      <circle cx="30" cy="58" r="4" fill="#4a2c17" stroke="#3d2b1f" strokeWidth="1" />
      <circle cx="40" cy="62" r="4" fill="#4a2c17" stroke="#3d2b1f" strokeWidth="1" />
      <circle cx="50" cy="58" r="3.5" fill="#4a2c17" stroke="#3d2b1f" strokeWidth="1" />
      <circle cx="35" cy="55" r="3" fill="#4a2c17" stroke="#3d2b1f" strokeWidth="1" />
      <circle cx="46" cy="55" r="3" fill="#4a2c17" stroke="#3d2b1f" strokeWidth="1" />
      {/* Pearl shines */}
      <circle cx="29" cy="56.5" r="1.2" fill="rgba(255,255,255,0.4)" />
      <circle cx="39" cy="60.5" r="1.2" fill="rgba(255,255,255,0.4)" />

      {/* Cute face - eyes */}
      <circle cx="33" cy="42" r="2.5" fill="#3d2b1f" />
      <circle cx="47" cy="42" r="2.5" fill="#3d2b1f" />
      {/* Eye shines */}
      <circle cx="34" cy="41" r="1" fill="white" />
      <circle cx="48" cy="41" r="1" fill="white" />

      {/* Cute blush */}
      <ellipse cx="28" cy="46" rx="4" ry="2.5" fill="#f8bbd0" opacity="0.5" />
      <ellipse cx="52" cy="46" rx="4" ry="2.5" fill="#f8bbd0" opacity="0.5" />

      {/* Smile */}
      <path d="M36 47 C38 50 42 50 44 47" fill="none" stroke="#3d2b1f" strokeWidth="1.5" strokeLinecap="round" />

      {/* Heart above */}
      <path d="M40 10 C40 8 38 6.5 36.5 6.5 C35 6.5 33 8 33 10 C33 13 40 16 40 16 C40 16 47 13 47 10 C47 8 45 6.5 43.5 6.5 C42 6.5 40 8 40 10Z" fill="#f8bbd0" stroke="#e91e63" strokeWidth="0.8" opacity="0.7" />
    </svg>
  );
}

function DoodleHeart({ size = 24, color = "#f8bbd0" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="inline-block">
      <path
        d="M12 6 C12 4 10 2 8 2 C6 2 4 4 4 6 C4 10 12 16 12 16 C12 16 20 10 20 6 C20 4 18 2 16 2 C14 2 12 4 12 6Z"
        fill={color}
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DoodleLeaf({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="inline-block">
      <path
        d="M12 3 C6 7 3 12 5 18 C7 22 10 22 12 20 C14 22 17 22 19 18 C21 12 18 7 12 3Z"
        fill="#a5d66f"
        stroke="#7cb342"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M12 5 L12 18" stroke="#7cb342" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
      <path d="M12 10 L8 13" stroke="#7cb342" strokeWidth="0.8" opacity="0.4" strokeLinecap="round" />
      <path d="M12 13 L16 11" stroke="#7cb342" strokeWidth="0.8" opacity="0.4" strokeLinecap="round" />
    </svg>
  );
}

function DoodleStar({ size = 24, color = "#6b4226" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="inline-block">
      <path
        d="M12 2 L14 9 L21 9 L15.5 13 L17.5 20 L12 16 L6.5 20 L8.5 13 L3 9 L10 9 Z"
        fill={color}
        stroke={color}
        strokeWidth="1"
        strokeLinejoin="round"
        opacity="0.5"
      />
    </svg>
  );
}

function DoodleBobaPearl({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="inline-block">
      <circle cx="12" cy="12" r="9" fill="#4a2c17" stroke="#3d2b1f" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="2.5" fill="rgba(255,255,255,0.25)" />
    </svg>
  );
}

function DoodleSparkle({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" className="inline-block">
      <path d="M8 0 L9 6 L16 8 L9 10 L8 16 L7 10 L0 8 L7 6 Z" fill="#7cb342" opacity="0.4" />
    </svg>
  );
}
