import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { audioManager } from '../utils/audio';
import { smoothScrollTo } from './SmoothScroll';

export interface SectionMeta {
  id: string;
  name: string;
  kanji: string;
  number: string;
  tagline: string;
}

export const SECTIONS: SectionMeta[] = [
  { id: 'hero', name: 'OVERTURE', kanji: '序幕', number: '01', tagline: 'The Sacred Vessel' },
  { id: 'story', name: 'PHILOSOPHY', kanji: '理念', number: '02', tagline: 'A Bowl is a Ritual' },
  { id: 'layers', name: 'ASSEMBLY', kanji: '階層', number: '03', tagline: 'Layer by Sacred Layer' },
  { id: 'signature', name: 'SIGNATURE', kanji: '極味', number: '04', tagline: 'Kōbō Tonkotsu' },
  { id: 'atmosphere', name: 'ATMOSPHERE', kanji: '空間', number: '05', tagline: '18 Seats. One Counter.' },
  { id: 'duality', name: 'DUALITY', kanji: '双契', number: '06', tagline: 'Tokyo & New York' },
  { id: 'menu', name: 'COLLECTION', kanji: '品書', number: '07', tagline: 'Culinary Masterpieces' },
  { id: 'craft', name: 'ARTISANS', kanji: '職人', number: '08', tagline: 'Made by Hand' },
  { id: 'location', name: 'SANCTUM', kanji: '聖地', number: '09', tagline: 'Lower Manhattan' },
  { id: 'reservation', name: 'RESERVATION', kanji: '席約', number: '10', tagline: 'Reserve Counter' },
  { id: 'footer', name: 'FINALE', kanji: '終章', number: '11', tagline: 'Until We Meet' },
];

interface SectionScrollContextType {
  activeSectionIndex: number;
  activeSection: SectionMeta;
  goToSection: (indexOrId: number | string, immediate?: boolean) => void;
  nextSection: () => void;
  prevSection: () => void;
  isLocked: boolean;
}

const SectionScrollContext = createContext<SectionScrollContextType>({
  activeSectionIndex: 0,
  activeSection: SECTIONS[0],
  goToSection: () => {},
  nextSection: () => {},
  prevSection: () => {},
  isLocked: false,
});

export function useSectionScroll() {
  return useContext(SectionScrollContext);
}

interface SectionScrollerProps {
  children: React.ReactNode;
}

export function SectionScroller({ children }: SectionScrollerProps) {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const activeIndexRef = useRef(0);
  activeIndexRef.current = activeSectionIndex;

  // Smooth free navigation to target section when clicked
  const goToSection = useCallback((indexOrId: number | string, immediate = false) => {
    let targetIndex: number;
    if (typeof indexOrId === 'string') {
      const cleanId = indexOrId.replace(/^#/, '');
      targetIndex = SECTIONS.findIndex((s) => s.id === cleanId);
      if (targetIndex === -1) return;
    } else {
      targetIndex = Math.max(0, Math.min(SECTIONS.length - 1, indexOrId));
    }

    const targetSection = SECTIONS[targetIndex];
    const targetElement = document.getElementById(targetSection.id);
    if (!targetElement) return;

    setActiveSectionIndex(targetIndex);
    activeIndexRef.current = targetIndex;

    // Update URL hash gently
    try {
      history.replaceState(null, '', `#${targetSection.id}`);
    } catch {
      // Safe fallback in restricted iframes
    }

    // Butter-smooth gliding to the target section
    smoothScrollTo(targetElement, {
      duration: immediate ? 0.2 : 1.25,
      offset: -20,
      immediate: immediate,
    });
  }, []);

  const nextSection = useCallback(() => {
    if (activeIndexRef.current < SECTIONS.length - 1) {
      audioManager.playChime(440);
      goToSection(activeIndexRef.current + 1);
    }
  }, [goToSection]);

  const prevSection = useCallback(() => {
    if (activeIndexRef.current > 0) {
      audioManager.playChime(380);
      goToSection(activeIndexRef.current - 1);
    }
  }, [goToSection]);

  // Track active section passively using IntersectionObserver (zero layout thrashing or scroll event overhead)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = SECTIONS.findIndex((s) => s.id === entry.target.id);
            if (idx !== -1 && activeIndexRef.current !== idx) {
              setActiveSectionIndex(idx);
              activeIndexRef.current = idx;
            }
          }
        }
      },
      {
        rootMargin: '-20% 0px -40% 0px',
        threshold: 0.1,
      }
    );

    SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const activeSection = SECTIONS[activeSectionIndex] || SECTIONS[0];

  return (
    <SectionScrollContext.Provider
      value={{
        activeSectionIndex,
        activeSection,
        goToSection,
        nextSection,
        prevSection,
        isLocked: false,
      }}
    >
      {children}
    </SectionScrollContext.Provider>
  );
}
