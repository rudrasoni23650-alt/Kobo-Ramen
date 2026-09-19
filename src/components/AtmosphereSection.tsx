import { useState, useRef, useEffect, MouseEvent } from 'react';
import { audioManager } from '../utils/audio';
import { ScrollReveal, ScrollDivider, ScrollStagger, ScrollStaggerItem } from './ScrollReveal';

export function AtmosphereSection() {
  const [atmosphereMode, setAtmosphereMode] = useState<'twilight' | 'hearth' | 'midnight'>('twilight');
  const containerRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const mouseRafId = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          audioManager.setZone('sanctum');
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !parallaxRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 14;

    if (mouseRafId.current) return;
    mouseRafId.current = requestAnimationFrame(() => {
      mouseRafId.current = 0;
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.06)`;
      }
    });
  };

  const modes = {
    twilight: {
      name: 'MEDITATIVE TWILIGHT',
      japanese: '黄昏の静寂',
      glowColor: 'from-[#ff9b50]/20 via-transparent to-black',
      ambientFilter: 'sepia(15%) contrast(110%) brightness(85%)',
      desc: 'Soft warm washi paper lanterns suspended over charred Yakisugi cedar counter. Ideal for the contemplative first bowl.',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop',
    },
    hearth: {
      name: 'CHEF HEARTH EMBERS',
      japanese: '炭火の余燼',
      glowColor: 'from-[#c53030]/25 via-transparent to-black',
      ambientFilter: 'sepia(30%) contrast(125%) hue-rotate(-15deg) brightness(80%)',
      desc: 'Infrared glow radiating from the Kishu binchotan pit. Smoke curling into custom brass ventilation flues.',
      image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1600&auto=format&fit=crop',
    },
    midnight: {
      name: 'MIDNIGHT TOKYO NEON',
      japanese: '真夜中の残光',
      glowColor: 'from-[#3b82f6]/20 via-transparent to-black',
      ambientFilter: 'hue-rotate(20deg) contrast(120%) brightness(75%)',
      desc: 'Darkened dining room as rain taps the skylight. Deep shadows pierced only by the counter spotlight on each bowl.',
      image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1600&auto=format&fit=crop',
    },
  };

  const current = modes[atmosphereMode];

  return (
    <section
      id="atmosphere"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-screen py-20 md:py-28 px-6 md:px-12 bg-[#08080a] text-[#f4f4f0] border-t border-white/[0.04] overflow-hidden flex flex-col justify-between select-none"
    >
      {/* Background Room Perspective with Smooth Mouse Parallax */}
      <div
        ref={parallaxRef}
        className="absolute inset-0 z-0 transition-transform duration-500 ease-out pointer-events-none will-change-transform"
        style={{
          transform: 'translate3d(0px, 0px, 0) scale(1.06)',
        }}
      >
        <img
          src={current.image}
          alt="Atmospheric Japanese Ramen Bar interior with dark cedar counter"
          className="w-full h-full object-cover transition-all duration-1000"
          style={{ filter: current.ambientFilter }}
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${current.glowColor}`} />
        <div className="absolute inset-0 bg-black/65 backdrop-blur-[0.5px]" />
      </div>

      {/* Top Section Tag */}
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <ScrollReveal variant="fade-up" distance={20} className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono tracking-[0.4em] text-[#c53030] uppercase">
              05 / SANCTUM ARCHITECTURE
            </span>
            <ScrollDivider className="w-12" color="#c53030" />
            <span className="text-xs font-['Noto_Serif_JP',serif] text-[#a1a1aa] tracking-widest">
              十八席の空間美学
            </span>
          </div>

          {/* Lighting Ambience Selector */}
          <div className="flex items-center gap-2 p-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
            {(['twilight', 'hearth', 'midnight'] as const).map((modeKey) => (
              <button
                key={modeKey}
                onClick={() => {
                  audioManager.playChime(380 + (modeKey === 'twilight' ? 50 : modeKey === 'hearth' ? 100 : 150));
                  setAtmosphereMode(modeKey);
                }}
                className={`px-3.5 py-1.5 rounded-full text-[10px] font-mono tracking-widest uppercase transition-all duration-300 focus:outline-none ${
                  atmosphereMode === modeKey
                    ? 'bg-[#c53030] text-white shadow-md'
                    : 'text-[#a1a1aa] hover:text-white'
                }`}
                data-cursor="LIGHT"
              >
                {modeKey}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Central Monumental Typography with Scroll-Triggered Progressive Reveal */}
        <div className="my-12 md:my-24 max-w-5xl xl:max-w-6xl w-full">
          <div className="space-y-3 md:space-y-4">
            {/* Beat 1: 18 SEATS */}
            <ScrollReveal variant="fade-up" delay={0.1} distance={40} className="overflow-hidden">
              <h2 className="font-['Cinzel',serif] text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[0.06em] font-normal uppercase text-[#f4f4f0] leading-none">
                18 SEATS.
              </h2>
            </ScrollReveal>

            {/* Beat 2: ONE COUNTER */}
            <ScrollReveal variant="fade-up" delay={0.25} distance={40} className="overflow-hidden">
              <h2 className="font-['Cinzel',serif] text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[0.06em] font-normal uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#f4f4f0] via-[#d4d4d8] to-[#71717a] leading-none">
                ONE COUNTER.
              </h2>
            </ScrollReveal>

            {/* Beat 3: NO DISTRACTIONS */}
            <ScrollReveal variant="fade-up" delay={0.4} distance={40} className="overflow-hidden pr-3">
              <h2 className="font-['Cinzel',serif] text-4xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl 2xl:text-9xl tracking-[0.03em] sm:tracking-[0.04em] font-black uppercase text-[#c53030] leading-none whitespace-nowrap pr-2">
                NO DISTRACTIONS.
              </h2>
            </ScrollReveal>
          </div>

          <ScrollReveal variant="fade-up" delay={0.55} distance={20} className="mt-8 font-['Noto_Serif_JP',serif] text-lg sm:text-2xl text-[#d4d4d8]/70 tracking-[0.3em]">
            無駄を削ぎ落とした、十八席だけの濃密な時間。
          </ScrollReveal>
        </div>

        {/* Bottom Details Bar */}
        <ScrollReveal variant="fade-up" delay={0.3} className="pt-12 border-t border-white/10 bg-black/40 backdrop-blur-md p-6">
          <ScrollStagger staggerDelay={0.08} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ScrollStaggerItem distance={16}>
              <span className="text-[9px] font-mono tracking-[0.3em] text-[#c53030] uppercase block mb-1">
                MATERIAL HONESTY
              </span>
              <p className="text-xs text-[#d4d4d8] font-light leading-relaxed">
                Carved from single-slab ancient Japanese Yakisugi cedar charred with fire, framed by cold flamed basalt stone.
              </p>
            </ScrollStaggerItem>

            <ScrollStaggerItem distance={16}>
              <span className="text-[9px] font-mono tracking-[0.3em] text-[#c53030] uppercase block mb-1">
                ACOUSTIC ARCHITECTURE
              </span>
              <p className="text-xs text-[#d4d4d8] font-light leading-relaxed">
                Washi paper baffle ceiling engineered to dampen ambient room reverb, isolating the sensory sizzle of the kitchen.
              </p>
            </ScrollStaggerItem>

            <ScrollStaggerItem distance={16}>
              <span className="text-[9px] font-mono tracking-[0.3em] text-[#c53030] uppercase block mb-1">
                LIGHT ARCHETYPE
              </span>
              <p className="text-xs text-[#d4d4d8] font-light leading-relaxed">
                Focused narrow-beam spotlight directly illuminating each diner’s bowl, leaving guests enveloped in contemplative shadow.
              </p>
            </ScrollStaggerItem>
          </ScrollStagger>
        </ScrollReveal>
      </div>
    </section>
  );
}

