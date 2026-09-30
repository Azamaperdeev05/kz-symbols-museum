import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import { MuseumRoom } from './MuseumRoom';
import { MuseumLights } from './MuseumLights';
import { ExhibitItem } from './ExhibitItem';
import { CameraController } from './CameraController';
import { EXHIBITS, MUSEUM_OVERVIEW_CAMERA } from '../data/exhibits';

export function MuseumCanvas({
  activeExhibit,
  hoveredExhibitId,
  onSelectExhibit,
  onHoverExhibit,
  onFloorClick
}) {
  return (
    <div className="canvas-container">
      <Canvas
        camera={{
          fov: 52,
          position: MUSEUM_OVERVIEW_CAMERA.position,
          near: 0.1,
          far: 40
        }}
        dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance'
        }}
        onPointerMissed={(e) => {
          // If clicked empty space / floor
          if (e.target.tagName === 'CANVAS' && onFloorClick) {
            onFloorClick();
          }
        }}
      >
        <color attach="background" args={['#040a12']} />
        <fog attach="fog" args={['#040a12', 12, 28]} />

        <Suspense fallback={null}>
          <MuseumLights activeExhibitId={activeExhibit?.id} />
          <MuseumRoom />

          {EXHIBITS.map((exhibit) => (
            <ExhibitItem
              key={exhibit.id}
              exhibit={exhibit}
              isSelected={activeExhibit?.id === exhibit.id}
              isHovered={hoveredExhibitId === exhibit.id}
              onSelect={onSelectExhibit}
              onHover={onHoverExhibit}
            />
          ))}

          <CameraController
            activeExhibit={activeExhibit}
          />
        </Suspense>
      </Canvas>

      {/* Drei Loader for initial asset loading */}
      <Loader
        dataInterpolation={(p) => `Жүктелуде: ${p.toFixed(0)}%`}
        containerStyles={{
          background: 'radial-gradient(circle at center, #091e36 0%, #030811 100%)',
          zIndex: 999
        }}
        innerStyles={{
          backgroundColor: '#0a1d33',
          border: '1px solid #d4af37'
        }}
        barStyles={{
          backgroundColor: '#fec400',
          height: '6px'
        }}
        dataStyles={{
          color: '#f5d77f',
          fontFamily: 'Outfit, sans-serif',
          fontSize: '15px',
          fontWeight: 600
        }}
      />
    </div>
  );
}
