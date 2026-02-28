import { motion } from 'framer-motion';
import { TrendingUp, Users, MapPin } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button }                 from '@/components/ui/button';
import { Badge }                  from '@/components/ui/badge';
import { Separator }              from '@/components/ui/separator';
import { G }                      from '../../constants/theme';
import { TRENDING, SUGGESTIONS }  from '@/constants/theme'; 
import { REGIONS  } from '@/data';   
import { CULTURAL_PILLARS } from '@/data';
import { useFollow }              from '../../hooks/useFollow';

/**
 * Sidebar droite : tendances, contributeurs suggérés, régions actives.
 * Consomme useFollow directement (état local à ce composant).
 *
 * Usage :
 *   <RightSidebar />
 */
export default function RightSidebar() {
  const { followed, toggleFollow } = useFollow();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>

      {/* ── Tendances ── */}
      <div
        style={{
          background: G.surface,
          borderRadius: 14,
          padding: '1rem',
          border: `1px solid ${G.border}`,
        }}
      >
        {/* Titre */}
        <div
          style={{
            display: 'flex', alignItems: 'center',
            gap: 6, marginBottom: '0.75rem',
          }}
        >
          <TrendingUp size={15} color={G.gold} />
          <span
            style={{
              fontFamily: "'Cinzel', serif",
              color: G.ink, fontSize: '0.76rem',
              fontWeight: 700, letterSpacing: '0.05em',
            }}
          >
            Tendances
          </span>
        </div>

        <Separator style={{ marginBottom: '0.6rem', background: G.borderSoft }} />

        {TRENDING.map((t, i) => (
          <motion.div
            key={t.tag}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ background: `${t.color}08` }}
            style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.5rem 0.65rem',
              borderRadius: 8, cursor: 'pointer',
              transition: 'background 0.15s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Point couleur */}
              <div
                style={{
                  width: 6, height: 6,
                  borderRadius: '50%', background: t.color,
                }}
              />
              <span style={{ fontSize: '0.73rem', color: G.inkMid, fontWeight: 600 }}>
                {t.tag}
              </span>
            </div>

            {/* shadcn Badge pour le compteur */}
            <Badge
              variant="secondary"
              style={{
                fontSize: '0.55rem', padding: '1px 7px',
                background: `${t.color}15`, color: t.color,
                border: `1px solid ${t.color}30`,
              }}
            >
              {t.count}
            </Badge>
          </motion.div>
        ))}
      </div>

      {/* ── Contributeurs suggérés ── */}
      <div
        style={{
          background: G.surface,
          borderRadius: 14,
          padding: '1rem',
          border: `1px solid ${G.border}`,
        }}
      >
        {/* Titre + lien */}
        <div
          style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Users size={15} color={G.gold} />
            <span
              style={{
                fontFamily: "'Cinzel', serif",
                color: G.ink, fontSize: '0.76rem',
                fontWeight: 700, letterSpacing: '0.05em',
              }}
            >
              Contributeurs
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            style={{ color: G.gold, fontSize: '0.6rem', height: 'auto', padding: '2px 6px' }}
          >
            Voir tout
          </Button>
        </div>

        <Separator style={{ marginBottom: '0.65rem', background: G.borderSoft }} />

        {SUGGESTIONS.map((s) => (
          <div
            key={s.name}
            style={{
              display: 'flex', alignItems: 'center',
              gap: '0.7rem', marginBottom: '0.75rem',
            }}
          >
            {/* shadcn Avatar */}
            <Avatar style={{ width: 36, height: 36, flexShrink: 0 }}>
              <AvatarFallback
                style={{
                  background: `linear-gradient(135deg, ${s.color}dd, ${s.color})`,
                  color: '#fff', fontSize: '0.6rem',
                  fontWeight: 700, fontFamily: "'Cinzel', serif",
                }}
              >
                {s.initials}
              </AvatarFallback>
            </Avatar>

            {/* Infos contributeur */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '0.73rem', color: G.ink,
                  fontWeight: 600, fontFamily: "'Cinzel', serif",
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}
              >
                {s.name}
              </div>
              <div style={{ fontSize: '0.58rem', color: G.inkMuted }}>
                {s.role}
              </div>
            </div>

            {/* Bouton Suivre / Suivi */}
            <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.93 }}>
              <Button
                size="sm"
                variant={followed[s.name] ? 'outline' : 'default'}
                onClick={() => toggleFollow(s.name)}
                style={{
                  padding: '3px 10px',
                  height: 'auto',
                  borderRadius: 999,
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  fontFamily: "'Cinzel', serif",
                  ...(followed[s.name]
                    ? {
                        background: `${s.color}15`,
                        border: `1px solid ${s.color}40`,
                        color: s.color,
                      }
                    : {
                        background: `linear-gradient(135deg, #9a7020, ${G.goldLight})`,
                        border: 'none',
                        color: '#fff',
                        boxShadow: '0 2px 8px rgba(184,134,11,0.3)',
                      }),
                }}
              >
                {followed[s.name] ? 'Suivi ✓' : 'Suivre'}
              </Button>
            </motion.div>
          </div>
        ))}
      </div>

      {/* ── Régions actives ── */}
      <div
        style={{
          background: G.surface,
          borderRadius: 14,
          padding: '1rem',
          border: `1px solid ${G.border}`,
        }}
      >
        {/* Titre */}
        <div
          style={{
            display: 'flex', alignItems: 'center',
            gap: 6, marginBottom: '0.75rem',
          }}
        >
          <MapPin size={15} color={G.gold} />
          <span
            style={{
              fontFamily: "'Cinzel', serif",
              color: G.ink, fontSize: '0.76rem',
              fontWeight: 700, letterSpacing: '0.05em',
            }}
          >
            Régions actives
          </span>
        </div>

        <Separator style={{ marginBottom: '0.6rem', background: G.borderSoft }} />

        {/* shadcn Badge par région */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {Object.entries(REGIONS).slice(0, 8).map(([name, reg]) => (
            <motion.div key={name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Badge
                variant="outline"
                style={{
                  padding: '3px 10px',
                  borderRadius: 999,
                  background: `${reg.color}14`,
                  border: `1px solid ${reg.color}35`,
                  color: reg.color,
                  fontSize: '0.58rem',
                  fontWeight: 600,
                  fontFamily: "'Cinzel', serif",
                  cursor: 'pointer',
                }}
              >
                {name.split(' ')[0]}
              </Badge>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}