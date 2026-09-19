import { useState, ChangeEvent, useEffect, useRef } from 'react';
import { audioManager } from '../utils/audio';
import { Compass, MapPin } from 'lucide-react';
import { ScrollReveal, ScrollDivider } from './ScrollReveal';

const DEFAULT_SHINJUKU_IMG = '/images/shinjuku_kobo.png';
const DEFAULT_NEWYORK_IMG = '/images/newyork_kobo.png';

export function NewYorkTokyoSection() {
  const [splitPosition, setSplitPosition] = useState(50); // percentage
  const [shinjukuImg, setShinjukuImg] = useState<string>(DEFAULT_SHINJUKU_IMG);
  const [newYorkImg, setNewYorkImg] = useState<string>(DEFAULT_NEWYORK_IMG);

  const sectionRef = useRef<HTMLDivElement>(null);

  // Check server for any detected storefront images
  useEffect(() => {
    const checkServerImages = async () => {
      try {
        const res = await fetch('/api/detect-storefront-images');
        if (res.ok) {
          const data = await res.json();
          if (data.tokyoImg) setShinjukuImg(data.tokyoImg);
          if (data.nyImg) setNewYorkImg(data.nyImg);
        }
      } catch {
        // Dev server or network offline
      }
    };

    checkServerImages();
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          audioManager.setZone('night');
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSliderMove = (e: ChangeEvent<HTMLInputElement>) => {
    setSplitPosition(Number(e.target.value));
  };

  return (
    <section
      id="duality"
      ref={sectionRef}
      className="relative w-full min-h-screen py-20 md:py-28 px-6 md:px-12 bg-[#08080b] text-[#f4f4f0] border-t border-white/[0.04] overflow-hidden flex flex-col justify-center"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Tag */}
        <ScrollReveal variant="fade-up" distance={20} className="flex items-center gap-4 mb-8">
          <span className="text-[10px] font-mono tracking-[0.4em] text-[#c53030] uppercase">
            06 / THE DUALITY
          </span>
          <ScrollDivider className="w-16" color="#c53030" />
          <span className="text-xs font-['Noto_Serif_JP',serif] text-[#71717a] tracking-widest">
            東京の魂・紐育の心
          </span>
        </ScrollReveal>

        {/* Monumental Headline */}
        <ScrollReveal variant="fade-up" delay={0.1} distance={30} className="mb-10 sm:mb-16">
          <h2 className="font-['Cinzel',serif] text-3xl sm:text-5xl md:text-7xl lg:text-8xl tracking-[0.04em] sm:tracking-[0.06em] font-normal uppercase text-[#f4f4f0] leading-tight">
            TOKYO IN SPIRIT. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] via-[#c53030] to-[#f59e0b]">
              NEW YORK AT HEART.
            </span>
          </h2>
          <p className="mt-3 sm:mt-4 text-[11px] sm:text-xs md:text-sm font-mono tracking-[0.2em] sm:tracking-[0.3em] text-[#a1a1aa] uppercase max-w-xl">
            TWO CAPITALS OF MIDNIGHT. UNITED IN A SINGLE STEAMING BOWL.
          </p>
        </ScrollReveal>

        {/* Dual Split-Screen Interactive Comparison Stage */}
        <ScrollReveal variant="fade-scale" delay={0.15} className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] rounded-none border border-white/15 overflow-hidden shadow-2xl group select-none">
          {/* TOKYO SIDE (Left Layer) */}
          <div className="absolute inset-0 z-0">
            <img
              src={shinjukuImg}
              alt="KŌBŌ RAMEN Shinjuku storefront at night with traditional wooden lantern and cedar slats"
              className="w-full h-full object-cover filter contrast-110 brightness-95 group-hover:scale-102 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent pointer-events-none" />

            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 z-10 space-y-1 sm:space-y-1.5 pointer-events-none max-w-[70%] sm:max-w-none">
              <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.25em] sm:tracking-[0.3em] text-[#38bdf8] uppercase block">
                01 // TOKYO ORIGIN • SHINJUKU
              </span>
              <h3 className="font-['Cinzel',serif] text-lg sm:text-2xl md:text-4xl text-white font-medium tracking-wide leading-tight">
                KŌBŌ RAMEN • 工房
              </h3>
              <p className="text-[10px] sm:text-xs text-[#bae6fd] font-mono tracking-wider max-w-xs sm:max-w-sm pt-0.5 sm:pt-1 leading-relaxed hidden xs:block sm:block">
                Kabukicho neon nightlights, vertical cedar louvers, glowing washi paper lantern, and three centuries of tare fermentation.
              </p>
            </div>
          </div>

          {/* NEW YORK SIDE (Right Layer clipped by splitPosition) */}
          <div
            className="absolute inset-0 z-10 overflow-hidden"
            style={{ clipPath: `polygon(${splitPosition}% 0, 100% 0, 100% 100%, ${splitPosition}% 100%)` }}
          >
            <img
              src={newYorkImg}
              alt="KOBO RAMEN BAR Lower Manhattan flagship storefront with backlit signage, Michelin star crest, and Empire State Building"
              className="w-full h-full object-cover filter contrast-110 brightness-95 group-hover:scale-102 transition-transform duration-1000"
            />

            {/* Subtle Passing NYC Taxi Headlight / Bokeh Beam */}
            <div className="pointer-events-none absolute -inset-x-full top-0 h-full w-[200%] bg-gradient-to-r from-transparent via-amber-500/10 to-transparent animate-pulse duration-3000" />

            {/* Rain streaks on Lower Manhattan glass */}
            <div
              className="pointer-events-none absolute inset-0 opacity-15 mix-blend-screen"
              style={{
                backgroundImage: `repeating-linear-gradient(105deg, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 1px, transparent 1px, transparent 18px)`,
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/50 to-transparent pointer-events-none" />

            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 z-10 text-right space-y-1 sm:space-y-1.5 pointer-events-none max-w-[70%] sm:max-w-none ml-auto">
              <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.25em] sm:tracking-[0.3em] text-[#f59e0b] uppercase block">
                02 // MANHATTAN FLAGSHIP • NYC
              </span>
              <h3 className="font-['Cinzel',serif] text-lg sm:text-2xl md:text-4xl text-white font-medium tracking-wide leading-tight">
                KOBO RAMEN BAR • こぼ
              </h3>
              <p className="text-[10px] sm:text-xs text-[#fed7aa] font-mono tracking-wider max-w-xs sm:max-w-sm pt-0.5 sm:pt-1 ml-auto leading-relaxed hidden xs:block sm:block">
                18-seat omakase counter, glowing tea-lit basalt stone, Michelin Star recognition, and the Empire State Building skyline.
              </p>
            </div>
          </div>

          {/* Interactive Split Divider Handle Line */}
          <div
            className="absolute top-0 bottom-0 z-20 w-[2px] bg-white pointer-events-none shadow-[0_0_15px_rgba(255,255,255,0.8)]"
            style={{ left: `${splitPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#09090b] border-2 border-white flex items-center justify-center text-white text-[10px] font-mono shadow-xl">
              ↔
            </div>
          </div>

          {/* Hidden Range Input overlay for smooth dragging */}
          <input
            type="range"
            min="10"
            max="90"
            value={splitPosition}
            onChange={handleSliderMove}
            className="absolute inset-0 opacity-0 cursor-ew-resize z-30 w-full h-full"
            aria-label="Drag to compare Shinjuku vs New York"
            data-cursor="DRAG DUALITY"
          />
        </ScrollReveal>

        {/* Narrative Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16 pt-12 border-t border-white/10">
          <ScrollReveal variant="fade-up" delay={0.2} className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#38bdf8] tracking-widest uppercase">
              <Compass className="w-4 h-4" />
              <span>THE JAPANESE DISCIPLINE • SHINJUKU</span>
            </div>
            <p className="text-sm md:text-base text-[#d4d4d8] font-light leading-relaxed">
              We never take shortcuts. We import whole dried kombu fronds from Hokkaido, unpasteurized shoyu from 150-year-old cedar vats in Nagano, and stone-cut ramen bowls from Okayama kilns. The technical rigor belongs purely to the old masters.
            </p>
          </ScrollReveal>

          <ScrollReveal variant="fade-up" delay={0.3} className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#f59e0b] tracking-widest uppercase">
              <MapPin className="w-4 h-4" />
              <span>THE NEW YORK INTENSITY • MANHATTAN</span>
            </div>
            <p className="text-sm md:text-base text-[#d4d4d8] font-light leading-relaxed">
              Yet KŌBŌ could only exist in New York. The late-night urgency, the multicultural culinary fearlessness, the intimate 18-seat energy where artists, chefs, and night wanderers sit shoulder to shoulder over boiling broth with the Empire State silhouette outside.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
