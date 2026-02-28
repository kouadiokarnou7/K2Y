import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Send, Heart, MessageCircle, Share2, Plus, ChevronDown,
  Bookmark, MapPin, CheckCircle2, Users, Search, Bell,
  Image, Smile, Video, MoreHorizontal, TrendingUp, Flame,
  Globe, Star, Layers, Music, Utensils, Building2, ScrollText,
  Crown, Leaf, Gem, Home, Compass, BookOpen,
  Repeat2, Eye
} from 'lucide-react';
import { REGIONS, CULTURAL_PILLARS } from './data.js';

const G = {
  bg: '#f0ebe0',
  surface: '#ffffff',
  surfaceAlt: '#faf7f2',
  gold: '#b8860b',
  goldLight: '#d4af37',
  goldPale: '#fdf3d0',
  ink: '#1a1410',
  inkMid: '#3d342a',
  inkSoft: '#7a6e62',
  inkMuted: '#b0a898',
  border: 'rgba(184,134,11,0.15)',
  borderSoft: 'rgba(184,134,11,0.08)',
};

const STORIES = [
  { id: 1, author: 'Korhogo', sub: 'Sénoufo', color: '#8E44AD', Icon: Layers },
  { id: 2, author: 'Man', sub: 'Dan · Yacouba', color: '#27AE60', Icon: Flame },
  { id: 3, author: 'Bondoukou', sub: 'Abron', color: '#E67E22', Icon: Crown },
  { id: 4, author: 'Grand-Lahou', sub: 'Adjoukrou', color: '#2980B9', Icon: Globe },
  { id: 5, author: 'Daloa', sub: 'Bété', color: '#C0392B', Icon: Music },
];

const TRENDING = [
  { tag: '#MasquesGoli', count: '2.4k', color: '#8E44AD' },
  { tag: '#TissuKorhogo', count: '1.8k', color: '#E67E22' },
  { tag: '#FêteDipri', count: '1.2k', color: '#2980B9' },
  { tag: '#BalafonsNord', count: '980', color: '#27AE60' },
  { tag: '#OrAgni', count: '756', color: '#F39C12' },
];

const SUGGESTIONS = [
  { name: 'Aya Koné', role: 'Tisserande · Korhogo', color: '#8E44AD', initials: 'AK', followers: '1.2k' },
  { name: 'Koffi Brou', role: 'Griot · Bouaké', color: '#C0392B', initials: 'KB', followers: '890' },
  { name: 'Mariam Traoré', role: 'Danseuse Sénoufo', color: '#16A085', initials: 'MT', followers: '2.1k' },
];

const DEMO_POSTS = [
  {
    id: 1, author: 'Kouamé Assi', location: 'Bouaké · Baoulé', avatar: 'KA', avatarColor: '#C0392B',
    pillar: 'masques', region: 'Vallée du Bandama',
    title: 'Le masque Goli et ses significations cachées',
    content: "Le Goli n'est pas qu'un simple masque festif. Chez les Baoulé, il représente la rencontre entre le monde visible et invisible. Lors des funérailles d'un notable, le porteur du Goli doit être en état de pureté rituelle pendant 7 jours avant la cérémonie. Ma grand-mère me disait que le masque «mange» les malheurs du défunt pour lui ouvrir le chemin de l'au-delà.",
    likes: 47, comments: 12, shares: 8, views: 234, time: 'Il y a 2h', liked: false, saved: false,
  },
  {
    id: 2, author: 'Fatou Coulibaly', location: 'Korhogo · Sénoufo', avatar: 'FC', avatarColor: '#8E44AD',
    pillar: 'textiles', region: 'Savanes',
    title: 'Les secrets du tissu Korhogo',
    content: "Peu de gens savent que chaque symbole sur le tissu Korhogo a une signification précise. Le crocodile symbolise le pouvoir de la chefferie. La tortue, la longévité et la sagesse. Les forgerons qui créent ces tissus appartiennent tous à la société Poro — ils ne peuvent révéler les codes qu'aux initiés.",
    likes: 83, comments: 24, shares: 19, views: 512, time: 'Il y a 5h', liked: true, saved: true,
  },
  {
    id: 3, author: 'Jean-Baptiste Zahi', location: 'Man · Dan', avatar: 'JZ', avatarColor: '#27AE60',
    pillar: 'oral', region: 'Montagnes',
    title: 'Proverbe Dan sur le courage',
    content: "«Gba ke ni to» — Ce que tu portes en toi, personne ne peut te l'arracher.\n\nCe proverbe Dan se dit aux jeunes hommes avant l'initiation forestière. Il signifie que le courage véritable n'est pas dans la force physique, mais dans ce qu'on a construit intérieurement.",
    likes: 156, comments: 31, shares: 44, views: 1240, time: 'Il y a 1 jour', liked: false, saved: false,
  },
  {
    id: 4, author: 'Akissi Brou', location: 'Dabou · Adjoukrou', avatar: 'AB', avatarColor: '#2980B9',
    pillar: 'rites', region: 'Lagunes',
    title: 'Le Dipri de Gomon — une nuit hors du temps',
    content: "Chaque année, dans notre village, il y a une nuit où les règles du monde s'inversent. Le Dipri. Les femmes prennent les rues, les gens marchent sur des braises sans se brûler, certains tombent en transe et révèlent des vérités cachées. Je l'ai vécu une fois. Impossible à décrire avec des mots.",
    likes: 212, comments: 58, shares: 73, views: 3400, time: 'Il y a 3 jours', liked: false, saved: false,
  },
];

const PILLAR_ICONS = {
  architecture: Building2, gastronomie: Utensils, masques: Layers,
  textiles: Gem, oral: ScrollText, rites: Flame,
  musique: Music, social: Crown, bijoux: Star, pharmacopee: Leaf,
};

// ── Avatar ────────────────────────────────────────────────────
function Avatar({ initials, color, size = 40, ring = false }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(135deg, ${color}dd, ${color})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontSize: size * 0.3, fontWeight: 700,
      letterSpacing: '0.04em', flexShrink: 0,
      boxShadow: ring
        ? `0 0 0 2.5px ${G.bg}, 0 0 0 4.5px ${color}`
        : `0 2px 8px ${color}35`,
    }}>
      {initials}
    </div>
  );
}

function PillarBadge({ pillarId }) {
  const p = CULTURAL_PILLARS.find(x => x.id === pillarId);
  if (!p) return null;
  const Icon = PILLAR_ICONS[p.id] || Star;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 9px', borderRadius: 999,
      background: `${p.color}12`, border: `1px solid ${p.color}30`,
      color: p.color, fontSize: '0.58rem', fontWeight: 600,
      fontFamily: "'Cinzel', serif", letterSpacing: '0.05em',
    }}>
      <Icon size={10} strokeWidth={2} />
      {p.label.split(' ')[0]}
    </span>
  );
}

// ── Story ─────────────────────────────────────────────────────
function StoryBubble({ story, isAdd }) {
  const [hov, setHov] = useState(false);
  if (isAdd) return (
    <motion.div whileHover={{ scale: 1.05 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', flexShrink: 0 }}>
      <div style={{ width: 58, height: 58, borderRadius: '50%', background: G.goldPale, border: `2px dashed ${G.gold}50`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Plus size={22} color={G.gold} strokeWidth={1.8} />
      </div>
      <span style={{ fontSize: '0.58rem', color: G.inkSoft, whiteSpace: 'nowrap', maxWidth: 62, textAlign: 'center', lineHeight: 1.3 }}>Votre story</span>
    </motion.div>
  );
  const { Icon } = story;
  return (
    <motion.div whileHover={{ scale: 1.05 }}
      onHoverStart={() => setHov(true)} onHoverEnd={() => setHov(false)}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', flexShrink: 0 }}>
      <div style={{
        width: 58, height: 58, borderRadius: '50%',
        background: `linear-gradient(135deg, ${story.color}ee, ${story.color}88)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: hov
          ? `0 0 0 3px ${G.bg}, 0 0 0 5px ${story.color}`
          : `0 0 0 2.5px ${G.bg}, 0 0 0 4px ${story.color}70`,
        transition: 'box-shadow 0.2s',
      }}>
        <Icon size={24} color="rgba(255,255,255,0.95)" strokeWidth={1.4} />
      </div>
      <span style={{ fontSize: '0.58rem', color: G.inkSoft, whiteSpace: 'nowrap', maxWidth: 64, textAlign: 'center', lineHeight: 1.3 }}>
        {story.author}
      </span>
    </motion.div>
  );
}

// ── Create Post ───────────────────────────────────────────────
function CreatePostBox({ onPost }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', pillar: '', region: '' });
  const [posted, setPosted] = useState(false);
  const valid = form.title.length > 2 && form.content.length > 15;

  const handlePost = () => {
    if (!valid) return;
    onPost({ ...form, id: Date.now(), time: "À l'instant", likes: 0, comments: 0, shares: 0, views: 1, liked: false, saved: false });
    setForm({ title: '', content: '', pillar: '', region: '' });
    setOpen(false);
    setPosted(true);
    setTimeout(() => setPosted(false), 3500);
  };

  const inputBase = { padding: '0.58rem 0.85rem', borderRadius: 10, border: `1px solid ${G.border}`, background: G.bg, color: G.ink, fontSize: '0.8rem', fontFamily: "'DM Sans', sans-serif", outline: 'none', width: '100%', boxSizing: 'border-box' };

  return (
    <div style={{ background: G.surface, borderRadius: 16, overflow: 'hidden', border: `1px solid ${G.border}`, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', marginBottom: '0.85rem' }}>
      <div style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Avatar initials="Moi" color={G.gold} size={38} />
        <button
          onClick={() => setOpen(true)}
          style={{ flex: 1, padding: '0.6rem 1rem', borderRadius: 999, background: G.bg, border: `1px solid ${G.border}`, textAlign: 'left', color: G.inkMuted, fontSize: '0.78rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
        >
          Partagez une tradition, un proverbe, un souvenir…
        </button>
      </div>

      <div style={{ borderTop: `1px solid ${G.borderSoft}`, display: 'flex' }}>
        {[
          { Icon: Image, label: 'Photo', color: '#27AE60' },
          { Icon: Video, label: 'Vidéo', color: '#E74C3C' },
          { Icon: BookOpen, label: 'Récit', color: G.gold },
        ].map(({ Icon, label, color }) => (
          <button key={label} onClick={() => setOpen(true)}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '0.6rem', background: 'none', border: 'none', cursor: 'pointer', color: G.inkSoft, fontSize: '0.7rem', fontWeight: 500, transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = `${color}0a`; e.currentTarget.style.color = color; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = G.inkSoft; }}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} style={{ overflow: 'hidden', borderTop: `1px solid ${G.borderSoft}` }}>
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Titre de votre partage…"
                style={{ ...inputBase, fontFamily: "'Cinzel', serif" }}
                onFocus={e => e.target.style.borderColor = G.gold} onBlur={e => e.target.style.borderColor = G.border} />
              <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={3}
                placeholder="Partagez une tradition, une recette, un rite, une histoire…"
                style={{ ...inputBase, resize: 'none' }}
                onFocus={e => e.target.style.borderColor = G.gold} onBlur={e => e.target.style.borderColor = G.border} />
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <select value={form.pillar} onChange={e => setForm({ ...form, pillar: e.target.value })} style={{ ...inputBase, flex: 1 }}>
                  <option value="">Pilier culturel…</option>
                  {CULTURAL_PILLARS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
                <select value={form.region} onChange={e => setForm({ ...form, region: e.target.value })} style={{ ...inputBase, flex: 1 }}>
                  <option value="">Région…</option>
                  {Object.keys(REGIONS).map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end' }}>
                <button onClick={() => setOpen(false)} style={{ padding: '0.5rem 1rem', borderRadius: 8, border: `1px solid ${G.border}`, background: 'none', color: G.inkSoft, fontSize: '0.72rem', cursor: 'pointer' }}>
                  Annuler
                </button>
                <motion.button whileHover={valid ? { scale: 1.02 } : {}} whileTap={valid ? { scale: 0.97 } : {}} onClick={handlePost} disabled={!valid}
                  style={{ padding: '0.5rem 1.3rem', borderRadius: 8, border: 'none', background: valid ? `linear-gradient(135deg,#9a7020,${G.goldLight})` : 'rgba(0,0,0,0.07)', color: valid ? '#fff' : G.inkMuted, fontSize: '0.72rem', fontWeight: 700, fontFamily: "'Cinzel', serif", letterSpacing: '0.06em', cursor: valid ? 'pointer' : 'not-allowed', boxShadow: valid ? '0 3px 12px rgba(184,134,11,0.35)' : 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Send size={12} /> Publier
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {posted && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ padding: '0.6rem 1rem', background: `${G.gold}12`, borderTop: `1px solid ${G.gold}25`, display: 'flex', alignItems: 'center', gap: 8, color: G.gold, fontSize: '0.7rem', fontFamily: "'Cinzel', serif" }}>
            <CheckCircle2 size={14} /> Publication partagée avec la communauté
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Post Card ─────────────────────────────────────────────────
function PostCard({ post, onLike, onSave }) {
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const pillar = CULTURAL_PILLARS.find(p => p.id === post.pillar);
  const isLong = post.content.length > 220;
  const displayContent = !expanded && isLong ? post.content.slice(0, 220) + '…' : post.content;

  const renderContent = (text) => text.split('\n').map((line, i) => {
    if (!line.trim()) return <div key={i} style={{ height: '0.4rem' }} />;
    if (line.startsWith('«')) return (
      <div key={i} style={{
        borderLeft: `3px solid ${pillar?.color || G.gold}`, padding: '0.6rem 0.9rem', margin: '0.5rem 0',
        fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.92rem',
        color: pillar?.color || G.gold, background: `${pillar?.color || G.gold}08`, borderRadius: '0 8px 8px 0',
      }}>{line}</div>
    );
    return <p key={i} style={{ color: G.inkMid, fontSize: '0.84rem', lineHeight: 1.8, fontWeight: 300, margin: 0 }}>{line}</p>;
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: G.surface, borderRadius: 16, overflow: 'hidden', marginBottom: '0.85rem', border: `1px solid ${G.border}`, boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}
      whileHover={{ boxShadow: `0 6px 24px rgba(184,134,11,0.1)` }}
    >
      {pillar && <div style={{ height: 3, background: `linear-gradient(90deg, ${pillar.color}, ${pillar.color}20)` }} />}

      {/* Header */}
      <div style={{ padding: '0.9rem 1rem 0.6rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        <Avatar initials={post.avatar} color={post.avatarColor} size={42} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, fontSize: '0.84rem', color: G.ink, fontFamily: "'Cinzel', serif" }}>{post.author}</span>
            {pillar && <PillarBadge pillarId={post.pillar} />}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
            <MapPin size={10} color={G.gold} />
            <span style={{ color: G.inkMuted, fontSize: '0.6rem' }}>{post.location}</span>
            <span style={{ color: G.borderSoft }}>·</span>
            <span style={{ color: G.inkMuted, fontSize: '0.6rem' }}>{post.time}</span>
            {post.views && <>
              <span style={{ color: G.borderSoft }}>·</span>
              <Eye size={9} color={G.inkMuted} />
              <span style={{ color: G.inkMuted, fontSize: '0.58rem' }}>{post.views}</span>
            </>}
          </div>
        </div>
        <button style={{ width: 30, height: 30, borderRadius: '50%', background: 'none', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: G.inkMuted, transition: 'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = G.bg}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}>
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '0 1rem 0.75rem' }}>
        <div style={{ fontFamily: "'Cinzel', serif", color: G.ink, fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3, letterSpacing: '0.02em' }}>
          {post.title}
        </div>
        {renderContent(displayContent)}
        {isLong && (
          <button onClick={() => setExpanded(!expanded)}
            style={{ background: 'none', border: 'none', color: G.gold, fontSize: '0.7rem', cursor: 'pointer', padding: '4px 0', display: 'flex', alignItems: 'center', gap: 3, fontWeight: 600, marginTop: 4 }}>
            {expanded ? 'Voir moins' : 'Lire la suite'}
            <ChevronDown size={11} style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
          </button>
        )}
      </div>

      {/* Stats */}
      <div style={{ padding: '0 1rem 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#E74C3C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Heart size={9} color="#fff" fill="#fff" />
          </div>
          <span style={{ color: G.inkMuted, fontSize: '0.65rem' }}>{post.likes}</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <span style={{ color: G.inkMuted, fontSize: '0.65rem', cursor: 'pointer' }} onClick={() => setShowComments(!showComments)}>
            {post.comments} commentaires
          </span>
          {post.shares > 0 && <span style={{ color: G.inkMuted, fontSize: '0.65rem' }}>{post.shares} partages</span>}
        </div>
      </div>

      {/* Actions */}
      <div style={{ borderTop: `1px solid ${G.borderSoft}`, display: 'flex' }}>
        {[
          { Icon: Heart, label: "J'aime", active: post.liked, activeColor: '#E74C3C', onClick: () => onLike(post.id), fill: post.liked },
          { Icon: MessageCircle, label: 'Commenter', active: showComments, activeColor: G.gold, onClick: () => setShowComments(!showComments), fill: false },
          { Icon: Repeat2, label: 'Partager', active: false, activeColor: '#27AE60', onClick: () => {}, fill: false },
          { Icon: Bookmark, label: 'Enregistrer', active: post.saved, activeColor: G.gold, onClick: () => onSave(post.id), fill: post.saved },
        ].map(({ Icon, label, active, activeColor, onClick, fill }) => (
          <motion.button key={label} whileTap={{ scale: 0.93 }} onClick={onClick}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '0.65rem 0', background: 'none', border: 'none', cursor: 'pointer', color: active ? activeColor : G.inkMuted, fontSize: '0.68rem', fontWeight: active ? 700 : 400, transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = `${activeColor}08`; e.currentTarget.style.color = activeColor; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = active ? activeColor : G.inkMuted; }}>
            <Icon size={14} fill={fill ? activeColor : 'none'} strokeWidth={active ? 2.2 : 1.8} />
            {label}
          </motion.button>
        ))}
      </div>

      {/* Comment box */}
      <AnimatePresence>
        {showComments && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: 'hidden', borderTop: `1px solid ${G.borderSoft}` }}>
            <div style={{ padding: '0.75rem 1rem', display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              <Avatar initials="Moi" color={G.gold} size={30} />
              <div style={{ flex: 1, display: 'flex', gap: 6, alignItems: 'center', background: G.bg, borderRadius: 999, padding: '0.45rem 0.9rem', border: `1px solid ${G.border}` }}>
                <input value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Votre commentaire…"
                  style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: G.ink, fontSize: '0.78rem', fontFamily: "'DM Sans', sans-serif" }} />
                <AnimatePresence>
                  {commentText && (
                    <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} onClick={() => setCommentText('')}
                      style={{ background: `linear-gradient(135deg,#9a7020,${G.goldLight})`, border: 'none', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                      <Send size={11} color="#fff" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

// ── Left Sidebar ──────────────────────────────────────────────
function LeftSidebar({ activeFilter, setFilter }) {
  const nav = [
    { Icon: Home, label: "Fil d'actualité", id: 'all' },
    { Icon: Compass, label: 'Explorer', id: 'explore' },
    { Icon: Bookmark, label: 'Enregistrés', id: 'saved' },
    { Icon: Users, label: 'Contributeurs', id: 'people' },
  ];
  return (
    <div style={{ width: 234, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      {/* Profile mini */}
      <div style={{ background: G.surface, borderRadius: 14, padding: '1rem', border: `1px solid ${G.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <Avatar initials="K2Y" color={G.gold} size={42} ring />
          <div>
            <div style={{ fontFamily: "'Cinzel', serif", color: G.ink, fontSize: '0.78rem', fontWeight: 700 }}>Ma Communauté</div>
            <div style={{ color: G.inkMuted, fontSize: '0.58rem', letterSpacing: '0.08em' }}>4 piliers suivis</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
          {[['Posts', '12'], ['Abonnés', '48'], ['Suivis', '23']].map(([l, v]) => (
            <div key={l} style={{ textAlign: 'center', padding: '0.4rem 0', background: G.bg, borderRadius: 8 }}>
              <div style={{ fontFamily: "'Cinzel', serif", color: G.gold, fontSize: '0.82rem', fontWeight: 700 }}>{v}</div>
              <div style={{ color: G.inkMuted, fontSize: '0.5rem', marginTop: 1 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Nav */}
      <div style={{ background: G.surface, borderRadius: 14, padding: '0.7rem 0.55rem', border: `1px solid ${G.border}` }}>
        {nav.map(({ Icon, label, id }) => (
          <button key={id} onClick={() => setFilter(id)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.6rem 0.8rem', borderRadius: 9, border: 'none', background: activeFilter === id ? `${G.gold}12` : 'none', color: activeFilter === id ? G.gold : G.inkSoft, fontSize: '0.73rem', fontWeight: activeFilter === id ? 700 : 400, cursor: 'pointer', textAlign: 'left', borderLeft: activeFilter === id ? `3px solid ${G.gold}` : '3px solid transparent', transition: 'all 0.15s' }}
            onMouseEnter={e => { if (activeFilter !== id) { e.currentTarget.style.background = `${G.gold}06`; e.currentTarget.style.color = G.inkMid; } }}
            onMouseLeave={e => { if (activeFilter !== id) { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = G.inkSoft; } }}>
            <Icon size={16} strokeWidth={activeFilter === id ? 2.2 : 1.8} /> {label}
          </button>
        ))}
      </div>

      {/* Piliers */}
      <div style={{ background: G.surface, borderRadius: 14, padding: '0.85rem 0.7rem', border: `1px solid ${G.border}` }}>
        <div style={{ fontSize: '0.56rem', color: G.inkMuted, letterSpacing: '0.22em', textTransform: 'uppercase', fontFamily: "'Cinzel', serif", fontWeight: 600, marginBottom: '0.6rem', paddingLeft: '0.35rem' }}>
          Piliers culturels
        </div>
        {CULTURAL_PILLARS.slice(0, 6).map(p => {
          const Icon = PILLAR_ICONS[p.id] || Star;
          return (
            <button key={p.id} onClick={() => setFilter(p.id)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.5rem 0.8rem', borderRadius: 8, border: 'none', background: activeFilter === p.id ? `${p.color}12` : 'none', cursor: 'pointer', transition: 'all 0.15s', borderLeft: activeFilter === p.id ? `3px solid ${p.color}` : '3px solid transparent' }}
              onMouseEnter={e => { if (activeFilter !== p.id) e.currentTarget.style.background = `${p.color}06`; }}
              onMouseLeave={e => { if (activeFilter !== p.id) e.currentTarget.style.background = 'none'; }}>
              <div style={{ width: 27, height: 27, borderRadius: 7, background: `${p.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={13} color={p.color} strokeWidth={1.7} />
              </div>
              <span style={{ fontSize: '0.7rem', color: activeFilter === p.id ? p.color : G.inkSoft, fontWeight: activeFilter === p.id ? 700 : 400 }}>
                {p.label.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Right Sidebar ─────────────────────────────────────────────
function RightSidebar() {
  const [followed, setFollowed] = useState({});
  return (
    <div style={{ width: 272, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {/* Tendances */}
      <div style={{ background: G.surface, borderRadius: 14, padding: '1rem', border: `1px solid ${G.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '0.85rem' }}>
          <TrendingUp size={15} color={G.gold} />
          <span style={{ fontFamily: "'Cinzel', serif", color: G.ink, fontSize: '0.76rem', fontWeight: 700, letterSpacing: '0.05em' }}>Tendances</span>
        </div>
        {TRENDING.map((t, i) => (
          <motion.button key={t.tag} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.65rem', borderRadius: 8, border: 'none', background: 'none', cursor: 'pointer', transition: 'background 0.15s' }}
            whileHover={{ background: `${t.color}08` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.color }} />
              <span style={{ fontSize: '0.73rem', color: G.inkMid, fontWeight: 600 }}>{t.tag}</span>
            </div>
            <span style={{ fontSize: '0.6rem', color: G.inkMuted }}>{t.count}</span>
          </motion.button>
        ))}
      </div>

      {/* Suggestions */}
      <div style={{ background: G.surface, borderRadius: 14, padding: '1rem', border: `1px solid ${G.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Users size={15} color={G.gold} />
            <span style={{ fontFamily: "'Cinzel', serif", color: G.ink, fontSize: '0.76rem', fontWeight: 700, letterSpacing: '0.05em' }}>Contributeurs</span>
          </div>
          <button style={{ background: 'none', border: 'none', color: G.gold, fontSize: '0.6rem', cursor: 'pointer', fontWeight: 600 }}>Voir tout</button>
        </div>
        {SUGGESTIONS.map(s => (
          <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.75rem' }}>
            <Avatar initials={s.initials} color={s.color} size={36} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.73rem', color: G.ink, fontWeight: 600, fontFamily: "'Cinzel', serif" }}>{s.name}</div>
              <div style={{ fontSize: '0.58rem', color: G.inkMuted }}>{s.role}</div>
            </div>
            <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.93 }}
              onClick={() => setFollowed(f => ({ ...f, [s.name]: !f[s.name] }))}
              style={{ padding: '4px 10px', borderRadius: 999, background: followed[s.name] ? `${s.color}15` : `linear-gradient(135deg,#9a7020,${G.goldLight})`, border: followed[s.name] ? `1px solid ${s.color}40` : 'none', color: followed[s.name] ? s.color : '#fff', fontSize: '0.6rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'Cinzel', serif", boxShadow: followed[s.name] ? 'none' : '0 2px 8px rgba(184,134,11,0.3)' }}>
              {followed[s.name] ? 'Suivi ✓' : 'Suivre'}
            </motion.button>
          </div>
        ))}
      </div>

      {/* Régions */}
      <div style={{ background: G.surface, borderRadius: 14, padding: '1rem', border: `1px solid ${G.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '0.85rem' }}>
          <MapPin size={15} color={G.gold} />
          <span style={{ fontFamily: "'Cinzel', serif", color: G.ink, fontSize: '0.76rem', fontWeight: 700, letterSpacing: '0.05em' }}>Régions actives</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {Object.entries(REGIONS).slice(0, 8).map(([name, reg]) => (
            <motion.button key={name} whileHover={{ scale: 1.05 }}
              style={{ padding: '3px 10px', borderRadius: 999, background: `${reg.color}14`, border: `1px solid ${reg.color}35`, color: reg.color, fontSize: '0.58rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'Cinzel', serif" }}>
              {name.split(' ')[0]}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────
export default function ContribFeed({ onClose, contextRegion }) {
  const [posts, setPosts] = useState(DEMO_POSTS);
  const [filter, setFilter] = useState('all');

  const handleLike = id => setPosts(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  const handleSave = id => setPosts(prev => prev.map(p => p.id === id ? { ...p, saved: !p.saved } : p));
  const handleNewPost = np => {
    const reg = REGIONS[np.region];
    setPosts(prev => [{
      ...np, author: 'Vous', avatar: 'Moi', avatarColor: G.gold,
      location: `${np.region || "Côte d'Ivoire"}${reg?.ethnies[0] ? ` · ${reg.ethnies[0]}` : ''}`,
    }, ...prev]);
  };

  const filteredPosts = ['all', 'explore', 'people'].includes(filter)
    ? posts
    : filter === 'saved'
      ? posts.filter(p => p.saved)
      : posts.filter(p => p.pillar === filter);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(26,20,16,0.55)', backdropFilter: 'blur(18px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.75rem' }}
    >
      <motion.div
        initial={{ scale: 0.96, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 20 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: '100%', maxWidth: 1060, height: '94vh', display: 'flex', flexDirection: 'column', background: G.bg, borderRadius: 20, overflow: 'hidden', border: `1px solid ${G.border}`, boxShadow: '0 40px 100px rgba(26,20,16,0.3)' }}
      >
        {/* ── NAVBAR ── */}
        <div style={{ background: G.surface, borderBottom: `1px solid ${G.border}`, padding: '0 1.25rem', height: 54, display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg,#9a7020,${G.goldLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(184,134,11,0.35)' }}>
              <span style={{ fontFamily: "'Cinzel Decorative', serif", color: '#fff', fontSize: '0.75rem', fontWeight: 700 }}>K</span>
            </div>
            <div>
              <div style={{ fontFamily: "'Cinzel Decorative', serif", color: G.ink, fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.1em', lineHeight: 1 }}>K2Y</div>
              <div style={{ color: G.inkMuted, fontSize: '0.44rem', letterSpacing: '0.28em', textTransform: 'uppercase', marginTop: 1 }}>Mémoire Collective</div>
            </div>
          </div>

          {/* Search */}
          <div style={{ flex: 1, maxWidth: 290, display: 'flex', alignItems: 'center', gap: 8, background: G.bg, border: `1px solid ${G.border}`, borderRadius: 999, padding: '0.38rem 0.9rem' }}>
            <Search size={12} color={G.inkMuted} />
            <input placeholder="Rechercher une tradition, un peuple…" style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: G.ink, fontSize: '0.72rem', fontFamily: "'DM Sans', sans-serif" }} />
          </div>

          {/* Center nav */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            {[{ Icon: Home, label: 'Accueil', act: true }, { Icon: Compass, label: 'Explorer', act: false }, { Icon: Users, label: 'Communauté', act: false }].map(({ Icon, label, act }) => (
              <button key={label}
                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0.42rem 0.8rem', borderRadius: 8, border: 'none', background: act ? `${G.gold}12` : 'none', color: act ? G.gold : G.inkSoft, fontSize: '0.67rem', cursor: 'pointer', fontWeight: act ? 700 : 400, transition: 'all 0.15s', borderBottom: act ? `2.5px solid ${G.gold}` : '2.5px solid transparent' }}
                onMouseEnter={e => { if (!act) { e.currentTarget.style.background = `${G.gold}08`; e.currentTarget.style.color = G.inkMid; } }}
                onMouseLeave={e => { if (!act) { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = G.inkSoft; } }}>
                <Icon size={15} strokeWidth={act ? 2.2 : 1.8} /> {label}
              </button>
            ))}
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            {[Bell, Bookmark].map((Icon, i) => (
              <button key={i}
                style={{ width: 34, height: 34, borderRadius: '50%', background: G.bg, border: `1px solid ${G.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: G.inkSoft, position: 'relative', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = `${G.gold}12`; e.currentTarget.style.color = G.gold; }}
                onMouseLeave={e => { e.currentTarget.style.background = G.bg; e.currentTarget.style.color = G.inkSoft; }}>
                <Icon size={15} />
                {i === 0 && <div style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: '50%', background: '#E74C3C', border: '1.5px solid #fff' }} />}
              </button>
            ))}
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }} onClick={onClose}
              style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(0,0,0,0.05)', border: `1px solid ${G.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: G.inkSoft, transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.color = G.ink; e.currentTarget.style.background = 'rgba(0,0,0,0.09)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = G.inkSoft; e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; }}>
              <X size={15} />
            </motion.button>
          </div>
        </div>

        {/* ── BODY ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1rem' }}>
          <div style={{ maxWidth: 1020, margin: '0 auto', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <LeftSidebar activeFilter={filter} setFilter={setFilter} />

            {/* Feed */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Stories */}
              <div style={{ background: G.surface, borderRadius: 16, padding: '0.85rem 1rem', marginBottom: '0.85rem', border: `1px solid ${G.border}`, display: 'flex', gap: '1rem', overflowX: 'auto' }}>
                <StoryBubble isAdd />
                {STORIES.map(s => <StoryBubble key={s.id} story={s} />)}
              </div>

              <CreatePostBox onPost={handleNewPost} />

              <AnimatePresence>
                {filteredPosts.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ textAlign: 'center', padding: '3rem 1rem', color: G.inkMuted, background: G.surface, borderRadius: 16, border: `1px solid ${G.border}` }}>
                    <Bookmark size={30} color={G.border} style={{ margin: '0 auto 0.75rem', display: 'block' }} />
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: '0.78rem' }}>Aucun contenu ici pour l'instant</div>
                  </motion.div>
                ) : (
                  filteredPosts.map((post, i) => (
                    <motion.div key={post.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                      <PostCard post={post} onLike={handleLike} onSave={handleSave} />
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            <RightSidebar />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
