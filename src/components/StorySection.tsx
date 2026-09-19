import { useState } from 'react';
import { audioManager } from '../utils/audio';
import { ScrollReveal, ScrollStagger, ScrollStaggerItem, ScrollDivider } from './ScrollReveal';

export function StorySection() {
  const [activeTab, setActiveTab] = useState<'philosophy' | 'origin' | 'rhythm'>('philosophy');

  const stats = [
    { label: 'EXTRACTION TIME', value: '24', unit: 'HOURS', note: 'Rolling marrow boil' },
    { label: 'COUNTER INTIMACY', value: '18', unit: 'SEATS', note: 'Single cedar counter' },
    { label: 'NOODLE HYDRATION', value: '34%', unit: 'KANSUI', note: 'Daily cellar extrusion' },
    { label: 'BINCHOTAN TEMP', value: '1,000°', unit: 'CELSIUS', note: 'Kishu white oak coals' },
  ];

  return (
    <section
      id="story"
      className="relative w-full min-h-screen py-20 md:py-28 px-6 md:px-12 bg-[#09090b] text-[#f4f4f0] overflow-hidden border-t border-white/[0.04] flex flex-col justify-center"
    >
      {/* Background Ambient Atmospheric Graphic */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-20 overflow-hidden">
        <div className="absolute top-1/4 -left-48 w-[600px] h-[600px] rounded-full bg-[#c53030]/10 blur-[140px]" />
        <div className="absolute bottom-10 right-0 w-[500px] h-[500px] rounded-full bg-[#ffaa5e]/5 blur-[120px]" />
        {/* Subtle Shoji screen geometric lines */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Tag */}
        <ScrollReveal variant="fade-up" distance={20} className="flex items-center gap-4 mb-12">
          <span className="text-[10px] font-mono tracking-[0.4em] text-[#c53030] uppercase">
            01 / PHILOSOPHY
          </span>
          <ScrollDivider className="w-16" color="#c53030" />
          <span className="text-xs font-['Noto_Serif_JP',serif] text-[#71717a] tracking-widest">
            調和と規律
          </span>
        </ScrollReveal>

        {/* Large Headline */}
        <ScrollReveal variant="fade-up" delay={0.1} distance={36} className="mb-20">
          <h2 className="font-['Cinzel',serif] text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.08em] font-normal leading-tight text-[#f4f4f0] max-w-5xl">
            A BOWL IS <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f4f4f0] via-[#e4e4e7] to-[#71717a]">
              A SACRED RITUAL.
            </span>
          </h2>
          <div className="mt-4 font-['Noto_Serif_JP',serif] text-xl md:text-2xl text-[#a1a1aa]/60 font-light tracking-[0.3em]">
            一口に込める、静寂と生命の鼓動。
          </div>
        </ScrollReveal>

        {/* 2-Column Editorial Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Left Column: Atmospheric Editorial Image with layered depth */}
          <ScrollReveal variant="fade-scale" delay={0.2} className="lg:col-span-6 relative group">
            <div className="relative aspect-[4/5] rounded-none overflow-hidden border border-white/10 shadow-2xl bg-[#121216]">
              <img
                src="https://img.magnific.com/free-photo/delicious-japanese-ramen-black-bowl_23-2152026858.jpg?semt=ais_hybrid&w=740&q=80"
                alt="Delicious Japanese ramen in a black bowl at Kobo Ramen counter"
                className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-1000"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent opacity-80" />

              {/* Floating Japanese Seal Stamp (Hanko) */}
              <div className="absolute top-6 right-6 w-14 h-14 border border-[#c53030]/60 bg-[#c53030]/10 backdrop-blur-md flex flex-col items-center justify-center text-[#f87171] font-['Noto_Serif_JP',serif] text-xs tracking-widest">
                <span>工</span>
                <span>房</span>
              </div>

              {/* Photo Caption Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#09090b]/80 backdrop-blur-md border border-white/10">
                <div className="text-[10px] font-mono tracking-[0.25em] text-[#c53030] uppercase mb-1">
                  ARCHIVE // FIGURE 01
                </div>
                <div className="text-xs text-[#d4d4d8] font-light">
                  The Master Chef tempering broth viscosity before the 5:00 PM evening chime.
                </div>
              </div>
            </div>

            {/* Subtle floating citation */}
            <div className="mt-4 flex items-center justify-between text-[10px] font-mono tracking-[0.25em] text-[#71717a]">
              <span>KYOTO TRADITION</span>
              <span>•</span>
              <span>LOWER MANHATTAN NOCTURNE</span>
            </div>
          </ScrollReveal>

          {/* Right Column: Narrative Content & Interactive Tabs */}
          <ScrollReveal variant="fade-up" delay={0.3} className="lg:col-span-6 flex flex-col justify-between h-full pt-4">
            {/* Interactive Narrative Tabs */}
            <div className="flex border-b border-white/10 mb-8">
              {(['philosophy', 'origin', 'rhythm'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    audioManager.playChime(392);
                    setActiveTab(tab);
                  }}
                  className={`pb-3 pr-8 text-xs font-mono tracking-[0.3em] uppercase transition-colors relative focus:outline-none ${
                    activeTab === tab ? 'text-[#f4f4f0]' : 'text-[#71717a] hover:text-[#a1a1aa]'
                  }`}
                  data-cursor="SELECT"
                >
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 right-8 h-[2px] bg-[#c53030]" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Descriptions */}
            <div className="min-h-[220px]">
              {activeTab === 'philosophy' && (
                <div className="space-y-6">
                  <p className="font-['Space_Grotesk',sans-serif] text-base md:text-lg text-[#e4e4e7] leading-relaxed font-light">
                    KŌBŌ was conceived not as a dining venue, but as an architectural and sensory refuge. In Japan, ramen is an art of absolute reduction: stripping away pretense until only marrow, wheat, fire, and water remain.
                  </p>
                  <p className="text-sm md:text-base text-[#a1a1aa] leading-relaxed font-light">
                    Inside our 18-seat Lower Manhattan sanctum, conversation slows to a murmur. There are no televisions, no loud pop music, no casual distractions. Only the hiss of binchotan embers, the billow of broth steam, and the singular devotion of the craftsman.
                  </p>
                </div>
              )}

              {activeTab === 'origin' && (
                <div className="space-y-6">
                  <p className="font-['Space_Grotesk',sans-serif] text-base md:text-lg text-[#e4e4e7] leading-relaxed font-light">
                    Born from ten years of study in the back alleys of Fukuoka and the temple kitchens of Kyoto, KŌBŌ imports centuries of generational broth alchemy into the nocturnal pulse of New York City.
                  </p>
                  <p className="text-sm md:text-base text-[#a1a1aa] leading-relaxed font-light">
                    We marry heritage Japanese ingredients — such as Rishiri island kombu, fermented white kansui, and Kishu binchotan — with the relentless, unyielding culinary precision that defines Manhattan at midnight.
                  </p>
                </div>
              )}

              {activeTab === 'rhythm' && (
                <div className="space-y-6">
                  <p className="font-['Space_Grotesk',sans-serif] text-base md:text-lg text-[#e4e4e7] leading-relaxed font-light">
                    The lifespan of perfect ramen is five minutes. The moment the steaming bowl touches your counter space, the clock begins. The noodles are at their highest elasticity; the broth oils are emulsified; the pork fat melts upon the tongue.
                  </p>
                  <p className="text-sm md:text-base text-[#a1a1aa] leading-relaxed font-light">
                    We ask our guests to surrender their phones and embrace the first sip in complete silence. You are tasting time, patience, and fire condensed into liquid form.
                  </p>
                </div>
              )}
            </div>

            {/* Architectural Stats Grid with Staggered Cascading Reveal */}
            <ScrollStagger
              staggerDelay={0.08}
              initialDelay={0.1}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-12 mt-12 border-t border-white/10"
            >
              {stats.map((s, idx) => (
                <ScrollStaggerItem key={idx} distance={20} className="flex flex-col">
                  <div className="text-[9px] font-mono tracking-[0.25em] text-[#71717a] uppercase mb-1">
                    {s.label}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-['Cinzel',serif] text-2xl md:text-3xl font-semibold text-[#f4f4f0]">
                      {s.value}
                    </span>
                    <span className="text-[10px] font-mono text-[#c53030] tracking-wider">
                      {s.unit}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#a1a1aa] mt-0.5">
                    {s.note}
                  </div>
                </ScrollStaggerItem>
              ))}
            </ScrollStagger>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

