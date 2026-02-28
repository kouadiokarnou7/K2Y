import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 import
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseconfig";

export function useLogout() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const navigate = useNavigate(); // 👈 hook pour la navigation

  async function logout() {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);

      // redirection immédiate vers la page login
      navigate("/auth/login"); // 👈 plus besoin de setTimeout sauf si tu veux un délai

      return { success: true };
    } catch (err) {
      const mapped = { success: false, message: "Erreur lors de la déconnexion." };
      setError(mapped);
      return mapped;
    } finally {
      setLoading(false); 
    }
  }

  return { logout, loading, error };
}