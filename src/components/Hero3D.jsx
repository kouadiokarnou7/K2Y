import { Canvas } from '@react-three/fiber';
import { Float, OrbitControls, useTexture, Sparkles } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Composant de la Carte CI en 3D
const CIMapShape = () => {
  const meshRef = useRef();

  // Animation subtile de rotation
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  // Création d'une texture procédurale ou utilisation d'une image
  // Ici on simule la forme avec une texture d'image (remplacez par votre image de carte transparente si vous en avez une)
  // Sinon, on utilise une forme abstraite orange et blanche
  
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={meshRef}>
        {/* Base : Forme stylisée représentant la carte (Simplifié pour la démo) */}
        {/* Pour un vrai projet, importez un .glb de la carte de la CI */}
        
        {/* Plan principal avec dégradé Orange/Blanc */}
        <mesh scale={2}>
          <circleGeometry args={[1, 64]} />
          <meshStandardMaterial 
            color="#f97316" // Orange
            metalness={0.2}
            roughness={0.6}
          />
        </mesh>

        {/* Détail central blanc */}
        <mesh scale={1.5} position={[0, 0, 0.01]}>
           <circleGeometry args={[1, 64]} />
           <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.5} />
        </mesh>
        
        {/* Effet de brillance */}
        <Sparkles count={50} scale={3} size={2} speed={0.4} color="#ffffff" />
      </group>
    </Float>
  );
};

const Hero3D = () => {
  return (
    <section id="accueil" className="relative h-screen w-full bg-black overflow-hidden">
      {/* Fond 3D */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#ffffff" />
            <pointLight position={[-10, -10, -5]} color="#f97316" intensity={2} /> {/* Lumière Orange */}
            
            {/* L'objet principal */}
            <CIMapShape />
            
            {/* Contrôles pour que l'utilisateur puisse bouger un peu */}
            <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} />
          </Suspense>
        </Canvas>
      </div>

      {/* Overlay dégradé pour le texte */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 pointer-events-none" />

      {/* Contenu Texte */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <div className="animate-fade-in">
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-4 drop-shadow-lg">
            NOTRE HÉRITAGE <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-white">VIVANT</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8 font-light">
            Explorez les trésors culturels et la géographie immersive de la Côte d'Ivoire.
            </p>
            <div className="flex gap-4 justify-center">
                <a href="#carte" className="px-8 py-3 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30">
                    Commencer l'exploration
                </a>
                <a href="#galerie" className="px-8 py-3 bg-white/10 text-white rounded-full font-semibold backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all">
                    Voir la galerie
                </a>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Hero3D;