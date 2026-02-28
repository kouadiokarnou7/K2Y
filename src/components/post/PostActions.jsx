import { motion } from 'framer-motion';
import { Heart, MessageCircle, Repeat2, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { G } from '../../constants/theme';

/**
 * Barre d'actions d'un post : J'aime, Commenter, Partager, Enregistrer.
 *
 * @param {object}   post
 * @param {function} onLike(id)
 * @param {function} onSave(id)
 * @param {boolean}  showComments
 * @param {function} setShowComments(bool)
 *
 * Usage :
 *   <PostActions
 *     post={post}
 *     onLike={handleLike}
 *     onSave={handleSave}
 *     showComments={showComments}
 *     setShowComments={setShowComments}
 *   />
 */
export default function PostActions({
  post,
  onLike,
  onSave,
  showComments,
  setShowComments,
}) {
  const actions = [
    {
      Icon: Heart,
      label: "J'aime",
      active: post.liked,
      activeColor: '#E74C3C',
      onClick: () => onLike(post.id),
      fill: post.liked,
    },
    {
      Icon: MessageCircle,
      label: 'Commenter',
      active: showComments,
      activeColor: G.gold,
      onClick: () => setShowComments(!showComments),
      fill: false,
    },
    {
      Icon: Repeat2,
      label: 'Partager',
      active: false,
      activeColor: '#27AE60',
      onClick: () => {},
      fill: false,
    },
    {
      Icon: Bookmark,
      label: 'Enregistrer',
      active: post.saved,
      activeColor: G.gold,
      onClick: () => onSave(post.id),
      fill: post.saved,
    },
  ];

  return (
    <div
      style={{
        borderTop: `1px solid ${G.borderSoft}`,
        display: 'flex',
      }}
    >
      {actions.map(({ Icon, label, active, activeColor, onClick, fill }) => (
        <motion.div
          key={label}
          whileTap={{ scale: 0.93 }}
          style={{ flex: 1 }}
        >
          <Button
            variant="ghost"
            onClick={onClick}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5,
              padding: '0.65rem 0',
              height: 'auto',
              borderRadius: 0,
              color: active ? activeColor : G.inkMuted,
              fontSize: '0.68rem',
              fontWeight: active ? 700 : 400,
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = activeColor;
              e.currentTarget.style.background = `${activeColor}08`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = active ? activeColor : G.inkMuted;
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <Icon
              size={14}
              fill={fill ? activeColor : 'none'}
              strokeWidth={active ? 2.2 : 1.8}
            />
            {label}
          </Button>
        </motion.div>
      ))}
    </div>
  );
}