import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Composant interne pour gérer l'animation de zoom
const ZoomAnimator = ({ minZoom, maxZoom, duration = 3000 }) => {
  const map = useMap();
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = (elapsed % duration) / duration; // 0 → 1 en boucle
      
      // Ease-in-out pour un mouvement fluide
      const eased = 0.5 - 0.5 * Math.cos(progress * Math.PI);
      const zoom = minZoom + (maxZoom - minZoom) * eased;
      
      map.setZoom(zoom, { animate: true, duration: 0.1 });
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      startTimeRef.current = null;
    };
  }, [map, minZoom, maxZoom, duration]);

  return null;
};

const MapSection = () => {
  // Coordonnées centrales de la Côte d'Ivoire
  const center = [7.5399, -5.5472];
  
  // Limites approximatives de la Côte d'Ivoire pour restreindre le pan
  const bounds = [
    [4.3, -8.6], // Sud-Ouest
    [10.7, -2.5] // Nord-Est
  ];

  return (
    <section id="carte" className="py-20 bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Carte Interactive</h2>
          <p className="text-zinc-400">Plongez dans les détails géographiques du territoire.</p>
        </motion.div>

        <motion.div 
          className="rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl h-[500px]"
          initial={{ scale: 0.98, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <MapContainer 
            center={center} 
            zoom={7} 
            minZoom={6}
            maxZoom={10}
            maxBounds={bounds}
            maxBoundsViscosity={1.0}
            scrollWheelZoom={true}
            dragging={true}
            className="h-full w-full" 
            style={{ background: '#09090b' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            
            {/* Animation de zoom infinie */}
            <ZoomAnimator minZoom={7} maxZoom={9} duration={4000} />
            
            <Marker position={[5.3599, -4.0083]}>
              <Popup>Abidjan - Capitale Économique</Popup>
            </Marker>
            <Marker position={[6.8276, -5.2893]}>
              <Popup>Yamoussoukro - Capitale Politique</Popup>
            </Marker>
          </MapContainer>
        </motion.div>
      </div>
    </section>
  );
};

export default MapSection;