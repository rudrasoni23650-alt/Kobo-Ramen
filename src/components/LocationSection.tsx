import { useState } from 'react';
import { MapPin, Navigation, Clock, Phone, ExternalLink } from 'lucide-react';
import { audioManager } from '../utils/audio';
import { ScrollReveal, ScrollDivider, ScrollStagger, ScrollStaggerItem } from './ScrollReveal';

export function LocationSection() {
  const [activeSubway, setActiveSubway] = useState<string | null>(null);

  const subways = [
    { line: '6', station: 'Spring St', walk: '2 MIN WALK', color: 'bg-green-600' },
    { line: 'N R', station: 'Prince St', walk: '4 MIN WALK', color: 'bg-yellow-500 text-black' },
    { line: 'J Z', station: 'Bowery', walk: '3 MIN WALK', color: 'bg-amber-700' },
    { line: 'B D', station: 'Grand St', walk: '5 MIN WALK', color: 'bg-orange-600' },
  ];

  return (
    <section
      id="location"
      className="relative w-full min-h-screen py-20 md:py-28 px-6 md:px-12 bg-[#09090b] text-[#f4f4f0] border-t border-white/[0.04] overflow-hidden flex flex-col justify-center"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <ScrollReveal variant="fade-up" distance={20} className="flex items-center gap-4 mb-8">
          <span className="text-[10px] font-mono tracking-[0.4em] text-[#c53030] uppercase">
            09 / THE SANCTUM
          </span>
          <ScrollDivider className="w-16" color="#c53030" />
          <span className="text-xs font-['Noto_Serif_JP',serif] text-[#71717a] tracking-widest">
            所在地と時刻
          </span>
        </ScrollReveal>

        {/* Monumental Headline */}
        <ScrollReveal variant="fade-up" delay={0.1} distance={30} className="mb-16">
          <h2 className="font-['Cinzel',serif] text-4xl sm:text-6xl md:text-8xl tracking-[0.06em] font-normal uppercase text-[#f4f4f0]">
            WHERE SILENCE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f4f4f0] via-[#d4d4d8] to-[#71717a]">
              MEETS THE NIGHT.
            </span>
          </h2>
          <p className="mt-3 text-xs sm:text-sm font-mono tracking-[0.3em] text-[#a1a1aa] uppercase max-w-xl">
            72 KENMARE STREET • LOWER MANHATTAN • NEW YORK
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Abstract Animated Lower Manhattan Vector Map */}
          <ScrollReveal variant="fade-scale" delay={0.15} className="lg:col-span-7 relative aspect-[4/3] rounded-none border border-white/10 bg-[#070709] p-6 sm:p-8 flex items-center justify-center overflow-hidden shadow-2xl group">
            {/* Abstract Manhattan Street Grid SVG */}
            <svg
              viewBox="0 0 500 400"
              className="w-full h-full opacity-60 transition-opacity group-hover:opacity-80"
            >
              <defs>
                <linearGradient id="gridGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c53030" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.1" />
                </linearGradient>
              </defs>

              {/* Angled Manhattan street grid lines */}
              <g stroke="#ffffff" strokeWidth="0.75" opacity="0.12">
                {/* Cross Streets */}
                <line x1="20" y1="60" x2="480" y2="100" />
                <line x1="20" y1="120" x2="480" y2="160" />
                <line x1="20" y1="180" x2="480" y2="220" />
                <line x1="20" y1="240" x2="480" y2="280" />
                <line x1="20" y1="300" x2="480" y2="340" />

                {/* Avenues (Broadway, Lafayette, Bowery, Mulberry) */}
                <line x1="100" y1="30" x2="130" y2="370" strokeWidth="1.5" opacity="0.25" />
                <line x1="180" y1="30" x2="220" y2="370" />
                <line x1="260" y1="30" x2="310" y2="370" strokeWidth="2" opacity="0.3" />
                <line x1="340" y1="30" x2="390" y2="370" />
                <line x1="420" y1="30" x2="460" y2="370" />
              </g>

              {/* Subway Line Routes */}
              <path
                d="M 120 30 Q 150 200 240 370"
                fill="none"
                stroke="#16a34a"
                strokeWidth="2.5"
                opacity="0.4"
                strokeDasharray="4 4"
              />
              <path
                d="M 280 30 Q 290 200 320 370"
                fill="none"
                stroke="#eab308"
                strokeWidth="2.5"
                opacity="0.4"
                strokeDasharray="4 4"
              />

              {/* Target Location Beacon (72 Kenmare St) */}
              <circle cx="260" cy="200" r="32" fill="#c53030" opacity="0.15" className="animate-ping" />
              <circle cx="260" cy="200" r="14" fill="#c53030" opacity="0.3" />
              <circle cx="260" cy="200" r="6" fill="#f4f4f0" />
              <circle cx="260" cy="200" r="2.5" fill="#c53030" />

              {/* Label at Beacon */}
              <text x="278" y="196" fill="#f4f4f0" fontSize="11" fontFamily="Cinzel" letterSpacing="2">
                KŌBŌ RAMEN
              </text>
              <text x="278" y="210" fill="#a1a1aa" fontSize="8" fontFamily="monospace">
                72 KENMARE ST
              </text>
            </svg>

            {/* Coordinates Badge */}
            <div className="absolute top-6 left-6 flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#71717a] bg-black/70 px-3 py-1.5 border border-white/10">
              <Navigation className="w-3 h-3 text-[#c53030]" />
              <span>40.7209° N, 73.9959° W</span>
            </div>

            {/* Open Google Maps CTA */}
            <a
              href="https://maps.google.com/?q=72+Kenmare+St+New+York+NY"
              target="_blank"
              rel="noreferrer"
              onClick={() => audioManager.playChime(480)}
              className="absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2 bg-white text-black text-[10px] font-mono tracking-widest uppercase hover:bg-[#c53030] hover:text-white transition-colors shadow-lg"
              data-cursor="DIRECTIONS"
            >
              <span>GET DIRECTIONS</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </ScrollReveal>

          {/* Right Column: Operating Hours, Seating & Subway Access */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            {/* Hours Block */}
            <ScrollReveal variant="fade-up" delay={0.2} className="p-8 border border-white/10 bg-[#121217] space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#c53030] uppercase">
                  <Clock className="w-4 h-4" />
                  <span>OPERATING HOURS</span>
                </div>
                <span className="text-[10px] font-mono text-[#f59e0b] tracking-wider">
                  DOORS OPEN 5:00 PM
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs sm:text-sm">
                <div className="flex justify-between items-center text-[#d4d4d8]">
                  <span>MON – THU</span>
                  <span className="text-white font-semibold">5:00 PM — 11:00 PM</span>
                </div>
                <div className="flex justify-between items-center text-[#d4d4d8]">
                  <span>FRI – SAT</span>
                  <span className="text-[#c53030] font-semibold">5:00 PM — 1:00 AM</span>
                </div>
                <div className="flex justify-between items-center text-[#d4d4d8]">
                  <span>SUN</span>
                  <span className="text-white font-semibold">4:00 PM — 10:00 PM</span>
                </div>
              </div>

              <div className="text-[11px] text-[#71717a] pt-2 border-t border-white/5 font-light">
                *Walk-in waitlist opens at 4:30 PM daily for unreserved counter spaces.
              </div>
            </ScrollReveal>

            {/* Subway Access Grid */}
            <ScrollReveal variant="fade-up" delay={0.3}>
              <span className="text-[10px] font-mono tracking-[0.3em] text-[#71717a] uppercase block mb-3">
                SUBWAY CONNECTIONS
              </span>
              <ScrollStagger staggerDelay={0.06} className="grid grid-cols-2 gap-2.5">
                {subways.map((s, idx) => (
                  <ScrollStaggerItem
                    key={idx}
                    distance={12}
                    className="p-3 border border-white/10 bg-[#0f0f13] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${s.color}`}>
                        {s.line}
                      </span>
                      <span className="text-xs font-mono text-white">{s.station}</span>
                    </div>
                    <span className="text-[9px] font-mono text-[#71717a]">{s.walk}</span>
                  </ScrollStaggerItem>
                ))}
              </ScrollStagger>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
