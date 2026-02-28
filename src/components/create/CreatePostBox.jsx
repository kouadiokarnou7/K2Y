import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Image, Video, BookOpen, CheckCircle2 } from 'lucide-react';
import { Avatar, AvatarFallback }   from '@/components/ui/avatar';
import { Button }                   from '@/components/ui/button';
import { Input }                    from '@/components/ui/input';
import { Textarea }                 from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { REGIONS, CULTURAL_PILLARS  } from '@/data';
import { G }                        from '@/constants/theme';

/**
 * Boîte de création de post avec formulaire extensible.
 *
 * @param {function} onPost(formData) - appelé avec les données du nouveau post
 *
 * Usage :
 *   <CreatePostBox onPost={handleNewPost} />
 */
export default function CreatePostBox({ onPost }) {
  const [open,   setOpen]   = useState(false);
  const [posted, setPosted] = useState(false);
  const [form,   setForm]   = useState({
    title: '', content: '', pillar: '', region: '',
  });

  const valid = form.title.length > 2 && form.content.length > 15;
  const set   = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const handlePost = () => {
    if (!valid) return;
    onPost(form);
    setForm({ title: '', content: '', pillar: '', region: '' });
    setOpen(false);
    setPosted(true);
    setTimeout(() => setPosted(false), 3500);
  };

  // ── Boutons raccourcis (Photo, Vidéo, Récit) ──
  const SHORTCUTS = [
    { Icon: Image,    label: 'Photo', color: '#27AE60' },
    { Icon: Video,    label: 'Vidéo', color: '#E74C3C' },
    { Icon: BookOpen, label: 'Récit', color: G.gold    },
  ];

  return (
    <div
      style={{
        background: G.surface,
        borderRadius: 16,
        overflow: 'hidden',
        border: `1px solid ${G.border}`,
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        marginBottom: '0.85rem',
      }}
    >

      {/* ── Ligne d'invite ── */}
      <div
        style={{
          padding: '0.85rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        {/* Avatar utilisateur */}
        <Avatar style={{ width: 38, height: 38, flexShrink: 0 }}>
          <AvatarFallback
            style={{
              background: `linear-gradient(135deg, ${G.gold}dd, ${G.gold})`,
              color: '#fff', fontSize: '0.55rem',
              fontWeight: 700, fontFamily: "'Cinzel', serif",
            }}
          >
            Moi
          </AvatarFallback>
        </Avatar>

        {/* Champ d'invite cliquable */}
        <button
          onClick={() => setOpen(true)}
          style={{
            flex: 1, padding: '0.6rem 1rem',
            borderRadius: 999,
            background: G.bg, border: `1px solid ${G.border}`,
            textAlign: 'left', color: G.inkMuted,
            fontSize: '0.78rem', cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = G.gold)}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = G.border)}
        >
          Partagez une tradition, un proverbe, un souvenir…
        </button>
      </div>

      {/* ── Raccourcis Photo / Vidéo / Récit ── */}
      <div
        style={{
          borderTop: `1px solid ${G.borderSoft}`,
          display: 'flex',
        }}
      >
        {SHORTCUTS.map(({ Icon, label, color }) => (
          <Button
            key={label}
            variant="ghost"
            onClick={() => setOpen(true)}
            style={{
              flex: 1, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              gap: 6, padding: '0.6rem',
              height: 'auto', borderRadius: 0,
              color: G.inkSoft, fontSize: '0.7rem', fontWeight: 500,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${color}0a`;
              e.currentTarget.style.color = color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = G.inkSoft;
            }}
          >
            <Icon size={15} /> {label}
          </Button>
        ))}
      </div>

      {/* ── Formulaire extensible ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden', borderTop: `1px solid ${G.borderSoft}` }}
          >
            <div
              style={{
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
              }}
            >
              {/* Titre */}
              <Input
                value={form.title}
                onChange={(e) => set('title')(e.target.value)}
                placeholder="Titre de votre partage…"
                style={{
                  fontFamily: "'Cinzel', serif",
                  background: G.bg,
                  border: `1px solid ${G.border}`,
                  borderRadius: 10,
                  fontSize: '0.8rem',
                  color: G.ink,
                }}
                onFocus={(e) => (e.target.style.borderColor = G.gold)}
                onBlur={(e)  => (e.target.style.borderColor = G.border)}
              />

              {/* Contenu */}
              <Textarea
                value={form.content}
                onChange={(e) => set('content')(e.target.value)}
                rows={3}
                placeholder="Partagez une tradition, une recette, un rite, une histoire…"
                style={{
                  background: G.bg,
                  border: `1px solid ${G.border}`,
                  borderRadius: 10,
                  fontSize: '0.8rem',
                  color: G.ink,
                  resize: 'none',
                  fontFamily: "'DM Sans', sans-serif",
                }}
                onFocus={(e) => (e.target.style.borderColor = G.gold)}
                onBlur={(e)  => (e.target.style.borderColor = G.border)}
              />

              {/* Sélecteurs Pilier + Région */}
              <div style={{ display: 'flex', gap: '0.6rem' }}>

                {/* shadcn Select — Pilier */}
                <Select onValueChange={set('pillar')}>
                  <SelectTrigger
                    style={{
                      flex: 1, background: G.bg,
                      border: `1px solid ${G.border}`,
                      borderRadius: 10, fontSize: '0.8rem', color: G.ink,
                    }}
                  >
                    <SelectValue placeholder="Pilier culturel…" />
                  </SelectTrigger>
                  <SelectContent>
                    {CULTURAL_PILLARS.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* shadcn Select — Région */}
                <Select onValueChange={set('region')}>
                  <SelectTrigger
                    style={{
                      flex: 1, background: G.bg,
                      border: `1px solid ${G.border}`,
                      borderRadius: 10, fontSize: '0.8rem', color: G.ink,
                    }}
                  >
                    <SelectValue placeholder="Région…" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(REGIONS).map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Boutons Annuler / Publier */}
              <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end' }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOpen(false)}
                  style={{ fontSize: '0.72rem', borderColor: G.border, color: G.inkSoft }}
                >
                  Annuler
                </Button>

                <motion.div whileHover={valid ? { scale: 1.02 } : {}} whileTap={valid ? { scale: 0.97 } : {}}>
                  <Button
                    size="sm"
                    disabled={!valid}
                    onClick={handlePost}
                    style={{
                      background: valid
                        ? `linear-gradient(135deg, #9a7020, ${G.goldLight})`
                        : 'rgba(0,0,0,0.07)',
                      color: valid ? '#fff' : G.inkMuted,
                      border: 'none',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      fontFamily: "'Cinzel', serif",
                      letterSpacing: '0.06em',
                      boxShadow: valid ? '0 3px 12px rgba(184,134,11,0.35)' : 'none',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}
                  >
                    <Send size={12} /> Publier
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toast succès ── */}
      <AnimatePresence>
        {posted && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              padding: '0.6rem 1rem',
              background: `${G.gold}12`,
              borderTop: `1px solid ${G.gold}25`,
              display: 'flex', alignItems: 'center', gap: 8,
              color: G.gold, fontSize: '0.7rem',
              fontFamily: "'Cinzel', serif",
            }}
          >
            <CheckCircle2 size={14} /> Publication partagée avec la communauté
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}