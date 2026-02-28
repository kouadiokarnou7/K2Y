import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseconfig";

/**
 * Contexte global d'authentification.
 * Fournit : { user, userProfile, loading }
 *
 * - user        : objet Firebase Auth (uid, email, …) ou null
 * - userProfile : document Firestore /users/{uid} ou null
 * - loading     : true pendant la résolution initiale
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]               = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    // Écoute les changements de session Firebase
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Charger le profil Firestore associé
        try {
          const snap = await getDoc(doc(db, "users", firebaseUser.uid));
          setUserProfile(snap.exists() ? snap.data() : null);
        } catch (err) {
          console.error("[AuthContext] Erreur chargement profil :", err);
          setUserProfile(null);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook utilitaire pour consommer le contexte.
 * Usage : const { user, userProfile, loading } = useAuth();
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé à l'intérieur d'<AuthProvider>");
  return ctx;
}