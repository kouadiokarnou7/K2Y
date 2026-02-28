import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import PostCard from '@/components/post/PostCard'; 
import { G } from '@/constants/theme';

/**
 * Liste animée des posts filtrés avec état de chargement et état vide.
 *
 * @param {array}    posts    - posts filtrés à afficher (défaut: [])
 * @param {boolean}  loading  - true pendant le chargement Firestore
 * @param {function} onLike(id)
 * @param {function} onSave(id)
 */
// ✅ posts = [] par défaut pour éviter le crash si undefined
export default function FeedList({ posts = [], loading, onLike, onSave }) {

  // ── Squelettes de chargement ──────────────────────────────
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              background: G.surface,
              borderRadius: 16,
              border: `1px solid ${G.border}`,
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Skeleton style={{ width: 42, height: 42, borderRadius: '50%' }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <Skeleton style={{ height: 12, width: '40%', borderRadius: 6 }} />
                <Skeleton style={{ height: 10, width: '25%', borderRadius: 6 }} />
              </div>
            </div>
            <Skeleton style={{ height: 14, width: '70%', borderRadius: 6 }} />
            <Skeleton style={{ height: 10, width: '100%', borderRadius: 6 }} />
            <Skeleton style={{ height: 10, width: '85%', borderRadius: 6 }} />
            <Skeleton style={{ height: 10, width: '60%', borderRadius: 6 }} />
          </div>
        ))}
      </div>
    );
  }

  // ── État vide ─────────────────────────────────────────────
  if (posts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          textAlign: 'center',
          padding: '3rem 1rem',
          background: G.surface,
          borderRadius: 16,
          border: `1px solid ${G.border}`,
          color: G.inkMuted,
        }}
      >
        <Bookmark
          size={32}
          color={G.border}
          style={{ margin: '0 auto 0.75rem', display: 'block' }}
        />
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: '0.78rem' }}>
          Aucun contenu ici pour l'instant
        </div>
        <div style={{ fontSize: '0.65rem', color: G.inkMuted, marginTop: 4 }}>
          Soyez le premier à partager une tradition
        </div>
      </motion.div>
    );
  }

  // ── Liste des posts ───────────────────────────────────────
  return (
    <AnimatePresence mode="popLayout">
      {posts.map((post, i) => (
        <motion.div
          key={post.id}
          layout
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
        >
          <PostCard post={post} onLike={onLike} onSave={onSave} />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}