import { useState, FormEvent } from 'react';
import { Calendar, Users, Clock, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { audioManager } from '../utils/audio';
import { ScrollReveal, ScrollDivider } from './ScrollReveal';

export function ReservationSection() {
  const [date, setDate] = useState('2026-09-18');
  const [time, setTime] = useState('19:30');
  const [guests, setGuests] = useState('2');
  const [seatingZone, setSeatingZone] = useState('Master Counter');
  const [specialNote, setSpecialNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [reservationCode, setReservationCode] = useState('');

  const timeSlots = [
    '17:00', '17:30', '18:15', '19:00', '19:45', '20:30', '21:15', '22:00', '22:45'
  ];

  const handleReserve = (e: FormEvent) => {
    e.preventDefault();
    audioManager.playChime(528);
    setIsSubmitting(true);

    setTimeout(() => {
      const randomCode = 'KB-' + Math.floor(100000 + Math.random() * 900000);
      setReservationCode(randomCode);
      setIsSubmitting(false);
      setIsConfirmed(true);
      audioManager.playChime(660);
    }, 900);
  };

  const handleReset = () => {
    audioManager.playChime(400);
    setIsConfirmed(false);
  };

  return (
    <section
      id="reservation"
      className="relative w-full min-h-screen py-32 px-6 md:px-12 bg-[#08080a] text-[#f4f4f0] border-t border-white/[0.04] overflow-hidden flex items-center justify-center"
    >
      {/* Background Japanese Watermark */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/[0.02] font-['Noto_Serif_JP',serif] text-8xl md:text-[16rem] font-black select-none leading-none">
        予約
      </div>

      <div className="max-w-4xl mx-auto w-full relative z-10">
        {/* Section Header */}
        <ScrollReveal variant="fade-up" distance={24} className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/10 bg-black/40 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c53030] animate-ping" />
            <span className="text-[10px] font-mono tracking-[0.35em] text-[#d4d4d8] uppercase">
              10 / COUNTER RESERVATION
            </span>
          </div>

          <h2 className="font-['Cinzel',serif] text-4xl sm:text-6xl md:text-8xl tracking-[0.08em] font-normal uppercase text-[#f4f4f0]">
            YOUR SEAT <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c53030] via-[#f87171] to-[#f59e0b]">
              AWAITS.
            </span>
          </h2>

          <p className="max-w-md mx-auto text-xs sm:text-sm font-light text-[#a1a1aa] tracking-widest uppercase">
            18 SEATS ONLY • SEATED PROMPTLY AT YOUR APPOINTED HOUR
          </p>
        </ScrollReveal>

        {/* Reservation Card / Confirmation State */}
        <ScrollReveal variant="fade-scale" delay={0.15} className="relative p-8 sm:p-12 border border-white/15 bg-[#101015] shadow-2xl backdrop-blur-xl">
          {!isConfirmed ? (
            <form onSubmit={handleReserve} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Date Picker */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#a1a1aa] uppercase">
                    <Calendar className="w-3.5 h-3.5 text-[#c53030]" />
                    <span>DATE</span>
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-[#09090b] border border-white/10 text-xs font-mono text-white focus:border-[#c53030] focus:outline-none transition-colors"
                  />
                </div>

                {/* Time Selection */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#a1a1aa] uppercase">
                    <Clock className="w-3.5 h-3.5 text-[#c53030]" />
                    <span>SEATING TIME</span>
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-3 bg-[#09090b] border border-white/10 text-xs font-mono text-white focus:border-[#c53030] focus:outline-none transition-colors cursor-pointer"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot} PM DINNER
                      </option>
                    ))}
                  </select>
                </div>

                {/* Number of Guests */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#a1a1aa] uppercase">
                    <Users className="w-3.5 h-3.5 text-[#c53030]" />
                    <span>GUEST COUNT</span>
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full px-4 py-3 bg-[#09090b] border border-white/10 text-xs font-mono text-white focus:border-[#c53030] focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="1">1 GUEST (SOLO SENSORY FOCUS)</option>
                    <option value="2">2 GUESTS (INTIMATE PAIR)</option>
                    <option value="3">3 GUESTS (SANCTUM CORNER)</option>
                    <option value="4">4 GUESTS (MAXIMUM ENSEMBLE)</option>
                  </select>
                </div>
              </div>

              {/* Seating Preference Selector */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono tracking-widest text-[#a1a1aa] uppercase block">
                  COUNTER SEATING ZONE PREFERENCE
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'Master Counter', desc: 'Direct view of broth cauldrons' },
                    { id: "Chef's Hearth", desc: 'Binchotan embers and flame searing' },
                    { id: 'Quiet Alcove', desc: 'Contemplative corner by stone garden' },
                  ].map((zone) => (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() => setSeatingZone(zone.id)}
                      className={`p-4 text-left border transition-all duration-300 focus:outline-none ${
                        seatingZone === zone.id
                          ? 'border-[#c53030] bg-[#c53030]/15 text-white'
                          : 'border-white/10 bg-[#09090b] text-[#a1a1aa] hover:border-white/20'
                      }`}
                      data-cursor="SELECT"
                    >
                      <div className="text-xs font-['Cinzel',serif] text-white font-medium">
                        {zone.id}
                      </div>
                      <div className="text-[10px] font-mono text-[#71717a] mt-1">
                        {zone.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Dietary / Notes */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono tracking-widest text-[#a1a1aa] uppercase block">
                  SPECIAL ALLERGIES OR NOTES (OPTIONAL)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vegetarian preference, gluten sensitivity, anniversary celebration..."
                  value={specialNote}
                  onChange={(e) => setSpecialNote(e.target.value)}
                  className="w-full px-4 py-3 bg-[#09090b] border border-white/10 text-xs font-mono text-white placeholder:text-[#52525b] focus:border-[#c53030] focus:outline-none transition-colors"
                />
              </div>

              {/* Submit CTA with Ripple Effect */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full py-4 bg-[#c53030] hover:bg-[#b91c1c] text-white text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase transition-all duration-300 shadow-xl overflow-hidden focus:outline-none disabled:opacity-50"
                data-cursor="RESERVE"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span>{isSubmitting ? 'VERIFYING COUNTER SEATS...' : 'CONFIRM YOUR RESERVATION'}</span>
                  <Sparkles className="w-4 h-4" />
                </span>
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </button>
            </form>
          ) : (
            /* Animated Confirmation State with Japanese Hanko Seal */
            <div className="text-center py-8 space-y-8 animate-fade-in">
              {/* Seal Stamp Container */}
              <div className="relative inline-flex items-center justify-center w-24 h-24 border-2 border-[#c53030] bg-[#c53030]/10 rounded-none shadow-[0_0_30px_rgba(197,48,48,0.3)] animate-pulse">
                <div className="text-[#f87171] font-['Noto_Serif_JP',serif] text-xl tracking-[0.2em] font-black flex flex-col items-center">
                  <span>工</span>
                  <span>房</span>
                  <span className="text-[8px] font-mono mt-1 text-[#fca5a5]">CONFIRMED</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono tracking-[0.35em] text-[#c53030] uppercase block">
                  RESERVATION CODE: {reservationCode}
                </span>
                <h3 className="font-['Cinzel',serif] text-3xl sm:text-5xl text-white font-normal">
                  YOUR SANCTUM IS HELD.
                </h3>
                <p className="text-xs sm:text-sm text-[#a1a1aa] font-light max-w-md mx-auto leading-relaxed">
                  We look forward to welcoming you into the silence of KŌBŌ on {date} at {time} PM.
                </p>
              </div>

              {/* Summary Itinerary Card */}
              <div className="max-w-md mx-auto p-6 bg-[#09090b] border border-white/10 text-left space-y-2 text-xs font-mono">
                <div className="flex justify-between text-[#a1a1aa]">
                  <span>VENUE:</span>
                  <span className="text-white">KŌBŌ RAMEN • 72 KENMARE ST</span>
                </div>
                <div className="flex justify-between text-[#a1a1aa]">
                  <span>DATE & TIME:</span>
                  <span className="text-[#f59e0b]">{date} @ {time} PM</span>
                </div>
                <div className="flex justify-between text-[#a1a1aa]">
                  <span>SEATS & ZONE:</span>
                  <span className="text-white">{guests} Guest(s) • {seatingZone}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-6 py-2.5 border border-white/20 text-xs font-mono tracking-widest text-[#a1a1aa] hover:text-white hover:border-white transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>BOOK ANOTHER TABLE</span>
                </button>
              </div>
            </div>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}

