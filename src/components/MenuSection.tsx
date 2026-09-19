import { useState, useRef, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MENU_ITEMS } from '../data/menuData';
import { MenuItem } from '../types';
import { audioManager } from '../utils/audio';
import { X, Wine, Eye, Droplet, Sparkles } from 'lucide-react';
import { useMagnetic } from '../utils/useMagnetic';
import { ScrollReveal, ScrollDivider } from './ScrollReveal';

function MenuCard({ dish, onOpen }: { key?: string; dish: MenuItem; onOpen: (dish: MenuItem) => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    const rotX = ((y / rect.height) - 0.5) * -14;
    const rotY = ((x / rect.width) - 0.5) * 14;

    setTransform(`perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`);
    setGlare({ x: xPercent, y: yPercent, opacity: 0.18 });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlare({ x: 50, y: 50, opacity: 0 });
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpen(dish)}
      style={{
        transform,
        transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform',
      }}
      className="group relative flex flex-col h-full p-6 sm:p-8 bg-[#121217] border border-white/10 hover:border-white/30 cursor-pointer shadow-xl overflow-hidden select-none"
      data-cursor="TASTE"
    >
      {/* Specular Glare Layer moving with mouse */}
      <div
        className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}), transparent 60%)`,
        }}
      />

      {/* Image Preview with Zoom on Hover */}
      <div className="relative aspect-[4/3] overflow-hidden mb-6 bg-black shrink-0">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover filter brightness-95 group-hover:scale-108 transition-transform duration-700"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121217] via-transparent to-transparent opacity-80" />

        {/* Price and Highlight Badges */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md border border-white/15 text-xs font-mono text-[#f4f4f0] font-semibold">
          {dish.price}
        </div>

        <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-[#c53030]/90 backdrop-blur-md text-[10px] font-mono tracking-wider text-white uppercase">
          {dish.highlight}
        </div>
      </div>

      {/* Content wrapper taking available vertical space */}
      <div className="flex flex-col flex-1">
        {/* Title & Japanese Name */}
        <div className="space-y-1 mb-4">
          <div className="flex items-center justify-between">
            <h3 className="font-['Cinzel',serif] text-xl sm:text-2xl text-white font-medium group-hover:text-[#c53030] transition-colors">
              {dish.name}
            </h3>
          </div>
          <div className="text-xs font-['Noto_Serif_JP',serif] text-[#71717a] tracking-widest">
            {dish.japaneseName}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#a1a1aa] font-light leading-relaxed mb-6 line-clamp-3 flex-1">
          {dish.description}
        </p>

        {/* Tasting Notes Pills */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap gap-1.5 mb-4">
          {dish.tastingNotes.slice(0, 3).map((note, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-[9px] font-mono text-[#d4d4d8]"
            >
              {note}
            </span>
          ))}
        </div>

        {/* Card Footer Call to Action */}
        <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-[#c53030] group-hover:text-white transition-colors mt-auto">
          <span className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>INSPECT PROFILE</span>
          </span>
          <span className="transform group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </div>
  );
}

export function MenuSection() {
  const [activeCategory, setActiveCategory] = useState<'ramen' | 'small_plates' | 'sides' | 'drinks'>('ramen');
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);

  const categoryConfigs = {
    ramen: {
      label: 'RAMEN MASTERWORKS',
      japanese: '拉麺 魂の一杯',
      colorTheme: 'from-[#c53030]/15 to-transparent',
      borderColor: 'border-[#c53030]/40',
      badgeBg: 'bg-[#c53030]/20 text-[#fca5a5]',
      desc: 'Our defining bowls. Emulsified collagen, alkaline kansui noodles, and charred aromatics.',
    },
    small_plates: {
      label: 'IZAKAYA SMALL PLATES',
      japanese: '酒肴 小皿料理',
      colorTheme: 'from-[#78350f]/15 to-transparent',
      borderColor: 'border-[#b45309]/40',
      badgeBg: 'bg-[#b45309]/20 text-[#fcd34d]',
      desc: 'Tactile bites designed to accompany fine saké and highballs before the main bowl.',
    },
    sides: {
      label: 'SIDES & CONDIMENTS',
      japanese: '添え物 薬味',
      colorTheme: 'from-[#27272a]/40 to-transparent',
      borderColor: 'border-white/20',
      badgeBg: 'bg-white/10 text-[#d4d4d8]',
      desc: 'Crafted accompaniments, charred over binchotan embers and seasoned with grey sea salt.',
    },
    drinks: {
      label: 'SAKÉ & NOCTURNAL SPIRITS',
      japanese: '日本酒・洋酒',
      colorTheme: 'from-[#1e3a8a]/20 to-transparent',
      borderColor: 'border-[#3b82f6]/40',
      badgeBg: 'bg-[#1d4ed8]/20 text-[#93c5fd]',
      desc: 'Curated Junmai Daiginjo, hand-carved ice cocktails, and single-cask Japanese whiskies.',
    },
  };

  const currentTheme = categoryConfigs[activeCategory];
  const filteredDishes = MENU_ITEMS.filter((item) => item.category === activeCategory);

  const handleCategorySwitch = (cat: 'ramen' | 'small_plates' | 'sides' | 'drinks') => {
    audioManager.playChime(cat === 'ramen' ? 440 : cat === 'small_plates' ? 392 : cat === 'sides' ? 330 : 520);
    setActiveCategory(cat);
  };

  const handleOpenDish = (dish: MenuItem) => {
    audioManager.playChime(494);
    setSelectedDish(dish);
  };

  return (
    <section
      id="menu"
      className="relative w-full min-h-screen py-20 md:py-28 px-6 md:px-12 bg-[#09090b] text-[#f4f4f0] border-t border-white/[0.04] transition-colors duration-1000 overflow-hidden flex flex-col justify-center"
    >
      {/* Category Ambient Dynamic Atmosphere Glow */}
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${currentTheme.colorTheme} transition-all duration-1000 opacity-80`}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Tag */}
        <ScrollReveal variant="fade-up" distance={20} className="flex items-center gap-4 mb-8">
          <span className="text-[10px] font-mono tracking-[0.4em] text-[#c53030] uppercase">
            07 / ART INSTALLATION MENU
          </span>
          <ScrollDivider className="w-16" color="#c53030" />
          <span className="text-xs font-['Noto_Serif_JP',serif] text-[#71717a] tracking-widest">
            {currentTheme.japanese}
          </span>
        </ScrollReveal>

        {/* Section Header */}
        <ScrollReveal variant="fade-up" delay={0.1} distance={30} className="flex flex-col xl:flex-row xl:items-end justify-between mb-12 gap-8 border-b border-white/[0.06] pb-8">
          <div className="max-w-2xl">
            <h2 className="font-['Cinzel',serif] text-3xl sm:text-5xl lg:text-6xl tracking-[0.05em] font-normal uppercase text-[#f4f4f0] leading-tight">
              THE CULINARY <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f4f4f0] via-[#e4e4e7] to-[#a1a1aa]">
                COLLECTION.
              </span>
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-[#a1a1aa] font-mono tracking-widest uppercase">
              {currentTheme.desc}
            </p>
          </div>

          {/* Interactive Category Selector Buttons */}
          <div className="inline-flex items-center gap-1.5 p-1.5 rounded-full bg-[#121217] border border-white/10 shadow-2xl backdrop-blur-md overflow-x-auto max-w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] self-start xl:self-end">
            {(['ramen', 'small_plates', 'sides', 'drinks'] as const).map((cat) => {
              const count = MENU_ITEMS.filter((item) => item.category === cat).length;
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategorySwitch(cat)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono tracking-[0.16em] uppercase transition-all duration-300 focus:outline-none shrink-0 whitespace-nowrap ${
                    isActive
                      ? 'bg-[#c53030] text-white shadow-lg shadow-[#c53030]/30 font-semibold'
                      : 'text-[#8e8e93] hover:text-[#f4f4f0] hover:bg-white/[0.05]'
                  }`}
                  data-cursor="CATEGORY"
                >
                  <span>{cat.replace('_', ' ')}</span>
                  <span
                    className={`text-[10px] font-mono tracking-normal transition-colors ${
                      isActive ? 'text-white/80' : 'text-[#71717a]'
                    }`}
                  >
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Dynamic 3D Perspective Cards Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 min-h-[400px]"
          >
            {filteredDishes.map((dish, idx) => (
              <motion.div
                key={dish.id}
                className="h-full flex flex-col"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: Math.min(idx * 0.05, 0.2),
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <MenuCard dish={dish} onOpen={handleOpenDish} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dish Detail Modal */}
      {selectedDish && (
        <div
          id="dish-detail-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl"
          onClick={() => setSelectedDish(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-[#121217] border border-white/20 p-6 sm:p-10 shadow-2xl overflow-y-auto max-h-[90vh] space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedDish(null)}
              className="absolute top-6 right-6 p-2 text-[#a1a1aa] hover:text-white border border-white/10 rounded-full focus:outline-none"
              aria-label="Close modal"
              data-cursor="CLOSE"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative aspect-[16/9] w-full overflow-hidden bg-black border border-white/10">
              <img
                src={selectedDish.image}
                alt={selectedDish.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121217] via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-3">
                <span className="font-['Cinzel',serif] text-2xl sm:text-3xl text-white font-semibold">
                  {selectedDish.price}
                </span>
                <span className="px-2.5 py-1 bg-[#c53030] text-white text-[10px] font-mono tracking-widest uppercase">
                  {selectedDish.highlight}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] text-[#c53030] uppercase block mb-1">
                CULINARY MASTERWORK
              </span>
              <h3 className="font-['Cinzel',serif] text-2xl sm:text-4xl text-white font-normal">
                {selectedDish.name}
              </h3>
              <div className="text-sm font-['Noto_Serif_JP',serif] text-[#a1a1aa] tracking-widest mt-1">
                {selectedDish.japaneseName}
              </div>
            </div>

            <p className="text-sm sm:text-base text-[#d4d4d8] leading-relaxed font-light">
              {selectedDish.description}
            </p>

            {/* Broth Viscosity Meter if applicable */}
            {selectedDish.brothViscosity && (
              <div className="p-4 border border-white/10 bg-[#09090b] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-[#f59e0b]">
                    <Droplet className="w-3.5 h-3.5" />
                    BROTH VISCOSITY & BODY
                  </span>
                  <span className="text-[#a1a1aa]">
                    LEVEL {selectedDish.brothViscosity} / 5
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden flex">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`flex-1 h-full border-r border-black ${
                        level <= (selectedDish.brothViscosity || 0)
                          ? 'bg-[#c53030]'
                          : 'bg-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Components Breakdown */}
            <div>
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#71717a] uppercase block mb-2">
                COMPONENTS & BOTANICALS
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedDish.ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-white/[0.04] border border-white/10 text-xs font-mono text-[#d4d4d8]"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Sommelier Recommended Pairing */}
            {selectedDish.pairing && (
              <div className="p-4 border border-[#3b82f6]/30 bg-[#1e3a8a]/10 flex items-center gap-3">
                <Wine className="w-5 h-5 text-[#60a5fa] shrink-0" />
                <div className="text-xs">
                  <span className="text-[#93c5fd] font-mono uppercase tracking-widest text-[9px] block">
                    SOMMELIER SUGGESTED PAIRING
                  </span>
                  <span className="text-[#f4f4f0] font-medium font-['Space_Grotesk']">
                    {selectedDish.pairing}
                  </span>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <a
                href="#reservation"
                onClick={() => {
                  setSelectedDish(null);
                  audioManager.playChime(528);
                }}
                className="w-full py-3 bg-[#c53030] hover:bg-[#b91c1c] text-white text-xs font-medium tracking-[0.25em] uppercase text-center transition-colors"
                data-cursor="RESERVE"
              >
                RESERVE COUNTER TO TASTE
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
