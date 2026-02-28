import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, RotateCcw, Sparkles, MessageCircle, Globe, Bot, Navigation, ArrowRight, Volume2, VolumeX, Image } from 'lucide-react';
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

**1. [Nom de la tradition]**
[Description immersive]

**2. [Nom de la tradition]**
[Description immersive]

**3. [Nom de la tradition]**
[Description immersive]

---

### 🗣️ Proverbe Associé
> *"[Proverbe en langue locale si possible]"*

---

### 🎵 Musique du Parcours
**Style/Artiste :** [Nom]

---

### 🏺 Objet Symbolique
**[Nom de l'objet]**

---

### 📖 Anecdote Historique
*[Histoire fascinante]*

---
* termine toujours par une phrase poétique d'invitation au voyage.* ✨`;

// ── 1. COMPOSANT PARTICULES (FOND IMMERSIF) ───────────────────────
const ParticleField = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrameId;
    let mouse = { x: null, y: null };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const handleMouse = (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    };
    window.addEventListener('mousemove', handleMouse);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Interaction souris
        if (mouse.x != null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 100) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const maxDistance = 100;
            const force = (maxDistance - distance) / maxDistance;
            const directionX = forceDirectionX * force * 2;
            const directionY = forceDirectionY * force * 2;
            this.x -= directionX;
            this.y -= directionY;
          }
        }

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      draw() {
        ctx.fillStyle = `rgba(184, 134, 11, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < 80; i++) {
        particles.push(new Particle());
      }
    };
    init();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
        pointerEvents: 'none', zIndex: 0 
      }} 
    />
  );
};

// ── 2. EFFET MACHINE À ÉCRIRE ───────────────────────────────────────
const useTypewriter = (text, speed = 10) => {
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    if (!text) return;
    let i = 0;
    setDisplayText("");
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return displayText;
};

// ── MESSAGE BUBBLE (AVEC IMAGE IMMERSIVE) ─────────────────────────────
function MessageBubble({ msg, isLast }) {
  const isUser = msg.role === 'user';
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showImage, setShowImage] = useState(false);
  
  // Effet de machine à écrire uniquement pour le dernier message de l'IA
  const shouldAnimate = !isUser && isLast;
  const displayedContent = useTypewriter(shouldAnimate ? msg.content : "", 15);
  
  // Contenu réel à afficher (animé ou statique)
  const textToRender = shouldAnimate ? displayedContent : msg.content;
  
  // Détection de la fin du texte pour afficher l'image
  useEffect(() => {
    if (shouldAnimate && displayedContent === msg.content && msg.content.length > 0) {
      // Petit délai avant d'afficher l'image pour l'effet dramatique
      const timer = setTimeout(() => setShowImage(true), 500);
      return () => clearTimeout(timer);
    }
  }, [displayedContent, msg.content, shouldAnimate]);

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(msg.content);
        utterance.lang = 'fr-FR';
        utterance.rate = 0.95;
        utterance.pitch = 0.9;
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  // Génération d'image contextuelle (Unsplash Source)
  // On cherche des images d'Afrique de l'Ouest, Côte d'Ivoire, masques, nature...
  const imageKeywords = "cote+d'ivoire,africa,nature,culture,mask,tradition";
  const imageUrl = `https://source.unsplash.com/600x400/?${imageKeywords}&sig=${Math.random()}`;

  const renderText = (text) => {
    return text.split('\n').map((line, i) => {
      if (!line.trim()) return <div key={i} style={{ height: '0.45rem' }} />;
      if (line.startsWith('## ')) return (
        <div key={i} style={{ 
          fontFamily: "'Cinzel', serif", color: '#b8860b', fontSize: '1.1rem', 
          fontWeight: 700, margin: '1rem 0 0.5rem', letterSpacing: '0.05em', 
          lineHeight: 1.3, textAlign: 'center',
          textShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }}>
          {line.replace('## ', '')}
        </div>
      );
      if (line.startsWith('### ')) return (
        <div key={i} style={{ 
          fontFamily: "'Cinzel', serif", color: '#6a5a48', fontSize: '0.9rem', 
          fontWeight: 600, margin: '1.2rem 0 0.5rem', 
          borderBottom: '2px solid #eaddcf', paddingBottom: '6px',
          display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          {line.replace('### ', '')}
        </div>
      );
      if (line === '---') return (
        <div key={i} style={{ 
          height: '1px', background: 'linear-gradient(90deg, transparent, rgba(184,134,11,0.3), transparent)', 
          margin: '1rem 0' 
        }} />
      );
      if (line.startsWith('> *') && line.endsWith('*')) return (
        <div key={i} style={{ 
          borderLeft: '3px solid #b8860b', paddingLeft: '1rem', 
          color: '#5a5048', fontStyle: 'italic', fontSize: '0.95rem', 
          lineHeight: 1.8, margin: '1rem 0', background: 'rgba(184,134,11,0.04)', 
          padding: '1rem', borderRadius: '0 8px 8px 0',
          boxShadow: '2px 2px 5px rgba(0,0,0,0.03)'
        }}>
          “{line.replace(/^> \*|\*$/g, '')}”
        </div>
      );
      
      const boldReplaced = line.replace(/\*\*([^*]+)\*\*/g, (_, m) => 
        `<strong style="color:#1a1410; font-family:'Cinzel',serif; font-size:0.85rem; font-weight:600">${m}</strong>`
      );
      if (boldReplaced !== line) return (
        <p key={i} style={{ 
          color: isUser ? 'rgba(255,255,255,0.9)' : '#5a5048', fontSize: '0.9rem', 
          lineHeight: 1.8, fontWeight: 400, margin: '0.3rem 0' 
        }} dangerouslySetInnerHTML={{ __html: boldReplaced }} />
      );

      if (line.startsWith('*') && line.endsWith('*')) return (
        <p key={i} style={{ 
          color: isUser ? 'rgba(255,255,255,0.75)' : '#7a6a5a', fontStyle: 'italic', 
          fontSize: '0.85rem', lineHeight: 1.7, margin: '0.5rem 0' 
        }}>
          {line.replace(/^\*|\*$/g, '')}
        </p>
      );

      return (
        <p key={i} style={{ 
          color: isUser ? 'rgba(255,255,255,0.92)' : '#4a4038', fontSize: '0.9rem', 
          lineHeight: 1.8, fontWeight: 400, margin: '0.2rem 0' 
        }}>
          {line}
        </p>
      );
    });
  };

  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: '1.2rem', gap: '10px' }}>
      {!isUser && (
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg,#9a7020,#d4af37)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, alignSelf: 'flex-end', marginBottom: '4px',
          boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
        }}>
          <Bot size={18} color="#fff" strokeWidth={2} />
        </div>
      )}

      <div style={{
        maxWidth: isUser ? '75%' : '85%',
        padding: '1.1rem 1.4rem',
        borderRadius: isUser ? '20px 20px 6px 20px' : '6px 20px 20px 20px',
        background: isUser
          ? 'linear-gradient(135deg,#9a7020,#d4af37)'
          : 'linear-gradient(145deg, #ffffff, #fdfbf7)',
        border: isUser ? 'none' : '1px solid rgba(230,220,200,0.5)',
        boxShadow: isUser
          ? '0 4px 15px rgba(184,134,11,0.3)'
          : '0 5px 15px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.8)',
        position: 'relative',
      }}>
        {renderText(textToRender)}
        
        {/* IMAGE IMMERSIVE À LA FIN */}
        {!isUser && showImage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8 }}
            style={{ marginTop: '1.5rem', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}
          >
            <img 
              src={imageUrl} 
              alt="Illustration culturelle" 
              style={{ width: '100%', display: 'block', filter: 'sepia(0.2) contrast(1.1)' }}
            />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
              padding: '2rem 1rem 0.5rem',
              color: '#fff',
              fontFamily: "'Cinzel', serif",
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              textAlign: 'right'
            }}>
              VISION DU VOYAGE
            </div>
          </motion.div>
        )}

        {!isUser && (
          <button 
            onClick={handleSpeak}
            style={{
              position: 'absolute', bottom: '8px', right: '8px',
              background: isSpeaking ? 'rgba(184,134,11,0.2)' : 'transparent',
              border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '50%',
              color: isSpeaking ? '#b8860b' : '#a0a0a0',
              transition: 'all 0.2s'
            }}
            title={isSpeaking ? "Arrêter" : "Écouter"}
          >
            {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        )}
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
      let systemPrompt = mode === 'parcours' ? SYSTEM_PARCOURS : SYSTEM_QA;
      if (contextRegion && mode !== 'parcours') {
        systemPrompt += `\n\nL'utilisateur explore actuellement la région "${contextRegion}".`;
      }

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: systemPrompt },
            ...newMessages
          ],
          temperature: 0.7,
          max_tokens: 2048,
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Erreur ${response.status}`);
      }

      const data = await response.json();
      const reply = data.choices[0].message.content;
      
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      console.error('Erreur:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `⚠️ Oups, une perturbation spirituelle a eu lieu : ${error.message}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { 
      e.preventDefault(); 
      sendMessage(); 
    }
  };

  const reset = () => { 
    setMode('choice'); 
    setMessages([]); 
    setInput(''); 
  };

  return (
    <>
      {/* FOND PARTICULES GLOBAL */}
      <ParticleField />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'radial-gradient(circle at center, rgba(40,30,20,0.85), rgba(10,5,0,0.98))',
          backdropFilter: 'blur(25px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }}
      >
        <motion.div
          initial={{ scale: 0.9, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 30, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{
            width: '100%', maxWidth: '800px', height: '90vh', maxHeight: '750px',
            display: 'flex', flexDirection: 'column',
            background: 'linear-gradient(180deg, rgba(255,251,245,0.95) 0%, rgba(248,244,237,0.98) 100%)',
            border: '1px solid rgba(184,134,11,0.3)',
            borderRadius: '24px', overflow: 'hidden',
            boxShadow: '0 50px 100px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1) inset',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '1.2rem 2rem',
            borderBottom: '1px solid rgba(184,134,11,0.1)',
            display: 'flex', alignItems: 'center', gap: '1rem',
            background: 'linear-gradient(90deg, rgba(184,134,11,0.05), transparent)',
          }}>
            <div style={{
              width: 45, height: 45, borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, #e6c56a, #8a6210)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(184,134,11,0.4), inset 0 2px 5px rgba(255,255,255,0.3)',
            }}>
              <Sparkles size={20} color="#fff" strokeWidth={1.5} />
            </div>
            <div>
              <div style={{ fontFamily: "'Cinzel', serif", color: '#b8860b', fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Kôrô
              </div>
              <div style={{ color: '#a09080', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: '2px' }}>
                Guide Culturel • Côte d'Ivoire
              </div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
              {mode !== 'choice' && (
                <button onClick={reset} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: '1px solid rgba(184,134,11,0.3)', color: '#8a7a6a', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 500 }}>
                  <RotateCcw size={12} /> Menu
                </button>
              )}
              <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.05)', border: 'none', color: '#8a7a6a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Contenu Principal */}
          {mode === 'choice' ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', gap: '1.5rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Globe size={48} color="#b8860b" strokeWidth={1} style={{ marginBottom: '1rem', opacity: 0.8 }} />
                <h2 style={{ fontFamily: "'Cinzel', serif", color: '#1a1410', fontSize: '1.4rem', fontWeight: 600, marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                  Bienvenue, Voyageur
                </h2>
                <p style={{ color: '#6a6050', fontSize: '0.85rem', maxWidth: '400px', lineHeight: 1.6 }}>
                  Je suis la mémoire des peuples. Comment souhaitez-vous explorer mon héritage ?
                </p>
              </div>

              {[
                { key: 'qa', IconComp: MessageCircle, title: 'Le Dialogue du Sage', desc: "Posez vos questions sur les peuples, les rites et l'histoire.", accent: false },
                { key: 'parcours', IconComp: Navigation, title: 'Le Parcours Immersif', desc: "Laissez-moi vous guider à travers une aventure culturelle complète.", accent: true },
              ].map(item => (
                <motion.button
                  key={item.key}
                  whileHover={{ y: -4, boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setMode(item.key)}
                  style={{
                    width: '100%', maxWidth: '450px', display: 'flex', gap: '1.5rem', alignItems: 'center',
                    background: item.accent ? 'linear-gradient(135deg, rgba(184,134,11,0.1), rgba(255,255,255,0.5))' : '#fff',
                    border: `1px solid ${item.accent ? 'rgba(184,134,11,0.4)' : 'rgba(0,0,0,0.08)'}`,
                    borderRadius: '16px', padding: '1.5rem',
                    cursor: 'pointer', textAlign: 'left', boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
                  }}
                >
                  <div style={{ width: 50, height: 50, borderRadius: '12px', background: item.accent ? 'linear-gradient(135deg, #b8860b, #8a6210)' : '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.accent ? '#fff' : '#666' }}>
                    <item.IconComp size={24} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Cinzel', serif", color: item.accent ? '#8a6210' : '#1a1410', fontSize: '1rem', fontWeight: 600, marginBottom: '0.3rem' }}>{item.title}</div>
                    <div style={{ color: '#6a6050', fontSize: '0.8rem', lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                  <ArrowRight size={20} color={item.accent ? '#b8860b' : '#ccc'} />
                </motion.button>
              ))}
            </div>
          ) : (
            <>
              {mode === 'parcours' && messages.length === 0 && (
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(184,134,11,0.08)', background: 'rgba(255,255,255,0.3)' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                    {QUICK_PROMPTS.map(p => (
                      <button
                        key={p.label}
                        onClick={() => sendMessage(p.prompt)}
                        style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(184,134,11,0.2)', color: '#6a5a48', borderRadius: '20px', padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 500 }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#b8860b'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.8)'; e.currentTarget.style.color = '#6a5a48'; }}
                      >
                        {p.emoji} {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
                {messages.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', opacity: 0.6 }}>
                    <Sparkles size={32} color="#b8860b" style={{ marginBottom: '1rem' }} />
                    <p style={{ fontFamily: "'Cinzel', serif", color: '#8a7a6a', fontSize: '0.9rem' }}>Je vous écoute...</p>
                  </div>
                )}
                {messages.map((m, i) => (
                  <MessageBubble key={i} msg={m} isLast={i === messages.length - 1 && m.role === 'assistant'} />
                ))}
                {loading && (
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#9a7020,#d4af37)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Bot size={18} color="#fff" />
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.8)', padding: '1rem', borderRadius: '20px' }}>
                      <div className="spinner" style={{ width: 20, height: 20, border: '2px solid #b8860b', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(184,134,11,0.08)', background: 'rgba(255,255,255,0.5)' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', background: '#fff', borderRadius: '30px', padding: '0.5rem', border: '1px solid rgba(184,134,11,0.15)', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    rows={1}
                    placeholder={mode === 'parcours' ? "Ex: Parlez-moi du pays Lobi..." : "Posez votre question..."}
                    style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', padding: '0.5rem 1rem', fontSize: '0.95rem', resize: 'none', fontFamily: "'DM Sans', sans-serif", color: '#1a1410' }}
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={loading || !input.trim()}
                    style={{ width: 46, height: 46, borderRadius: '50%', background: input.trim() && !loading ? 'linear-gradient(135deg, #b8860b, #8a6210)' : '#e0e0e0', border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', boxShadow: input.trim() ? '0 4px 12px rgba(184,134,11,0.4)' : 'none' }}
                  >
                    <Send size={18} color="#fff" />
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
      
      {/* Style Global pour l'animation de rotation */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}