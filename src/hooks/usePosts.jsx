import { useState, useEffect } from 'react';
import {
  collection, onSnapshot, addDoc,
  updateDoc, doc, serverTimestamp,
  orderBy, query,
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/firebase/firebaseconfig';
import { uuid } from 'zod';

export function usePosts() {
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLike = async (id) => {
    const post = posts.find((p) => p.id === id);
    if (!post) return;
    const newLiked = !post.liked;
    const newLikes = newLiked ? post.likes + 1 : post.likes - 1;
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, liked: newLiked, likes: newLikes } : p));
    await updateDoc(doc(db, 'posts', id), { liked: newLiked, likes: newLikes });
  };

  const handleSave = async (id) => {
    const post = posts.find((p) => p.id === id);
    if (!post) return;
    const newSaved = !post.saved;
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, saved: newSaved } : p));
    await updateDoc(doc(db, 'posts', id), { saved: newSaved });
  };

  const handleNewPost = async (formData, regions = {}) => {
    const reg = regions[formData.region];
    await addDoc(collection(db, 'posts'), {
      ...formData,
      author:      user?.displayName ?? 'Anonyme',
      avatar:      user?.displayName ? user.displayName.slice(0, 2).toUpperCase() : 'AN',
      avatarColor: '#b8860b',
      photoURL:    user?.photoURL ?? null,
      authorId:    user?.uid      ?? null,
      location:    `${formData.region || "Côte d'Ivoire"}${reg?.ethnies?.[0] ? ` · ${reg.ethnies[0]}` : ''}`,
      likes: 0, comments: 0, shares: 0, views: 1,
      liked: false, saved: false,
      createdAt: serverTimestamp(),
    });
  };

  return { posts, loading, handleLike, handleSave, handleNewPost };
}