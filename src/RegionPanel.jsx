import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ChevronLeft, ArrowRight, Users, MapPin, Sparkles,
  BookOpen, Music, Utensils, Home, Star, Layers,
  MessageSquare, Share2, Heart, Bookmark, MoreHorizontal,
  Globe, Crown, Leaf, Gem, Flame, Building2, ScrollText,
  ChevronDown, Play, Volume2, Info, Clock, TrendingUp,
  ArrowUpRight, Camera, RefreshCw, ChevronRight
} from 'lucide-react';
import { REGIONS, CULTURAL_PILLARS } from './data.js';

// ── Icônes Lucide par pilier ─────────────────────────────────
const PILLAR_ICONS = {
  architecture: Building2,
  gastronomie:  Utensils,
  masques:      Layers,
  textiles:     Gem,
  oral:         ScrollText,
  rites:        Flame,
  musique:      Music,
  social:       Crown,
  bijoux:       Star,
  pharmacopee:  Leaf,
};

// ── Appel IA contenu pilier ───────────────────────────────────
async function fetchPillarContent(regionName, pillar) {
  const reg = REGIONS[regionName];
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 900,
      system: `Tu es un expert passionné de la culture ivoirienne. Rédige en français, avec vivacité et poésie.
Structure ta réponse ainsi (respecte EXACTEMENT ce format) :

**[Titre accrocheur en rapport avec le thème]**

[Paragraphe d'introduction 2-3 phrases, contexte général pour ce peuple]

**Point 1 :** [Nom du point]
[2 phrases de description vivante]

**Point 2 :** [Nom du point]
[2 phrases de description vivante]

**Point 3 :** [Nom du point]
[2 phrases de description vivante]

> *[Une anecdote fascinante ou un fait surprenant, en italique, 2 phrases]*

Maximum 280 mots. Pas de listes à puces. Zéro markdown superflu.`,
      messages: [{
        role: 'user',
        content: `Décris "${pillar.label}" pour les peuples ${reg.ethnies.join(', ')} de la région ${regionName} (${reg.zone} de la Côte d'Ivoire). Contexte : ${reg.desc}`,
      }],
    }),
  });
  const json = await resp.json();
  return json.content?.[0]?.text || 'Contenu temporairement indisponible.';
}

// ── Render markdown léger ─────────────────────────────────────
function RenderContent({ text, accentColor }) {
  return (
    <div>
      {text.split('\n').map((line, i) => {
        if (!line.trim()) return <div key={i} style={{ height: '0.55rem' }} />;

        if (line.startsWith('**') && line.endsWith('**') && !line.includes(':**')) {
          return (
            <h3 key={i} style={{
              fontFamily: "'Cinzel', serif", color: '#1a1410',
              fontSize: '0.95rem', fontWeight: 700,
              margin: '1rem 0 0.3rem', letterSpacing: '0.03em', lineHeight: 1.3,
            }}>
              {line.replace(/\*\*/g, '')}
            </h3>
          );
        }

        if (line.startsWith('**') && line.includes(':**')) {
          const colonIdx = line.indexOf(':**');
          const label = line.slice(2, colonIdx);
          const rest = line.slice(colonIdx + 3).replace(/\*\*/g, '');
          return (
            <div key={i} style={{
              marginBottom: '0.65rem',
              paddingLeft: '0.9rem',
              borderLeft: `2.5px solid ${accentColor}55`,
            }}>
              <span style={{
                color: accentColor, fontFamily: "'Cinzel', serif",
                fontSize: '0.7rem', letterSpacing: '0.08em', fontWeight: 700,
              }}>
                {label}
              </span>
              <span style={{ color: '#3d342a', fontSize: '0.83rem', fontWeight: 300, lineHeight: 1.75 }}>
                {' '}{rest}
              </span>
            </div>
          );
        }

        if (line.startsWith('> *') && line.endsWith('*')) {
          return (
            <div key={i} style={{
              margin: '1.1rem 0 0.5rem',
              padding: '0.9rem 1.1rem',
              background: `${accentColor}0c`,
              borderLeft: `3px solid ${accentColor}`,
              borderRadius: '0 10px 10px 0',
              color: '#5a5048', fontStyle: 'italic',
              fontSize: '0.8rem', lineHeight: 1.8,
            }}>
              {line.replace(/^> \*|\*$/g, '')}
            </div>
          );
        }

        return (
          <p key={i} style={{ color: '#5a5048', fontSize: '0.84rem', lineHeight: 1.85, fontWeight: 300, margin: '0.1rem 0' }}>
            {line}
          </p>
        );
      })}
    </div>
  );
}

// ── Skeleton loader ───────────────────────────────────────────
function SkeletonLoader({ color }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '0.5rem 0' }}>
      {[100, 88, 94, 76, 98, 72, 85].map((w, i) => (
        <div key={i} style={{
          height: 11, background: `${color}15`,
          borderRadius: 6, width: `${w}%`,
          animation: `shimmer 1.6s ease infinite ${i * 0.1}s`,
        }} />
      ))}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: '0.75rem' }}>
        <div style={{ width: 22, height: 22, borderRadius: '50%', background: `${color}20`, animation: 'shimmer 1.6s ease infinite' }} />
        <div style={{ height: 9, background: `${color}12`, borderRadius: 6, width: 180, animation: 'shimmer 1.6s ease infinite' }} />
      </div>
    </div>
  );
}

// ── Pillar Detail Screen ──────────────────────────────────────
function PillarScreen({ regionName, pillar, onBack, reg }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const loaded = useRef(false);
  const Icon = PILLAR_ICONS[pillar.id] || Star;

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    fetchPillarContent(regionName, pillar)
      .then(setContent)
      .catch(() => setContent('Erreur de chargement. Vérifiez votre connexion.'))
      .finally(() => setLoading(false));
  }, [regionName, pillar]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Back */}
      <button
        onClick={onBack}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          color: '#b0a898', background: 'none', border: 'none',
          cursor: 'pointer', fontSize: '0.58rem', letterSpacing: '0.25em',
          textTransform: 'uppercase', padding: '0 0 1.35rem',
          fontFamily: "'Cinzel', serif", transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#b8860b'}
        onMouseLeave={e => e.currentTarget.style.color = '#b0a898'}
      >
        <ChevronLeft size={13} /> Retour aux piliers
      </button>

      {/* Card header */}
      <div style={{
        background: `linear-gradient(135deg, ${pillar.color}18, ${pillar.color}08)`,
        border: `1px solid ${pillar.color}30`,
        borderRadius: 16, padding: '1.1rem 1.2rem',
        marginBottom: '1.25rem',
        display: 'flex', alignItems: 'center', gap: '0.9rem',
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: `linear-gradient(135deg, ${pillar.color}30, ${pillar.color}18)`,
          border: `1.5px solid ${pillar.color}45`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, boxShadow: `0 4px 18px ${pillar.color}25`,
        }}>
          <Icon size={24} color={pillar.color} strokeWidth={1.5} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Cinzel', serif", color: '#1a1410', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.03em', marginBottom: 3 }}>
            {pillar.label}
          </div>
          <div style={{ color: pillar.color, fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600 }}>
            {regionName}
          </div>
        </div>
        {/* Actions */}
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => setLiked(!liked)}
            style={{
              width: 34, height: 34, borderRadius: '50%',
              background: liked ? '#fee2e2' : 'rgba(0,0,0,0.04)',
              border: `1px solid ${liked ? '#fca5a5' : 'rgba(184,134,11,0.15)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            <Heart size={14} color={liked ? '#ef4444' : '#b0a898'} fill={liked ? '#ef4444' : 'none'} />
          </button>
          <button
            onClick={() => setSaved(!saved)}
            style={{
              width: 34, height: 34, borderRadius: '50%',
              background: saved ? '#fef9ec' : 'rgba(0,0,0,0.04)',
              border: `1px solid ${saved ? '#d4af37' : 'rgba(184,134,11,0.15)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            <Bookmark size={14} color={saved ? '#b8860b' : '#b0a898'} fill={saved ? '#b8860b' : 'none'} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ borderTop: `1.5px solid ${pillar.color}18`, paddingTop: '1.1rem' }}>
        {loading
          ? <SkeletonLoader color={pillar.color} />
          : <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <RenderContent text={content} accentColor={pillar.color} />
            </motion.div>
        }
      </div>

      {/* Bottom share bar */}
      {!loading && content && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            marginTop: '1.5rem', paddingTop: '1rem',
            borderTop: '1px solid rgba(184,134,11,0.1)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          <button style={actionBtnStyle}>
            <MessageSquare size={14} /> Commenter
          </button>
          <button style={actionBtnStyle}>
            <Share2 size={14} /> Partager
          </button>
          <button
            style={{
              ...actionBtnStyle,
              marginLeft: 'auto',
              background: `${pillar.color}15`,
              borderColor: `${pillar.color}35`,
              color: pillar.color,
            }}
          >
            <RefreshCw size={13} /> Régénérer
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

const actionBtnStyle = {
  display: 'flex', alignItems: 'center', gap: 5,
  padding: '6px 14px', borderRadius: 20,
  background: 'rgba(0,0,0,0.03)',
  border: '1px solid rgba(184,134,11,0.18)',
  color: '#7a6e62', fontSize: '0.68rem', fontWeight: 500,
  cursor: 'pointer', transition: 'all 0.18s',
  fontFamily: "'DM Sans', sans-serif",
};

// ── TABS config ───────────────────────────────────────────────
const TABS = [
  { id: 'overview', label: 'Accueil',   Icon: Home },
  { id: 'pillars',  label: 'Culture',   Icon: Layers },
  { id: 'about',    label: 'À propos',  Icon: Info },
];

// ── About Tab ─────────────────────────────────────────────────
function AboutTab({ reg, regionName }) {
  const items = [
    { Icon: MapPin,      label: 'Zone géographique', value: reg.zone },
    { Icon: Building2,   label: 'Capitale',           value: reg.capitale },
    { Icon: Users,       label: 'Population',         value: reg.population },
    { Icon: Globe,       label: 'Ethnies',             value: reg.ethnies.join(', ') },
    { Icon: Clock,       label: 'Région',              value: regionName },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
    >
      <h3 style={{ fontFamily: "'Cinzel', serif", color: '#1a1410', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '0.06em' }}>
        À propos de {regionName}
      </h3>

      <p style={{
        color: '#5a5048', lineHeight: 1.85, fontWeight: 300,
        fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.92rem',
        borderLeft: `2.5px solid ${reg.color}60`,
        paddingLeft: '1rem', marginBottom: '1.5rem',
      }}>
        {reg.desc}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {items.map(({ Icon, label, value }) => (
          <div key={label} style={{
            display: 'flex', alignItems: 'flex-start', gap: '0.85rem',
            padding: '0.65rem 0.9rem',
            background: 'rgba(184,134,11,0.03)',
            border: '1px solid rgba(184,134,11,0.1)',
            borderRadius: 10,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              background: `${reg.color}15`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={15} color={reg.color} strokeWidth={1.8} />
            </div>
            <div>
              <div style={{ fontSize: '0.57rem', color: '#b0a898', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 2, fontFamily: "'Cinzel', serif" }}>
                {label}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#1a1410', fontWeight: 500 }}>{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Ethnies badges */}
      <div style={{ marginTop: '1.25rem' }}>
        <div style={{ fontSize: '0.57rem', color: '#b0a898', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '0.65rem', fontFamily: "'Cinzel', serif" }}>
          Peuples & Ethnies
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
          {reg.ethnies.map((e, i) => (
            <motion.span
              key={e}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              style={{
                padding: '5px 14px',
                background: `${reg.color}14`,
                border: `1px solid ${reg.color}40`,
                borderRadius: 999,
                color: reg.color, fontSize: '0.72rem',
                fontFamily: "'Cinzel', serif", letterSpacing: '0.08em',
                fontWeight: 600,
              }}
            >
              {e}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ── Overview Tab ──────────────────────────────────────────────
function OverviewTab({ reg, regionName, onOpenAI, onOpenContrib, setTab, setView }) {

  const quickActions = [
    {
      Icon: Sparkles, label: 'IA Kôrô', sublabel: 'Parcours immersif',
      onClick: onOpenAI,
      style: { bg: 'linear-gradient(135deg,#9a7020,#d4af37)', color: '#fff', border: 'none', shadow: '0 4px 18px rgba(184,134,11,0.4)' },
    },
    {
      Icon: Layers, label: 'Culture', sublabel: '10 piliers',
      onClick: () => setTab('pillars'),
      style: { bg: `${reg.color}14`, color: reg.color, border: `1.5px solid ${reg.color}40`, shadow: `0 4px 14px ${reg.color}20` },
    },
    {
      Icon: Users, label: 'Partager', sublabel: 'Contribuer',
      onClick: onOpenContrib,
      style: { bg: 'rgba(0,0,0,0.04)', color: '#7a6e62', border: '1.5px solid rgba(184,134,11,0.2)', shadow: 'none' },
    },
    {
      Icon: Info, label: 'À propos', sublabel: 'Histoire',
      onClick: () => setTab('about'),
      style: { bg: 'rgba(0,0,0,0.04)', color: '#7a6e62', border: '1.5px solid rgba(184,134,11,0.2)', shadow: 'none' },
    },
  ];

  // Quick pilier cards (top 4)
  const topPillars = CULTURAL_PILLARS.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
    >
      {/* Description */}
      <p style={{
        color: '#5a5048', lineHeight: 1.85, fontWeight: 300,
        fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.92rem',
        borderLeft: `2.5px solid ${reg.color}60`,
        paddingLeft: '1rem', marginBottom: '1.5rem',
      }}>
        {reg.desc}
      </p>

      {/* 4 actions — 2x2 grid avec tailles différentes */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto', gap: '8px', marginBottom: '1.5rem' }}>
        {/* Grande action IA — occupe 2 colonnes */}
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpenAI}
          style={{
            gridColumn: '1 / -1',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'linear-gradient(135deg,#9a7020,#d4af37,#f0c040)',
            border: 'none', borderRadius: 14,
            padding: '1rem 1.25rem',
            cursor: 'pointer',
            boxShadow: '0 6px 24px rgba(184,134,11,0.4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={22} color="#fff" strokeWidth={1.5} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: "'Cinzel', serif", color: '#fff', fontSize: '0.88rem', fontWeight: 700, letterSpacing: '0.04em', marginBottom: 2 }}>
                IA Kôrô — Parcours Immersif
              </div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.62rem', letterSpacing: '0.06em' }}>
                Voyage culturel personnalisé · {regionName}
              </div>
            </div>
          </div>
          <ArrowUpRight size={18} color="rgba(255,255,255,0.85)" />
        </motion.button>

        {/* Bouton Culture */}
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setTab('pillars')}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
            background: `${reg.color}12`,
            border: `1.5px solid ${reg.color}38`,
            borderRadius: 14, padding: '0.9rem 1rem',
            cursor: 'pointer', transition: 'all 0.22s',
            boxShadow: `0 3px 12px ${reg.color}15`,
          }}
        >
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `${reg.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <Layers size={18} color={reg.color} strokeWidth={1.6} />
          </div>
          <div style={{ fontFamily: "'Cinzel', serif", color: reg.color, fontSize: '0.75rem', fontWeight: 700, marginBottom: 2 }}>Culture</div>
          <div style={{ color: '#b0a898', fontSize: '0.58rem' }}>10 piliers culturels</div>
        </motion.button>

        {/* Bouton Contribuer */}
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.96 }}
          onClick={onOpenContrib}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
            background: 'rgba(0,0,0,0.025)',
            border: '1.5px solid rgba(184,134,11,0.2)',
            borderRadius: 14, padding: '0.9rem 1rem',
            cursor: 'pointer', transition: 'all 0.22s',
          }}
        >
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <Users size={18} color="#7a6e62" strokeWidth={1.6} />
          </div>
          <div style={{ fontFamily: "'Cinzel', serif", color: '#3d342a', fontSize: '0.75rem', fontWeight: 700, marginBottom: 2 }}>Contribuer</div>
          <div style={{ color: '#b0a898', fontSize: '0.58rem' }}>Partager un savoir</div>
        </motion.button>
      </div>

      {/* Section piliers rapides */}
      <div style={{ marginBottom: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#3d342a', letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: "'Cinzel', serif" }}>
          Piliers culturels
        </div>
        <button
          onClick={() => setTab('pillars')}
          style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: '#b8860b', fontSize: '0.62rem', cursor: 'pointer', fontWeight: 600 }}
        >
          Voir tout <ChevronRight size={12} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '7px' }}>
        {CULTURAL_PILLARS.slice(0, 8).map((pillar, i) => {
          const PIcon = PILLAR_ICONS[pillar.id] || Star;
          return (
            <motion.button
              key={pillar.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => { setTab('pillars'); setView(pillar.id); }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: '5px', padding: '0.65rem 0.4rem',
                background: '#fff',
                border: '1px solid rgba(184,134,11,0.14)',
                borderRadius: 12, cursor: 'pointer',
                boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
                transition: 'all 0.18s',
              }}
            >
              <div style={{ width: 30, height: 30, borderRadius: 8, background: `${pillar.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PIcon size={15} color={pillar.color} strokeWidth={1.7} />
              </div>
              <span style={{ fontSize: '0.55rem', color: '#7a6e62', textAlign: 'center', lineHeight: 1.3, fontWeight: 500 }}>
                {pillar.label.split(' ')[0]}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ── Pillars Tab ───────────────────────────────────────────────
function PillarsTab({ reg, regionName, setView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
    >
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontFamily: "'Cinzel', serif", color: '#1a1410', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: 3 }}>
          10 Piliers Culturels
        </div>
        <div style={{ color: '#b0a898', fontSize: '0.6rem', letterSpacing: '0.1em' }}>
          Sélectionnez un pilier — l'IA génère le contenu
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {CULTURAL_PILLARS.map((pillar, idx) => {
          const PIcon = PILLAR_ICONS[pillar.id] || Star;
          return (
            <motion.button
              key={pillar.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.04 }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setView(pillar.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.85rem',
                background: '#fff',
                border: '1px solid rgba(184,134,11,0.12)',
                borderRadius: 12, padding: '0.75rem 0.9rem',
                cursor: 'pointer', textAlign: 'left',
                boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                transition: 'all 0.18s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = `${pillar.color}0c`; e.currentTarget.style.borderColor = `${pillar.color}40`; e.currentTarget.style.boxShadow = `0 3px 14px ${pillar.color}18`; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'rgba(184,134,11,0.12)'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.03)'; }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 11, background: `${pillar.color}15`, border: `1px solid ${pillar.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <PIcon size={19} color={pillar.color} strokeWidth={1.6} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#1a1410', fontSize: '0.78rem', fontFamily: "'Cinzel', serif", fontWeight: 600, marginBottom: 2 }}>
                  <span style={{ color: pillar.color, marginRight: 6, fontSize: '0.6rem', fontWeight: 700, opacity: 0.7 }}>{idx + 1}.</span>
                  {pillar.label}
                </div>
                <div style={{ color: '#b0a898', fontSize: '0.6rem', fontStyle: 'italic', lineHeight: 1.4 }}>{pillar.sublabel}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: `${pillar.color}60` }} />
                <ChevronRight size={13} color="#c8b898" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════
// REGION PANEL — Facebook Culturel
// ══════════════════════════════════════════════════════════════
export default function RegionPanel({ regionName, onClose, onOpenAI, onOpenContrib }) {
  const [tab, setTab] = useState('overview');
  const [view, setView] = useState(null); // null | pillarId
  const reg = REGIONS[regionName];
  const activePillar = view ? CULTURAL_PILLARS.find(p => p.id === view) : null;

  // Quand on change d'onglet, reset la vue pilier
  const handleTabChange = (newTab) => {
    setView(null);
    setTab(newTab);
  };

  if (!reg) return null;

  return (
    <motion.aside
      key={regionName}
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 480,
        background: '#f4f0e8',
        borderLeft: '1px solid rgba(184,134,11,0.18)',
        zIndex: 30,
        display: 'flex', flexDirection: 'column',
        boxShadow: '-20px 0 60px rgba(0,0,0,0.12)',
        overflow: 'hidden',
      }}
    >
      {/* ── COVER PHOTO ── */}
      <div style={{ position: 'relative', height: 185, flexShrink: 0 }}>
        {/* Image de couverture */}
        <img
          src={reg.img} alt={regionName}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {/* Gradient crème en bas */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(244,240,232,0) 45%, rgba(244,240,232,1) 100%)' }} />
        {/* Gradient gauche-droite subtil couleur région */}
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(120deg, ${reg.color}18 0%, transparent 60%)` }} />

        {/* Barre colorée haut */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: reg.gradient }} />

        {/* Bouton fermer */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={onClose}
          style={{
            position: 'absolute', top: '0.85rem', right: '0.85rem',
            width: 34, height: 34, borderRadius: '50%',
            background: 'rgba(244,240,232,0.92)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(184,134,11,0.25)',
            color: '#7a6e62', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
          }}
        >
          <X size={15} />
        </motion.button>

        {/* Badge zone */}
        <div style={{
          position: 'absolute', top: '0.85rem', left: '0.85rem',
          background: 'rgba(244,240,232,0.9)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${reg.color}50`,
          borderRadius: 999, padding: '3px 12px',
        }}>
          <span style={{ color: reg.color, fontSize: '0.55rem', fontFamily: "'Cinzel', serif", letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700 }}>
            {reg.zone}
          </span>
        </div>
      </div>

      {/* ── PROFILE SECTION (sous cover) ── */}
      <div style={{ padding: '0 1.4rem', flexShrink: 0, marginTop: -20, position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          {/* Avatar région */}
          <div style={{
            width: 68, height: 68, borderRadius: 18,
            background: `linear-gradient(135deg, ${reg.color}ee, ${reg.color}88)`,
            border: '3px solid #f4f0e8',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 4px 20px ${reg.color}40`,
            flexShrink: 0,
          }}>
            <Globe size={28} color="rgba(255,255,255,0.9)" strokeWidth={1.4} />
          </div>

          {/* Boutons d'action style FB */}
          <div style={{ display: 'flex', gap: 7, alignItems: 'center', paddingBottom: 4 }}>
            {/* Bouton principal — IA */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenAI}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'linear-gradient(135deg,#9a7020,#d4af37)',
                border: 'none', borderRadius: 8,
                padding: '7px 14px',
                color: '#fff', fontSize: '0.7rem', fontWeight: 700,
                cursor: 'pointer', fontFamily: "'Cinzel', serif",
                letterSpacing: '0.06em',
                boxShadow: '0 3px 14px rgba(184,134,11,0.4)',
              }}
            >
              <Sparkles size={13} />
              Kôrô
            </motion.button>

            {/* Bouton secondaire — Contribuer */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenContrib}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'rgba(0,0,0,0.05)',
                border: '1.5px solid rgba(184,134,11,0.25)',
                borderRadius: 8, padding: '7px 14px',
                color: '#3d342a', fontSize: '0.7rem', fontWeight: 600,
                cursor: 'pointer', fontFamily: "'Cinzel', serif",
                letterSpacing: '0.06em',
              }}
            >
              <Users size={13} />
              Contribuer
            </motion.button>

            {/* More */}
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              style={{
                width: 34, height: 34, borderRadius: 8,
                background: 'rgba(0,0,0,0.05)',
                border: '1.5px solid rgba(184,134,11,0.22)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <MoreHorizontal size={16} color="#7a6e62" />
            </motion.button>
          </div>
        </div>

        {/* Nom + ethnies */}
        <h1 style={{ fontFamily: "'Cinzel', serif", color: '#1a1410', fontSize: '1.45rem', fontWeight: 800, letterSpacing: '0.04em', lineHeight: 1.1, margin: '0 0 0.35rem' }}>
          {regionName}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: '0.85rem' }}>
          {reg.ethnies.map(e => (
            <span key={e} style={{
              padding: '2px 10px',
              background: `${reg.color}14`,
              border: `1px solid ${reg.color}38`,
              borderRadius: 999, color: reg.color,
              fontSize: '0.6rem', fontFamily: "'Cinzel', serif",
              letterSpacing: '0.08em', fontWeight: 600,
            }}>
              {e}
            </span>
          ))}
          <span style={{ fontSize: '0.6rem', color: '#b0a898', display: 'flex', alignItems: 'center', gap: 3 }}>
            <MapPin size={10} /> {reg.capitale}
          </span>
        </div>

        {/* Stats rapides style FB */}
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '0.85rem' }}>
          {[
            { Icon: Users, value: reg.population, label: 'habitants' },
            { Icon: Globe, value: reg.ethnies.length, label: 'ethnies' },
            { Icon: TrendingUp, value: '10', label: 'piliers' },
          ].map(({ Icon, value, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Icon size={13} color="#b8860b" strokeWidth={1.8} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1a1410' }}>{value}</span>
              <span style={{ fontSize: '0.62rem', color: '#b0a898' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── TABS NAVIGATION (style FB) ── */}
      <div style={{
        borderTop: '1px solid rgba(184,134,11,0.12)',
        borderBottom: '1px solid rgba(184,134,11,0.12)',
        background: '#f9f6f0',
        flexShrink: 0, display: 'flex', gap: 0,
        overflowX: 'auto',
        paddingLeft: '0.5rem', paddingRight: '0.5rem',
      }}>
        {TABS.map(({ id, label, Icon: TabIcon }) => {
          const isActive = tab === id && !activePillar;
          return (
            <button
              key={id}
              onClick={() => handleTabChange(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '0.75rem 1rem',
                border: 'none', background: 'none',
                color: isActive ? reg.color : '#b0a898',
                fontSize: '0.7rem', fontWeight: isActive ? 700 : 500,
                fontFamily: "'Cinzel', serif", letterSpacing: '0.06em',
                cursor: 'pointer', whiteSpace: 'nowrap',
                position: 'relative', transition: 'color 0.2s',
                borderBottom: isActive ? `2.5px solid ${reg.color}` : '2.5px solid transparent',
              }}
            >
              <TabIcon size={14} strokeWidth={isActive ? 2.2 : 1.8} />
              {label}
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  style={{
                    position: 'absolute', bottom: -1, left: 0, right: 0,
                    height: 2.5, background: reg.color, borderRadius: '2px 2px 0 0',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ── CONTENT AREA ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.4rem' }}>
        <AnimatePresence mode="wait">

          {/* Vue détail pilier */}
          {activePillar ? (
            <PillarScreen
              key={view}
              regionName={regionName}
              pillar={activePillar}
              reg={reg}
              onBack={() => setView(null)}
            />
          ) : tab === 'overview' ? (
            <OverviewTab
              key="overview"
              reg={reg}
              regionName={regionName}
              onOpenAI={onOpenAI}
              onOpenContrib={onOpenContrib}
              setTab={handleTabChange}
              setView={setView}
            />
          ) : tab === 'pillars' ? (
            <PillarsTab
              key="pillars"
              reg={reg}
              regionName={regionName}
              setView={setView}
            />
          ) : tab === 'about' ? (
            <AboutTab key="about" reg={reg} regionName={regionName} />
          ) : null}

        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
