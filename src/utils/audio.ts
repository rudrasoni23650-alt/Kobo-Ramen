// Synthesizes atmospheric ambient sound using Web Audio API with section-aware soundscapes
class AudioManager {
  private ctx: AudioContext | null = null;
  private rainNode: AudioNode | null = null;
  private droneGain: GainNode | null = null;
  private hearthGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying: boolean = false;
  private activeZone: 'broth' | 'hearth' | 'sanctum' | 'night' = 'broth';

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggle(): boolean {
    this.initContext();
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public setZone(zone: 'broth' | 'hearth' | 'sanctum' | 'night') {
    if (!this.isPlaying || !this.ctx || this.activeZone === zone) return;
    this.activeZone = zone;

    const now = this.ctx.currentTime;
    if (this.hearthGain && this.droneGain) {
      if (zone === 'hearth') {
        this.hearthGain.gain.setTargetAtTime(0.12, now, 1.2);
        this.droneGain.gain.setTargetAtTime(0.04, now, 1.2);
      } else if (zone === 'sanctum') {
        this.hearthGain.gain.setTargetAtTime(0.01, now, 1.5);
        this.droneGain.gain.setTargetAtTime(0.12, now, 1.5);
      } else {
        this.hearthGain.gain.setTargetAtTime(0.03, now, 1.5);
        this.droneGain.gain.setTargetAtTime(0.08, now, 1.5);
      }
    }
  }

  public start() {
    if (!this.ctx || !this.masterGain) this.initContext();
    if (!this.ctx || !this.masterGain) return;

    if (this.isPlaying) return;
    this.isPlaying = true;

    // 1. Warm rain / broth simmer generator (Filtered Pink Noise)
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.02; // soft volume
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Lowpass filter for warm soothing rain/steam sound
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(820, this.ctx.currentTime);

    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    rainGain.gain.exponentialRampToValueAtTime(0.16, this.ctx.currentTime + 3);

    whiteNoise.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(this.masterGain);
    whiteNoise.start();
    this.rainNode = whiteNoise;

    // 2. Deep meditative Zen drone (55Hz and 110Hz warm sine waves with slight chorus)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const droneFilter = this.ctx.createBiquadFilter();
    droneFilter.type = 'lowpass';
    droneFilter.frequency.setValueAtTime(180, this.ctx.currentTime);

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 fundamental
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(110.25, this.ctx.currentTime); // Gentle natural beating

    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.droneGain.gain.exponentialRampToValueAtTime(0.08, this.ctx.currentTime + 3.5);

    osc1.connect(droneFilter);
    osc2.connect(droneFilter);
    droneFilter.connect(this.droneGain);
    this.droneGain.connect(this.masterGain);

    // 3. Subtle Binchotan hearth ember crackle filter
    const hearthFilter = this.ctx.createBiquadFilter();
    hearthFilter.type = 'bandpass';
    hearthFilter.frequency.setValueAtTime(2400, this.ctx.currentTime);
    hearthFilter.Q.setValueAtTime(4.0, this.ctx.currentTime);

    this.hearthGain = this.ctx.createGain();
    this.hearthGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.hearthGain.gain.exponentialRampToValueAtTime(0.02, this.ctx.currentTime + 3);

    whiteNoise.connect(hearthFilter);
    hearthFilter.connect(this.hearthGain);
    this.hearthGain.connect(this.masterGain);

    osc1.start();
    osc2.start();
  }

  public stop() {
    if (!this.ctx || !this.masterGain) return;
    this.masterGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.6);
    setTimeout(() => {
      if (this.ctx && this.masterGain) {
        this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
        this.ctx.suspend();
      }
      this.isPlaying = false;
    }, 700);
  }

  // Play a soft wooden/singing bowl bell on subtle interactions
  public playChime(freq = 432) {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.98, this.ctx.currentTime + 1.2);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.3);
    } catch {
      // Audio autoplay policy fallback
    }
  }
}

export const audioManager = new AudioManager();
