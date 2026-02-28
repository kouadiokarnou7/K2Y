import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { G } from '../../constants/theme';
import { CULTURAL_PILLARS } from '@/data'; // 👈 adapte si besoin

const MAX_LENGTH = 220;

/**
 * Corps du post : titre, texte avec expand/collapse, citations stylisées.
 * Les lignes commençant par «  sont automatiquement stylisées en bloc-citation.
 *
 * @param {object} post - objet post complet
 *
 * Usage :
 *   <PostContent post={post} />
 */
export default function PostContent({ post }) {
  const [expanded, setExpanded] = useState(false);

  const pillar  = CULTURAL_PILLARS.find((p) => p.id === post.pillar);
  const accentColor = pillar?.color || G.gold;
  const isLong  = post.content.length > MAX_LENGTH;
  const displayed = !expanded && isLong
    ? post.content.slice(0, MAX_LENGTH) + '…'
    : post.content;

  // ── Rendu ligne par ligne ──────────────────────────────────
  const renderLines = (text) =>
    text.split('\n').map((line, i) => {
      // Ligne vide → espacement
      if (!line.trim()) return <div key={i} style={{ height: '0.4rem' }} />;

      // Citation (commence par «) → bloc stylisé
      if (line.startsWith('«')) {
        return (
          <div
            key={i}
            style={{
              borderLeft: `3px solid ${accentColor}`,
              padding: '0.6rem 0.9rem',
              margin: '0.5rem 0',
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontSize: '0.92rem',
              color: accentColor,
              background: `${accentColor}08`,
              borderRadius: '0 8px 8px 0',
            }}
          >
            {line}
          </div>
        );
      }

      // Texte normal
      return (
        <p
          key={i}
          style={{
            color: G.inkMid,
            fontSize: '0.84rem',
            lineHeight: 1.8,
            fontWeight: 300,
            margin: 0,
          }}
        >
          {line}
        </p>
      );
    });

  return (
    <div style={{ padding: '0 1rem 0.75rem' }}>

      {/* ── Titre ── */}
      <div
        style={{
          fontFamily: "'Cinzel', serif",
          color: G.ink,
          fontSize: '0.9rem',
          fontWeight: 700,
          marginBottom: '0.5rem',
          lineHeight: 1.3,
          letterSpacing: '0.02em',
        }}
      >
        {post.title}
      </div>

      {/* ── Contenu ── */}
      {renderLines(displayed)}

      {/* ── Bouton Lire la suite / Voir moins ── */}
      {isLong && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          style={{
            color: G.gold,
            fontSize: '0.7rem',
            fontWeight: 600,
            padding: '4px 0',
            height: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            marginTop: 4,
          }}
        >
          {expanded ? 'Voir moins' : 'Lire la suite'}
          <ChevronDown
            size={11}
            style={{
              transform: expanded ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s',
            }}
          />
        </Button>
      )}
    </div>
  );
}