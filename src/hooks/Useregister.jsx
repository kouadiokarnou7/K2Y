import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseconfig";

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const resetError = () => setError(null);

  async function register(formData) {
    const { pseudo, email, password, isIvorian, ethnie, profil } = formData;

    setLoading(true);
    setError(null);

    try {
      console.log("🟡 STEP 1 — Vérification pseudo");

      const pseudoLower = pseudo.trim().toLowerCase();

      const pseudoQuery = query(
        collection(db, "users"),
        where("pseudoLower", "==", pseudoLower)
      );

      const pseudoSnap = await getDocs(pseudoQuery);

      if (!pseudoSnap.empty) {
        throw {
          customStep: "STEP 1 - PSEUDO CHECK",
          code: "pseudo-already-in-use",
          message: "Ce pseudo est déjà pris.",
        };
      }

      console.log("🟢 STEP 1 OK");

      // ─────────────────────────────────────────────

      console.log("🟡 STEP 2 — Création Auth");

      const credential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
        await credential.user.getIdToken(true); // 👈 IMPORTANT
      const { uid } = credential.user;
     
      await updateProfile(credential.user, {
        displayName: pseudo.trim(),
      });

      console.log("🟢 STEP 2 OK — UID:", uid);

      // ─────────────────────────────────────────────

      console.log("🟡 STEP 3 — Création document users");

      const userDoc = {
        uid,
        pseudo: pseudo.trim(),
        pseudoLower,
        email: email.trim().toLowerCase(),
        isIvorian,
        ethnie: isIvorian ? ethnie : null,
        profil: isIvorian ? null : profil,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        avatarUrl: null,
        bio: null,
        followers: 0,
        following: 0,
      };

      await setDoc(doc(db, "users", uid), userDoc);

      console.log("🟢 STEP 3 OK");

      // ─────────────────────────────────────────────

      console.log("🟡 STEP 4 — Création index pseudo");

      await setDoc(doc(db, "pseudos", pseudoLower), { uid });

      console.log("🟢 STEP 4 OK");

      setLoading(false);
      return { success: true, uid };

    } catch (firebaseErr) {
      console.error("🔥 ERREUR DÉTECTÉE");
      console.error("Full error object:", firebaseErr);
      console.error("Code:", firebaseErr.code);
      console.error("Message:", firebaseErr.message);
      console.error("Custom Step:", firebaseErr.customStep);

      const mapped = {
        success: false,
        step: firebaseErr.customStep || "UNKNOWN STEP",
        code: firebaseErr.code || "unknown",
        message:
          firebaseErr.message ||
          "Erreur inconnue. Vérifie la console pour plus de détails.",
      };

      setError(mapped);
      setLoading(false);
      return mapped;
    }
  }

  return { register, loading, error, resetError };
}