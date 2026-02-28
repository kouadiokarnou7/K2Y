import { MapPin, MoreHorizontal, Eye } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import PillarBadge from "@/components/pillars/PillarBadge";

import { G } from '../../constants/theme';

/**
 * En-tête d'un post : avatar, auteur, badge pilier, lieu, heure, vues.
 *
 * @param {object} post - objet post complet
 *
 * Usage :
 *   <PostHeader post={post} />
 */
export default function PostHeader({ post }) {
  return (
    <div
      style={{
        padding: '0.9rem 1rem 0.6rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
      }}
    >
      {/* ── Avatar shadcn ── */}
      <Avatar style={{ width: 42, height: 42, flexShrink: 0 }}>
        <AvatarFallback
          style={{
            background: `linear-gradient(135deg, ${post.avatarColor}dd, ${post.avatarColor})`,
            color: '#fff',
            fontSize: '0.75rem',
            fontWeight: 700,
            fontFamily: "'Cinzel', serif",
            letterSpacing: '0.04em',
          }}
        >
          {post.avatar}
        </AvatarFallback>
      </Avatar>

      {/* ── Infos auteur ── */}
      <div style={{ flex: 1 }}>
        {/* Nom + badge pilier */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontWeight: 700,
              fontSize: '0.84rem',
              color: G.ink,
              fontFamily: "'Cinzel', serif",
            }}
          >
            {post.author}
          </span>

          {post.pillar && <PillarBadge pillarId={post.pillar} />}
        </div>

        {/* Lieu · Heure · Vues */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            marginTop: 3,
            flexWrap: 'wrap',
          }}
        >
          <MapPin size={10} color={G.gold} />
          <span style={{ color: G.inkMuted, fontSize: '0.6rem' }}>
            {post.location}
          </span>

          <span style={{ color: G.inkMuted, fontSize: '0.6rem' }}>·</span>

          <span style={{ color: G.inkMuted, fontSize: '0.6rem' }}>
            {post.time}
          </span>

          {post.views && (
            <>
              <span style={{ color: G.inkMuted, fontSize: '0.6rem' }}>·</span>
              <Eye size={9} color={G.inkMuted} />
              <span style={{ color: G.inkMuted, fontSize: '0.58rem' }}>
                {post.views}
              </span>
            </>
          )}
        </div>
      </div>

      {/* ── Menu options ── */}
      <Button
        variant="ghost"
        size="icon"
        style={{
          width: 30, height: 30,
          borderRadius: '50%',
          color: G.inkMuted,
          flexShrink: 0,
        }}
      >
        <MoreHorizontal size={16} />
      </Button>
    </div>
  );
}