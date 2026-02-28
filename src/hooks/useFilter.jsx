import { useState } from 'react';

// Filtres "globaux" qui affichent tous les posts
const GLOBAL_FILTERS = ['all', 'explore', 'people'];

/**
 * Gère le filtre actif et calcule les posts filtrés.
 *
 * Usage :
 *   const { filter, setFilter, getFilteredPosts } = useFilter();
 *   const filteredPosts = getFilteredPosts(posts);
 */
export function useFilter() {
  const [filter, setFilter] = useState('all');

  /**
   * Retourne les posts selon le filtre actif :
   * - 'all' / 'explore' / 'people' → tous les posts
   * - 'saved'                       → posts sauvegardés
   * - autre valeur                  → filtre par pilier culturel
   */
  const getFilteredPosts = (posts) => {
    if (GLOBAL_FILTERS.includes(filter)) return posts;
    if (filter === 'saved') return posts.filter((p) => p.saved);
    return posts.filter((p) => p.pillar === filter);
  };

  return { filter, setFilter, getFilteredPosts };
}