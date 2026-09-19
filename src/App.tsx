/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Navbar } from './components/Navbar';
import { CustomCursor } from './components/CustomCursor';
import { SmoothScrollProvider } from './components/SmoothScroll';
import { SectionScroller, useSectionScroll } from './components/SectionScroller';
import { Hero3D } from './components/Hero3D';
import { StorySection } from './components/StorySection';
import { RamenLayersVideo } from './components/RamenLayersVideo';
import { SignatureDish } from './components/SignatureDish';
import { AtmosphereSection } from './components/AtmosphereSection';
import { NewYorkTokyoSection } from './components/NewYorkTokyoSection';
import { MenuSection } from './components/MenuSection';
import { CraftSection } from './components/CraftSection';
import { LocationSection } from './components/LocationSection';
import { ReservationSection } from './components/ReservationSection';
import { Footer } from './components/Footer';

function MainAppContent() {
  const { goToSection, activeSection } = useSectionScroll();

  return (
    <main className="relative min-h-screen bg-[#09090b] text-[#f4f4f0] selection:bg-[#c53030] selection:text-white">
      {/* Interactive Custom Cursor */}
      <CustomCursor />

      {/* Persistent Morphing Navigation Header */}
      <Navbar onNavigate={(id) => goToSection(id)} activeSection={activeSection.id} />

      {/* 1. Hero / Opening 3D Experience */}
      <Hero3D onExploreClick={() => goToSection('story')} />

      {/* 2. Restaurant Story: "A BOWL IS A RITUAL" */}
      <StorySection />

      {/* 3. Ramen Experience: "BUILT LAYER BY SACRED LAYER" (Interactive Video Assembly) */}
      <RamenLayersVideo />

      {/* 4. Signature Dish Showcase: "KŌBŌ TONKOTSU" */}
      <SignatureDish />

      {/* 5. Atmosphere Section: "18 SEATS. ONE COUNTER. NO DISTRACTIONS." */}
      <AtmosphereSection />

      {/* 6. Tokyo / New York Duality: "TOKYO IN SPIRIT. NEW YORK AT HEART." */}
      <NewYorkTokyoSection />

      {/* 7. Art Installation Menu Section */}
      <MenuSection />

      {/* 8. Artisanal Craft Guild: "MADE BY HAND" */}
      <CraftSection />

      {/* 9. Location Sanctum & Lower Manhattan Map */}
      <LocationSection />

      {/* 10. Reservation: "YOUR SEAT AWAITS" */}
      <ReservationSection />

      {/* 11. Minimalist Footer: "また会いましょう" */}
      <Footer />
    </main>
  );
}

export default function App() {
  return (
    <SmoothScrollProvider>
      <SectionScroller>
        <MainAppContent />
      </SectionScroller>
    </SmoothScrollProvider>
  );
}

