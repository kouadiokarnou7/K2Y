import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, RotateCcw, Sparkles, MessageCircle, Map, Globe, MapIcon, Bot, Navigation, ArrowRight } from 'lucide-react';
import { QUICK_PROMPTS } from './data.js';

const SYSTEM_QA = `Tu es Kôrô, un sage gardien de la mémoire culturelle de la Côte d'Ivoire.
Tu parles avec chaleur, précision et poésie en français.
Tu connais intimement tous les peuples ivoiriens : Sénoufo, Dan/Yacouba, Baoulé, Agni, Ébrié, Bété, Guro, Malinké, Dioula, Lobi, Koulango, Adjoukrou, Attié, Guéré, Wobé, Dida, Neyo, Abron, Avikam...
Sois concis (max 250 mots), vivant, et conclus toujours par un proverbe ivoirien pertinent en italique.`;

const SYSTEM_PARCOURS = `Tu es un générateur de parcours culturels immersifs sur la Côte d'Ivoire.
Tu réponds TOUJOURS en respectant EXACTEMENT cette structure markdown :

## 🗺️ [Titre du parcours évocateur et poétique]

**Peuple(s) à l'honneur :** [noms]
**Région(s) :** [zones géographiques]

---

### ✨ 3 Traditions Clés

**1. [Nom de la tradition]** [emoji]
[Description immersive en 2-3 phrases, présent actif, deuxième personne]

**2. [Nom de la tradition]** [emoji]
[Description immersive 2-3 phrases]

**3. [Nom de la tradition]** [emoji]
[Description immersive 2-3 phrases]

---

### 🗣️ Proverbe Associé
> *"[Proverbe en langue locale si possible, sinon en français]"*
> **Signification :** [explication 1-2 phrases]

---

### 🎵 Musique du Parcours
**Style/Artiste :** [Nom]
[Description de la musique et quand elle résonne, 2 phrases]

---

### 🏺 Objet Symbolique
**[Nom de l'objet]**
[Sa description, son rôle rituel ou social, 2-3 phrases]

---

### 📖 Anecdote Historique
*[Histoire fascinante, vraie, 3-4 phrases à la narration vivante]*

---
*Bonne exploration, voyageur de la mémoire.* ✨`;

// ── Typing dots ───────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: '5px', padding: '0.75rem 1rem', background: 'rgba(184,134,11,0.06)', border: '1px solid rgba(184,134,11,0.14)', borderRadius: '4px 14px 14px 14px', width: 'fit-content' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#b8860b', animation: `bounce 1.3s infinite ${i * 0.22}s` }} />
      ))}
    </div>
  );
}

// ── Message ───────────────────────────────────────────────────
function MessageBubble({ msg }) {
  const isUser = msg.role === 'user';

  const renderText = (text) => {
    return text.split('\n').map((line, i) => {
      if (!line.trim()) return <div key={i} style={{ height: '0.45rem' }} />;
      if (line.startsWith('## ')) return (
        <div key={i} style={{ fontFamily: "'Cinzel', serif", color: '#b8860b', fontSize: '0.95rem', fontWeight: 600, margin: '0.6rem 0 0.3rem', letterSpacing: '0.04em', lineHeight: 1.3 }}>
          {line.replace('## ', '')}
        </div>
      );
      if (line.startsWith('### ')) return (
        <div key={i} style={{ fontFamily: "'Cinzel', serif", color: '#1a1410', fontSize: '0.8rem', fontWeight: 600, margin: '0.8rem 0 0.25rem', borderBottom: '1px solid rgba(184,134,11,0.15)', paddingBottom: '4px' }}>
          {line.replace('### ', '')}
        </div>
      );
      if (line === '---') return <div key={i} style={{ borderTop: '1px solid rgba(184,134,11,0.12)', margin: '0.6rem 0' }} />;
      if (line.startsWith('> *') && line.endsWith('*')) return (
        <div key={i} style={{ borderLeft: '2.5px solid #b8860b', paddingLeft: '0.8rem', color: '#5a5048', fontStyle: 'italic', fontSize: '0.8rem', lineHeight: 1.75, margin: '0.5rem 0', background: 'rgba(184,134,11,0.05)', padding: '0.6rem 0.8rem', borderRadius: '0 6px 6px 0' }}>
          {line.replace(/^> \*|\*$/g, '')}
        </div>
      );
      if (line.startsWith('> **')) return (
        <div key={i} style={{ paddingLeft: '1.1rem', color: '#7a6e62', fontSize: '0.78rem', lineHeight: 1.7 }}>
          {line.replace(/^> \*\*|\*\*$/g, '')}
        </div>
      );
      const boldReplaced = line.replace(/\*\*([^*]+)\*\*/g, (_, m) => `<strong style="color:#1a1410;font-family:'Cinzel',serif;font-size:0.79rem;font-weight:600">${m}</strong>`);
      if (boldReplaced !== line) return (
        <p key={i} style={{ color: isUser ? 'rgba(255,255,255,0.9)' : '#5a5048', fontSize: '0.82rem', lineHeight: 1.82, fontWeight: 300, margin: '0.15rem 0' }} dangerouslySetInnerHTML={{ __html: boldReplaced }} />
      );
      if (line.startsWith('*') && line.endsWith('*')) return (
        <p key={i} style={{ color: isUser ? 'rgba(255,255,255,0.75)' : '#8a7a6a', fontStyle: 'italic', fontSize: '0.78rem', lineHeight: 1.7, margin: '0.5rem 0' }}>
          {line.replace(/^\*|\*$/g, '')}
        </p>
      );
      return (
        <p key={i} style={{ color: isUser ? 'rgba(255,255,255,0.92)' : '#5a5048', fontSize: '0.83rem', lineHeight: 1.82, fontWeight: 300, margin: '0.1rem 0' }}>
          {line}
        </p>
      );
    });
  };

  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: '0.85rem' }}>
      {!isUser && (
        <div style={{
          width: 30, height: 30, borderRadius: '50%',
          background: 'linear-gradient(135deg,#9a7020,#d4af37)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, marginRight: '8px', alignSelf: 'flex-start', marginTop: '4px',
          boxShadow: '0 2px 8px rgba(184,134,11,0.3)',
        }}>
          <Bot size={14} color="#fff" strokeWidth={2} />
        </div>
      )}
      <div style={{
        maxWidth: isUser ? '80%' : '90%',
        padding: '0.85rem 1.1rem',
        borderRadius: isUser ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
        background: isUser
          ? 'linear-gradient(135deg,#9a7020,#d4af37)'
          : 'rgba(255,255,255,0.75)',
        border: isUser ? 'none' : '1px solid rgba(184,134,11,0.15)',
        boxShadow: isUser
          ? '0 3px 14px rgba(184,134,11,0.3)'
          : '0 2px 8px rgba(0,0,0,0.05)',
        backdropFilter: isUser ? 'none' : 'blur(8px)',
      }}>
        {renderText(msg.content)}
      </div>
    </div>
  );
}

// ── AIModal ───────────────────────────────────────────────────
export default function AIModal({ onClose, contextRegion }) {
  const [mode, setMode] = useState('choice');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (mode !== 'choice') {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [mode]);

  const sendMessage = async (text) => {
    const content = (text || input).trim();
    if (!content || loading) return;
    setInput('');
    const newMessages = [...messages, { role: 'user', content }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1100,
          system: mode === 'parcours' ? SYSTEM_PARCOURS : SYSTEM_QA + (contextRegion ? `\n\nL'utilisateur explore actuellement la région "${contextRegion}".` : ''),
          messages: newMessages,
        }),
      });
      const json = await res.json();
      const reply = json.content?.[0]?.text || "Je n'ai pas pu répondre. Réessayez.";
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Erreur de connexion. Vérifiez votre réseau et réessayez." }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const reset = () => { setMode('choice'); setMessages([]); setInput(''); };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(26,20,16,0.65)',
        backdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
      }}
    >
      <motion.div
        initial={{ scale: 0.96, y: 18 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 18 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: '100%', maxWidth: '740px', height: '88vh', maxHeight: '700px',
          display: 'flex', flexDirection: 'column',
          background: '#fdf9f1',
          border: '1px solid rgba(184,134,11,0.25)',
          borderRadius: '18px', overflow: 'hidden',
          boxShadow: '0 40px 100px rgba(26,20,16,0.3), 0 0 0 1px rgba(184,134,11,0.1)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.1rem 1.5rem',
          borderBottom: '1px solid rgba(184,134,11,0.12)',
          display: 'flex', alignItems: 'center', gap: '1rem',
          flexShrink: 0,
          background: 'linear-gradient(135deg, rgba(184,134,11,0.05), transparent)',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: '12px',
            background: 'linear-gradient(135deg,#9a7020,#d4af37)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 3px 12px rgba(184,134,11,0.35)',
          }}>
            <Sparkles size={18} color="#fff" strokeWidth={1.8} />
          </div>
          <div>
            <div style={{ fontFamily: "'Cinzel', serif", color: '#b8860b', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.07em' }}>
              Kôrô — IA Culturelle
            </div>
            <div style={{ color: '#b0a898', fontSize: '0.56rem', letterSpacing: '0.22em', textTransform: 'uppercase', marginTop: '2px', fontFamily: "'Cinzel', serif" }}>
              {mode === 'choice' ? 'Choisissez votre mode' : mode === 'qa' ? 'Questions & Réponses' : 'Parcours Immersif'}
              {contextRegion && mode !== 'choice' ? ` · ${contextRegion}` : ''}
            </div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
            {mode !== 'choice' && (
              <button
                onClick={reset}
                style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(184,134,11,0.07)', border: '1px solid rgba(184,134,11,0.2)', color: '#8a7a6a', padding: '0.3rem 0.75rem', borderRadius: '6px', fontSize: '0.6rem', cursor: 'pointer', letterSpacing: '0.1em', fontFamily: "'Cinzel', serif" }}
              >
                <RotateCcw size={11} /> Changer
              </button>
            )}
            <button
              onClick={onClose}
              style={{ width: 34, height: 34, borderRadius: '8px', background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(184,134,11,0.15)', color: '#8a7a6a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.08)'; e.currentTarget.style.color = '#1a1410'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = '#8a7a6a'; }}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Écran choix */}
        {mode === 'choice' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2.5rem', gap: '1rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(184,134,11,0.12),rgba(184,134,11,0.05))', border: '1.5px solid rgba(184,134,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Globe size={28} color="#b8860b" strokeWidth={1.4} />
              </div>
              <div style={{ fontFamily: "'Cinzel', serif", color: '#1a1410', fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.45rem', letterSpacing: '0.04em' }}>
                Que souhaitez-vous explorer ?
              </div>
              <div style={{ color: '#b0a898', fontSize: '0.68rem', letterSpacing: '0.14em' }}>
                Deux façons de voyager dans la culture ivoirienne
              </div>
            </div>

            {[
              {
                key: 'qa', IconComp: MessageCircle, iconBg: 'rgba(0,0,0,0.06)', iconColor: '#7a6e62',
                title: 'Poser une Question à Kôrô',
                desc: "Interrogez le sage sur n'importe quel peuple, tradition, rite ou histoire de Côte d'Ivoire. Il répond avec précision et poésie.",
                accent: false,
              },
              {
                key: 'parcours', IconComp: Navigation, iconBg: 'rgba(184,134,11,0.18)', iconColor: '#b8860b',
                title: 'Générateur de Parcours Immersif',
                desc: "L'IA crée un voyage guidé : 3 traditions, 1 proverbe, 1 musique, 1 objet symbolique et 1 anecdote historique.",
                accent: true,
              },
            ].map(item => (
              <motion.button
                key={item.key}
                whileHover={{ y: -3, boxShadow: '0 10px 28px rgba(184,134,11,0.18)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setMode(item.key)}
                style={{
                  width: '100%', maxWidth: '480px', display: 'flex', gap: '1.25rem', alignItems: 'center',
                  background: item.accent ? 'rgba(184,134,11,0.07)' : 'rgba(0,0,0,0.025)',
                  border: item.accent ? '1px solid rgba(184,134,11,0.3)' : '1px solid rgba(184,134,11,0.14)',
                  borderRadius: '14px', padding: '1.25rem 1.5rem',
                  cursor: 'pointer', textAlign: 'left',
                }}
              >
                <div style={{ width: 52, height: 52, borderRadius: 14, background: item.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${item.accent ? 'rgba(184,134,11,0.25)' : 'rgba(0,0,0,0.07)'}` }}>
                  <item.IconComp size={24} color={item.iconColor} strokeWidth={1.6} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Cinzel', serif", color: item.accent ? '#b8860b' : '#1a1410', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.45rem', letterSpacing: '0.04em' }}>
                    {item.title}
                  </div>
                  <div style={{ color: item.accent ? '#9a7840' : '#7a6e62', fontSize: '0.73rem', lineHeight: 1.65 }}>
                    {item.desc}
                  </div>
                </div>
                <ArrowRight size={16} color={item.accent ? '#b8860b' : '#c8b898'} />
              </motion.button>
            ))}
          </div>
        )}

        {/* Chat */}
        {mode !== 'choice' && (
          <>
            {/* Raccourcis */}
            {mode === 'parcours' && messages.length === 0 && (
              <div style={{ padding: '0.9rem 1.5rem', borderBottom: '1px solid rgba(184,134,11,0.1)', flexShrink: 0, background: 'rgba(184,134,11,0.03)' }}>
                <div style={{ color: '#b0a898', fontSize: '0.56rem', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: '0.65rem', fontFamily: "'Cinzel', serif" }}>
                  Raccourcis de parcours
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {QUICK_PROMPTS.map(p => (
                    <button
                      key={p.label}
                      onClick={() => sendMessage(p.prompt)}
                      style={{ background: 'rgba(184,134,11,0.08)', border: '1px solid rgba(184,134,11,0.22)', color: '#9a7020', borderRadius: '999px', padding: '5px 14px', fontSize: '0.62rem', cursor: 'pointer', transition: 'all 0.16s', letterSpacing: '0.04em', fontFamily: "'DM Sans', sans-serif" }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(184,134,11,0.18)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(184,134,11,0.08)'; }}
                    >
                      {p.emoji} {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(184,134,11,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', opacity: 0.4 }}>{mode === 'parcours' ? <Navigation size={24} color='#b8860b' /> : <MessageCircle size={24} color='#b8860b' />}</div>
                  <div style={{ fontFamily: "'Cinzel', serif", color: '#b0a898', fontSize: '0.8rem', letterSpacing: '0.08em' }}>
                    {mode === 'parcours' ? 'Choisissez un raccourci ou décrivez votre intérêt' : 'Posez votre question au sage Kôrô'}
                  </div>
                </div>
              )}
              {messages.map((m, i) => <MessageBubble key={i} msg={m} />)}
              {loading && <TypingDots />}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{
              padding: '0.9rem 1.25rem',
              borderTop: '1px solid rgba(184,134,11,0.12)',
              flexShrink: 0, display: 'flex', gap: '8px', alignItems: 'flex-end',
              background: 'rgba(184,134,11,0.02)',
            }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                rows={1}
                placeholder={mode === 'parcours' ? "Ex: Je viens de l'Est, je m'intéresse à l'or Agni…" : "Demandez à Kôrô…"}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(184,134,11,0.22)',
                  borderRadius: '12px', padding: '0.75rem 1rem',
                  color: '#1a1410', fontSize: '0.83rem',
                  resize: 'none', fontFamily: "'DM Sans', sans-serif",
                  lineHeight: 1.55, minHeight: '44px', maxHeight: '120px',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(184,134,11,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(184,134,11,0.08)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(184,134,11,0.22)'; e.target.style.boxShadow = 'none'; }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                style={{
                  width: 44, height: 44, borderRadius: '12px',
                  background: input.trim() && !loading ? 'linear-gradient(135deg,#9a7020,#d4af37)' : 'rgba(0,0,0,0.06)',
                  border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, transition: 'all 0.2s',
                  boxShadow: input.trim() && !loading ? '0 3px 12px rgba(184,134,11,0.35)' : 'none',
                }}
              >
                <Send size={16} color={input.trim() && !loading ? '#fff' : '#b0a898'} />
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
