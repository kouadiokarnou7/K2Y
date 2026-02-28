import { G } from '@/constants/theme.jsx';

/**
 * Layout générique pleine page pour les autres routes (accueil, carte, profil…).
 *
 * Usage :
 *   <PageLayout>
 *     <MonContenu />
 *   </PageLayout>
 */
export default function PageLayout({ children, style = {} }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: G.bg,
        color: G.ink,
        fontFamily: "'DM Sans', sans-serif",
        ...style,
      }}
    >
      {children}
    </div>
  );
}