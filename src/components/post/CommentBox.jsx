import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { G } from '../../constants/theme';

/**
 * Zone de commentaire animée, affichée sous un post.
 *
 * @param {boolean} visible - affiche ou cache la zone
 *
 * Usage :
 *   <CommentBox visible={showComments} />
 */
export default function CommentBox({ visible }) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim()) return;
    // TODO : envoyer le commentaire à Firestore
    setText('');
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{
            overflow: 'hidden',
            borderTop: `1px solid ${G.borderSoft}`,
          }}
        >
          <div
            style={{
              padding: '0.75rem 1rem',
              display: 'flex',
              gap: '0.6rem',
              alignItems: 'center',
            }}
          >
            {/* Avatar utilisateur connecté */}
            <Avatar style={{ width: 30, height: 30, flexShrink: 0 }}>
              <AvatarFallback
                style={{
                  background: `linear-gradient(135deg, ${G.gold}dd, ${G.gold})`,
                  color: '#fff',
                  fontSize: '0.55rem',
                  fontWeight: 700,
                  fontFamily: "'Cinzel', serif",
                }}
              >
                Moi
              </AvatarFallback>
            </Avatar>

            {/* Zone de saisie */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: G.bg,
                borderRadius: 999,
                padding: '0.3rem 0.9rem',
                border: `1px solid ${G.border}`,
              }}
            >
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Votre commentaire…"
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  boxShadow: 'none',
                  padding: 0,
                  color: G.ink,
                  fontSize: '0.78rem',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              />

              {/* Bouton envoyer — apparaît quand du texte est présent */}
              <AnimatePresence>
                {text.trim() && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Button
                      size="icon"
                      onClick={handleSend}
                      style={{
                        width: 26, height: 26,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, #9a7020, ${G.goldLight})`,
                        border: 'none',
                        flexShrink: 0,
                        boxShadow: '0 2px 8px rgba(184,134,11,0.35)',
                      }}
                    >
                      <Send size={11} color="#fff" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}