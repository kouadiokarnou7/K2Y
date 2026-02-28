import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ChevronLeft, ArrowRight, Users, MapPin, Sparkles,
  BookOpen, Music, Utensils, Home, Star, Layers,
  MessageSquare, Share2, Heart, Bookmark, MoreHorizontal,
  Globe, Crown, Leaf, Gem, Flame, Building2, ScrollText,
  ChevronDown, Play, Volume2, Info, Clock, TrendingUp,
  ArrowUpRight, Camera, RefreshCw, ChevronRight, Palette,
  RotateCw, Maximize2, Eye, Grid3x3, ExternalLink,
  VenetianMask, User, Sword
} from 'lucide-react';
import { REGIONS, CULTURAL_PILLARS } from './data.js';

// ── Icônes Lucide par pilier ─────────────────────────────────
const PILLAR_ICONS = {
  architecture: Building2,
  gastronomie:  Utensils,
  masques:      VenetianMask,
  textiles:     Gem,
  oral:         ScrollText,
  rites:        Flame,
  musique:      Music,
  social:       Crown,
  bijoux:       Star,
  pharmacopee:  Leaf,
};

// ── Galerie d'art virtuelle 3D (PLEIN ÉCRAN) ─────────────────
function ArtGallery({ regionName, reg, onClose }) {
  const [selectedArt, setSelectedArt] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  const artObjects = [
    {
      id: 'senufo-mask',
      title: 'Masque Casque Sénoufo',
      description: 'Masque cérémoniel Sénoufo de Côte d\'Ivoire - Utilisé lors des rites d\'initiation du Poro, ce masque incarne la sagesse ancestrale et la connexion avec les esprits de la forêt.',
      embedUrl: 'https://sketchfab.com/models/42323d07ea8143539372cff219aceaf6/embed',
      modelUrl: 'https://sketchfab.com/3d-models/senufo-helmet-mask-from-ivory-coast-42323d07ea8143539372cff219aceaf6',
      author: 'Marc Ghysels',
      culture: 'Sénoufo',
      type: 'masque',
      color: '#8B4513',
      region: 'Nord',
    },
    {
      id: 'african-mask',
      title: 'Masque Traditionnel',
      description: 'Masque africain aux lignes épurées - Représentation stylisée de l\'esprit ancestral, symbole de protection et de transmission du savoir.',
      embedUrl: 'https://sketchfab.com/models/1b7477c375c84be69aa6047fdba08411/embed',
      modelUrl: 'https://sketchfab.com/3d-models/african-mask-ivory-coast-1b7477c375c84be69aa6047fdba08411',
      author: 'jerome.poisson',
      culture: 'Traditionnel',
      type: 'masque',
      color: '#CD853F',
      region: 'Centre',
    },
    {
      id: 'attie-woman',
      title: 'Statue Féminine Attié',
      description: 'Représentation d\'une femme Attié - Sculpture élégante capturant la grâce et la dignité des femmes de ce peuple du sud-est de la Côte d\'Ivoire, reconnues pour leur artisanat et leur rôle social.',
      embedUrl: 'https://sketchfab.com/models/9336ffbd60974236a3bf5dcee6a16cdb/embed',
      modelUrl: 'https://sketchfab.com/3d-models/attie-woman-ivory-coast-9336ffbd60974236a3bf5dcee6a16cdb',
      author: 'Henrique.Luz',
      culture: 'Attié',
      type: 'statue',
      color: '#DAA520',
      region: 'Sud-Est',
    },
    {
      id: 'curved-sword',
      title: 'Sabre Courbe',
      description: 'Sabre cérémoniel à lame courbe - Arme d\'apparat utilisée lors des cérémonies et rituels, symbole de pouvoir et de prestige chez les peuples de la région.',
      embedUrl: 'https://sketchfab.com/models/9ae640d2063b44e4a7bc2f4616e0e47c/embed',
      modelUrl: 'https://sketchfab.com/3d-models/curved-sword-liberia-9ae640d2063b44e4a7bc2f4616e0e47c',
      author: 're1monsen',
      culture: 'Traditionnel',
      type: 'arme',
      color: '#B8860B',
      region: 'Ouest',
    },
    {
      id: 'african-pipe',
      title: 'Pipe Africaine',
      description: 'Pipe traditionnelle sculptée - Objet rituel et quotidien, souvent orné de motifs symboliques. Utilisée lors des cérémonies et des réunions importantes, elle représente le partage et la sagesse.',
      embedUrl: 'https://sketchfab.com/models/3a9a95549e8041fea11d9eff5a09c568/embed',
      modelUrl: 'https://sketchfab.com/3d-models/african-pipe-3a9a95549e8041fea11d9eff5a09c568',
      author: 'Nik',
      culture: 'Traditionnel',
      type: 'objet',
      color: '#A0522D',
      region: 'Divers',
    },
    {
      id: 'guro-mask',
      title: 'Masque Guro',
      description: 'Masque Guro de Côte d\'Ivoire - Représentation stylisée de la beauté féminine (masque "Gu" ou "Zamble"). Utilisé dans les danses cérémonielles, il incarne la grâce, la fertilité et la joie.',
      embedUrl: 'https://sketchfab.com/models/83bb4ee419fe43249f8f1d399476c9eb/embed',
      modelUrl: 'https://sketchfab.com/3d-models/guro-african-mask-83bb4ee419fe43249f8f1d399476c9eb',
      author: 'Grzegorz Dabrowski',
      culture: 'Guro',
      type: 'masque',
      color: '#C67141',
      region: 'Centre-Ouest',
    },
  ];

  const filteredArt = artObjects.filter(obj =>
    reg.ethnies.some(e => obj.culture.includes(e)) ||
    obj.culture === 'Traditionnel'
  );

  const getTypeIcon = (type) => {
    switch(type) {
      case 'masque': return <VenetianMask size={16} />;
      case 'statue': return <User size={16} />;
      case 'arme':   return <Sword size={16} />;
      case 'objet':  return <Palette size={16} />;
      default:       return <Palette size={16} />;
    }
  };

  const getTypeLabel = (type) => {
    switch(type) {
      case 'masque': return 'Masque';
      case 'statue': return 'Statue';
      case 'arme':   return 'Arme';
      case 'objet':  return 'Objet rituel';
      default:       return 'Objet d\'art';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: '#1a1410',
        zIndex: 1000,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        padding: '1rem 1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)',
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.25)',
              color: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={18} />
          </motion.button>
          <h1 style={{
            fontFamily: "'Cinzel', serif", color: '#fff',
            fontSize: '1.2rem', fontWeight: 700, letterSpacing: '0.04em',
          }}>
            Galerie d'art virtuelle · {regionName}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setViewMode('grid')}
            style={{
              width: 36, height: 36, borderRadius: 8,
              background: viewMode === 'grid' ? reg.color : 'rgba(255,255,255,0.15)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Grid3x3 size={16} color="#fff" />
          </button>
          <button
            onClick={() => setViewMode('single')}
            style={{
              width: 36, height: 36, borderRadius: 8,
              background: viewMode === 'single' ? reg.color : 'rgba(255,255,255,0.15)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Maximize2 size={16} color="#fff" />
          </button>
        </div>
      </div>

      {/* Compteur */}
      <div style={{
        position: 'absolute', top: '5rem', right: '1.5rem',
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(10px)',
        padding: '0.4rem 1rem',
        borderRadius: 999,
        border: `1px solid ${reg.color}60`,
        zIndex: 10,
        color: '#fff',
        fontSize: '0.7rem',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <Palette size={12} color={reg.color} />
        <span>{filteredArt.length} objets exposés</span>
      </div>

      {/* Contenu principal */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingTop: '80px' }}>
        {selectedArt ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: '#000' }}>
                <iframe
                  title={selectedArt.title}
                  frameBorder="0"
                  allowFullScreen
                  mozallowfullscreen="true"
                  webkitallowfullscreen="true"
                  allow="autoplay; fullscreen; xr-spatial-tracking"
                  xr-spatial-tracking
                  execution-while-out-of-viewport
                  execution-while-not-rendered
                  web-share
                  src={selectedArt.embedUrl}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                />
              </div>

              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.95), transparent)',
                padding: '2rem 2rem 1.5rem',
                color: '#fff',
              }}>
                <div style={{ maxWidth: 700 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{
                      background: selectedArt.color,
                      padding: '4px 12px', borderRadius: 20,
                      fontSize: '0.7rem', fontWeight: 600,
                      display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                      {getTypeIcon(selectedArt.type)}
                      {getTypeLabel(selectedArt.type)}
                    </span>
                    <span style={{ background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: 20, fontSize: '0.7rem' }}>
                      {selectedArt.culture}
                    </span>
                  </div>
                  <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                    {selectedArt.title}
                  </h2>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.25rem', opacity: 0.9, maxWidth: 600 }}>
                    {selectedArt.description}
                  </p>
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={14} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.6rem', opacity: 0.6 }}>Artiste</div>
                        <div style={{ fontSize: '0.8rem' }}>{selectedArt.author}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MapPin size={14} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.6rem', opacity: 0.6 }}>Région</div>
                        <div style={{ fontSize: '0.8rem' }}>{selectedArt.region}</div>
                      </div>
                    </div>
                    <a
                      href={selectedArt.modelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        marginLeft: 'auto',
                        display: 'flex', alignItems: 'center', gap: 8,
                        color: '#fff', textDecoration: 'none',
                        background: selectedArt.color,
                        padding: '10px 20px', borderRadius: 30,
                        fontSize: '0.8rem', fontWeight: 600,
                      }}
                    >
                      Voir sur Sketchfab <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedArt(null)}
                style={{
                  position: 'absolute', top: '1rem', left: '1rem',
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 20,
                }}
              >
                <ChevronLeft size={18} />
              </button>
            </div>
          </motion.div>
        ) : (
          <div style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: viewMode === 'grid' ? 'repeat(2, 1fr)' : '1fr',
            gap: '1rem',
            padding: '0 1.5rem 1.5rem',
            overflowY: 'auto',
          }}>
            {filteredArt.map((art, idx) => (
              <motion.div
                key={art.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedArt(art)}
                style={{
                  background: '#2a241e',
                  borderRadius: 20,
                  overflow: 'hidden',
                  border: `1px solid ${art.color}40`,
                  cursor: 'pointer',
                  height: viewMode === 'grid' ? 280 : 350,
                  position: 'relative',
                }}
              >
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                  <iframe
                    title={art.title}
                    frameBorder="0"
                    allowFullScreen
                    mozallowfullscreen="true"
                    webkitallowfullscreen="true"
                    allow="autoplay; fullscreen; xr-spatial-tracking"
                    xr-spatial-tracking
                    src={art.embedUrl}
                    style={{ width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }}
                  />
                </div>
                <div style={{
                  position: 'absolute', top: '0.5rem', right: '0.5rem',
                  background: art.color,
                  padding: '4px 10px', borderRadius: 20,
                  fontSize: '0.6rem', color: '#fff', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  <RotateCw size={10} /> 3D
                </div>
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
                  padding: '1.5rem 1rem 0.8rem',
                }}>
                  <span style={{
                    background: art.color,
                    padding: '2px 8px', borderRadius: 12,
                    fontSize: '0.5rem', color: '#fff',
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    marginBottom: 4,
                  }}>
                    {getTypeIcon(art.type)} {getTypeLabel(art.type)}
                  </span>
                  <h3 style={{ fontFamily: "'Cinzel', serif", color: '#fff', fontSize: '0.85rem', margin: '0 0 2px' }}>
                    {art.title}
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.6rem', margin: 0 }}>
                    {art.culture} · {art.author}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Appel IA contenu pilier ───────────────────────────────────
async function fetchPillarContent(regionName, pillar) {
  const reg = REGIONS[regionName];
  const resp = await fetch('/api/groq/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 900,
      messages: [
        {
          role: 'system',
          content: `Tu es un expert passionné de la culture ivoirienne. Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks, sans texte avant ou après le JSON. Format exact : {"description": "Une phrase courte et poétique (max 20 mots) qui résume ce pilier culturel pour ce peuple précis dans cette région", "content": "**[Titre accrocheur]**\\n\\n[Introduction 2-3 phrases]\\n\\n**Point 1 :** [Nom]\\n[2 phrases]\\n\\n**Point 2 :** [Nom]\\n[2 phrases]\\n\\n**Point 3 :** [Nom]\\n[2 phrases]\\n\\n> *[Anecdote fascinante, 2 phrases]*"}`,
        },
        {
          role: 'user',
          content: `Décris "${pillar.label}" pour les peuples ${reg.ethnies.join(', ')} de la région ${regionName} (${reg.zone} de la Côte d'Ivoire). Contexte : ${reg.desc}`,
        },
      ],
    }),
  });
  const json = await resp.json();
  const raw = json.choices?.[0]?.message?.content || '{}';
  try {
    const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return { description: '', content: raw };
  }
}

// ── Render markdown léger ─────────────────────────────────────
function RenderContent({ text, accentColor }) {
  if (!text) return null;
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
            <div key={i} style={{ marginBottom: '0.65rem', paddingLeft: '0.9rem', borderLeft: `2.5px solid ${accentColor}55` }}>
              <span style={{ color: accentColor, fontFamily: "'Cinzel', serif", fontSize: '0.7rem', letterSpacing: '0.08em', fontWeight: 700 }}>
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
              margin: '1.1rem 0 0.5rem', padding: '0.9rem 1.1rem',
              background: `${accentColor}0c`, borderLeft: `3px solid ${accentColor}`,
              borderRadius: '0 10px 10px 0', color: '#5a5048', fontStyle: 'italic',
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

const actionBtnStyle = {
  display: 'flex', alignItems: 'center', gap: 5,
  padding: '6px 14px', borderRadius: 20,
  background: 'rgba(0,0,0,0.03)',
  border: '1px solid rgba(184,134,11,0.18)',
  color: '#7a6e62', fontSize: '0.68rem', fontWeight: 500,
  cursor: 'pointer', transition: 'all 0.18s',
  fontFamily: "'DM Sans', sans-serif",
};

// ── Pillar Detail Screen ──────────────────────────────────────
function PillarScreen({ regionName, pillar, onBack }) {
  const [result, setResult] = useState({ description: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const loaded = useRef(false);
  const Icon = PILLAR_ICONS[pillar.id] || Star;

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    fetchPillarContent(regionName, pillar)
      .then(setResult)
      .catch(() => setResult({ description: '', content: '' }))
      .finally(() => setLoading(false));
  }, [regionName, pillar]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
    >
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

      <div style={{
        background: `linear-gradient(135deg, ${pillar.color}18, ${pillar.color}08)`,
        border: `1px solid ${pillar.color}30`,
        borderRadius: 16, padding: '1.1rem 1.2rem',
        marginBottom: '1.25rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
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
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
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

        {loading ? (
          <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: `1px solid ${pillar.color}20` }}>
            <div style={{ height: 10, background: `${pillar.color}15`, borderRadius: 6, width: '80%', animation: 'shimmer 1.6s ease infinite' }} />
          </div>
        ) : result.description ? (
          <div style={{
            marginTop: '0.85rem', paddingTop: '0.75rem',
            borderTop: `1px solid ${pillar.color}20`,
            color: '#5a4a3a', fontSize: '0.78rem', lineHeight: 1.6, fontStyle: 'italic',
          }}>
            {result.description}
          </div>
        ) : null}
      </div>

      <div style={{ borderTop: `1.5px solid ${pillar.color}18`, paddingTop: '1.1rem' }}>
        {loading
          ? <SkeletonLoader color={pillar.color} />
          : (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <RenderContent text={result.content} accentColor={pillar.color} />
            </motion.div>
          )
        }
      </div>

      {!loading && result.content && (
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
          <button style={actionBtnStyle}><MessageSquare size={14} /> Commenter</button>
          <button style={actionBtnStyle}><Share2 size={14} /> Partager</button>
          <button style={{ ...actionBtnStyle, marginLeft: 'auto', background: `${pillar.color}15`, borderColor: `${pillar.color}35`, color: pillar.color }}>
            <RefreshCw size={13} /> Régénérer
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

// ── TABS config ───────────────────────────────────────────────
const TABS = [
  { id: 'overview', label: 'Accueil',  Icon: Home },
  { id: 'pillars',  label: 'Culture',  Icon: Layers },
  { id: 'about',    label: 'À propos', Icon: Info },
];

// ── About Tab ─────────────────────────────────────────────────
function AboutTab({ reg, regionName }) {
  const items = [
    { Icon: MapPin,    label: 'Zone géographique', value: reg.zone },
    { Icon: Building2, label: 'Capitale',          value: reg.capitale },
    { Icon: Users,     label: 'Population',        value: reg.population },
    { Icon: Globe,     label: 'Ethnies',            value: reg.ethnies.join(', ') },
    { Icon: Clock,     label: 'Région',             value: regionName },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.28 }}>
      <h3 style={{ fontFamily: "'Cinzel', serif", color: '#1a1410', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '0.06em' }}>
        À propos de {regionName}
      </h3>
      <p style={{
        color: '#5a5048', lineHeight: 1.85, fontWeight: 300,
        fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.92rem',
        borderLeft: `2.5px solid ${reg.color}60`, paddingLeft: '1rem', marginBottom: '1.5rem',
      }}>
        {reg.desc}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {items.map(({ Icon, label, value }) => (
          <div key={label} style={{
            display: 'flex', alignItems: 'flex-start', gap: '0.85rem',
            padding: '0.65rem 0.9rem',
            background: 'rgba(184,134,11,0.03)', border: '1px solid rgba(184,134,11,0.1)', borderRadius: 10,
          }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: `${reg.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={15} color={reg.color} strokeWidth={1.8} />
            </div>
            <div>
              <div style={{ fontSize: '0.57rem', color: '#b0a898', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 2, fontFamily: "'Cinzel', serif" }}>{label}</div>
              <div style={{ fontSize: '0.82rem', color: '#1a1410', fontWeight: 500 }}>{value}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '1.25rem' }}>
        <div style={{ fontSize: '0.57rem', color: '#b0a898', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '0.65rem', fontFamily: "'Cinzel', serif" }}>
          Peuples & Ethnies
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
          {reg.ethnies.map((e, i) => (
            <motion.span key={e} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}
              style={{ padding: '5px 14px', background: `${reg.color}14`, border: `1px solid ${reg.color}40`, borderRadius: 999, color: reg.color, fontSize: '0.72rem', fontFamily: "'Cinzel', serif", letterSpacing: '0.08em', fontWeight: 600 }}>
              {e}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ── Overview Tab ──────────────────────────────────────────────
function OverviewTab({ reg, regionName, onOpenGallery, onOpenContrib, setTab, setView }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.28 }}>
      <p style={{
        color: '#5a5048', lineHeight: 1.85, fontWeight: 300,
        fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.92rem',
        borderLeft: `2.5px solid ${reg.color}60`, paddingLeft: '1rem', marginBottom: '1.5rem',
      }}>
        {reg.desc}
      </p>

      {/* Grid 2x2 — Galerie en grande bannière */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto', gap: '8px', marginBottom: '1.5rem' }}>

        {/* Grande bannière Galerie d'art — remplace IA Kôrô */}
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpenGallery}
          style={{
            gridColumn: '1 / -1',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'linear-gradient(135deg,#8B4513,#B8860B,#DAA520)',
            border: 'none', borderRadius: 14,
            padding: '1rem 1.25rem',
            cursor: 'pointer',
            boxShadow: '0 6px 24px rgba(139,69,19,0.4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Palette size={22} color="#fff" strokeWidth={1.5} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: "'Cinzel', serif", color: '#fff', fontSize: '0.88rem', fontWeight: 700, letterSpacing: '0.04em', marginBottom: 2 }}>
                Galerie d'art virtuelle
              </div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.62rem', letterSpacing: '0.06em' }}>
                6 objets 3D · Masques · Statues · Armes · {regionName}
              </div>
            </div>
          </div>
          <ArrowUpRight size={18} color="rgba(255,255,255,0.85)" />
        </motion.button>

        {/* Bouton Culture */}
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.96 }}
          onClick={() => setTab('pillars')}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
            background: `${reg.color}12`, border: `1.5px solid ${reg.color}38`,
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
          whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.96 }}
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

      {/* Piliers rapides */}
      <div style={{ marginBottom: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#3d342a', letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: "'Cinzel', serif" }}>
          Piliers culturels
        </div>
        <button onClick={() => setTab('pillars')} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: '#b8860b', fontSize: '0.62rem', cursor: 'pointer', fontWeight: 600 }}>
          Voir tout <ChevronRight size={12} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '7px' }}>
        {CULTURAL_PILLARS.slice(0, 8).map((pillar, i) => {
          const PIcon = PILLAR_ICONS[pillar.id] || Star;
          return (
            <motion.button
              key={pillar.id}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.94 }}
              onClick={() => { setTab('pillars'); setView(pillar.id); }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: '5px', padding: '0.65rem 0.4rem',
                background: '#fff', border: '1px solid rgba(184,134,11,0.14)',
                borderRadius: 12, cursor: 'pointer',
                boxShadow: '0 1px 6px rgba(0,0,0,0.04)', transition: 'all 0.18s',
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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.28 }}>
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
              initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.04 }}
              whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
              onClick={() => setView(pillar.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.85rem',
                background: '#fff', border: '1px solid rgba(184,134,11,0.12)',
                borderRadius: 12, padding: '0.75rem 0.9rem',
                cursor: 'pointer', textAlign: 'left',
                boxShadow: '0 1px 4px rgba(0,0,0,0.03)', transition: 'all 0.18s',
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
export default function RegionPanel({ regionName, onClose, onOpenContrib }) {
  const [tab, setTab] = useState('overview');
  const [view, setView] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const reg = REGIONS[regionName];
  const activePillar = view ? CULTURAL_PILLARS.find(p => p.id === view) : null;

  const handleTabChange = (newTab) => {
    setView(null);
    setTab(newTab);
  };

  if (!reg) return null;

  return (
    <>
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
        {/* Bouton fermer */}
        <motion.button
          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
          onClick={onClose}
          style={{
            position: 'absolute', top: '0.85rem', right: '0.85rem', zIndex: 50,
            width: 34, height: 34, borderRadius: '50%',
            background: 'rgba(244,240,232,0.92)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(184,134,11,0.25)',
            color: '#7a6e62', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
          }}
        >
          <X size={15} />
        </motion.button>

        <div style={{ flex: 1, overflowY: 'auto' }}>

          {/* COVER PHOTO */}
          <div style={{ position: 'relative', height: 185, flexShrink: 0 }}>
            <img src={reg.img} alt={regionName} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(244,240,232,0) 45%, rgba(244,240,232,1) 100%)' }} />
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(120deg, ${reg.color}18 0%, transparent 60%)` }} />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: reg.gradient }} />
            <div style={{
              position: 'absolute', top: '0.85rem', left: '0.85rem',
              background: 'rgba(244,240,232,0.9)', backdropFilter: 'blur(10px)',
              border: `1px solid ${reg.color}50`, borderRadius: 999, padding: '3px 12px',
            }}>
              <span style={{ color: reg.color, fontSize: '0.55rem', fontFamily: "'Cinzel', serif", letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700 }}>
                {reg.zone}
              </span>
            </div>
          </div>

          {/* PROFILE SECTION */}
          <div style={{ padding: '0 1.4rem', marginTop: -20, position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{
                width: 68, height: 68, borderRadius: 18,
                background: `linear-gradient(135deg, ${reg.color}ee, ${reg.color}88)`,
                border: '3px solid #f4f0e8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 4px 20px ${reg.color}40`, flexShrink: 0,
              }}>
                <Globe size={28} color="rgba(255,255,255,0.9)" strokeWidth={1.4} />
              </div>

              <div style={{ display: 'flex', gap: 7, alignItems: 'center', paddingBottom: 4 }}>
                {/* Bouton principal — Galerie d'art (remplace Kôrô) */}
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setShowGallery(true)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: 'linear-gradient(135deg,#8B4513,#DAA520)',
                    border: 'none', borderRadius: 8,
                    padding: '7px 14px',
                    color: '#fff', fontSize: '0.7rem', fontWeight: 700,
                    cursor: 'pointer', fontFamily: "'Cinzel', serif",
                    letterSpacing: '0.06em',
                    boxShadow: '0 3px 14px rgba(139,69,19,0.4)',
                  }}
                >
                  <Palette size={13} /> Galerie
                </motion.button>

                {/* Bouton secondaire — Contribuer */}
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
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
                  <Users size={13} /> Contribuer
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.92 }}
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

            <h1 style={{ fontFamily: "'Cinzel', serif", color: '#1a1410', fontSize: '1.45rem', fontWeight: 800, letterSpacing: '0.04em', lineHeight: 1.1, margin: '0 0 0.35rem' }}>
              {regionName}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: '0.85rem' }}>
              {reg.ethnies.map(e => (
                <span key={e} style={{ padding: '2px 10px', background: `${reg.color}14`, border: `1px solid ${reg.color}38`, borderRadius: 999, color: reg.color, fontSize: '0.6rem', fontFamily: "'Cinzel', serif", letterSpacing: '0.08em', fontWeight: 600 }}>
                  {e}
                </span>
              ))}
              <span style={{ fontSize: '0.6rem', color: '#b0a898', display: 'flex', alignItems: 'center', gap: 3 }}>
                <MapPin size={10} /> {reg.capitale}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '0.85rem' }}>
              {[
                { Icon: Users,      value: reg.population,    label: 'habitants' },
                { Icon: Globe,      value: reg.ethnies.length, label: 'ethnies' },
                { Icon: TrendingUp, value: '10',              label: 'piliers' },
              ].map(({ Icon, value, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Icon size={13} color="#b8860b" strokeWidth={1.8} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1a1410' }}>{value}</span>
                  <span style={{ fontSize: '0.62rem', color: '#b0a898' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TABS NAVIGATION */}
          <div style={{
            position: 'sticky', top: 0, zIndex: 20,
            borderTop: '1px solid rgba(184,134,11,0.12)',
            borderBottom: '1px solid rgba(184,134,11,0.12)',
            background: '#f9f6f0',
            display: 'flex', gap: 0,
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
                      style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2.5, background: reg.color, borderRadius: '2px 2px 0 0' }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* CONTENT AREA */}
          <div style={{ padding: '1.25rem 1.4rem' }}>
            <AnimatePresence mode="wait">
              {activePillar ? (
                <PillarScreen
                  key={view}
                  regionName={regionName}
                  pillar={activePillar}
                  onBack={() => setView(null)}
                />
              ) : tab === 'overview' ? (
                <OverviewTab
                  key="overview"
                  reg={reg}
                  regionName={regionName}
                  onOpenGallery={() => setShowGallery(true)}
                  onOpenContrib={onOpenContrib}
                  setTab={handleTabChange}
                  setView={setView}
                />
              ) : tab === 'pillars' ? (
                <PillarsTab key="pillars" reg={reg} regionName={regionName} setView={setView} />
              ) : tab === 'about' ? (
                <AboutTab key="about" reg={reg} regionName={regionName} />
              ) : null}
            </AnimatePresence>
          </div>

        </div>
      </motion.aside>

      {/* Galerie plein écran */}
      <AnimatePresence>
        {showGallery && (
          <ArtGallery
            regionName={regionName}
            reg={reg}
            onClose={() => setShowGallery(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}