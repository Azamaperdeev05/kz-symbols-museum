import React from 'react';

export function MuseumLights({ activeExhibitId }) {
  return (
    <group>
      {/* 1. Global Soft Ambient Lighting */}
      <ambientLight color="#eaf2fc" intensity={0.9} />

      {/* 2. Main Key Light (Soft Warm Directional) */}
      <directionalLight
        position={[0, 7, 3]}
        color="#ffffff"
        intensity={1.2}
      />

      {/* 3. Subtle Fill Light from Front */}
      <directionalLight
        position={[0, 2, 6]}
        color="#00afca"
        intensity={0.3}
      />

      {/* 4. Ceiling Spotlights for each Exhibit */}
      {/* Flag Spotlight */}
      <spotLight
        position={[-3.3, 4.8, -1.0]}
        target-position={[-3.3, 1.8, -2.4]}
        color="#fff5cc"
        intensity={activeExhibitId === 'flag' ? 25 : 16}
        angle={0.55}
        penumbra={0.6}
        distance={9}
      />

      {/* Coat of Arms / Emblem Spotlight */}
      <spotLight
        position={[0, 4.8, -2.2]}
        target-position={[0, 1.8, -3.8]}
        color="#fff5cc"
        intensity={activeExhibitId === 'emblem' ? 25 : 16}
        angle={0.55}
        penumbra={0.6}
        distance={9}
      />

      {/* Anthem Spotlight */}
      <spotLight
        position={[3.3, 4.8, -1.0]}
        target-position={[3.3, 1.8, -2.4]}
        color="#fff5cc"
        intensity={activeExhibitId === 'anthem' ? 25 : 16}
        angle={0.55}
        penumbra={0.6}
        distance={9}
      />

      {/* Soft floor glow point lights */}
      <pointLight position={[0, 0.4, 0]} color="#00afca" intensity={2} distance={5} />
    </group>
  );
}
