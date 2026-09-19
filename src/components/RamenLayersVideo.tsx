import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { RAMEN_LAYERS } from '../data/menuData';
import { audioManager } from '../utils/audio';
import { ScrollReveal, ScrollDivider } from './ScrollReveal';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Film,
  FastForward,
  CheckCircle2
} from 'lucide-react';
import { useMagnetic } from '../utils/useMagnetic';

export function RamenLayersVideo() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isContinuousMode, setIsContinuousMode] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const autoAdvanceMagnetic = useMagnetic<HTMLButtonElement>(0.2, 5);
  const continuousMagnetic = useMagnetic<HTMLButtonElement>(0.2, 5);

  const currentLayer = RAMEN_LAYERS.find((l) => l.step === currentStep) || RAMEN_LAYERS[0];

  // Video source determination
  const activeVideoSrc = isContinuousMode
    ? '/videos/ramen_assembly_full.mp4'
    : currentLayer.videoSrc || '/videos/step1_vessel.mp4';

  const activePoster = isContinuousMode
    ? '/videos/ramen_assembly_full_poster.jpg'
    : currentLayer.poster || '/videos/step1_vessel_poster.jpg';

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowLeft') {
        handleStepSelect(Math.max(1, currentStep - 1));
      } else if (e.key === 'ArrowRight') {
        handleStepSelect(Math.min(RAMEN_LAYERS.length, currentStep + 1));
      } else if (e.key === ' ' && document.activeElement?.tagName !== 'BUTTON') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, isPlaying]);

  // When step changes in step-by-step mode, load and play the video
  useEffect(() => {
    if (!isContinuousMode && videoRef.current) {
      setIsVideoLoading(true);
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsVideoLoading(false);
          })
          .catch(() => {
            // Autoplay might require user interaction or mute
            setIsPlaying(false);
            setIsVideoLoading(false);
          });
      }
    }
  }, [currentStep, isContinuousMode]);

  // Pause video decoding when section is offscreen to preserve 60fps smooth scrolling
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && videoRef.current && !videoRef.current.paused) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Handle step selection
  const handleStepSelect = (stepNumber: number) => {
    audioManager.playChime(350 + stepNumber * 35);
    setCurrentStep(stepNumber);

    if (isContinuousMode && videoRef.current) {
      const targetLayer = RAMEN_LAYERS.find((l) => l.step === stepNumber);
      if (targetLayer && typeof targetLayer.startTime === 'number') {
        videoRef.current.currentTime = targetLayer.startTime;
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  // Toggle Play / Pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
      audioManager.playChime(480);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      audioManager.playChime(380);
    }
  };

  // Replay current step
  const handleReplay = () => {
    if (!videoRef.current) return;
    audioManager.playChime(520);
    if (isContinuousMode) {
      const targetLayer = RAMEN_LAYERS.find((l) => l.step === currentStep);
      videoRef.current.currentTime = targetLayer?.startTime ?? 0;
    } else {
      videoRef.current.currentTime = 0;
    }
    videoRef.current.play().catch(() => {});
    setIsPlaying(true);
  };

  // Toggle Mute
  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
    audioManager.playChime(isMuted ? 500 : 350);
  };

  // Toggle Playback Speed
  const cyclePlaybackSpeed = () => {
    if (!videoRef.current) return;
    const speeds = [0.75, 1, 1.25];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    videoRef.current.playbackRate = nextSpeed;
    setPlaybackSpeed(nextSpeed);
    audioManager.playChime(420 + nextSpeed * 60);
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Throttled time update listener to minimize React reconciliation overhead
  const lastTimeUpdateRef = useRef(0);
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;

    // In continuous mode, update currentStep based on timestamps immediately
    if (isContinuousMode) {
      for (const layer of RAMEN_LAYERS) {
        if (
          typeof layer.startTime === 'number' &&
          typeof layer.endTime === 'number' &&
          time >= layer.startTime &&
          time < layer.endTime
        ) {
          if (layer.step !== currentStep) {
            setCurrentStep(layer.step);
          }
          break;
        }
      }
    }

    // Throttle progress bar update to ~120ms to keep playback smooth and prevent CPU spikes
    const now = performance.now();
    if (now - lastTimeUpdateRef.current > 120) {
      lastTimeUpdateRef.current = now;
      setCurrentTime(time);
    }
  };

  // Video ended handler
  const handleVideoEnded = () => {
    if (isContinuousMode) {
      // Loop continuous film or restart from step 1
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
        setCurrentStep(1);
      }
    } else if (autoAdvance) {
      // Auto-advance to the next step
      if (currentStep < RAMEN_LAYERS.length) {
        handleStepSelect(currentStep + 1);
      } else {
        // Loop back to step 1
        handleStepSelect(1);
      }
    } else {
      setIsPlaying(false);
    }
  };

  // Seek bar click handler
  const handleScrub = (e: MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = pos * duration;
    videoRef.current.currentTime = newTime;
  };

  // Toggle continuous full assembly mode
  const toggleContinuousMode = () => {
    audioManager.playChime(460);
    setIsContinuousMode((prev) => {
      const next = !prev;
      if (next && videoRef.current) {
        // Jump to current step in master film
        const target = RAMEN_LAYERS.find((l) => l.step === currentStep);
        setTimeout(() => {
          if (videoRef.current && target?.startTime) {
            videoRef.current.currentTime = target.startTime;
            videoRef.current.play().catch(() => {});
            setIsPlaying(true);
          }
        }, 100);
      }
      return next;
    });
  };

  return (
    <section
      id="layers"
      className="relative w-full min-h-screen py-20 md:py-28 px-6 md:px-12 bg-[#0c0d10] text-[#f4f4f0] border-t border-white/[0.04] overflow-hidden flex flex-col justify-center"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <ScrollReveal variant="fade-up" distance={30} className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[10px] font-mono tracking-[0.4em] text-[#c53030] uppercase">
                02 / ARCHITECTURE OF FLAVOR
              </span>
              <ScrollDivider className="w-12" color="#c53030" />
              <span className="text-xs font-['Noto_Serif_JP',serif] text-[#a1a1aa] tracking-widest">
                積層の美学・調理工程
              </span>
            </div>
            <h2 className="font-['Cinzel',serif] text-4xl sm:text-6xl md:text-7xl tracking-[0.08em] font-normal uppercase text-[#f4f4f0]">
              BUILT LAYER <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c53030] via-[#f97316] to-[#fbbf24]">
                BY SACRED LAYER.
              </span>
            </h2>
          </div>

          {/* Top Interactive Mode Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Continuous Assembly Film Toggle */}
            <button
              ref={continuousMagnetic.ref}
              {...continuousMagnetic.magneticProps}
              onClick={toggleContinuousMode}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-mono tracking-widest transition-all duration-300 focus:outline-none ${
                isContinuousMode
                  ? 'border-[#fbbf24] bg-[#fbbf24]/20 text-[#fde047] shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                  : 'border-white/10 bg-white/[0.03] text-[#d4d4d8] hover:border-white/30'
              }`}
              data-cursor="MODE"
            >
              <Film className="w-3.5 h-3.5 text-[#fbbf24]" />
              <span>{isContinuousMode ? 'CONTINUOUS FILM' : 'FULL ASSEMBLY FILM'}</span>
            </button>

            {/* Auto-Advance / Loop Toggle */}
            <button
              ref={autoAdvanceMagnetic.ref}
              {...autoAdvanceMagnetic.magneticProps}
              onClick={() => {
                audioManager.playChime(440);
                setAutoAdvance(!autoAdvance);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-mono tracking-widest transition-colors focus:outline-none ${
                autoAdvance
                  ? 'border-[#c53030]/50 bg-[#c53030]/10 text-white'
                  : 'border-white/10 bg-white/[0.03] text-[#a1a1aa] hover:border-white/30'
              }`}
              data-cursor={autoAdvance ? 'ADVANCE ON' : 'LOOP STEP'}
            >
              <FastForward className="w-3.5 h-3.5 text-[#c53030]" />
              <span>{autoAdvance ? 'AUTO-ADVANCE ON' : 'REPEAT STEP'}</span>
            </button>
          </div>
        </ScrollReveal>

        {/* Video Player & Editorial Controller Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left / Center Video Stage */}
          <ScrollReveal
            variant="fade-scale"
            delay={0.15}
            className="lg:col-span-7 relative h-[480px] md:h-[600px] rounded-none border border-white/10 bg-[#070709] flex items-center justify-center overflow-hidden group shadow-2xl select-none"
          >
            <div ref={containerRef} className="w-full h-full relative flex items-center justify-center">

            {/* Subtle Studio Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(217,119,6,0.12),transparent_70%)] pointer-events-none" />

            {/* HTML5 Video Element */}
            <video
              ref={videoRef}
              key={activeVideoSrc}
              src={activeVideoSrc}
              poster={activePoster}
              playsInline
              autoPlay
              muted={isMuted}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  setDuration(videoRef.current.duration);
                  videoRef.current.playbackRate = playbackSpeed;
                  videoRef.current.play().catch(() => {});
                  setIsPlaying(true);
                }
              }}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={handleVideoEnded}
              onClick={togglePlay}
              className="w-full h-full object-cover cursor-pointer"
            />

            {/* Stage Title Overlay (Top-Left) */}
            <div className="absolute top-6 left-6 z-20 flex flex-col gap-1 pointer-events-none bg-black/60 backdrop-blur-md px-4 py-2.5 rounded border border-white/10">
              <span className="text-[9px] font-mono tracking-[0.3em] text-[#f59e0b] uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-ping" />
                <span>
                  STAGE 0{currentStep} OF 0{RAMEN_LAYERS.length}
                </span>
                {isContinuousMode && (
                  <span className="text-[8px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                    MASTER FILM
                  </span>
                )}
              </span>
              <span className="font-['Cinzel',serif] text-xl sm:text-2xl text-white font-medium">
                {currentLayer.title}
              </span>
              <span className="text-xs font-['Noto_Serif_JP',serif] text-[#a1a1aa]">
                {currentLayer.japaneseTitle}
              </span>
            </div>

            {/* Top-Right Metric Pill */}
            <div className="absolute top-6 right-6 z-20 pointer-events-none">
              <span className="px-3.5 py-1.5 rounded-full border border-amber-500/40 bg-black/80 backdrop-blur-md text-[10px] font-mono tracking-widest text-[#f59e0b] flex items-center gap-1.5 shadow-lg">
                <Sparkles className="w-3 h-3 text-[#f59e0b]" />
                {currentLayer.metric}
              </span>
            </div>

            {/* Center Play/Pause Large Overlay (Fades when playing) */}
            {!isPlaying && (
              <button
                onClick={togglePlay}
                className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:scale-110 hover:border-[#c53030] hover:text-[#c53030] transition-all duration-300 z-30 shadow-2xl"
                aria-label="Play video"
              >
                <Play className="w-8 h-8 fill-current translate-x-0.5" />
              </button>
            )}

            {/* Bottom Video Controls Overlay Bar */}
            <div className="absolute bottom-0 inset-x-0 z-30 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-4 md:p-6 flex flex-col gap-3 transition-opacity duration-300">
              {/* 6-Step Segmented Chapter Scrub Bar */}
              <div className="w-full flex items-center gap-1.5 cursor-pointer py-1" onClick={handleScrub}>
                {RAMEN_LAYERS.map((layer) => {
                  const isActive = currentStep === layer.step;
                  const isPast = currentStep > layer.step;

                  // Compute step progress percentage
                  let fillPct = 0;
                  if (isPast) {
                    fillPct = 100;
                  } else if (isActive) {
                    if (isContinuousMode && layer.startTime !== undefined && layer.endTime !== undefined) {
                      const stepDur = layer.endTime - layer.startTime;
                      const stepElapsed = Math.max(0, currentTime - layer.startTime);
                      fillPct = Math.min(100, Math.max(0, (stepElapsed / stepDur) * 100));
                    } else if (duration > 0) {
                      fillPct = Math.min(100, Math.max(0, (currentTime / duration) * 100));
                    }
                  }

                  return (
                    <div
                      key={layer.step}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStepSelect(layer.step);
                      }}
                      className="group/seg relative flex-1 h-2 bg-white/15 rounded-full overflow-hidden hover:h-2.5 transition-all"
                      title={`${layer.shortLabel || layer.title}`}
                    >
                      <div
                        className={`h-full transition-all duration-150 ${
                          isActive
                            ? 'bg-gradient-to-r from-[#c53030] to-[#f59e0b]'
                            : isPast
                            ? 'bg-white/70'
                            : 'bg-transparent'
                        }`}
                        style={{ width: `${fillPct}%` }}
                      />
                      {/* Hover Tooltip */}
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover/seg:block px-2 py-0.5 rounded bg-black/90 text-[9px] font-mono text-white whitespace-nowrap border border-white/20">
                        {layer.shortLabel}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Row Controls */}
              <div className="flex items-center justify-between gap-4 text-xs font-mono">
                {/* Left Controls: Play/Pause, Replay, Prev, Next */}
                <div className="flex items-center gap-2 md:gap-3">
                  <button
                    onClick={togglePlay}
                    className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>

                  <button
                    onClick={handleReplay}
                    className="p-2 rounded-full hover:bg-white/10 text-[#d4d4d8] hover:text-white transition-colors"
                    title="Replay Current Step"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleStepSelect(Math.max(1, currentStep - 1))}
                    disabled={currentStep === 1}
                    className="p-2 rounded-full hover:bg-white/10 text-[#d4d4d8] hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    title="Previous Step"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleStepSelect(Math.min(RAMEN_LAYERS.length, currentStep + 1))}
                    disabled={currentStep === RAMEN_LAYERS.length}
                    className="p-2 rounded-full hover:bg-white/10 text-[#f59e0b] hover:text-[#fbbf24] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    title="Next Step"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <span className="text-[11px] text-[#a1a1aa] hidden sm:inline-block ml-1">
                    {Math.floor(currentTime)}s / {Math.floor(duration)}s
                  </span>
                </div>

                {/* Right Controls: Mute, Speed, Fullscreen */}
                <div className="flex items-center gap-2">
                  {/* Speed Button */}
                  <button
                    onClick={cyclePlaybackSpeed}
                    className="px-2.5 py-1 rounded border border-white/15 bg-white/5 hover:border-white/30 text-[10px] text-[#d4d4d8] transition-colors"
                    title="Change Playback Speed"
                  >
                    {playbackSpeed}x
                  </button>

                  {/* Audio Mute Toggle */}
                  <button
                    onClick={toggleMute}
                    className="p-2 rounded-full hover:bg-white/10 text-[#d4d4d8] hover:text-white transition-colors"
                    title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-[#a1a1aa]" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                  </button>

                  {/* Fullscreen Toggle */}
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 rounded-full hover:bg-white/10 text-[#d4d4d8] hover:text-white transition-colors"
                    title="Toggle Fullscreen"
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            </div>
          </ScrollReveal>

          {/* Right Controller & Detailed Information Card */}
          <ScrollReveal variant="fade-up" delay={0.25} className="lg:col-span-5 flex flex-col justify-between h-full space-y-8">
            {/* Step Selection Tabs */}
            <div className="grid grid-cols-6 gap-2">
              {RAMEN_LAYERS.map((item) => {
                const isCurrent = currentStep === item.step;
                const isPast = currentStep > item.step;

                return (
                  <button
                    key={item.step}
                    onClick={() => handleStepSelect(item.step)}
                    className={`h-16 flex flex-col items-center justify-center rounded-none border transition-all duration-300 focus:outline-none relative overflow-hidden ${
                      isCurrent
                        ? 'border-[#c53030] bg-[#c53030]/20 text-white font-bold shadow-[0_0_18px_rgba(197,48,48,0.3)]'
                        : isPast
                        ? 'border-amber-500/30 bg-white/[0.04] text-[#fde047]'
                        : 'border-white/10 bg-[#121217] text-[#71717a] hover:border-white/30 hover:text-white'
                    }`}
                    data-cursor={`STEP 0${item.step}`}
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-mono">0{item.step}</span>
                      {isPast && <CheckCircle2 className="w-2.5 h-2.5 text-amber-400/80" />}
                    </div>

                    <span className="text-[8px] sm:text-[9px] font-mono mt-0.5 uppercase tracking-tighter truncate max-w-full px-1">
                      {item.step === 1
                        ? 'VESSEL'
                        : item.step === 2
                        ? 'BROTH'
                        : item.step === 3
                        ? 'NOODLES'
                        : item.step === 4
                        ? 'TOPPINGS'
                        : item.step === 5
                        ? 'AROMA'
                        : 'RITUAL'}
                    </span>

                    {/* Active playing indicator */}
                    <div className="flex items-center gap-0.5 mt-1 h-2">
                      {isCurrent ? (
                        <>
                          <span className="w-1 bg-[#c53030] h-2 animate-pulse" />
                          <span className="w-1 bg-[#f59e0b] h-3 animate-pulse delay-75" />
                          <span className="w-1 bg-[#c53030] h-1.5 animate-pulse delay-150" />
                        </>
                      ) : (
                        <div className={`w-1.5 h-1.5 rounded-full ${isPast ? 'bg-amber-400/50' : 'bg-transparent'}`} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Current Step Detailed Card */}
            <div className="p-8 border border-white/10 bg-[#121217] space-y-6 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-44 h-44 bg-[#c53030]/10 rounded-full blur-3xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono tracking-[0.3em] text-[#c53030] uppercase block">
                    {currentLayer.subtitle}
                  </span>
                  <span className="text-[10px] font-mono text-[#a1a1aa]">
                    STAGE 0{currentStep} / 0{RAMEN_LAYERS.length}
                  </span>
                </div>
                <h3 className="font-['Cinzel',serif] text-2xl md:text-3xl text-white font-normal">
                  {currentLayer.title}
                </h3>
                <span className="text-xs font-['Noto_Serif_JP',serif] text-[#a1a1aa] block mt-0.5">
                  {currentLayer.japaneseTitle}
                </span>
              </div>

              <p className="text-sm md:text-base text-[#d4d4d8] leading-relaxed font-light">
                {currentLayer.description}
              </p>

              {/* Specific Craft Details */}
              <div className="pt-4 border-t border-white/10">
                <div className="text-[10px] font-mono tracking-[0.25em] text-[#a1a1aa] uppercase mb-3 flex items-center justify-between">
                  <span>MATERIAL SPECIFICATIONS</span>
                  <span className="text-[#f59e0b] font-semibold">{currentLayer.metric}</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {currentLayer.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[#d4d4d8] font-mono">
                      <Sparkles className="w-3 h-3 text-[#f59e0b] shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prev / Next Step Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <button
                  onClick={() => handleStepSelect(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#a1a1aa] hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>PREVIOUS</span>
                </button>

                <div className="flex items-center gap-2 text-xs font-mono text-[#a1a1aa]">
                  <span className="text-white font-semibold">0{currentStep}</span>
                  <span>/</span>
                  <span>0{RAMEN_LAYERS.length}</span>
                </div>

                <button
                  onClick={() => handleStepSelect(Math.min(RAMEN_LAYERS.length, currentStep + 1))}
                  disabled={currentStep === RAMEN_LAYERS.length}
                  className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#f59e0b] hover:text-[#fbbf24] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <span>NEXT LAYER</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
