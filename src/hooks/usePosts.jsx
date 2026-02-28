import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  orderBy,
  query,
} from 'firebase/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from "@/firebase/firebaseconfig";

/**
 * Gère les posts en temps réel avec Firestore + Firebase Auth.
 *
 * Usage :
 *   const { posts, loading, handleLike, handleSave, handleNewPost } = usePosts();
 */
export function usePosts() {
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);

  // ── Écoute temps réel ──────────────────────────────────────
  useEffect(() => {
    const q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc')  // plus récent en premier
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setPosts(data);
      setLoading(false);
    });

    return () => unsubscribe(); // nettoyage à la destruction
  }, []);

  // ── Toggle like ────────────────────────────────────────────
  const handleLike = async (id) => {
    const post = posts.find((p) => p.id === id);
    if (!post) return;

    const newLiked = !post.liked;
    const newLikes = newLiked ? post.likes + 1 : post.likes - 1;

    // Mise à jour optimiste locale → UI réactive immédiatement
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, liked: newLiked, likes: newLikes } : p
      )
    );

    // Persistance Firestore
    await updateDoc(doc(db, 'posts', id), {
      liked: newLiked,
      likes: newLikes,
    });
  };

  // ── Toggle save ────────────────────────────────────────────
  const handleSave = async (id) => {
    const post = posts.find((p) => p.id === id);
    if (!post) return;

    const newSaved = !post.saved;

    // Optimiste local
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, saved: newSaved } : p))
    );

    // Firestore
    await updateDoc(doc(db, 'posts', id), { saved: newSaved });
  };

  // ── Nouveau post ───────────────────────────────────────────
  /**
   * @param {object} formData  - { title, content, pillar, region }
   * @param {object} regions   - objet REGIONS de data.js (optionnel)
   */
  const handleNewPost = async (formData, regions = {}) => {
    const reg = regions[formData.region];

    const newPost = {
      ...formData,

      // ── Auteur depuis Firebase Auth ──
      author:      user?.displayName ?? 'Anonyme',
      avatar:      user?.displayName
                     ? user.displayName.slice(0, 2).toUpperCase()
                     : 'AN',
      avatarColor: '#b8860b',
      photoURL:    user?.photoURL ?? null,
      authorId:    user?.uid      ?? null,

      // ── Localisation enrichie ──
      location: `${formData.region || "Côte d'Ivoire"}${
        reg?.ethnies?.[0] ? ` · ${reg.ethnies[0]}` : ''
      }`,

      // ── Compteurs initiaux ──
      likes:    0,
      comments: 0,
      shares:   0,
      views:    1,
      liked:    false,
      saved:    false,

      // ── Timestamp serveur pour le tri ──
      createdAt: serverTimestamp(),
    };

    // addDoc → Firestore génère l'id
    // onSnapshot détecte le changement et met à jour posts[] automatiquement
    await addDoc(collection(db, 'posts'), newPost);
  };

  return { posts, loading, handleLike, handleSave, handleNewPost };
}