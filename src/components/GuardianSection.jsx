import React from 'react';

function GuardianSection() {
  return (
    <section style={{ padding: '50px', textAlign: 'center' }}>
      <h2>Devenez Gardien du Savoir</h2>
      <button style={{ backgroundColor: 'green', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px' }}>↓</button>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
        <div style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '10px' }}>Partagez vos histories locales</div>
        <div style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '10px' }}>Sculptez vos artefacts historiques</div>
        <div style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '10px' }}>Sagesse Ancestrale <br /> Bonjour! Comment puis-je aider?</div>
      </div>
    </section>
  );
}

export default GuardianSection;