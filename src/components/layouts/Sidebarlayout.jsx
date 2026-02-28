import { G } from '@/constants/theme.jsx';

/**
 * Layout 2 colonnes réutilisable : sidebar fixe à gauche + contenu principal.
 *
 * Usage :
 *   <SidebarLayout sidebar={<MonMenu />}>
 *     <MaPage />
 *   </SidebarLayout>
 *
 * @param {ReactNode} sidebar       - contenu de la colonne gauche
 * @param {ReactNode} children      - contenu principal (droite)
 * @param {number}    sidebarWidth  - largeur sidebar en px (défaut : 240)
 */
export default function SidebarLayout({
  sidebar,
  children,
  sidebarWidth = 240,
}) {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: G.bg,
      }}
    >
      {/* Sidebar fixe */}
      <aside
        style={{
          width: sidebarWidth,
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
          borderRight: `1px solid ${G.border}`,
          background: G.surface,
          padding: '1rem 0.75rem',
        }}
      >
        {sidebar}
      </aside>

      {/* Contenu principal */}
      <main
        style={{
          flex: 1,
          minWidth: 0,
          overflowY: 'auto',
          padding: '1.5rem',
        }}
      >
        {children}
      </main>
    </div>
  );
}