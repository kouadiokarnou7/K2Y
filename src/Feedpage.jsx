import { useState, useEffect } from 'react';
import { useNavigate }   from 'react-router-dom';
import { usePosts }      from '@/hooks/usePosts';
import { useFilter }     from '@/hooks/useFilter';
import { FeedLayout }    from '@/components/layouts';
import Navbar            from '@/components/Navbar/Navbar';
import LeftSidebar       from '@/components/sidebar/Leftsidebar';
import RightSidebar      from '@/components/sidebar/RightSidebar';
import StoriesRow        from '@/components/stories/StoriesRow';
import CreatePostBox     from '@/components/create/CreatePostBox';
import FeedList          from '@/components/feed/FeedList';
import { REGIONS }       from '@/data';

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
}

export default function FeedPage() {
  const navigate  = useNavigate();
  const width     = useWindowWidth();
  const isMobile  = width < 640;
  const isDesktop = width >= 1024;

  const { posts, loading, handleLike, handleSave, handleNewPost } = usePosts();
  const { filter, setFilter, getFilteredPosts } = useFilter();
  const filteredPosts = getFilteredPosts(posts ?? []);

  const handleClose = () => navigate(-1);
  const handlePost  = (formData) => handleNewPost(formData, REGIONS);

  return (
    <FeedLayout
      navbar={<Navbar onClose={handleClose} />}

      left={
        !isMobile
          ? (
            <LeftSidebar
              activeFilter={filter}
              setFilter={setFilter}
              posts={posts}        // ✅ posts réels passés ici → stats dynamiques
            />
          )
          : null
      }

      center={
        <>
          {isMobile && (
            <div style={{
              display: 'flex', gap: 8, overflowX: 'auto',
              padding: '0 0 0.75rem', scrollbarWidth: 'none',
              marginBottom: '0.5rem',
            }}>
              {['all', 'masques', 'textiles', 'oral', 'rites', 'musique'].map((f) => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  flexShrink: 0, padding: '0.35rem 0.85rem', borderRadius: 999,
                  border: filter === f ? 'none' : '1px solid rgba(184,134,11,0.2)',
                  background: filter === f ? 'linear-gradient(135deg,#9a7020,#d4af37)' : 'rgba(249,246,240,0.9)',
                  color: filter === f ? '#fff' : '#7a6e62',
                  fontSize: '0.65rem', fontFamily: "'Cinzel', serif",
                  cursor: 'pointer', fontWeight: filter === f ? 700 : 400,
                }}>
                  {f === 'all' ? 'Tout' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          )}

          <StoriesRow />
          <CreatePostBox onPost={handlePost} />
          <FeedList
            posts={filteredPosts}
            loading={loading}
            onLike={handleLike}
            onSave={handleSave}
          />
        </>
      }

      right={isDesktop ? <RightSidebar /> : null}
      onClose={handleClose}
    />
  );
}