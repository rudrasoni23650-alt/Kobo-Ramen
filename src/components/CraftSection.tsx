import { useState } from 'react';
import { audioManager } from '../utils/audio';
import { ScrollReveal, ScrollDivider, ScrollStagger, ScrollStaggerItem } from './ScrollReveal';

export function CraftSection() {
  const [activeCraft, setActiveCraft] = useState<number>(0);

  const crafts = [
    {
      title: 'THE BIZEN-YAKI VESSEL',
      japanese: '備前焼の器',
      artisan: 'Master Terada, Okayama Prefecture',
      metric: '1,250°C Wood Fired For 14 Days',
      description:
        'Each donburi bowl is hand-thrown from iron-heavy mountain clay without glaze. Pine ash melting at 1,250°C creates spontaneous gold and ember patterns ("sangiri"). The dense ceramic retains intense broth heat for over 25 minutes.',
      image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=1200&auto=format&fit=crop',
    },
    {
      title: 'THE KANSUI NOODLE ALCHEMY',
      japanese: '自家製 かんすい麺',
      artisan: 'Cellar Extrusion Daily in Manhattan',
      metric: '34% Hydration • No. 24 Square Cut',
      description:
        'Crafted from high-protein hard winter wheat milled in Hokkaido and stone-ground flour. Hydrated with natural alkaline mineral water to trigger gluten elasticity, producing a resilient snap that holds against scalding broth.',
      image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=1200&auto=format&fit=crop',
    },
    {
      title: 'THE SAKAI FORGED BLADES',
      japanese: '堺の鍛造包丁',
      artisan: 'Shirogami #1 White Paper Steel',
      metric: '64 HRC Rockwell Hardness',
      description:
        'Every slice of chashu, needle-cut negi, and cured egg is parted with hand-hammered carbon steel from Sakai, Osaka. An edge so keen it shears through muscle fibers without crushing delicate aromatic cells.',
      image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?q=80&w=1200&auto=format&fit=crop',
    },
    {
      title: 'KISHU WHITE OAK BINCHOTAN',
      japanese: '紀州 備長炭',
      artisan: 'Wakayama Forest Coals',
      metric: '95% Pure Carbon Matrix',
      description:
        'Harvested sustainably from Japanese Holm oak, baked in clay ovens for weeks, and smothered in ash. It burns virtually smokeless with pure infrared radiation that locks chashu juices within a crisp caramelized crust.',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop',
    },
  ];

  const current = crafts[activeCraft];

  return (
    <section
      id="craft"
      className="relative w-full min-h-screen py-20 md:py-28 px-6 md:px-12 bg-[#09090b] text-[#f4f4f0] border-t border-white/[0.04] overflow-hidden flex flex-col justify-center"
    >
      {/* Subtle Japanese Architectural Vertical Lattice Lines */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] flex justify-between px-8">
        {[...Array(16)].map((_, i) => (
          <div key={i} className="w-[1px] h-full bg-white" />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <ScrollReveal variant="fade-up" distance={20} className="flex items-center gap-4 mb-8">
          <span className="text-[10px] font-mono tracking-[0.4em] text-[#c53030] uppercase">
            08 / ARTISAN GUILD
          </span>
          <ScrollDivider className="w-16" color="#c53030" />
          <span className="text-xs font-['Noto_Serif_JP',serif] text-[#71717a] tracking-widest">
            職人の手業
          </span>
        </ScrollReveal>

        {/* Large Headline */}
        <ScrollReveal variant="fade-up" delay={0.1} distance={30} className="mb-16">
          <h2 className="font-['Cinzel',serif] text-4xl sm:text-6xl md:text-8xl tracking-[0.06em] font-normal uppercase text-[#f4f4f0]">
            MADE BY HAND. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f4f4f0] via-[#d4d4d8] to-[#71717a]">
              SHAPED BY TIME.
            </span>
          </h2>
          <p className="mt-3 text-xs sm:text-sm font-mono tracking-[0.3em] text-[#a1a1aa] uppercase max-w-xl">
            FOUR CENTURIES OF JAPANESE DISCIPLINE IN FOUR PILLARS.
          </p>
        </ScrollReveal>

        {/* 4 Pillars Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Left Column: Pillar Buttons */}
          <ScrollReveal variant="fade-up" delay={0.15} className="lg:col-span-5 flex flex-col justify-between space-y-3">
            <ScrollStagger staggerDelay={0.06} className="space-y-3">
              {crafts.map((craft, idx) => {
                const isActive = activeCraft === idx;
                return (
                  <ScrollStaggerItem
                    key={idx}
                    distance={16}
                    onClick={() => {
                      audioManager.playChime(360 + idx * 45);
                      setActiveCraft(idx);
                    }}
                    className={`w-full p-6 text-left border transition-all duration-300 cursor-pointer focus:outline-none ${
                      isActive
                        ? 'border-[#c53030] bg-[#16161c] text-white shadow-xl translate-x-1'
                        : 'border-white/10 bg-[#0e0e12] text-[#a1a1aa] hover:border-white/20 hover:text-white'
                    }`}
                    data-cursor="INSPECT"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono tracking-widest text-[#c53030] uppercase">
                        PILLAR 0{idx + 1}
                      </span>
                      <span className="text-xs font-['Noto_Serif_JP',serif] text-[#71717a]">
                        {craft.japanese}
                      </span>
                    </div>
                    <div className="font-['Cinzel',serif] text-lg sm:text-xl font-normal text-white">
                      {craft.title}
                    </div>
                    <div className="text-[11px] font-mono text-[#f59e0b] tracking-wider mt-1">
                      {craft.metric}
                    </div>
                  </ScrollStaggerItem>
                );
              })}
            </ScrollStagger>
          </ScrollReveal>

          {/* Right Column: Active Pillar Editorial Focus */}
          <ScrollReveal variant="fade-scale" delay={0.25} className="lg:col-span-7 relative p-8 sm:p-12 border border-white/10 bg-[#121217] flex flex-col justify-between shadow-2xl overflow-hidden">
            {/* Background image preview */}
            <div className="relative aspect-[16/9] w-full overflow-hidden mb-8 border border-white/10 bg-black">
              <img
                src={current.image}
                alt={current.title}
                className="w-full h-full object-cover filter contrast-110 brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121217] via-transparent to-transparent opacity-80" />
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono tracking-[0.3em] text-[#c53030] uppercase block mb-1">
                  {current.artisan}
                </span>
                <h3 className="font-['Cinzel',serif] text-3xl sm:text-4xl text-white font-normal">
                  {current.title}
                </h3>
              </div>

              <p className="text-sm sm:text-base text-[#d4d4d8] leading-relaxed font-light">
                {current.description}
              </p>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#a1a1aa]">
                <span>ORIGIN: JAPAN & MANHATTAN</span>
                <span className="text-[#f59e0b]">{current.metric}</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

