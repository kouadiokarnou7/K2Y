import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { G } from '../../constants/theme';
import { CULTURAL_PILLARS } from '@/data'; 
import PostHeader  from './Postheader';
import PostContent from './PostContent';
import PostActions from './PostActions';
import CommentBox  from './CommentBox';

/**
 * Carte post complète — assemble tous les sous-composants.
 *
 * @param {object}   post
 * @param {function} onLike(id)
 * @param {function} onSave(id)
 *
 * Usage :
 *   <PostCard post={post} onLike={handleLike} onSave={handleSave} />
 */
export default function PostCard({ post, onLike, onSave }) {
  const [showComments, setShowComments] = useState(false);

  const pillar = CULTURAL_PILLARS.find((p) => p.id === post.pillar);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ boxShadow: `0 6px 24px rgba(184,134,11,0.12)` }}
      transition={{ duration: 0.3 }}
      style={{ marginBottom: '0.85rem' }}
    >
      <Card
        style={{
          borderRadius: 16,
          overflow: 'hidden',
          border: `1px solid ${G.border}`,
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
          background: G.surface,
          padding: 0,
        }}
      >
        {/* ── Barre de couleur pilier en haut ── */}
        {pillar && (
          <div
            style={{
              height: 3,
              background: `linear-gradient(90deg, ${pillar.color}, ${pillar.color}20)`,
            }}
          />
        )}

        {/* ── En-tête ── */}
        <PostHeader post={post} />

        {/* ── Corps ── */}
        <PostContent post={post} />

        {/* ── Stats (likes, commentaires, partages) ── */}
        <div
          style={{
            padding: '0 1rem 0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Compteur likes */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div
              style={{
                width: 18, height: 18, borderRadius: '50%',
                background: '#E74C3C',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Heart size={9} color="#fff" fill="#fff" />
            </div>
            <span style={{ color: G.inkMuted, fontSize: '0.65rem' }}>
              {post.likes}
            </span>
          </div>

          {/* Compteurs commentaires + partages */}
          <div style={{ display: 'flex', gap: 10 }}>
            <span
              style={{ color: G.inkMuted, fontSize: '0.65rem', cursor: 'pointer' }}
              onClick={() => setShowComments(!showComments)}
            >
              {post.comments} commentaires
            </span>
            {post.shares > 0 && (
              <span style={{ color: G.inkMuted, fontSize: '0.65rem' }}>
                {post.shares} partages
              </span>
            )}
          </div>
        </div>

        {/* ── Actions ── */}
        <PostActions
          post={post}
          onLike={onLike}
          onSave={onSave}
          showComments={showComments}
          setShowComments={setShowComments}
        />

        {/* ── Zone commentaire animée ── */}
        <CommentBox visible={showComments} />
      </Card>
    </motion.div>
  );
}