import { STORIES } from '@/constants/theme';
import StoryBubble from './Storybubble';
import { G } from '../../constants/theme';

/**
 * Rangée horizontale scrollable de stories.
 * Les données viennent de feedData.js (STORIES).
 *
 * Usage :
 *   <StoriesRow />
 */
export default function StoriesRow() {
  return (
    <div
      style={{
        background: G.surface,
        borderRadius: 16,
        padding: '0.85rem 1rem',
        marginBottom: '0.85rem',
        border: `1px solid ${G.border}`,
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',

        // Scroll horizontal
        display: 'flex',
        gap: '1.1rem',
        overflowX: 'auto',
        alignItems: 'flex-start',

        // Cache la scrollbar visuellement
        scrollbarWidth: 'none',       // Firefox
        msOverflowStyle: 'none',      // IE/Edge
      }}
    >
      {/* Bouton ajout story */}
      <StoryBubble isAdd />

      {/* Stories dynamiques */}
      {STORIES.map((story) => (
        <StoryBubble key={story.id} story={story} />
      ))}
    </div>
  );
}