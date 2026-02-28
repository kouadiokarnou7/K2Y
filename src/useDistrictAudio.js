// ══════════════════════════════════════════════════════════════════════════
// useDistrictAudio — Musique en ligne par district + fallback Web Audio
// ══════════════════════════════════════════════════════════════════════════

import { useEffect, useRef, useState, useCallback } from 'react';

// ── URLs audio par district ────────────────────────────────────────────────
// Pour changer une URL : remplace la valeur de `url` par ta propre URL
// Si url: null → ambiance Web Audio générée automatiquement
const DISTRICT_TRACKS = {
  'Savanes':            { url: '/audio/abidjan.mp3',  label: 'Rythmes Sénoufo',        description: 'Percussions du Nord'             },
  'Denguélé':           { url: '/audio/denguele.mp3',  label: 'Griots Mandingues',      description: 'Kora & voix ancestrales'         },
  'Zanzan':             { url: '/audio/zanzan.mp3',  label: 'Spirituel Lobi',         description: 'Rituels animistes'               },
  'Woroba':             { url: '/audio/woroba.mp3',  label: 'Worodougou',             description: 'Entre savane et forêt'           },
  'Montagnes':          { url: '/audio/montagnes.mp3',  label: 'Masques Dan',            description: 'Forêts & chutes de Man'          },
  'Bas-Sassandra':      { url: '/audio/bassassandra.mp3',  label: 'Pêcheurs Neyo',          description: 'Vagues & tam-tams du littoral'   },
  'Sassandra-Marahoué': { url: '/audio/marahoué.mp3',  label: 'Sculptures Guro',        description: 'Rythmes du centre-ouest'         },
  'Vallée du Bandama':  { url: '/audio/Bandama.mp3',  label: 'Âme Baoulé',             description: 'Balafons & tam-tams'             },
  'Lacs':               { url: '/audio/lacs.mp3',  label: 'Reflets Akan',           description: 'Musique des confluents'          },
  'Yamoussoukro':       { url: '/audio/yamoussoukro.mp3',  label: "N'Gban Royal",           description: 'La capitale & ses traditions'    },
  'Gôh-Djiboua':        { url: '/audio/djiboua.mp3',  label: 'Masques Gla',            description: 'Rites initiatiques Guro'         },
  'Lagunes':            { url: '/audio/lagunes.mp3',  label: 'Dipri Adjoukrou',        description: 'Lagunes & rites sacrés'          },
  'Abidjan':            { url: '/audion/abidjan.mp3',  label: 'Coupé-Décalé',           description: 'Le creuset ivoirien moderne'     },
  'Comoé':              { url: '/audio/comoé.mp3',  label: 'Royauté Agni Sanwi',     description: 'Trompettes & percussions royales'},
};



const FALLBACK_WEB_AUDIO = {
  bpm: 96, notes: [261.63, 293.66, 329.63, 392, 440],
  drumPattern: [1,0,1,0,0,1,0,1,1,0,0,1,0,1,1,0],
  waveType: 'triangle', filterFreq: 900,
};

// ── Moteur HTML Audio (URLs en ligne) ──────────────────────────────────────
class FileAudioEngine {
  constructor() { this.audio = null; this.isRunning = false; this.fadeInterval = null; }

  start(url, volume, onSuccess, onError) {
    this._stop();
    this.audio = new Audio();
    this.audio.crossOrigin = 'anonymous';
    this.audio.loop = true;
    this.audio.volume = 0;
    this.audio.src = url;
    this.isRunning = true;

    const doPlay = () => {
      this.audio.play()
        .then(() => {
          this._fadeIn(volume);
          onSuccess?.();
        })
        .catch(() => onError?.());
    };

    this.audio.addEventListener('canplaythrough', doPlay, { once: true });
    this.audio.addEventListener('error', () => onError?.(), { once: true });
    // Fallback si canplaythrough ne se déclenche pas
    setTimeout(() => {
      if (this.isRunning && this.audio?.paused) doPlay();
    }, 2000);
    this.audio.load();
  }

  _fadeIn(target) {
    clearInterval(this.fadeInterval);
    let v = 0;
    const step = target / 20;
    this.fadeInterval = setInterval(() => {
      v = Math.min(v + step, target);
      if (this.audio) this.audio.volume = v;
      if (v >= target) clearInterval(this.fadeInterval);
    }, 60);
  }

  fadeOut(callback) {
    if (!this.audio) { callback?.(); return; }
    clearInterval(this.fadeInterval);
    const audio = this.audio;
    let v = audio.volume;
    const step = Math.max(v / 15, 0.01);
    this.fadeInterval = setInterval(() => {
      v = Math.max(0, v - step);
      audio.volume = v;
      if (v <= 0) {
        clearInterval(this.fadeInterval);
        audio.pause();
        callback?.();
      }
    }, 50);
  }

  setVolume(v) { if (this.audio) this.audio.volume = v; }

  _stop() {
    clearInterval(this.fadeInterval);
    if (this.audio) { this.audio.pause(); this.audio.src = ''; this.audio = null; }
    this.isRunning = false;
  }

  destroy() { this._stop(); }
}

// ── Moteur Web Audio (fallback génératif) ──────────────────────────────────
class WebAudioEngine {
  constructor() {
    this.ctx = null; this.masterGain = null; this.nodes = [];
    this.stepIndex = 0; this.nextStepTime = 0; this.timerID = null;
    this.profile = null; this.isRunning = false;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }

  playNote(freq, time, duration, waveType, filterFreq) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    osc.type = waveType; osc.frequency.value = freq;
    filter.type = 'lowpass'; filter.frequency.value = filterFreq; filter.Q.value = 1.5;
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.18, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    osc.connect(filter); filter.connect(gain); gain.connect(this.masterGain);
    osc.start(time); osc.stop(time + duration + 0.1);
    this.nodes.push(osc);
  }

  playDrum(time, isAccent) {
    const bufSize = Math.floor(this.ctx.sampleRate * 0.08);
    const buffer = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufSize; i++)
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufSize, isAccent ? 5 : 2.5);
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(isAccent ? 0.55 : 0.28, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.07);
    const filter = this.ctx.createBiquadFilter();
    filter.type = isAccent ? 'lowpass' : 'highpass';
    filter.frequency.value = isAccent ? 180 : 4000;
    src.connect(filter); filter.connect(gain); gain.connect(this.masterGain);
    src.start(time); this.nodes.push(src);
  }

  scheduleStep() {
    const { bpm, notes, drumPattern, waveType, filterFreq } = this.profile;
    const stepDur = 60 / bpm / 4;
    while (this.nextStepTime < this.ctx.currentTime + 0.1) {
      const step = this.stepIndex % 16;
      if (drumPattern[step]) this.playDrum(this.nextStepTime, step % 4 === 0);
      if (step % 2 === 0) {
        const noteIdx = Math.floor(this.stepIndex / 2) % notes.length;
        const freq = notes[noteIdx] * (1 + (Math.random() - 0.5) * 0.004);
        this.playNote(freq, this.nextStepTime, stepDur * 1.8, waveType, filterFreq);
      }
      this.nextStepTime += stepDur;
      this.stepIndex++;
      if (this.nodes.length > 200) this.nodes = this.nodes.slice(-100);
    }
  }

  start(regionName, targetVolume) {
    this.init();
    this.isRunning = false;
    clearInterval(this.timerID);
    this.nodes.forEach(n => { try { n.stop(); } catch(_) {} });
    this.nodes = [];

    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(0, now + 0.15);

    setTimeout(() => {
      this.profile = WEB_AUDIO_PROFILES[regionName] || FALLBACK_WEB_AUDIO;
      this.stepIndex = 0;
      this.nextStepTime = this.ctx.currentTime + 0.05;
      this.isRunning = true;
      const t = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(t);
      this.masterGain.gain.setValueAtTime(0, t);
      this.masterGain.gain.linearRampToValueAtTime(targetVolume, t + 1.0);
      this.timerID = setInterval(() => { if (this.isRunning) this.scheduleStep(); }, 50);
    }, 160);
  }

  fadeOut(callback) {
    if (!this.ctx || !this.masterGain) { callback?.(); return; }
    this.isRunning = false;
    clearInterval(this.timerID);
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(0, now + 0.8);
    setTimeout(() => {
      this.nodes.forEach(n => { try { n.stop(); } catch(_) {} });
      this.nodes = [];
      callback?.();
    }, 850);
  }

  setVolume(v) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(v, now + 0.1);
  }

  destroy() {
    this.isRunning = false;
    clearInterval(this.timerID);
    this.nodes.forEach(n => { try { n.stop(); } catch(_) {} });
    this.nodes = [];
    try { this.ctx?.close(); } catch(_) {}
    this.ctx = null;
  }
}

// ── Hook React ──────────────────────────────────────────────────────────────
export function useDistrictAudio(selectedRegion) {
  const fileEngineRef     = useRef(null);
  const webEngineRef      = useRef(null);
  const activeEngineRef   = useRef(null);

  const [isPlaying, setIsPlaying]       = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [volume, setVolumeState]        = useState(0.45);
  const volumeRef = useRef(0.45);

  const getFileEngine = useCallback(() => {
    if (!fileEngineRef.current) fileEngineRef.current = new FileAudioEngine();
    return fileEngineRef.current;
  }, []);

  const getWebEngine = useCallback(() => {
    if (!webEngineRef.current) webEngineRef.current = new WebAudioEngine();
    return webEngineRef.current;
  }, []);

  const setVolume = useCallback((v) => {
    const clamped = Math.max(0, Math.min(1, v));
    volumeRef.current = clamped;
    setVolumeState(clamped);
    activeEngineRef.current?.setVolume(clamped);
  }, []);

  const stop = useCallback(() => {
    activeEngineRef.current?.fadeOut(() => {
      setIsPlaying(false);
      setCurrentTrack(null);
    });
  }, []);

  // Arrêt propre de tout ce qui joue
  const stopAll = useCallback((callback) => {
    const fe = fileEngineRef.current;
    const we = webEngineRef.current;
    if (fe?.isRunning) { fe.fadeOut(callback); return; }
    if (we?.isRunning) { we.fadeOut(callback); return; }
    callback?.();
  }, []);

  useEffect(() => {
    if (!selectedRegion) {
      stopAll(() => { setIsPlaying(false); setCurrentTrack(null); });
      return;
    }

    const trackConfig = DISTRICT_TRACKS[selectedRegion];
    const url = trackConfig?.url || null;
    const track = {
      label:       trackConfig?.label       || selectedRegion,
      description: trackConfig?.description || '',
      isFile: !!url,
    };

    const launchWebAudio = () => {
      const engine = getWebEngine();
      activeEngineRef.current = engine;
      engine.start(selectedRegion, volumeRef.current);
      setCurrentTrack({ ...track, isFile: false });
      setIsPlaying(true);
    };

    const launchFile = () => {
      const engine = getFileEngine();
      activeEngineRef.current = engine;
      engine.start(
        url,
        volumeRef.current,
        () => { setCurrentTrack(track); setIsPlaying(true); }, // succès
        () => { launchWebAudio(); }                            // échec → fallback
      );
    };

    // Arrêter proprement avant de lancer
    stopAll(url ? launchFile : launchWebAudio);

  }, [selectedRegion, getFileEngine, getWebEngine, stopAll]);

  useEffect(() => {
    return () => {
      fileEngineRef.current?.destroy();
      webEngineRef.current?.destroy();
    };
  }, []);

  return { isPlaying, currentTrack, volume, setVolume, stop };
}