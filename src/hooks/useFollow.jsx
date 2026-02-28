import { useState, useEffect } from 'react';
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from "@/firebase/firebaseconfig"; 

/**
 * Gère le suivi/désuivi des contributeurs en temps réel avec Firestore.
 *
 * Structure Firestore :
 *   collection "follows"
 *     document id : "{followerId}_{contributorName}"
 *     champs      : { followerId, contributorName, createdAt }
 *
 * Usage :
 *   const { followed, toggleFollow, loading } = useFollow();
 *   followed['Aya Koné']       // true si l'utilisateur connecté la suit
 *   toggleFollow('Aya Koné')   // suit ou désabonne
 */
export function useFollow() {
  const [followed, setFollowed] = useState({});  // { [contributorName]: boolean }
  const [loading, setLoading]   = useState(true);
  const [user] = useAuthState(auth);

  // ── Écoute temps réel des follows de l'utilisateur connecté ──
  useEffect(() => {
    // Pas d'utilisateur connecté → on vide et on arrête
    if (!user) {
      setFollowed({});
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'follows'),
      where('followerId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Reconstruit l'objet { [nom]: true } depuis les docs Firestore
      const data = {};
      snapshot.docs.forEach((docSnap) => {
        const { contributorName } = docSnap.data();
        data[contributorName] = true;
      });
      setFollowed(data);
      setLoading(false);
    });

    return () => unsubscribe(); // nettoyage
  }, [user]);

  // ── Toggle follow / unfollow ───────────────────────────────
  const toggleFollow = async (contributorName) => {
    if (!user) return; // sécurité : utilisateur non connecté

    // ID unique du document : followerId + nom du contributeur
    const docId  = `${user.uid}_${contributorName.replace(/\s+/g, '_')}`;
    const docRef = doc(db, 'follows', docId);

    const isFollowing = !!followed[contributorName];

    // Mise à jour optimiste locale → UI réactive immédiatement
    setFollowed((prev) => ({
      ...prev,
      [contributorName]: !isFollowing,
    }));

    if (isFollowing) {
      // Déjà suivi → on supprime le document
      await deleteDoc(docRef);
    } else {
      // Pas encore suivi → on crée le document
      await setDoc(docRef, {
        followerId:      user.uid,
        followerName:    user.displayName ?? 'Anonyme',
        contributorName,
        createdAt:       new Date().toISOString(),
      });
    }
  };

  return { followed, toggleFollow, loading };
}