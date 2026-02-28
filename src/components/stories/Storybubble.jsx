import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar'; // shadcn Avatar
import { G } from '../../constants/theme';

/**
 * Une bulle de story.
 *
 * @param {object}  story  - { id, author, sub, color, Icon }
 * @param {boolean} isAdd  - true → affiche le bouton "Ajouter votre story"
 *
 * Usage :
 *   <StoryBubble isAdd />
 *   <StoryBubble story={{ id:1, author:'Korhogo', color:'#8E44AD', Icon: Layers }} />
 */
export default function StoryBubble({ story, isAdd = false }) {
  const [hovered, setHovered] = useState(false);

  // ── Bouton "Ajouter votre story" ──────────────────────────
  if (isAdd) {
    return (
      <motion.div
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        {/* Cercle pointillé doré */}
        <div
          style={{
            width: 58, height: 58, borderRadius: '50%',
            background: G.goldPale,
            border: `2px dashed ${G.gold}60`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'border-color 0.2s, background 0.2s',
          }}
        >
          <Plus size={22} color={G.gold} strokeWidth={1.8} />
        </div>
        <span
          style={{
            fontSize: '0.58rem', color: G.inkSoft,
            whiteSpace: 'nowrap', maxWidth: 64,
            textAlign: 'center', lineHeight: 1.3,
          }}
        >
          Votre story
        </span>
      </motion.div>
    );
  }

  // ── Story normale ─────────────────────────────────────────
  const { Icon, author, color } = story;

  return (
    <motion.div
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      {/* shadcn Avatar avec anneau coloré */}
      <div
        style={{
          padding: 2,
          borderRadius: '50%',
          // Anneau qui s'intensifie au survol
          boxShadow: hovered
            ? `0 0 0 2px ${G.bg}, 0 0 0 4px ${color}`
            : `0 0 0 2px ${G.bg}, 0 0 0 3.5px ${color}70`,
          transition: 'box-shadow 0.2s',
        }}
      >
        <Avatar
          style={{
            width: 54, height: 54,
            background: `linear-gradient(135deg, ${color}ee, ${color}88)`,
          }}
        >
          <AvatarFallback
            style={{
              background: `linear-gradient(135deg, ${color}ee, ${color}88)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Icon size={24} color="rgba(255,255,255,0.95)" strokeWidth={1.4} />
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Nom de la région */}
      <span
        style={{
          fontSize: '0.58rem', color: G.inkSoft,
          whiteSpace: 'nowrap', maxWidth: 64,
          textAlign: 'center', lineHeight: 1.3,
        }}
      >
        {author}
      </span>
    </motion.div>
  );
}