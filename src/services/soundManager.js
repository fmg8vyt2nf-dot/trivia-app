// Programmatic sound engine using Web Audio API — no external audio files needed

let audioCtx = null;
let masterGain = null;
let musicOsc = null;
let musicGain = null;
let enabled = true;
let volume = 0.5;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = volume;
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playNote(freq, type, duration, startDelay = 0, gainVal = 0.3) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(gainVal, ctx.currentTime + startDelay);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startDelay + duration);
  osc.connect(gain);
  gain.connect(masterGain);
  osc.start(ctx.currentTime + startDelay);
  osc.stop(ctx.currentTime + startDelay + duration + 0.05);
}

function playNoise(duration, startDelay = 0, gainVal = 0.15) {
  const ctx = getCtx();
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(gainVal, ctx.currentTime + startDelay);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startDelay + duration);
  noise.connect(gain);
  gain.connect(masterGain);
  noise.start(ctx.currentTime + startDelay);
}

const sounds = {
  correct() {
    // Rising two-note chime: C5 -> E5
    playNote(523.25, 'sine', 0.15, 0, 0.25);
    playNote(659.25, 'sine', 0.2, 0.1, 0.3);
  },

  wrong() {
    // Low descending buzz
    playNote(220, 'sawtooth', 0.12, 0, 0.12);
    playNote(165, 'sawtooth', 0.2, 0.08, 0.1);
  },

  tick() {
    // Short click
    playNoise(0.03, 0, 0.08);
  },

  gameStart() {
    // Ascending arpeggio: C4 -> E4 -> G4
    playNote(261.6, 'sine', 0.12, 0, 0.2);
    playNote(329.6, 'sine', 0.12, 0.1, 0.2);
    playNote(392.0, 'sine', 0.18, 0.2, 0.25);
  },

  gameOver() {
    // Descending three-note
    playNote(392.0, 'triangle', 0.15, 0, 0.2);
    playNote(329.6, 'triangle', 0.15, 0.12, 0.2);
    playNote(261.6, 'triangle', 0.25, 0.24, 0.2);
  },

  victory() {
    // Fanfare: C4 -> E4 -> G4 -> C5
    playNote(261.6, 'sine', 0.1, 0, 0.2);
    playNote(329.6, 'sine', 0.1, 0.08, 0.2);
    playNote(392.0, 'sine', 0.1, 0.16, 0.25);
    playNote(523.25, 'sine', 0.3, 0.24, 0.3);
  },

  buttonClick() {
    playNoise(0.02, 0, 0.05);
  },

  powerUp() {
    // Frequency sweep upward
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.35);
  },

  skip() {
    // Swoosh — noise with descending filter
    const ctx = getCtx();
    const bufferSize = ctx.sampleRate * 0.2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2000, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.2);
    filter.Q.value = 2;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    noise.start(ctx.currentTime);
  },

  streakMilestone() {
    // Sparkle — layered high-freq shimmers
    playNote(1046.5, 'sine', 0.08, 0, 0.15);
    playNote(1318.5, 'sine', 0.08, 0.05, 0.15);
    playNote(1568.0, 'sine', 0.08, 0.1, 0.15);
    playNote(2093.0, 'sine', 0.12, 0.15, 0.2);
  },

  streakShield() {
    // Protective chime — bell-like descending + resolving upward
    playNote(880, 'sine', 0.1, 0, 0.2);
    playNote(659.25, 'sine', 0.1, 0.08, 0.2);
    playNote(783.99, 'sine', 0.2, 0.16, 0.25);
  },

  levelUp() {
    // Triumphant ascending scale
    playNote(523.25, 'sine', 0.1, 0, 0.2);
    playNote(659.25, 'sine', 0.1, 0.08, 0.2);
    playNote(783.99, 'sine', 0.1, 0.16, 0.25);
    playNote(1046.5, 'sine', 0.3, 0.24, 0.3);
    playNote(1046.5, 'triangle', 0.3, 0.24, 0.15);
  },
};

export const soundManager = {
  play(name) {
    if (!enabled || !sounds[name]) return;
    try {
      sounds[name]();
    } catch {
      // Silently fail if audio is not available
    }
  },

  setVolume(v) {
    volume = Math.max(0, Math.min(1, v));
    if (masterGain) {
      masterGain.gain.value = volume;
    }
  },

  setEnabled(val) {
    enabled = val;
    if (!val) {
      soundManager.stopMusic();
    }
  },

  isEnabled() {
    return enabled;
  },

  getVolume() {
    return volume;
  },

  startMusic() {
    if (!enabled || musicOsc) return;
    try {
      const ctx = getCtx();
      musicOsc = ctx.createOscillator();
      const musicOsc2 = ctx.createOscillator();
      musicGain = ctx.createGain();

      musicOsc.type = 'sine';
      musicOsc.frequency.value = 65.41; // C2 — deep pad
      musicOsc2.type = 'sine';
      musicOsc2.frequency.value = 98.0; // G2 — fifth

      musicGain.gain.value = 0;
      musicGain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 2);

      musicOsc.connect(musicGain);
      musicOsc2.connect(musicGain);
      musicGain.connect(masterGain);

      musicOsc.start();
      musicOsc2.start();

      // Store reference for cleanup
      musicOsc._pair = musicOsc2;
    } catch {
      musicOsc = null;
      musicGain = null;
    }
  },

  stopMusic() {
    if (musicOsc) {
      try {
        musicOsc.stop();
        if (musicOsc._pair) musicOsc._pair.stop();
      } catch {
        // Already stopped
      }
      musicOsc = null;
      musicGain = null;
    }
  },
};
