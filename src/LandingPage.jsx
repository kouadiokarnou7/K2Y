import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";
import * as THREE from "three";
import {
  Sparkles, Globe, Users, BookOpen, Camera, MapPin,
  ArrowRight, ChevronDown, Play, Shield, Heart, Layers
} from "lucide-react";

// ── Régions CI (simplifié pour la carte 3D) ───────────────────
const REGIONS_3D = [
  { name:"Savanes",           color:0xE91E8C, pts:[[-6.5,10.7],[-5.2,10.7],[-4.5,10.2],[-4.8,9.4],[-5.5,9.2],[-6.8,9.5],[-7.2,10.1]] },
  { name:"Zanzan",            color:0xF57C00, pts:[[-4.5,10.2],[-3.2,10.5],[-2.6,9.8],[-3.0,8.8],[-4.0,8.6],[-4.8,9.4]] },
  { name:"Denguélé",          color:0xCE93D8, pts:[[-8.0,10.5],[-6.5,10.7],[-7.2,10.1],[-7.8,9.4],[-8.5,9.8]] },
  { name:"Bafing",            color:0xB0BEC5, pts:[[-8.5,9.8],[-7.8,9.4],[-7.2,10.1],[-7.5,8.8],[-8.2,8.6],[-8.8,9.2]] },
  { name:"Worodougou",        color:0xAB47BC, pts:[[-6.8,9.5],[-5.5,9.2],[-5.8,8.4],[-6.5,8.0],[-7.2,8.5],[-7.5,8.8],[-7.2,10.1],[-6.8,9.5]] },
  { name:"Vallée du Bandama", color:0xFF8A65, pts:[[-4.8,9.4],[-4.0,8.6],[-4.5,7.8],[-5.2,7.5],[-5.8,8.4],[-5.5,9.2],[-4.8,9.4]] },
  { name:"Haut-Sassandra",    color:0x64B5F6, pts:[[-7.2,8.5],[-6.5,8.0],[-5.8,8.4],[-6.2,7.4],[-7.0,7.2],[-7.8,7.8],[-7.5,8.8]] },
  { name:"Marahoué",          color:0x4DD0E1, pts:[[-5.8,8.4],[-5.2,7.5],[-5.6,7.0],[-6.2,7.4],[-5.8,8.4]] },
  { name:"Lacs",              color:0x81C784, pts:[[-4.5,7.8],[-4.0,8.6],[-3.0,8.8],[-3.2,7.5],[-4.0,7.0],[-4.8,7.2],[-4.5,7.8]] },
  { name:"N'zi-Comoé",        color:0xFFF176, pts:[[-3.2,7.5],[-3.0,8.8],[-2.6,9.8],[-2.2,8.5],[-2.8,7.0],[-3.5,6.8],[-3.2,7.5]] },
  { name:"Dix-Huit Montagnes",color:0x4CAF50, pts:[[-8.2,8.6],[-7.5,8.8],[-7.8,7.8],[-7.0,7.2],[-7.5,6.5],[-8.5,6.8],[-8.8,7.5]] },
  { name:"Moyen-Cavally",     color:0xD4E157, pts:[[-8.5,6.8],[-7.5,6.5],[-7.0,7.2],[-6.2,6.5],[-6.8,5.8],[-8.0,5.5],[-8.8,6.2]] },
  { name:"Fromager",          color:0xFF7043, pts:[[-6.2,7.4],[-5.6,7.0],[-5.8,6.2],[-6.5,5.8],[-6.8,5.8],[-6.2,6.5],[-7.0,7.2]] },
  { name:"Moyen-Comoé",       color:0x26C6DA, pts:[[-2.6,9.8],[-2.2,8.5],[-2.8,7.0],[-2.5,6.2],[-3.0,5.8],[-3.5,6.8],[-2.8,7.0]] },
  { name:"Sud-Bandama",       color:0x26A69A, pts:[[-5.6,7.0],[-5.2,7.5],[-4.8,7.2],[-4.0,7.0],[-4.2,6.2],[-5.0,5.8],[-5.8,6.2]] },
  { name:"Agnéby",            color:0xEF5350, pts:[[-3.5,6.8],[-2.8,7.0],[-2.5,6.2],[-2.8,5.5],[-3.5,5.2],[-4.2,5.8],[-4.2,6.2],[-3.5,6.8]] },
  { name:"Lagunes",           color:0xFFA726, pts:[[-4.2,6.2],[-4.2,5.8],[-3.5,5.2],[-3.8,4.8],[-4.5,4.8],[-5.0,5.2],[-5.0,5.8],[-4.2,6.2]] },
  { name:"Bas-Sassandra",     color:0xE53935, pts:[[-6.8,5.8],[-6.5,5.8],[-5.8,6.2],[-5.0,5.8],[-5.0,5.2],[-5.5,4.8],[-6.5,4.8],[-7.5,5.0],[-8.0,5.5]] },
  { name:"Sud-Comoé",         color:0x7E57C2, pts:[[-2.8,5.5],[-2.5,6.2],[-2.2,5.5],[-2.5,4.8],[-3.0,4.8],[-3.5,5.2],[-2.8,5.5]] },
];

function geoTo3D(lon, lat) {
  return new THREE.Vector2((lon + 6.0) * 4.5, (lat - 7.5) * 4.5);
}

// ── Carte 3D ──────────────────────────────────────────────────
function IvoryCoast3D({ scale = 1 }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth, H = mount.clientHeight;
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 1000);
    camera.position.set(0, 0, 55 / scale);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const ambient  = new THREE.AmbientLight(0xfff0d0, 0.7);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xFFD700, 1.3);
    dirLight.position.set(10, 20, 30);
    scene.add(dirLight);
    const rimLight = new THREE.DirectionalLight(0xC8973A, 0.5);
    rimLight.position.set(-15, -10, 10);
    scene.add(rimLight);
    const ptLight = new THREE.PointLight(0xFF6B35, 0.9, 120);
    scene.add(ptLight);

    const mapGroup = new THREE.Group();
    scene.add(mapGroup);

    REGIONS_3D.forEach(r => {
      try {
        const shape = new THREE.Shape();
        const pts   = r.pts.map(([lo, la]) => geoTo3D(lo, la));
        shape.moveTo(pts[0].x, pts[0].y);
        pts.slice(1).forEach(p => shape.lineTo(p.x, p.y));
        shape.closePath();

        const geo = new THREE.ExtrudeGeometry(shape, {
          depth: 1.4, bevelEnabled: true,
          bevelThickness: .18, bevelSize: .12, bevelSegments: 3,
        });

        const col     = new THREE.Color(r.color);
        const colSide = new THREE.Color(r.color).multiplyScalar(0.5);

        const mesh = new THREE.Mesh(geo, [
          new THREE.MeshPhongMaterial({ color: col, transparent: true, opacity: .88, shininess: 90, specular: new THREE.Color(0xffffff) }),
          new THREE.MeshPhongMaterial({ color: colSide, transparent: true, opacity: .95, shininess: 40 }),
        ]);
        mesh.position.z = -.7;
        mapGroup.add(mesh);

        const edges = new THREE.LineSegments(
          new THREE.EdgesGeometry(geo, 22),
          new THREE.LineBasicMaterial({ color: 0xC8973A, transparent: true, opacity: .6 })
        );
        edges.position.z = -.7;
        mapGroup.add(edges);
      } catch (_) {}
    });

    // Particules
    const N = 500;
    const pp = new Float32Array(N * 3);
    const pc = new Float32Array(N * 3);
    const pal = [new THREE.Color(0xC8973A), new THREE.Color(0xE8C060), new THREE.Color(0xFF6B35), new THREE.Color(0xFFD700)];
    for (let i = 0; i < N; i++) {
      pp[i*3]   = (Math.random() - .5) * 90;
      pp[i*3+1] = (Math.random() - .5) * 70;
      pp[i*3+2] = (Math.random() - .5) * 45;
      const c = pal[i % 4];
      pc[i*3] = c.r; pc[i*3+1] = c.g; pc[i*3+2] = c.b;
    }
    const pg = new THREE.BufferGeometry();
    pg.setAttribute("position", new THREE.BufferAttribute(pp, 3));
    pg.setAttribute("color",    new THREE.BufferAttribute(pc, 3));
    scene.add(new THREE.Points(pg, new THREE.PointsMaterial({
      size: .3, vertexColors: true, transparent: true, opacity: .6,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })));

    let tgt = { x: .3, y: 0 }, cur = { x: .3, y: 0 };
    let drag = false, prev = { x: 0, y: 0 }, timer = null;
    let auto = true;

    const onMD = e => { drag = true; prev = { x: e.clientX, y: e.clientY }; auto = false; clearTimeout(timer); };
    const onMU = () => { drag = false; timer = setTimeout(() => { auto = true; }, 3000); };
    const onMM = e => {
      if (!drag) return;
      tgt.y += (e.clientX - prev.x) * .012;
      tgt.x += (e.clientY - prev.y) * .012;
      tgt.x = Math.max(-1.3, Math.min(1.3, tgt.x));
      prev = { x: e.clientX, y: e.clientY };
    };
    const onRz = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("mousedown", onMD);
    window.addEventListener("mouseup",   onMU);
    window.addEventListener("mousemove", onMM);
    window.addEventListener("resize",    onRz);

    let raf;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (auto) { tgt.y += .004; tgt.x = .3 + Math.sin(Date.now() * .0005) * .18; }
      cur.x += (tgt.x - cur.x) * .055;
      cur.y += (tgt.y - cur.y) * .055;
      mapGroup.rotation.x = cur.x;
      mapGroup.rotation.y = cur.y;
      ptLight.position.set(Math.sin(Date.now() * .001) * 22, Math.cos(Date.now() * .0007) * 16, 20);
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      window.removeEventListener("mousedown", onMD);
      window.removeEventListener("mouseup",   onMU);
      window.removeEventListener("mousemove", onMM);
      window.removeEventListener("resize",    onRz);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" style={{ cursor: "grab" }} />;
}

// ── Curseur ────────────────────────────────────────────────────
function MagicCursor() {
  const x  = useMotionValue(-100), y  = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 28 });
  const sy = useSpring(y, { stiffness: 500, damping: 28 });
  const tx = useSpring(x, { stiffness: 70, damping: 18 });
  const ty = useSpring(y, { stiffness: 70, damping: 18 });

  useEffect(() => {
    const h = e => { x.set(e.clientX - 6); y.set(e.clientY - 6); };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  return (
    <>
      <motion.div style={{ x: sx, y: sy, position: "fixed", top: 0, left: 0, zIndex: 9999, pointerEvents: "none" }}
        className="w-3 h-3 rounded-full bg-amber-400 mix-blend-screen" />
      <motion.div style={{ x: tx, y: ty, position: "fixed", top: -14, left: -14, zIndex: 9998, pointerEvents: "none" }}
        className="w-10 h-10 rounded-full border border-amber-400/40 mix-blend-screen" />
    </>
  );
}

// ── Stats ──────────────────────────────────────────────────────
const STATS = [
  { value: "19",  label: "Régions culturelles",  icon: MapPin },
  { value: "60+", label: "Groupes ethniques",    icon: Users },
  { value: "5K+", label: "Mémoires archivées",   icon: BookOpen },
  { value: "120", label: "Langues répertoriées", icon: Globe },
];

// ── Features ───────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Globe,
    title: "Carte Vivante",
    desc: "Explorez la Côte d'Ivoire région par région. Cliquez, zoomez, découvrez.",
    color: "#F59E0B",
    delay: 0,
  },
  {
    icon: Sparkles,
    title: "IA Kôrô",
    desc: "Notre intelligence artificielle culturelle répond à vos questions sur les traditions.",
    color: "#8B5CF6",
    delay: 0.1,
  },
  {
    icon: Users,
    title: "Communauté",
    desc: "Partagez vos mémoires, vos histoires, connectez-vous à votre diaspora.",
    color: "#10B981",
    delay: 0.2,
  },
  {
    icon: BookOpen,
    title: "Archives",
    desc: "Des milliers de contes, proverbes et savoirs ancestraux préservés.",
    color: "#EC4899",
    delay: 0.3,
  },
  {
    icon: Camera,
    title: "Galerie",
    desc: "Photos, vidéos et arts visuels de toutes les cultures ivoiriennes.",
    color: "#3B82F6",
    delay: 0.4,
  },
  {
    icon: Shield,
    title: "Patrimoine protégé",
    desc: "Chaque contribution est vérifiée et préservée pour les générations futures.",
    color: "#C8973A",
    delay: 0.5,
  },
];

// ── Témoignages ────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: "Aminata K.",
    role: "Diaspora — Paris",
    avatar: "A",
    color: "#F59E0B",
    text: "K2Y m'a aidée à retrouver les contes que ma grand-mère me racontait. Une plateforme indispensable pour ne pas oublier ses racines.",
  },
  {
    name: "Dr. Jean-Paul M.",
    role: "Chercheur — Université d'Abidjan",
    avatar: "J",
    color: "#8B5CF6",
    text: "La richesse des archives et la précision des données ethnologiques sont impressionnantes. Un outil exceptionnel pour la recherche.",
  },
  {
    name: "Fatou B.",
    role: "Artiste — Bouaké",
    avatar: "F",
    color: "#EC4899",
    text: "J'ai pu documenter et partager les motifs Kente de ma région. La communauté K2Y est bienveillante et passionnée.",
  },
];

// ── Landing Page principale ────────────────────────────────────
export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ background: "#0A0602", color: "#F5E6C8", cursor: "none", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=Cormorant+Garamond:wght@300;400;600&family=Cinzel+Decorative:wght@400&display=swap');
        
        body { cursor: none !important; }
        * { cursor: none !important; }
        
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(200,151,58,0.3); border-radius: 2px; }

        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes gradShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }

        .diamond-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='70' height='70' viewBox='0 0 70 70' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M35 8 L62 35 L35 62 L8 35 Z' fill='none' stroke='%23C8973A' stroke-width='0.6'/%3E%3C/svg%3E");
          background-size: 70px 70px;
        }

        .gold-text {
          background: linear-gradient(135deg, #C8973A, #E8C060, #FFD700, #C8973A);
          background-size: 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradShift 4s ease infinite;
        }

        .glass-dark {
          background: rgba(8,4,1,0.50);
          backdrop-filter: blur(20px) saturate(1.5);
          border: 1px solid rgba(200,151,58,0.2);
          box-shadow: 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(200,151,58,0.12);
        }

        .feature-card {
          background: rgba(8,4,1,0.4);
          border: 1px solid rgba(200,151,58,0.12);
          transition: all 0.4s ease;
        }
        .feature-card:hover {
          background: rgba(200,151,58,0.06);
          border-color: rgba(200,151,58,0.4);
          transform: translateY(-6px);
          box-shadow: 0 20px 50px rgba(200,151,58,0.15);
        }

        .btn-primary {
          background: linear-gradient(135deg, #C8973A 0%, #E8C060 50%, #C8973A 100%);
          background-size: 200%;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }
        .btn-primary::after {
          content: '';
          position: absolute;
          top: 0; left: -100%; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          animation: shimmer 2.5s infinite;
        }
        .btn-primary:hover {
          background-position: 100%;
          box-shadow: 0 12px 40px rgba(200,151,58,0.55);
          transform: translateY(-2px);
        }

        .btn-ghost {
          background: transparent;
          border: 1px solid rgba(200,151,58,0.3);
          transition: all 0.3s ease;
        }
        .btn-ghost:hover {
          background: rgba(200,151,58,0.1);
          border-color: rgba(200,151,58,0.6);
          box-shadow: 0 8px 24px rgba(200,151,58,0.2);
        }

        .nav-link {
          position: relative;
          color: rgba(245,230,200,0.65);
          transition: color 0.3s;
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.95rem;
          letter-spacing: 0.05em;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0;
          width: 0; height: 1px;
          background: #C8973A;
          transition: width 0.3s;
        }
        .nav-link:hover { color: #E8C060; }
        .nav-link:hover::after { width: 100%; }
      `}</style>

      <MagicCursor />

      {/* ── NAVBAR ── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [.25,.8,.25,1] }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          padding: "1.1rem 2.5rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: scrollY > 60 ? "rgba(10,6,2,0.9)" : "transparent",
          backdropFilter: scrollY > 60 ? "blur(20px)" : "none",
          borderBottom: scrollY > 60 ? "1px solid rgba(200,151,58,0.12)" : "none",
          transition: "all 0.4s ease",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
          <div style={{
            width: 42, height: 42, borderRadius: "50%",
            background: "linear-gradient(135deg, #9a7020, #d4af37)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px rgba(200,151,58,0.4)",
          }}>
            <span style={{ fontFamily: "'Cinzel Decorative', serif", color: "#fff", fontSize: "0.9rem" }}>K</span>
          </div>
          <div>
            <div style={{ fontFamily: "'Cinzel Decorative', serif", color: "#E8C060", fontSize: "1rem", letterSpacing: "0.15em" }}>K2Y</div>
            <div style={{ color: "rgba(200,151,58,0.5)", fontSize: "0.45rem", letterSpacing: "0.35em", textTransform: "uppercase" }}>Héritage · Vivant</div>
          </div>
        </div>

        {/* Links */}
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          {["Découvrir", "Communauté", "Archives"].map(l => (
            <a key={l} href="#" className="nav-link">{l}</a>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <Link to="/auth/login">
            <button
              className="btn-ghost"
              style={{
                padding: "0.55rem 1.4rem",
                borderRadius: "4px",
                color: "rgba(245,230,200,0.7)",
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "0.9rem",
                letterSpacing: "0.05em",
              }}
            >
              Connexion
            </button>
          </Link>
          <Link to="/auth/register">
            <button
              className="btn-primary"
              style={{
                padding: "0.55rem 1.5rem",
                borderRadius: "4px",
                color: "#1A0E05",
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                fontWeight: "700",
              }}
            >
              Rejoindre ✦
            </button>
          </Link>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}
      >
        {/* Carte 3D */}
        <IvoryCoast3D />

        {/* Dégradés directionnels */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
          background: "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(10,6,2,0.35) 0%, rgba(10,6,2,0.85) 100%)",
        }} />
        <div style={{
          position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
          background: "linear-gradient(to bottom, rgba(10,6,2,0.6) 0%, transparent 25%, transparent 65%, rgba(10,6,2,1) 100%)",
        }} />

        {/* Filigrane */}
        <div className="diamond-pattern" style={{ position: "absolute", inset: 0, zIndex: 1, opacity: 0.025, pointerEvents: "none" }} />

        {/* Contenu hero */}
        <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "1280px", margin: "0 auto", padding: "0 2.5rem", paddingTop: "6rem" }}>
          <div style={{ maxWidth: "700px" }}>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "0.4rem 1rem",
                border: "1px solid rgba(200,151,58,0.3)",
                borderRadius: "100px",
                background: "rgba(200,151,58,0.08)",
                marginBottom: "1.5rem",
              }}
            >
              <span style={{ color: "#E8C060", fontSize: "0.6rem", letterSpacing: "0.3em", fontFamily: "'Cinzel Decorative', serif" }}>
                ✦ AKWABA — BIENVENUE ✦
              </span>
            </motion.div>

            {/* Titre principal */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
              style={{ fontFamily: "'Playfair Display', serif", lineHeight: 1.05, marginBottom: "1.5rem" }}
            >
              <span style={{ display: "block", fontSize: "clamp(3rem, 7vw, 6rem)", color: "rgba(245,230,200,0.9)", fontWeight: 900 }}>
                La mémoire
              </span>
              <span className="gold-text" style={{ display: "block", fontSize: "clamp(3rem, 7vw, 6rem)", fontWeight: 900 }}>
                vivante de la
              </span>
              <span style={{ display: "block", fontSize: "clamp(3rem, 7vw, 6rem)", color: "rgba(245,230,200,0.9)", fontWeight: 900, fontStyle: "italic" }}>
                Côte d'Ivoire
              </span>
            </motion.h1>

            {/* Sous-titre */}
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.2rem",
                color: "rgba(245,230,200,0.55)",
                lineHeight: 1.75,
                maxWidth: "500px",
                marginBottom: "2.5rem",
              }}
            >
              Explorez, préservez et célébrez le patrimoine culturel ivoirien.
              Des traditions ancestrales aux expressions contemporaines, tout en un seul portail.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
              style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
            >
              <Link to="/auth/register">
                <button
                  className="btn-primary"
                  style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "1rem 2.2rem",
                    borderRadius: "4px",
                    color: "#1A0E05",
                    fontFamily: "'Cinzel Decorative', serif",
                    fontSize: "0.65rem",
                    letterSpacing: "0.2em",
                    fontWeight: "700",
                  }}
                >
                  Rejoindre l'héritage
                  <ArrowRight size={14} />
                </button>
              </Link>
              <Link to="/app">
                <button
                  className="btn-ghost"
                  style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "1rem 2rem",
                    borderRadius: "4px",
                    color: "rgba(245,230,200,0.65)",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  <Play size={14} />
                  Explorer la carte
                </button>
              </Link>
            </motion.div>

            {/* Drapeau CI */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
              style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "3rem" }}
            >
              <div style={{ display: "flex", overflow: "hidden", borderRadius: "3px", width: 36, height: 22, boxShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
                <div style={{ flex: 1, background: "#F77F00" }} />
                <div style={{ flex: 1, background: "#FFFFFF" }} />
                <div style={{ flex: 1, background: "#009A44" }} />
              </div>
              <span style={{ color: "rgba(200,151,58,0.5)", fontSize: "0.6rem", letterSpacing: "0.25em", fontFamily: "'Cinzel Decorative', serif" }}>
                CÔTE D'IVOIRE
              </span>
            </motion.div>
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div
          animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
          style={{
            position: "absolute", bottom: "2.5rem", left: "50%", transform: "translateX(-50%)",
            zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
          }}
        >
          <span style={{ color: "rgba(200,151,58,0.4)", fontSize: "0.5rem", letterSpacing: "0.4em" }}>DÉFILER</span>
          <ChevronDown size={16} color="rgba(200,151,58,0.4)" />
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section style={{ position: "relative", padding: "5rem 2.5rem", borderTop: "1px solid rgba(200,151,58,0.1)" }}>
        <div className="diamond-pattern" style={{ position: "absolute", inset: 0, opacity: 0.015, pointerEvents: "none" }} />
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2rem" }}>
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
              style={{ textAlign: "center" }}
            >
              <s.icon size={20} color="rgba(200,151,58,0.5)" style={{ margin: "0 auto 0.75rem" }} />
              <div className="gold-text" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.8rem", fontWeight: 900, lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", color: "rgba(245,230,200,0.45)", fontSize: "0.85rem", marginTop: "0.5rem", letterSpacing: "0.05em" }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: "6rem 2.5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Titre section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            style={{ textAlign: "center", marginBottom: "4rem" }}
          >
            <div style={{
              display: "inline-block",
              padding: "0.3rem 1rem",
              border: "1px solid rgba(200,151,58,0.25)",
              borderRadius: "100px",
              background: "rgba(200,151,58,0.06)",
              marginBottom: "1rem",
            }}>
              <span style={{ color: "#C8973A", fontSize: "0.58rem", letterSpacing: "0.35em", fontFamily: "'Cinzel Decorative', serif" }}>
                ✦ FONCTIONNALITÉS
              </span>
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4.5vw, 3.5rem)", fontWeight: 900, color: "rgba(245,230,200,0.9)", lineHeight: 1.1, marginBottom: "1rem" }}>
              Un portail complet pour<br />
              <span className="gold-text">votre héritage</span>
            </h2>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", color: "rgba(245,230,200,0.45)", fontSize: "1.1rem", maxWidth: "500px", margin: "0 auto", lineHeight: 1.8 }}>
              De la carte interactive aux archives numériques, K2Y rassemble tout pour explorer et préserver la culture ivoirienne.
            </p>
          </motion.div>

          {/* Grille */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}>
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                className="feature-card"
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: f.delay, duration: 0.6 }}
                style={{ padding: "2rem", borderRadius: "8px" }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: "10px",
                  background: `${f.color}18`,
                  border: `1px solid ${f.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "1.25rem",
                }}>
                  <f.icon size={22} color={f.color} />
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", color: "rgba(245,230,200,0.9)", fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.6rem" }}>
                  {f.title}
                </h3>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", color: "rgba(245,230,200,0.45)", fontSize: "0.95rem", lineHeight: 1.75 }}>
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section style={{ padding: "6rem 2.5rem", position: "relative", overflow: "hidden" }}>
        {/* Glow */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(200,151,58,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "absolute", inset: 0, borderTop: "1px solid rgba(200,151,58,0.1)", borderBottom: "1px solid rgba(200,151,58,0.1)", pointerEvents: "none" }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto", position: "relative", zIndex: 1 }}
        >
          <div style={{ marginBottom: "1.5rem" }}>
            {"AKWABA".split("").map((l, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                  fontWeight: 900,
                  color: "transparent",
                  WebkitTextStroke: "1.5px rgba(200,151,58,0.6)",
                  letterSpacing: "0.12em",
                  display: "inline-block",
                  marginRight: "0.05em",
                }}
              >
                {l}
              </motion.span>
            ))}
          </div>

          <p style={{ fontFamily: "'Cormorant Garamond', serif", color: "rgba(245,230,200,0.5)", fontSize: "1.15rem", lineHeight: 1.8, marginBottom: "2.5rem" }}>
            Rejoignez des milliers de passionnés, chercheurs et membres de la diaspora qui préservent et célèbrent la culture ivoirienne.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/auth/register">
              <button
                className="btn-primary"
                style={{
                  padding: "1.1rem 2.8rem",
                  borderRadius: "4px",
                  color: "#1A0E05",
                  fontFamily: "'Cinzel Decorative', serif",
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  fontWeight: "700",
                }}
              >
                Créer mon sanctuaire ✦
              </button>
            </Link>
            <Link to="/auth/login">
              <button
                className="btn-ghost"
                style={{
                  padding: "1.1rem 2.4rem",
                  borderRadius: "4px",
                  color: "rgba(245,230,200,0.6)",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1rem",
                  letterSpacing: "0.05em",
                }}
              >
                J'ai déjà un compte
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section style={{ padding: "6rem 2.5rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            style={{ textAlign: "center", marginBottom: "3.5rem" }}
          >
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 900, color: "rgba(245,230,200,0.9)" }}>
              Ils font partie de la <span className="gold-text">communauté</span>
            </h2>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                className="glass-dark"
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.6 }}
                style={{ padding: "2rem", borderRadius: "8px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: "50%",
                    background: `linear-gradient(135deg, ${t.color}60, ${t.color}30)`,
                    border: `1px solid ${t.color}40`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Playfair Display', serif",
                    color: t.color, fontSize: "1.1rem", fontWeight: 900,
                  }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", color: "rgba(245,230,200,0.9)", fontWeight: 600, fontSize: "1rem" }}>{t.name}</div>
                    <div style={{ color: "rgba(245,230,200,0.4)", fontSize: "0.75rem", fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.05em" }}>{t.role}</div>
                  </div>
                </div>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", color: "rgba(245,230,200,0.6)", fontSize: "0.98rem", lineHeight: 1.8, fontStyle: "italic" }}>
                  "{t.text}"
                </p>
                <div style={{ marginTop: "1rem", display: "flex", gap: "3px" }}>
                  {[...Array(5)].map((_, j) => (
                    <span key={j} style={{ color: t.color, fontSize: "0.75rem" }}>✦</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: "1px solid rgba(200,151,58,0.12)",
        padding: "3rem 2.5rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: "1.5rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "linear-gradient(135deg, #9a7020, #d4af37)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontFamily: "'Cinzel Decorative', serif", color: "#fff", fontSize: "0.7rem" }}>K</span>
          </div>
          <span style={{ fontFamily: "'Cinzel Decorative', serif", color: "rgba(200,151,58,0.5)", fontSize: "0.75rem", letterSpacing: "0.15em" }}>
            K2Y — Héritage Vivant
          </span>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <div style={{ width: 18, height: 11, display: "flex", overflow: "hidden", borderRadius: "2px" }}>
            <div style={{ flex: 1, background: "#F77F00" }} />
            <div style={{ flex: 1, background: "#FFFFFF" }} />
            <div style={{ flex: 1, background: "#009A44" }} />
          </div>
          <span style={{ color: "rgba(200,151,58,0.4)", fontSize: "0.6rem", letterSpacing: "0.2em", fontFamily: "'Cinzel Decorative', serif" }}>
            CÔTE D'IVOIRE
          </span>
        </div>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", color: "rgba(245,230,200,0.25)", fontSize: "0.8rem" }}>
          © 2024 K2Y — Patrimoine · Culture · Mémoire
        </p>
      </footer>
    </div>
  );
}