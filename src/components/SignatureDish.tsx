import { useState } from 'react';
import { SIGNATURE_INGREDIENTS } from '../data/menuData';
import { audioManager } from '../utils/audio';
import { Sparkles, Info, Flame } from 'lucide-react';
import { ScrollReveal, ScrollStagger, ScrollStaggerItem, ScrollDivider } from './ScrollReveal';

export function SignatureDish() {
  const [activeIngredientId, setActiveIngredientId] = useState<string>('chashu');

  const activeIngredient =
    SIGNATURE_INGREDIENTS.find((ing) => ing.id === activeIngredientId) ||
    SIGNATURE_INGREDIENTS[0];

  const handleSelectIngredient = (id: string) => {
    audioManager.playChime(420);
    setActiveIngredientId(id);
  };

  return (
    <section
      id="signature"
      className="relative w-full min-h-screen py-20 md:py-28 px-6 md:px-12 bg-[#09090b] text-[#f4f4f0] border-t border-white/[0.04] overflow-hidden flex flex-col justify-center"
    >
      {/* Background Japanese Watermark */}
      <div className="pointer-events-none absolute right-4 top-20 text-white/[0.03] font-['Noto_Serif_JP',serif] text-8xl md:text-[14rem] font-black select-none leading-none">
        極味
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <ScrollReveal variant="fade-up" distance={30} className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[10px] font-mono tracking-[0.4em] text-[#c53030] uppercase">
                03 / SIGNATURE CREATION
              </span>
              <ScrollDivider className="w-12" color="#c53030" />
              <span className="text-xs font-['Noto_Serif_JP',serif] text-[#71717a] tracking-widest">
                至高の一杯
              </span>
            </div>
            <h2 className="font-['Cinzel',serif] text-4xl sm:text-6xl md:text-7xl tracking-[0.08em] font-normal uppercase text-[#f4f4f0]">
              KŌBŌ TONKOTSU
            </h2>
            <div className="text-sm font-['Space_Grotesk',sans-serif] text-[#a1a1aa] tracking-[0.3em] uppercase mt-2">
              THE 24-HOUR MANHATTAN PILGRIMAGE • $26
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 border border-[#c53030]/30 bg-[#c53030]/10 rounded-full text-xs font-mono text-[#fca5a5] tracking-widest">
            <Flame className="w-3.5 h-3.5 text-[#c53030] animate-pulse" />
            <span>SERVED PIPING HOT AT 88°C</span>
          </div>
        </ScrollReveal>

        {/* Interactive Visual Display Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Main Visual Bowl Showcase with Interactive Hotspots */}
          <ScrollReveal variant="fade-scale" delay={0.15} className="lg:col-span-8 relative aspect-square sm:aspect-[4/3] rounded-none border border-white/10 bg-[#121216] overflow-hidden group shadow-2xl">
            {/* Cinematic High Resolution Food Imagery */}
            <img
              src="https://thumbs.dreamstime.com/b/fresh-delicious-ramen-soup-egg-ramen-soup-egg-spring-onion-vegetables-250148802.jpg"
              alt="Kobo Signature Tonkotsu Ramen close-up"
              className="w-full h-full object-cover object-center filter contrast-110 brightness-95 group-hover:scale-105 transition-transform duration-1000"
              loading="lazy"
              referrerPolicy="no-referrer"
            />

            {/* Dark Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-[#09090b]/40 pointer-events-none" />

            {/* Rising Steam Effect Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06)_0%,transparent_65%)]" />

            {/* Dynamic Ingredient Hotspots */}
            {SIGNATURE_INGREDIENTS.map((ing) => {
              const isActive = activeIngredientId === ing.id;
              return (
                <div
                  key={ing.id}
                  style={{ left: `${ing.x}%`, top: `${ing.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  <button
                    onClick={() => handleSelectIngredient(ing.id)}
                    className={`relative flex items-center justify-center transition-transform duration-300 focus:outline-none ${
                      isActive ? 'scale-125' : 'hover:scale-110'
                    }`}
                    data-cursor="INSPECT"
                    aria-label={`Inspect ${ing.name}`}
                  >
                    {/* Ping ring animation */}
                    <span
                      className={`absolute w-8 h-8 rounded-full border transition-opacity ${
                        isActive
                          ? 'border-[#c53030] bg-[#c53030]/30 animate-ping opacity-90'
                          : 'border-white/40 bg-white/10 opacity-40'
                      }`}
                    />
                    {/* Center Core dot */}
                    <span
                      className={`w-3.5 h-3.5 rounded-full border-2 transition-colors shadow-lg ${
                        isActive
                          ? 'bg-[#c53030] border-white shadow-[#c53030]'
                          : 'bg-white border-black'
                      }`}
                    />
                  </button>

                  {/* Hotspot Floating Label */}
                  <div
                    className={`absolute left-5 top-1/2 -translate-y-1/2 px-3 py-1 rounded bg-[#09090b]/90 border border-white/20 backdrop-blur-md whitespace-nowrap pointer-events-none transition-all duration-300 ${
                      isActive
                        ? 'opacity-100 translate-x-0 border-[#c53030]'
                        : 'opacity-0 -translate-x-2'
                    }`}
                  >
                    <span className="text-[10px] font-mono tracking-widest text-[#f4f4f0] uppercase font-semibold">
                      {ing.name}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Bottom Floating Bar */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
              <span className="px-3 py-1.5 bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono tracking-widest text-[#a1a1aa] uppercase">
                INTERACTIVE DECONSTRUCTION • 6 HOTSPOTS
              </span>
              <span className="text-xs font-['Noto_Serif_JP',serif] text-[#d4d4d8] bg-black/70 px-3 py-1.5 backdrop-blur-md border border-white/10">
                工房特製
              </span>
            </div>
          </ScrollReveal>

          {/* Right Column: Active Ingredient Breakdown & Origin Panel */}
          <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-6">
            {/* Quick Ingredient Selector List */}
            <ScrollReveal variant="fade-up" delay={0.2} className="space-y-1.5">
              <span className="text-[10px] font-mono tracking-[0.3em] text-[#71717a] uppercase block mb-3">
                ANATOMY OF THE BOWL
              </span>
              <ScrollStagger staggerDelay={0.06} className="grid grid-cols-2 gap-2">
                {SIGNATURE_INGREDIENTS.map((ing) => {
                  const isActive = activeIngredientId === ing.id;
                  return (
                    <ScrollStaggerItem
                      key={ing.id}
                      distance={16}
                      onClick={() => handleSelectIngredient(ing.id)}
                      className={`p-3 text-left border transition-all duration-300 cursor-pointer focus:outline-none ${
                        isActive
                          ? 'border-[#c53030] bg-[#c53030]/10 text-white shadow-md'
                          : 'border-white/10 bg-[#121216] text-[#a1a1aa] hover:border-white/25 hover:text-white'
                      }`}
                      data-cursor="SELECT"
                    >
                      <div className="text-[9px] font-['Noto_Serif_JP',serif] text-[#71717a] mb-0.5">
                        {ing.japanese}
                      </div>
                      <div className="text-xs font-mono tracking-wide font-medium leading-tight">
                        {ing.name}
                      </div>
                    </ScrollStaggerItem>
                  );
                })}
              </ScrollStagger>
            </ScrollReveal>

            {/* Active Selected Ingredient Highlight Card */}
            <ScrollReveal variant="fade-up" delay={0.3} className="p-6 md:p-8 border border-white/10 bg-[#121216] space-y-5 relative">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono tracking-[0.3em] text-[#c53030] uppercase block">
                    ACTIVE ELEMENT FOCUS
                  </span>
                  <h3 className="font-['Cinzel',serif] text-2xl text-[#f4f4f0] font-normal mt-1">
                    {activeIngredient.name}
                  </h3>
                </div>
                <span className="font-['Noto_Serif_JP',serif] text-xl text-[#c53030] border border-[#c53030]/30 px-2 py-1">
                  {activeIngredient.japanese}
                </span>
              </div>

              <p className="text-sm text-[#d4d4d8] leading-relaxed font-light">
                {activeIngredient.description}
              </p>

              <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                <Info className="w-4 h-4 text-[#c53030] shrink-0" />
                <div className="text-xs text-[#a1a1aa] font-mono">
                  <span className="text-[#71717a] block text-[9px] uppercase tracking-widest">
                    PROVENANCE & SOURCING
                  </span>
                  {activeIngredient.source}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 text-[10px] font-mono text-[#f59e0b] tracking-widest">
                <Sparkles className="w-3 h-3" />
                <span>EACH COMPONENT PREPARED FRESH IN CELLAR DAILY</span>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

