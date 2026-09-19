import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { motion, useScroll, useSpring } from 'motion/react';

interface SmoothScrollContextType {
  lenis: Lenis | null;
  scrollTo: (target: string | HTMLElement | number, options?: { offset?: number; duration?: number; immediate?: boolean }) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  lenis: null,
  scrollTo: () => {},
});

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

// Global fallback ref so navigation can call it directly
let globalLenisInstance: Lenis | null = null;

export function smoothScrollTo(
  target: string | HTMLElement | number,
  options: { offset?: number; duration?: number; immediate?: boolean; onComplete?: () => void } = {}
) {
  if (globalLenisInstance) {
    globalLenisInstance.scrollTo(target, {
      offset: options.offset ?? -40,
      duration: options.duration ?? 0.85,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      immediate: options.immediate ?? false,
      lock: false,
      onComplete: options.onComplete,
    });
  } else {
    // Fallback if lenis not yet ready
    if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' });
    } else if (typeof target === 'string') {
      const el = target.startsWith('#') ? document.querySelector(target) : document.getElementById(target);
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    options.onComplete?.();
  }
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    const lenisInstance = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: false, // Disables artificial wheel delay; user trackpad & mouse wheel are 100% native 120fps with zero latency
      syncTouch: false,
      infinite: false,
    });

    globalLenisInstance = lenisInstance;
    setLenis(lenisInstance);

    let animationFrameId: number;

    function raf(time: number) {
      lenisInstance.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    // Sync with window resize
    const handleResize = () => {
      lenisInstance.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      lenisInstance.destroy();
      globalLenisInstance = null;
      setLenis(null);
    };
  }, []);

  const scrollTo = (
    target: string | HTMLElement | number,
    options: { offset?: number; duration?: number; immediate?: boolean } = {}
  ) => {
    smoothScrollTo(target, options);
  };

  return (
    <SmoothScrollContext.Provider value={{ lenis, scrollTo }}>
      {/* Super-Smooth Reading / Scroll Progress Bar at very top */}
      <ScrollProgressBar />
      {children}
    </SmoothScrollContext.Provider>
  );
}

/**
 * Minimalist hairline scroll progress indicator with subtle crimson-to-amber glow
 */
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none h-[2px] bg-white/[0.04]">
      <motion.div
        className="h-full origin-left bg-gradient-to-r from-[#c53030] via-[#f59e0b] to-[#38bdf8] shadow-[0_0_12px_rgba(197,48,48,0.7)]"
        style={{ scaleX }}
      />
    </div>
  );
}
