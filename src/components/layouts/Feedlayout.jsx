import { motion, AnimatePresence } from 'framer-motion';
import { G } from '@/constants/theme';

/**
 * Layout modal 3 colonnes responsive.
 * Si left ou right est null → colonne masquée automatiquement.
 *
 * @param {ReactNode} navbar
 * @param {ReactNode|null} left    - null sur mobile
 * @param {ReactNode}      center
 * @param {ReactNode|null} right   - null sur mobile/tablette
 * @param {function}       onClose
 */
export default function FeedLayout({ navbar, left, center, right, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        key="feed-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(26,20,16,0.55)',
          backdropFilter: 'blur(18px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0.75rem',
        }}
      >
        <motion.div
          key="feed-panel"
          initial={{ scale: 0.96, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.96, y: 20 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: 1060,
            height: '94vh',
            display: 'flex',
            flexDirection: 'column',
            background: G.bg,
            borderRadius: 20,
            overflow: 'hidden',
            border: `1px solid ${G.border}`,
            boxShadow: '0 40px 100px rgba(26,20,16,0.3)',
          }}
        >
          {/* ── Navbar ── */}
          {navbar}

          {/* ── Body ── */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '1rem',
            scrollbarWidth: 'thin',
            scrollbarColor: `${G.border} transparent`,
          }}>
            <div style={{
              maxWidth: 1020, margin: '0 auto',
              display: 'flex', gap: '1rem',
              alignItems: 'flex-start',
            }}>

              {/* Sidebar gauche — masquée si null */}
              {left && (
                <motion.aside
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ width: 234, flexShrink: 0 }}
                >
                  {left}
                </motion.aside>
              )}

              {/* Feed central */}
              <main style={{ flex: 1, minWidth: 0 }}>
                {center}
              </main>

              {/* Sidebar droite — masquée si null */}
              {right && (
                <motion.aside
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ width: 272, flexShrink: 0 }}
                >
                  {right}
                </motion.aside>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}