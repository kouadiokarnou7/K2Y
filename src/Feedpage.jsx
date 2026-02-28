import { useNavigate } from 'react-router-dom';
import { usePosts }     from '@/hooks/usePosts';
import { useFilter }    from '@/hooks/useFilter';
import { FeedLayout }   from '@/components/layouts';
import Navbar           from '@/components/Navbar/Navbar';
import LeftSidebar      from '@/components/sidebar/Leftsidebar';
import RightSidebar     from '@/components/sidebar/RightSidebar';
import StoriesRow       from '@/components/stories/StoriesRow';
import CreatePostBox    from '@/components/create/CreatePostBox';
import FeedList         from '@/components/feed/FeedList';
import { REGIONS }      from '@/data';

export default function FeedPage() {
  const navigate = useNavigate();

  const { posts, loading, handleLike, handleSave, handleNewPost } = usePosts();
  const { filter, setFilter, getFilteredPosts } = useFilter();
  const filteredPosts = getFilteredPosts(posts ?? []); // ✅ sécurité si posts undefined

  const handleClose = () => navigate(-1);
  const handlePost  = (formData) => handleNewPost(formData, REGIONS);

  return (
    <FeedLayout
      navbar={<Navbar onClose={handleClose} />}
      left={<LeftSidebar activeFilter={filter} setFilter={setFilter} />}
      center={
        <>
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
      right={<RightSidebar />}
      onClose={handleClose}
    />
  );
}