import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseconfig";

/**
 * useLogin
 * --------
 * Connexion par email OU par pseudo + mot de passe.
 *
 * Logique :
 *   - Si l'identifiant contient "@"  → connexion directe par email
 *   - Sinon                          → lookup dans /pseudos/{pseudoLower}
 *                                      pour récupérer l'email lié, puis connexion
 *
 * @returns {{ login, loading, error, resetError }}
 *
 * login(identifier, password) :
 *   identifier : email ou pseudo
 *   password   : string
 *
 * Retourne { success: true, uid } ou { success: false, code, message }
 */
export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const resetError = () => setError(null);

  async function login(identifier, password) {
    setLoading(true);
    setError(null);

    try {
      let emailToUse = identifier.trim();

      // ── Résolution pseudo → email ──────────────────────────────────────
      if (!emailToUse.includes("@")) {
        const pseudoLower = emailToUse.toLowerCase();
        const pseudoSnap  = await getDoc(doc(db, "pseudos", pseudoLower));

        if (!pseudoSnap.exists()) {
          const err = {
            success: false,
            code: "pseudo-not-found",
            message: "Aucun compte trouvé avec ce pseudo.",
          };
          setError(err);
          setLoading(false);
          return err;
        }

        const { uid } = pseudoSnap.data();

        // Récupérer l'email depuis /users/{uid}
        const userSnap = await getDoc(doc(db, "users", uid));
        if (!userSnap.exists()) {
          const err = {
            success: false,
            code: "user-profile-missing",
            message: "Profil introuvable. Contacte le support.",
          };
          setError(err);
          setLoading(false);
          return err;
        }

        emailToUse = userSnap.data().email;
      }

      // ── Connexion Firebase Auth ────────────────────────────────────────
      const credential = await signInWithEmailAndPassword(auth, emailToUse, password);

      setLoading(false);
      return { success: true, uid: credential.user.uid };

    } catch (firebaseErr) {
      const mapped = mapFirebaseError(firebaseErr.code);
      setError(mapped);
      setLoading(false);
      return mapped;
    }
  }

  return { login, loading, error, resetError };
}

// ── Mapping erreurs Firebase ────────────────────────────────────────────────
function mapFirebaseError(code) {
  const messages = {
    "auth/user-not-found":         "Aucun compte trouvé avec cet email.",
    "auth/wrong-password":         "Mot de passe incorrect.",
    "auth/invalid-credential":     "Identifiant ou mot de passe incorrect.",
    "auth/invalid-email":          "Format d'email invalide.",
    "auth/user-disabled":          "Ce compte a été désactivé.",
    "auth/too-many-requests":      "Trop de tentatives. Réessaie dans quelques minutes.",
    "auth/network-request-failed": "Problème de connexion. Vérifie ta connexion internet.",
  };
  return {
    success: false,
    code,
    message: messages[code] ?? "Une erreur inattendue est survenue. Réessaie.",
  };
}