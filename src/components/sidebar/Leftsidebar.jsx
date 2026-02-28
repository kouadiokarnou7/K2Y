import {
  Home, Compass, Bookmark, Users,
  Building2, Utensils, Layers, Gem,
  ScrollText, Flame, Music, Crown, Star, Leaf,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button }                 from '@/components/ui/button';
import { Separator }              from '@/components/ui/separator';
import { G }                      from '@/constants/theme';
import { CULTURAL_PILLARS ,}       from '@/data';
import { REGIONS }                from '@/data';   

// ── Icône par pilier ──────────────────────────────────────────
const ICON_MAP = {
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

// ── Navigation principale ─────────────────────────────────────
const NAV_ITEMS = [
  { Icon: Home,     label: "Fil d'actualité", id: 'all'     },
  { Icon: Compass,  label: 'Explorer',        id: 'explore' },
  { Icon: Bookmark, label: 'Enregistrés',     id: 'saved'   },
  { Icon: Users,    label: 'Contributeurs',   id: 'people'  },
];

/**
 * Sidebar gauche : mini-profil, navigation, filtres par pilier.
 *
 * @param {string}   activeFilter  - id du filtre actif
 * @param {function} setFilter(id) - change le filtre
 */
export default function LeftSidebar({ activeFilter, setFilter }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>

      {/* ── Mini profil ── */}
      <div style={{ background: G.surface, borderRadius: 14, padding: '1rem', border: `1px solid ${G.border}` }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
          <Avatar style={{ width: 42, height: 42, boxShadow: `0 0 0 2.5px ${G.bg}, 0 0 0 4.5px ${G.gold}` }}>
            <AvatarFallback
              style={{
                background: `linear-gradient(135deg, ${G.gold}dd, ${G.gold})`,
                color: '#fff', fontSize: '0.6rem',
                fontWeight: 700, fontFamily: "'Cinzel', serif",
              }}
            >
              K2Y
            </AvatarFallback>
          </Avatar>

          <div>
            <div style={{ fontFamily: "'Cinzel', serif", color: G.ink, fontSize: '0.78rem', fontWeight: 700 }}>
              Ma Communauté
            </div>
            <div style={{ color: G.inkMuted, fontSize: '0.58rem', letterSpacing: '0.08em' }}>
              4 piliers suivis
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
          {[['Posts', '12'], ['Abonnés', '48'], ['Suivis', '23']].map(([label, value]) => (
            <div key={label} style={{ textAlign: 'center', padding: '0.4rem 0', background: G.bg, borderRadius: 8 }}>
              <div style={{ fontFamily: "'Cinzel', serif", color: G.gold, fontSize: '0.82rem', fontWeight: 700 }}>
                {value}
              </div>
              <div style={{ color: G.inkMuted, fontSize: '0.5rem', marginTop: 1 }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Navigation ── */}
      <div style={{ background: G.surface, borderRadius: 14, padding: '0.7rem 0.55rem', border: `1px solid ${G.border}` }}>
        {NAV_ITEMS.map(({ Icon, label, id }) => {
          const active = activeFilter === id;
          return (
            <Button
              key={id}
              variant="ghost"
              onClick={() => setFilter(id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: '0.7rem',
                padding: '0.6rem 0.8rem',
                height: 'auto',
                borderRadius: 9,
                background: active ? `${G.gold}12` : 'transparent',
                color: active ? G.gold : G.inkSoft,
                fontSize: '0.73rem',
                fontWeight: active ? 700 : 400,
                borderLeft: active ? `3px solid ${G.gold}` : '3px solid transparent',
                marginBottom: 2,
              }}
            >
              <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
              {label}
            </Button>
          );
        })}
      </div>

      {/* ── Piliers culturels ── */}
      <div style={{ background: G.surface, borderRadius: 14, padding: '0.85rem 0.7rem', border: `1px solid ${G.border}` }}>

        <div style={{
          fontSize: '0.56rem', color: G.inkMuted,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          fontFamily: "'Cinzel', serif", fontWeight: 600,
          marginBottom: '0.5rem', paddingLeft: '0.35rem',
        }}>
          Piliers culturels
        </div>

        <Separator style={{ marginBottom: '0.5rem', background: G.borderSoft }} />

        {CULTURAL_PILLARS.slice(0, 6).map((p) => {
          const Icon   = ICON_MAP[p.id] || Star;
          const active = activeFilter === p.id;
          return (
            <Button
              key={p.id}
              variant="ghost"
              onClick={() => setFilter(p.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: '0.7rem',
                padding: '0.5rem 0.8rem',
                height: 'auto',
                borderRadius: 8,
                background: active ? `${p.color}12` : 'transparent',
                borderLeft: active ? `3px solid ${p.color}` : '3px solid transparent',
                marginBottom: 2,
              }}
            >
              <div style={{
                width: 27, height: 27, borderRadius: 7,
                background: `${p.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={13} color={p.color} strokeWidth={1.7} />
              </div>

              <span style={{
                fontSize: '0.7rem',
                color: active ? p.color : G.inkSoft,
                fontWeight: active ? 700 : 400,
              }}>
                {p.label.split(' ')[0]}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}