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

      {/* 5. Ceiling Spotlights for each Exhibit */}
      {/* Flag Spotlight */}
      <spotLight
        position={[-3.3, 4.8, -1.0]}
        target-position={[-3.3, 1.8, -2.4]}
        color="#fff5cc"
        intensity={activeExhibitId === 'flag' ? 35 : 22}
        angle={0.6}
        penumbra={0.6}
        distance={10}
      />

      {/* Coat of Arms / Emblem Spotlight */}
      <spotLight
        position={[0, 4.8, -2.2]}
        target-position={[0, 1.8, -3.8]}
        color="#fff5cc"
        intensity={activeExhibitId === 'emblem' ? 35 : 22}
        angle={0.6}
        penumbra={0.6}
        distance={10}
      />

      {/* Anthem Spotlight */}
      <spotLight
        position={[3.3, 4.8, -1.0]}
        target-position={[3.3, 1.8, -2.4]}
        color="#fff5cc"
        intensity={activeExhibitId === 'anthem' ? 35 : 22}
        angle={0.6}
        penumbra={0.6}
        distance={10}
      />

      {/* Floor glow accent */}
      <pointLight position={[0, 0.5, 0]} color="#00afca" intensity={3} distance={6} />
    </group>
  );
}
