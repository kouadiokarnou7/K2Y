import { useState, useEffect } from 'react';
import {
  collection, onSnapshot, addDoc,
  updateDoc, deleteDoc, doc,
  serverTimestamp, orderBy, query,
  increment, arrayUnion, arrayRemove,
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/firebase/firebaseconfig';

export function usePosts() {
  const [posts,    setPosts]    = useState([]);
  const [comments, setComments] = useState({});
  const [loading,  setLoading]  = useState(true);
  const [user] = useAuthState(auth);

  // ── 1. Écoute posts temps réel ─────────────────────────────
  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => {
          const post = { id: d.id, ...d.data() };

          // ✅ "liked" calculé localement selon si le user est dans likedBy[]
          post.liked = Array.isArray(post.likedBy)
            ? post.likedBy.includes(user?.uid)
            : false;

          // ✅ "saved" calculé localement selon savedBy[]
          post.saved = Array.isArray(post.savedBy)
            ? post.savedBy.includes(user?.uid)
            : false;

          return post;
        });

        console.log(`✅ [usePosts] ${data.length} post(s) reçu(s)`);
        setPosts(data);
        setLoading(false);
      },
      (err) => {
        console.error('❌ [usePosts] onSnapshot:', err.code, err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]); // ✅ re-run si user change (connexion/déconnexion)

  // ── 2. Écoute commentaires d'un post ──────────────────────
  const subscribeToComments = (postId) => {
    const q = query(
      collection(db, 'posts', postId, 'comments'),
      orderBy('createdAt', 'asc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setComments((prev) => ({ ...prev, [postId]: data }));
    });
    return unsubscribe;
  };

  // ── 3. Toggle like ─────────────────────────────────────────
  /**
   * Like/unlike via arrayUnion/arrayRemove sur likedBy[].
   * Le compteur likes est incrémenté/décrémenté en conséquence.
   * Chaque user a son propre état de like.
   */
  const handleLike = async (id) => {
    if (!user) return;

    const post = posts.find((p) => p.id === id);
    if (!post) return;

    const alreadyLiked = post.liked; // calculé depuis likedBy[] dans onSnapshot

    // ✅ Optimiste local
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              liked:   !alreadyLiked,
              likes:   alreadyLiked ? p.likes - 1 : p.likes + 1,
              likedBy: alreadyLiked
                ? (p.likedBy ?? []).filter((uid) => uid !== user.uid)
                : [...(p.likedBy ?? []), user.uid],
            }
          : p
      )
    );

    try {
      await updateDoc(doc(db, 'posts', id), {
        // ✅ arrayUnion/arrayRemove — atomique, pas de race condition
        likedBy: alreadyLiked ? arrayRemove(user.uid) : arrayUnion(user.uid),
        likes:   increment(alreadyLiked ? -1 : 1),
      });
      console.log(`✅ [handleLike] Post ${id} → liked: ${!alreadyLiked}`);
    } catch (err) {
      console.error('❌ [handleLike]', err.code, err.message);
      // Rollback
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, liked: alreadyLiked, likes: post.likes, likedBy: post.likedBy }
            : p
        )
      );
    }
  };

  // ── 4. Toggle save ─────────────────────────────────────────
  const handleSave = async (id) => {
    if (!user) return;

    const post = posts.find((p) => p.id === id);
    if (!post) return;

    const alreadySaved = post.saved;

    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              saved:   !alreadySaved,
              savedBy: alreadySaved
                ? (p.savedBy ?? []).filter((uid) => uid !== user.uid)
                : [...(p.savedBy ?? []), user.uid],
            }
          : p
      )
    );

    try {
      await updateDoc(doc(db, 'posts', id), {
        savedBy: alreadySaved ? arrayRemove(user.uid) : arrayUnion(user.uid),
      });
      console.log(`✅ [handleSave] Post ${id} → saved: ${!alreadySaved}`);
    } catch (err) {
      console.error('❌ [handleSave]', err.code, err.message);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, saved: alreadySaved, savedBy: post.savedBy } : p
        )
      );
    }
  };

  // ── 5. Nouveau post ────────────────────────────────────────
  const handleNewPost = async (formData, regions = {}) => {
    const reg = regions[formData.region];

    const newPost = {
      ...formData,
      author:      user?.displayName ?? 'Anonyme',
      avatar:      user?.displayName
                     ? user.displayName.slice(0, 2).toUpperCase()
                     : 'AN',
      avatarColor: '#b8860b',
      photoURL:    user?.photoURL ?? null,
      authorId:    user?.uid      ?? null,
      location:    `${formData.region || "Côte d'Ivoire"}${
                     reg?.ethnies?.[0] ? ` · ${reg.ethnies[0]}` : ''
                   }`,
      likes:    0,
      comments: 0,
      shares:   0,
      views:    1,
      likedBy:  [],  // ✅ tableau vide au départ
      savedBy:  [],  // ✅ tableau vide au départ
      createdAt: serverTimestamp(),
    };

    console.log('📤 [handleNewPost] Envoi :', newPost);

    try {
      const ref = await addDoc(collection(db, 'posts'), newPost);
      console.log('✅ [handleNewPost] Créé ! ID:', ref.id);
    } catch (err) {
      console.error('❌ [handleNewPost]', err.code, err.message);
    }
  };

  // ── 6. Supprimer son post ──────────────────────────────────
  const handleDelete = async (postId) => {
    const post = posts.find((p) => p.id === postId);
    if (!post || post.authorId !== user?.uid) {
      console.warn('⛔ [handleDelete] Interdit');
      return;
    }

    setPosts((prev) => prev.filter((p) => p.id !== postId));

    try {
      await deleteDoc(doc(db, 'posts', postId));
      console.log(`✅ [handleDelete] Post ${postId} supprimé`);
    } catch (err) {
      console.error('❌ [handleDelete]', err.code, err.message);
      setPosts((prev) => [post, ...prev]);
    }
  };

  // ── 7. Commenter ───────────────────────────────────────────
  const handleComment = async (postId, text) => {
    if (!text?.trim() || !user) return;

    try {
      await addDoc(collection(db, 'posts', postId, 'comments'), {
        text:      text.trim(),
        author:    user.displayName ?? 'Anonyme',
        avatar:    user.displayName
                     ? user.displayName.slice(0, 2).toUpperCase()
                     : 'AN',
        authorId:  user.uid,
        photoURL:  user.photoURL ?? null,
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(db, 'posts', postId), { comments: increment(1) });
      console.log(`✅ [handleComment] Commentaire ajouté au post ${postId}`);
    } catch (err) {
      console.error('❌ [handleComment]', err.code, err.message);
    }
  };

  // ── 8. Partager / Republier ────────────────────────────────
  const handleShare = async (postId) => {
    if (!user) return;

    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    setPosts((prev) =>
      prev.map((p) => p.id === postId ? { ...p, shares: (p.shares ?? 0) + 1 } : p)
    );

    try {
      await addDoc(collection(db, 'reposts'), {
        postId,
        originalAuthorId: post.authorId,
        repostedBy:       user.uid,
        repostedByName:   user.displayName ?? 'Anonyme',
        createdAt:        serverTimestamp(),
      });

      await updateDoc(doc(db, 'posts', postId), { shares: increment(1) });
      console.log(`✅ [handleShare] Post ${postId} partagé`);
    } catch (err) {
      console.error('❌ [handleShare]', err.code, err.message);
      setPosts((prev) =>
        prev.map((p) => p.id === postId ? { ...p, shares: (p.shares ?? 1) - 1 } : p)
      );
    }
  };

  return {
    posts,
    comments,
    loading,
    handleLike,
    handleSave,
    handleNewPost,
    handleDelete,
    handleComment,
    handleShare,
    subscribeToComments,
  };
}