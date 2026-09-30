import React from 'react';

export function MuseumLights({ activeExhibitId }) {
  return (
    <group>
      {/* 1. Global Soft Ambient Lighting */}
      <ambientLight color="#ffffff" intensity={1.5} />

      {/* 2. Hemisphere Light for Natural Museum Fill */}
      <hemisphereLight
        skyColor="#d4edff"
        groundColor="#0a1829"
        intensity={1.0}
      />

      {/* 3. Main Key Light (Ceiling Downlight) */}
      <directionalLight
        position={[0, 8, 4]}
        color="#ffffff"
        intensity={1.8}
      />

      {/* 4. Subtle Fill Light from Front */}
      <directionalLight
        position={[0, 2, 6]}
        color="#00afca"
        intensity={0.6}
      />

      {/* 5. Museum Exhibit Showcase Accent Lights (Front + Top illumination) */}
      {/* Flag Light */}
      <pointLight
        position={[-3.3, 3.2, -1.2]}
        color="#fff4d0"
        intensity={activeExhibitId === 'flag' ? 22 : 12}
        distance={8}
        decay={1.6}
      />

      {/* Emblem Light */}
      <pointLight
        position={[0, 3.2, -2.6]}
        color="#fff4d0"
        intensity={activeExhibitId === 'emblem' ? 22 : 12}
        distance={8}
        decay={1.6}
      />

      {/* Anthem Light */}
      <pointLight
        position={[3.3, 3.2, -1.2]}
        color="#fff4d0"
        intensity={activeExhibitId === 'anthem' ? 22 : 12}
        distance={8}
        decay={1.6}
      />

      {/* Floor glow accent */}
      <pointLight position={[0, 0.4, 0]} color="#00afca" intensity={4} distance={6} decay={1.5} />
    </group>
  );
}
