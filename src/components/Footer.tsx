import { MouseEvent } from 'react';
import { ArrowUp } from 'lucide-react';
import { audioManager } from '../utils/audio';
import { ScrollReveal } from './ScrollReveal';
import { smoothScrollTo } from './SmoothScroll';

export function Footer() {
  const scrollToTop = () => {
    audioManager.playChime(600);
    smoothScrollTo(0);
  };

  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    audioManager.playChime(420);
    smoothScrollTo(hash);
  };

  return (
    <footer
      id="footer"
      className="relative w-full min-h-screen py-20 px-6 md:px-12 bg-gradient-to-b from-[#08080a] via-[#050507] to-black text-[#f4f4f0] border-t border-white/[0.04] overflow-hidden flex flex-col justify-center"
    >
      <div className="max-w-7xl mx-auto flex flex-col justify-between min-h-[400px]">
        {/* Top Minimal Navigation Links */}
        <ScrollReveal variant="fade-up" distance={20} className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-16 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="font-['Cinzel',serif] text-2xl tracking-[0.2em] font-semibold text-white">
              KŌBŌ
            </span>
            <span className="text-xs font-['Noto_Serif_JP',serif] text-[#c53030] border-l border-white/20 pl-3">
              工房
            </span>
            <span className="text-[10px] font-mono tracking-widest text-[#71717a] ml-2">
              LOWER MANHATTAN • NYC
            </span>
          </div>

          <div className="flex flex-wrap gap-8 text-[11px] font-mono tracking-[0.25em] text-[#a1a1aa] uppercase">
            <a href="#story" onClick={(e) => handleNavClick(e, '#story')} className="hover:text-[#c53030] transition-colors">STORY</a>
            <a href="#layers" onClick={(e) => handleNavClick(e, '#layers')} className="hover:text-[#c53030] transition-colors">3D LAYERS</a>
            <a href="#menu" onClick={(e) => handleNavClick(e, '#menu')} className="hover:text-[#c53030] transition-colors">MENU</a>
            <a href="#atmosphere" onClick={(e) => handleNavClick(e, '#atmosphere')} className="hover:text-[#c53030] transition-colors">ATMOSPHERE</a>
            <a href="#location" onClick={(e) => handleNavClick(e, '#location')} className="hover:text-[#c53030] transition-colors">LOCATION</a>
            <a href="#reservation" onClick={(e) => handleNavClick(e, '#reservation')} className="text-[#c53030] hover:text-[#f87171] transition-colors">RESERVE</a>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#71717a] hover:text-white transition-colors focus:outline-none"
            data-cursor="TOP"
          >
            <span>BACK TO SURFACE</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </ScrollReveal>

        {/* Centerpiece Monumental Logo */}
        <ScrollReveal variant="fade-scale" delay={0.15} className="py-20 text-center select-none">
          <div className="font-['Cinzel',serif] text-6xl sm:text-8xl md:text-9xl lg:text-[13rem] tracking-[0.15em] font-light text-white/[0.04] leading-none uppercase">
            KŌBŌ
          </div>
        </ScrollReveal>

        {/* Farewell Calligraphy & Sign-off */}
        <ScrollReveal variant="fade-up" delay={0.2} distance={20} className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-12 border-t border-white/10 text-center sm:text-left">
          <div className="space-y-1">
            <div className="font-['Noto_Serif_JP',serif] text-2xl sm:text-3xl text-white font-light tracking-[0.25em]">
              また会いましょう。
            </div>
            <div className="text-xs font-mono tracking-[0.3em] text-[#71717a] uppercase">
              "SEE YOU AGAIN IN THE SILENCE."
            </div>
          </div>

          <div className="flex flex-col sm:items-end text-[10px] font-mono tracking-widest text-[#71717a] space-y-1">
            <div>© {new Date().getFullYear()} KŌBŌ RAMEN NEW YORK. ALL RIGHTS RESERVED.</div>
            <div>72 KENMARE STREET, LOWER MANHATTAN, NY 10012</div>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
}
