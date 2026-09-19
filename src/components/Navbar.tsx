import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { audioManager } from '../utils/audio';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  activeSection?: string;
}

export function Navbar({ onNavigate, activeSection }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled((prev) => {
            const next = window.scrollY > 40;
            return prev === next ? prev : next;
          });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSoundToggle = () => {
    const newState = audioManager.toggle();
    setIsSoundOn(newState);
    if (newState) {
      audioManager.playChime(528);
    }
  };

  const navLinks = [
    { label: 'STORY', id: 'story' },
    { label: 'LAYERS', id: 'layers' },
    { label: 'SIGNATURE', id: 'signature' },
    { label: 'MENU', id: 'menu' },
    { label: 'ATMOSPHERE', id: 'atmosphere' },
    { label: 'LOCATION', id: 'location' },
  ];

  const handleLinkClick = (id: string) => {
    audioManager.playChime(440);
    onNavigate(id);
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-700 ${
        isScrolled
          ? 'py-3.5 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)]'
          : 'py-6 md:py-8 bg-gradient-to-b from-black/80 via-black/30 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          id="nav-brand-logo"
          onClick={() => handleLinkClick('hero')}
          className="group flex items-center gap-3 text-left focus:outline-none"
          data-cursor="HOME"
        >
          <div className="flex flex-col">
            <span className="font-['Cinzel',serif] text-xl md:text-2xl tracking-[0.25em] font-semibold text-[#f4f4f0] transition-colors group-hover:text-[#c53030]">
              KŌBŌ
            </span>
            <span className="text-[9px] tracking-[0.35em] text-[#a1a1aa] uppercase font-mono -mt-0.5 flex items-center gap-1.5">
              <span>RAMEN</span>
              <span className="w-1 h-1 rounded-full bg-[#c53030]"></span>
              <span>NYC</span>
            </span>
          </div>
          <span className="text-xs font-['Noto_Serif_JP',serif] text-[#71717a] border-l border-white/15 pl-2.5 ml-1 hidden sm:inline-block tracking-widest">
            工房
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-[11px] tracking-[0.28em] font-['Space_Grotesk',sans-serif] text-[#a1a1aa]">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                id={`nav-link-${link.id}`}
                onClick={() => handleLinkClick(link.id)}
                className={`relative py-1 transition-colors focus:outline-none group ${
                  isActive ? 'text-[#f4f4f0]' : 'text-[#a1a1aa] hover:text-[#f4f4f0]'
                }`}
                data-cursor="GO"
              >
                <span>{link.label}</span>
                <span
                  className={`absolute bottom-0 left-0 h-[1.5px] bg-[#c53030] transition-all duration-300 ${
                    isActive ? 'w-full shadow-[0_0_8px_rgba(197,48,48,0.8)]' : 'w-0 group-hover:w-full'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Audio Ambience & Reserve Action */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Sound Toggle */}
          <button
            id="nav-audio-toggle"
            onClick={handleSoundToggle}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] tracking-[0.2em] font-mono border transition-all duration-300 focus:outline-none ${
              isSoundOn
                ? 'bg-[#c53030]/15 border-[#c53030]/50 text-[#fca5a5] shadow-[0_0_15px_rgba(197,48,48,0.25)]'
                : 'bg-white/[0.04] border-white/10 text-[#a1a1aa] hover:border-white/30 hover:text-white'
            }`}
            data-cursor={isSoundOn ? 'MUTE' : 'SOUND'}
            title="Toggle atmospheric rain & zen drone audio"
            aria-label="Toggle atmospheric sound"
          >
            {isSoundOn ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#c53030] animate-pulse" />
                <span className="hidden sm:inline">AMBIENCE ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 opacity-60" />
                <span className="hidden sm:inline">SOUND</span>
              </>
            )}
          </button>

          {/* Reserve CTA */}
          <button
            id="nav-reserve-button"
            onClick={() => handleLinkClick('reservation')}
            className="group relative overflow-hidden px-4 md:px-5 py-2 rounded-full bg-[#f4f4f0] text-[#09090b] text-[10px] md:text-[11px] font-semibold tracking-[0.25em] transition-all duration-300 hover:bg-[#c53030] hover:text-white focus:outline-none shadow-md"
            data-cursor="BOOK"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              <span>RESERVE</span>
              <Sparkles className="w-3 h-3 text-[#c53030] group-hover:text-white transition-colors" />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
