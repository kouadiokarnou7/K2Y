import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Users, MapPin, ChevronRight } from 'lucide-react';

import MapView from './MapView.jsx';
import RegionPanel from './RegionPanel.jsx';
import AIModal from './AIModal.jsx';
import ContribFeed from './ContribFeed.jsx';
import { REGIONS } from './data.js';

import districtData from './ci.json';

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cinzel+Decorative:wght@400;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; height: 100%; overflow: hidden; }
  body { background: #f2ece0; font-family: 'DM Sans', sans-serif; color: #1a1410; }

  :root {
    --gold: #b8860b;
    --gold-light: #d4af37;
    --gold-pale: #f5e6b0;
    --gold-surface: #fdf8ec;
    --cream: #f9f6f0;
    --cream-dark: #ede6d8;
    --ink: #1a1410;
    --ink-mid: #3d342a;
    --ink-soft: #7a6e62;
    --ink-muted: #b0a898;
    --border: rgba(184,134,11,0.2);
    --border-soft: rgba(184,134,11,0.1);
    --r: 14px;
    --r-sm: 8px;
  }

  .leaflet-container { background: #ddd4be !important; }
  .leaflet-pane, .leaflet-control { z-index: 1 !important; }

  .ci-region-tooltip {
    background: rgba(253,248,236,0.98) !important;
    border: 1px solid rgba(184,134,11,0.25) !important;
    border-radius: 10px !important;
    padding: 10px 16px !important;
    box-shadow: 0 8px 32px rgba(184,134,11,0.18) !important;
    pointer-events: none !important;
    backdrop-filter: blur(12px) !important;
  }
  .ci-region-tooltip::before { display: none !important; }
  .leaflet-tooltip-left::before, .leaflet-tooltip-right::before { display: none !important; }

  ::-webkit-scrollbar { width: 3px; height: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(184,134,11,0.22); border-radius: 2px; }

  input::placeholder, textarea::placeholder { color: var(--ink-muted); }
  select option { background: #fdf8ec; color: var(--ink); }

  @keyframes shimmer { 0%,100%{opacity:0.3} 50%{opacity:0.8} }
  @keyframes bounce { 0%,80%,100%{transform:translateY(0);opacity:0.6} 40%{transform:translateY(-7px);opacity:1} }
  @keyframes fadeSlideIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes floatAI { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-7px)} }
  @keyframes pulseRing {
    0%{transform:scale(1);opacity:0.7}
    100%{transform:scale(1.75);opacity:0}
  }

  .ai-float { animation: floatAI 3.6s ease-in-out infinite; }
  .pulse-ring {
    position:absolute; inset:-5px; border-radius:50%;
    border: 1.5px solid rgba(212,175,55,0.6);
    animation: pulseRing 2.4s ease-out infinite;
    pointer-events:none;
  }
  textarea { line-height: 1.65; }
`;

// ── LOADER ──────────────────────────────────────────────────
function Loader({ onComplete }) {
  const [pct, setPct] = useState(0);
  const [label, setLabel] = useState('Ouverture des archives…');

  useEffect(() => {
    const t1 = setTimeout(() => { setPct(35); setLabel('Chargement des mémoires…'); }, 350);
    const t2 = setTimeout(() => { setPct(75); setLabel('Cartographie en cours…'); }, 950);
    const t3 = setTimeout(() => { setPct(100); setLabel('Bienvenue dans la mémoire vivante'); }, 1550);
    const t4 = setTimeout(onComplete, 2700);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.85, ease: 'easeInOut' }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'linear-gradient(150deg, #fdf9f1 0%, #f5ead4 50%, #fdf9f1 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Grille de points */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.035,
        backgroundImage: 'radial-gradient(circle, #b8860b 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />

      {/* Logo central */}
      <div style={{ position: 'relative', marginBottom: '3.5rem' }}>
        {[88, 66, 46].map((s, i) => (
          <div key={i} style={{
            position: 'absolute', top: '50%', left: '50%',
            width: s, height: s, borderRadius: '50%',
            border: `1px solid rgba(184,134,11,${0.08 + i * 0.08})`,
            transform: 'translate(-50%, -50%)',
          }} />
        ))}
        <div style={{
          width: 46, height: 46, borderRadius: '50%',
          background: 'linear-gradient(135deg, #9a7020, #d4af37)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 6px 24px rgba(184,134,11,0.4)',
        }}>
          <span style={{ fontFamily: "'Cinzel Decorative', serif", color: '#fff', fontSize: '0.9rem' }}>K</span>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: "'Cinzel Decorative', serif", color: '#b8860b', fontSize: '1.8rem', letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
          K2Y
        </div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", color: '#7a6e62', fontSize: '0.95rem', letterSpacing: '0.22em', fontStyle: 'italic', marginBottom: '0.2rem' }}>
          Côte d'Ivoire
        </div>
        <div style={{ color: '#b0a898', fontSize: '0.53rem', letterSpacing: '0.5em', textTransform: 'uppercase', marginBottom: '2.75rem' }}>
          Héritage · Culture · Mémoire
        </div>

        <div style={{ width: '200px', height: '1.5px', background: 'rgba(184,134,11,0.12)', borderRadius: '2px', margin: '0 auto', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #9a7020, #d4af37, #f0c040)',
            borderRadius: '2px',
            transition: 'width 0.55s cubic-bezier(0.4,0,0.2,1)',
            width: `${pct}%`,
          }} />
        </div>
        <div style={{ color: '#c0a870', fontSize: '0.53rem', letterSpacing: '0.3em', marginTop: '0.75rem', textTransform: 'uppercase' }}>
          {label}
        </div>
      </div>
    </motion.div>
  );
}

// ── HEADER ──────────────────────────────────────────────────
function Header({ panelOpen, onOpenAI, onOpenContrib }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.55, ease: 'easeOut' }}
      style={{
        position: 'absolute', top: 0, left: 0,
        right: panelOpen ? '480px' : '0',
        transition: 'right 0.6s cubic-bezier(0.22,1,0.36,1)',
        padding: '1.15rem 1.75rem',
        zIndex: 20,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        pointerEvents: 'none',
      }}
    >
      {/* Logo */}
      <div style={{ pointerEvents: 'all', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: 38, height: 38, borderRadius: '50%',
          background: 'linear-gradient(135deg, #9a7020, #d4af37)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 3px 14px rgba(184,134,11,0.35)',
          flexShrink: 0,
        }}>
          <span style={{ fontFamily: "'Cinzel Decorative', serif", color: '#fff', fontSize: '0.8rem' }}>K</span>
        </div>
        <div>
          <div style={{ fontFamily: "'Cinzel Decorative', serif", color: '#1a1410', fontSize: '1.05rem', letterSpacing: '0.12em', lineHeight: 1 }}>K2Y</div>
          <div style={{ color: '#b0a898', fontSize: '0.48rem', letterSpacing: '0.42em', textTransform: 'uppercase', marginTop: '3px' }}>Patrimoine · Côte d'Ivoire</div>
        </div>
      </div>

      {/* Boutons */}
      <div style={{ display: 'flex', gap: '8px', pointerEvents: 'all' }}>
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: '0 4px 20px rgba(184,134,11,0.5)' }}
          whileTap={{ scale: 0.96 }}
          onClick={onOpenAI}
          style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            background: 'linear-gradient(135deg, #9a7020, #d4af37)',
            border: 'none',
            color: '#fff',
            borderRadius: '999px', padding: '0.5rem 1.15rem',
            cursor: 'pointer', fontSize: '0.62rem',
            fontFamily: "'Cinzel', serif", letterSpacing: '0.1em',
            boxShadow: '0 2px 12px rgba(184,134,11,0.35)',
          }}
        >
          <Sparkles size={12} /> IA Kôrô
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={onOpenContrib}
          style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            background: 'rgba(249,246,240,0.9)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(184,134,11,0.22)',
            color: '#7a6e62',
            borderRadius: '999px', padding: '0.5rem 1.15rem',
            cursor: 'pointer', fontSize: '0.62rem',
            fontFamily: "'Cinzel', serif", letterSpacing: '0.1em',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <Users size={12} /> Communauté
        </motion.button>
      </div>
    </motion.header>
  );
}

// ── LÉGENDE ──────────────────────────────────────────────────
function Legend({ selectedRegion }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.45 }}
      style={{
        position: 'absolute', bottom: '1.5rem', left: '1.5rem', zIndex: 20,
        background: 'rgba(249,246,240,0.94)',
        backdropFilter: 'blur(18px)',
        border: '1px solid rgba(184,134,11,0.2)',
        borderRadius: '12px',
        overflow: 'hidden',
        maxWidth: '225px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.07), 0 1px 4px rgba(184,134,11,0.1)',
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.65rem 0.9rem', background: 'none', border: 'none', cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg,#9a7020,#d4af37)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={10} color="#fff" />
          </div>
          <span style={{ color: '#7a6e62', fontSize: '0.56rem', letterSpacing: '0.25em', textTransform: 'uppercase', fontFamily: "'Cinzel', serif" }}>
            14 Régions & Ethnies
          </span>
        </div>
        <ChevronRight size={11} color="#b0a898" style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: '0.25s ease' }} />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 0.9rem 0.85rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px', marginBottom: '0.65rem' }}>
                {Object.entries(REGIONS).map(([name, reg]) => (
                  <div
                    key={name}
                    title={`${name} · ${reg.ethnies.join(', ')}`}
                    style={{
                      width: 22, height: 22, borderRadius: '5px',
                      background: reg.color,
                      opacity: selectedRegion === name ? 1 : 0.6,
                      border: selectedRegion === name ? '2px solid #1a1410' : '1.5px solid rgba(255,255,255,0.6)',
                      cursor: 'default', transition: 'all 0.2s',
                      boxShadow: selectedRegion === name ? '0 2px 8px rgba(0,0,0,0.25)' : 'none',
                    }}
                  />
                ))}
              </div>
              <div style={{ color: '#b0a898', fontSize: '0.54rem', letterSpacing: '0.14em' }}>
                {selectedRegion ? `✓ ${selectedRegion}` : 'Cliquez une région sur la carte'}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── BULLE IA FLOTTANTE ───────────────────────────────────────
function AIFloatingBubble({ onOpenAI }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="ai-float" style={{ position: 'relative' }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <div className="pulse-ring" />
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          onClick={onOpenAI}
          style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'linear-gradient(135deg, #9a7020, #d4af37, #f0c040)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 28px rgba(184,134,11,0.5)',
            position: 'relative', zIndex: 1,
          }}
        >
          <Sparkles size={22} color="#fff" />
        </motion.button>
      </div>

      {/* Tooltip au survol */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: 8, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            style={{
              position: 'absolute', right: '100%', top: '50%', transform: 'translateY(-50%)',
              marginRight: '10px', whiteSpace: 'nowrap',
              background: 'rgba(249,246,240,0.97)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(184,134,11,0.22)',
              borderRadius: '10px',
              padding: '7px 13px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            }}
          >
            <div style={{ fontFamily: "'Cinzel', serif", color: '#b8860b', fontSize: '0.62rem', letterSpacing: '0.12em' }}>Kôrô — IA Culturelle</div>
            <div style={{ color: '#b0a898', fontSize: '0.52rem', letterSpacing: '0.1em', marginTop: '2px' }}>Posez vos questions</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── APP ──────────────────────────────────────────────────────
export default function App() {
  const [loading, setLoading]         = useState(true);
  const [selectedReg, setSelectedReg] = useState(null);
  const [showAI, setShowAI]           = useState(false);
  const [showContrib, setShowContrib] = useState(false);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
  }, []);

  const handleRegionSelect = useCallback((name) => setSelectedReg(name), []);
  const closePanel = useCallback(() => setSelectedReg(null), []);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#ddd4be', position: 'relative' }}>

      <AnimatePresence>
        {loading && <Loader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <>
          <MapView
            geoData={districtData}
            onRegionSelect={handleRegionSelect}
            selectedRegion={selectedReg}
            panelOpen={!!selectedReg}
          />

          <Header
            panelOpen={!!selectedReg}
            onOpenAI={() => setShowAI(true)}
            onOpenContrib={() => setShowContrib(true)}
          />

          <Legend selectedRegion={selectedReg} />

          {/* Bulle IA flottante — disparaît quand panel ouvert */}
          <AnimatePresence>
            {!selectedReg && (
              <motion.div
                key="ai-bubble"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                transition={{ delay: 0.7, type: 'spring', stiffness: 260, damping: 20 }}
                style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', zIndex: 20 }}
              >
                <AIFloatingBubble onOpenAI={() => setShowAI(true)} />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {selectedReg && (
              <RegionPanel
                key={selectedReg}
                regionName={selectedReg}
                onClose={closePanel}
                onOpenAI={() => setShowAI(true)}
                onOpenContrib={() => setShowContrib(true)}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showAI && (
              <AIModal
                key="ai-modal"
                onClose={() => setShowAI(false)}
                contextRegion={selectedReg}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showContrib && (
              <ContribFeed
                key="contrib-modal"
                onClose={() => setShowContrib(false)}
                contextRegion={selectedReg}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
