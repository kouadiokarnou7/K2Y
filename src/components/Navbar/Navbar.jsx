import { motion } from 'framer-motion';
import { Search, Home, Compass, Users, Bell, Bookmark, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { G }  from '@/constants/theme';

/**
 * Barre de navigation principale du feed.
 *
 * @param {function} onClose - ferme le feed (retour à la page précédente)
 *
 * Usage :
 *   <Navbar onClose={() => navigate(-1)} />
 */

const CENTER_NAV = [
  { Icon: Home,    label: 'Accueil',    active: true  },
  { Icon: Compass, label: 'Explorer',   active: false },
  { Icon: Users,   label: 'Communauté', active: false },
];

export default function Navbar({ onClose }) {
  return (
    <header
      style={{
        background: G.surface,
        borderBottom: `1px solid ${G.border}`,
        padding: '0 1.25rem',
        height: 54,
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flexShrink: 0,
      }}
    >

      {/* ── Logo ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
        <div
          style={{
            width: 34, height: 34, borderRadius: '50%',
            background: `linear-gradient(135deg, #9a7020, ${G.goldLight})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(184,134,11,0.35)',
          }}
        >
          <span style={{ fontFamily: "'Cinzel Decorative', serif", color: '#fff', fontSize: '0.75rem', fontWeight: 700 }}>
            K
          </span>
        </div>
        <div>
          <div style={{ fontFamily: "'Cinzel Decorative', serif", color: G.ink, fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.1em', lineHeight: 1 }}>
            K2Y
          </div>
          <div style={{ color: G.inkMuted, fontSize: '0.44rem', letterSpacing: '0.28em', textTransform: 'uppercase', marginTop: 1 }}>
            Mémoire Collective
          </div>
        </div>
      </div>

      {/* ── Barre de recherche (shadcn Input) ── */}
      <div
        style={{
          flex: 1, maxWidth: 290,
          display: 'flex', alignItems: 'center', gap: 8,
          background: G.bg, border: `1px solid ${G.border}`,
          borderRadius: 999, padding: '0 0.9rem',
        }}
      >
        <Search size={12} color={G.inkMuted} />
        <Input
          placeholder="Rechercher une tradition, un peuple…"
          style={{
            flex: 1, background: 'none', border: 'none',
            outline: 'none', boxShadow: 'none',
            color: G.ink, fontSize: '0.72rem',
            fontFamily: "'DM Sans', sans-serif",
            padding: '0.38rem 0',
          }}
        />
      </div>

      {/* ── Navigation centrale ── */}
      <nav style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
        {CENTER_NAV.map(({ Icon, label, active }) => (
          <button
            key={label}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '0.42rem 0.8rem', borderRadius: 8,
              border: 'none', cursor: 'pointer',
              background: active ? `${G.gold}12` : 'none',
              color: active ? G.gold : G.inkSoft,
              fontSize: '0.67rem', fontWeight: active ? 700 : 400,
              borderBottom: active ? `2.5px solid ${G.gold}` : '2.5px solid transparent',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              if (!active) {
                e.currentTarget.style.background = `${G.gold}08`;
                e.currentTarget.style.color = G.inkMid;
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                e.currentTarget.style.background = 'none';
                e.currentTarget.style.color = G.inkSoft;
              }
            }}
          >
            <Icon size={15} strokeWidth={active ? 2.2 : 1.8} />
            {label}
          </button>
        ))}
      </nav>

      {/* ── Icônes droite ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          style={{
            width: 34, height: 34, borderRadius: '50%',
            background: G.bg, border: `1px solid ${G.border}`,
            color: G.inkSoft, position: 'relative',
          }}
        >
          <Bell size={15} />
          {/* Point rouge */}
          <span
            style={{
              position: 'absolute', top: 6, right: 6,
              width: 7, height: 7, borderRadius: '50%',
              background: '#E74C3C', border: '1.5px solid #fff',
            }}
          />
        </Button>

        {/* Enregistrés */}
        <Button
          variant="ghost"
          size="icon"
          style={{
            width: 34, height: 34, borderRadius: '50%',
            background: G.bg, border: `1px solid ${G.border}`,
            color: G.inkSoft,
          }}
        >
          <Bookmark size={15} />
        </Button>

        {/* Fermer */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'rgba(0,0,0,0.05)',
              border: `1px solid ${G.border}`,
              color: G.inkSoft,
            }}
          >
            <X size={15} />
          </Button>
        </motion.div>

      </div>
    </header>
  );
}