import React from 'react';
import ThreeDMap from './ThreeDMap';

function HeroSection() {
  return (
    <section style={{ position: 'relative', height: '60vh', backgroundColor: '#4b5320', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', top: '20%', left: '10%', zIndex: 1 }}>
        <h1 style={{ fontSize: '3rem' }}>Héritage Vivant</h1>
        <p style={{ fontSize: '1.5rem' }}>Explorez les trésors des 31 régions de la Côte d'Ivoire</p>
        <button style={{ backgroundColor: 'orange', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px' }}>Graphik</button>
      </div>
      <ThreeDMap />
      {/* Placeholder points on map */}
      <div style={{ position: 'absolute', top: '30%', right: '40%', backgroundColor: 'white', color: 'black', padding: '5px', borderRadius: '50%' }}>Art Senufo</div>
      <div style={{ position: 'absolute', top: '20%', right: '45%', backgroundColor: 'white', color: 'black', padding: '5px', borderRadius: '50%' }}>Cuisine Dan</div>
    </section>
  );
}

export default HeroSection;