import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
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
  onFloorClick,
  walkDirection = 0
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
          if (e.target.tagName === 'CANVAS' && onFloorClick) {
            onFloorClick();
          }
        }}
      >
        <color attach="background" args={['#040a12']} />
        <fog attach="fog" args={['#040a12', 12, 28]} />

        {/* 1. Lighting & Architecture always render immediately without suspending */}
        <MuseumLights activeExhibitId={activeExhibit?.id} />
        <MuseumRoom />

        {/* 2. Interactive Camera Controller with Walking & Orbiting */}
        <CameraController
          activeExhibit={activeExhibit}
          walkDirection={walkDirection}
        />

        {/* 3. Exhibits (each with its own instant canvas texture fallback) */}
        <Suspense fallback={null}>
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
        </Suspense>
      </Canvas>
    </div>
  );
}
