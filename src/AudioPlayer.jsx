// ══════════════════════════════════════════════════════════════════════════
// AudioPlayer — Indicateur de musique flottant
// Affiche la piste en cours avec contrôle volume et bouton stop
// ══════════════════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Music, ChevronDown } from 'lucide-react';

export default function AudioPlayer({ isPlaying, currentTrack, volume, setVolume, stop, panelOpen }) {
  const [expanded, setExpanded] = useState(false);

  if (!isPlaying || !currentTrack) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="audio-player"
        initial={{ opacity: 0, y: 20, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        style={{
          position: 'absolute',
          bottom: '1.5rem',
          // Se décale si le panel latéral est ouvert
          right: panelOpen ? 'calc(480px + 1.5rem)' : '1.5rem',
          transition: 'right 0.6s cubic-bezier(0.22,1,0.36,1)',
          zIndex: 25,
          background: 'rgba(249,246,240,0.96)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(184,134,11,0.25)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(184,134,11,0.15), 0 2px 8px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          minWidth: '200px',
          maxWidth: '260px',
        }}
      >
        {/* Header cliquable */}
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '0.7rem 0.9rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          {/* Icône animée */}
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #9a7020, #d4af37)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(184,134,11,0.35)',
          }}>
            <MusicWaveIcon />
          </div>

          {/* Infos piste */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{
              fontFamily: "'Cinzel', serif",
              color: '#b8860b',
              fontSize: '0.6rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {currentTrack.label}
            </div>
            <div style={{
              color: '#b0a898',
              fontSize: '0.52rem',
              letterSpacing: '0.08em',
              marginTop: '2px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {currentTrack.description}
            </div>
          </div>

          <ChevronDown
            size={12}
            color="#b0a898"
            style={{
              transform: expanded ? 'rotate(180deg)' : 'none',
              transition: '0.25s ease',
              flexShrink: 0,
            }}
          />
        </button>

        {/* Panneau expandable : volume + stop */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{
                padding: '0 0.9rem 0.8rem',
                borderTop: '1px solid rgba(184,134,11,0.1)',
                paddingTop: '0.65rem',
              }}>
                {/* Volume */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.6rem' }}>
                  <button
                    onClick={() => setVolume(volume === 0 ? 0.45 : 0)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                  >
                    {volume === 0
                      ? <VolumeX size={13} color="#b0a898" />
                      : <Volume2 size={13} color="#b8860b" />
                    }
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    style={{
                      flex: 1,
                      height: '3px',
                      accentColor: '#d4af37',
                      cursor: 'pointer',
                    }}
                  />
                  <span style={{ color: '#b0a898', fontSize: '0.5rem', minWidth: '26px', textAlign: 'right' }}>
                    {Math.round(volume * 100)}%
                  </span>
                </div>

                {/* Bouton stop */}
                <button
                  onClick={stop}
                  style={{
                    width: '100%',
                    padding: '0.4rem',
                    background: 'rgba(184,134,11,0.08)',
                    border: '1px solid rgba(184,134,11,0.18)',
                    borderRadius: '8px',
                    color: '#7a6e62',
                    fontSize: '0.54rem',
                    fontFamily: "'Cinzel', serif",
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.target.style.background = 'rgba(184,134,11,0.15)';
                    e.target.style.color = '#b8860b';
                  }}
                  onMouseLeave={e => {
                    e.target.style.background = 'rgba(184,134,11,0.08)';
                    e.target.style.color = '#7a6e62';
                  }}
                >
                  ■ Arrêter la musique
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Icône d'ondes musicales animées ────────────────────────────────────────
function MusicWaveIcon() {
  return (
    <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
      {[
        { x: 1, h: 6, delay: '0s' },
        { x: 4, h: 10, delay: '0.15s' },
        { x: 7, h: 14, delay: '0.3s' },
        { x: 10, h: 10, delay: '0.15s' },
        { x: 13, h: 6, delay: '0s' },
      ].map((bar, i) => (
        <rect
          key={i}
          x={bar.x}
          y={(14 - bar.h) / 2}
          width="2"
          height={bar.h}
          rx="1"
          fill="white"
          style={{
            animation: `audioBar 0.8s ease-in-out infinite alternate`,
            animationDelay: bar.delay,
            transformOrigin: 'center',
          }}
        />
      ))}
      <style>{`
        @keyframes audioBar {
          from { transform: scaleY(0.35); opacity: 0.7; }
          to   { transform: scaleY(1);    opacity: 1;   }
        }
      `}</style>
    </svg>
  );
}