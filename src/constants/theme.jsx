
import { Layers, Flame, Crown, Globe, Music, Building2, Utensils, Gem, ScrollText, Star, Leaf } from 'lucide-react';
const G = {
  bg: '#f0ebe0',
  surface: '#ffffff',
  surfaceAlt: '#faf7f2',
  gold: '#b8860b',
  goldLight: '#d4af37',
  goldPale: '#fdf3d0',
  ink: '#1a1410',
  inkMid: '#3d342a',
  inkSoft: '#7a6e62',
  inkMuted: '#b0a898',
  border: 'rgba(184,134,11,0.15)',
  borderSoft: 'rgba(184,134,11,0.08)',
};

const STORIES = [
  { id: 1, author: 'Korhogo', sub: 'Sénoufo', color: '#8E44AD', Icon: Layers },
  { id: 2, author: 'Man', sub: 'Dan · Yacouba', color: '#27AE60', Icon: Flame },
  { id: 3, author: 'Bondoukou', sub: 'Abron', color: '#E67E22', Icon: Crown },
  { id: 4, author: 'Grand-Lahou', sub: 'Adjoukrou', color: '#2980B9', Icon: Globe },
  { id: 5, author: 'Daloa', sub: 'Bété', color: '#C0392B', Icon: Music },
];

const TRENDING = [
  { tag: '#MasquesGoli', count: '2.4k', color: '#8E44AD' },
  { tag: '#TissuKorhogo', count: '1.8k', color: '#E67E22' },
  { tag: '#FêteDipri', count: '1.2k', color: '#2980B9' },
  { tag: '#BalafonsNord', count: '980', color: '#27AE60' },
  { tag: '#OrAgni', count: '756', color: '#F39C12' },
];

const SUGGESTIONS = [
  { name: 'Aya Koné', role: 'Tisserande · Korhogo', color: '#8E44AD', initials: 'AK', followers: '1.2k' },
  { name: 'Koffi Brou', role: 'Griot · Bouaké', color: '#C0392B', initials: 'KB', followers: '890' },
  { name: 'Mariam Traoré', role: 'Danseuse Sénoufo', color: '#16A085', initials: 'MT', followers: '2.1k' },
];

const DEMO_POSTS = [
  {
    id: 1, author: 'Kouamé Assi', location: 'Bouaké · Baoulé', avatar: 'KA', avatarColor: '#C0392B',
    pillar: 'masques', region: 'Vallée du Bandama',
    title: 'Le masque Goli et ses significations cachées',
    content: "Le Goli n'est pas qu'un simple masque festif. Chez les Baoulé, il représente la rencontre entre le monde visible et invisible. Lors des funérailles d'un notable, le porteur du Goli doit être en état de pureté rituelle pendant 7 jours avant la cérémonie. Ma grand-mère me disait que le masque «mange» les malheurs du défunt pour lui ouvrir le chemin de l'au-delà.",
    likes: 47, comments: 12, shares: 8, views: 234, time: 'Il y a 2h', liked: false, saved: false,
  },
  {
    id: 2, author: 'Fatou Coulibaly', location: 'Korhogo · Sénoufo', avatar: 'FC', avatarColor: '#8E44AD',
    pillar: 'textiles', region: 'Savanes',
    title: 'Les secrets du tissu Korhogo',
    content: "Peu de gens savent que chaque symbole sur le tissu Korhogo a une signification précise. Le crocodile symbolise le pouvoir de la chefferie. La tortue, la longévité et la sagesse. Les forgerons qui créent ces tissus appartiennent tous à la société Poro — ils ne peuvent révéler les codes qu'aux initiés.",
    likes: 83, comments: 24, shares: 19, views: 512, time: 'Il y a 5h', liked: true, saved: true,
  },
  {
    id: 3, author: 'Jean-Baptiste Zahi', location: 'Man · Dan', avatar: 'JZ', avatarColor: '#27AE60',
    pillar: 'oral', region: 'Montagnes',
    title: 'Proverbe Dan sur le courage',
    content: "«Gba ke ni to» — Ce que tu portes en toi, personne ne peut te l'arracher.\n\nCe proverbe Dan se dit aux jeunes hommes avant l'initiation forestière. Il signifie que le courage véritable n'est pas dans la force physique, mais dans ce qu'on a construit intérieurement.",
    likes: 156, comments: 31, shares: 44, views: 1240, time: 'Il y a 1 jour', liked: false, saved: false,
  },
  {
    id: 4, author: 'Akissi Brou', location: 'Dabou · Adjoukrou', avatar: 'AB', avatarColor: '#2980B9',
    pillar: 'rites', region: 'Lagunes',
    title: 'Le Dipri de Gomon — une nuit hors du temps',
    content: "Chaque année, dans notre village, il y a une nuit où les règles du monde s'inversent. Le Dipri. Les femmes prennent les rues, les gens marchent sur des braises sans se brûler, certains tombent en transe et révèlent des vérités cachées. Je l'ai vécu une fois. Impossible à décrire avec des mots.",
    likes: 212, comments: 58, shares: 73, views: 3400, time: 'Il y a 3 jours', liked: false, saved: false,
  },
];

const PILLAR_ICONS = {
  architecture: Building2, gastronomie: Utensils, masques: Layers,
  textiles: Gem, oral: ScrollText, rites: Flame,
  musique: Music, social: Crown, bijoux: Star, pharmacopee: Leaf,
};
export {
  G,
  STORIES,
  TRENDING,
  SUGGESTIONS,
  DEMO_POSTS,
  PILLAR_ICONS,
  
};