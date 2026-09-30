import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { MUSEUM_OVERVIEW_CAMERA } from '../data/exhibits';

export function CameraController({ activeExhibit, onUserStartOrbit }) {
  const controlsRef = useRef();
  const { camera } = useThree();

  // Targets
  const targetPosRef = useRef(new THREE.Vector3(...MUSEUM_OVERVIEW_CAMERA.position));
  const targetLookAtRef = useRef(new THREE.Vector3(...MUSEUM_OVERVIEW_CAMERA.target));
  const isTransitioningRef = useRef(false);
  const transitionStartRef = useRef(0);

  // Set initial camera position once
  useEffect(() => {
    camera.position.set(...MUSEUM_OVERVIEW_CAMERA.position);
    if (controlsRef.current) {
      controlsRef.current.target.set(...MUSEUM_OVERVIEW_CAMERA.target);
      controlsRef.current.update();
    }
  }, [camera]);

  // When activeExhibit changes, start smooth camera flight
  useEffect(() => {
    if (activeExhibit) {
      targetPosRef.current.set(...activeExhibit.cameraPosition);
      targetLookAtRef.current.set(...activeExhibit.cameraTarget);
    } else {
      targetPosRef.current.set(...MUSEUM_OVERVIEW_CAMERA.position);
      targetLookAtRef.current.set(...MUSEUM_OVERVIEW_CAMERA.target);
    }
    isTransitioningRef.current = true;
    transitionStartRef.current = performance.now();
  }, [activeExhibit]);

  // Interpolate camera smoothly on each frame during transition
  useFrame((state, delta) => {
    if (!controlsRef.current) return;

    if (isTransitioningRef.current) {
      const elapsed = performance.now() - transitionStartRef.current;
      // Smooth damp factor
      const t = Math.min(delta * 4.5, 0.2);

      camera.position.lerp(targetPosRef.current, t);
      controlsRef.current.target.lerp(targetLookAtRef.current, t);
      controlsRef.current.update();

      // Check if camera has reached close enough or timed out (1.8s)
      const distPos = camera.position.distanceTo(targetPosRef.current);
      const distTarget = controlsRef.current.target.distanceTo(targetLookAtRef.current);

      if ((distPos < 0.04 && distTarget < 0.04) || elapsed > 1800) {
        camera.position.copy(targetPosRef.current);
        controlsRef.current.target.copy(targetLookAtRef.current);
        controlsRef.current.update();
        isTransitioningRef.current = false;
      }
    } else {
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      target={MUSEUM_OVERVIEW_CAMERA.target}
      enableDamping={true}
      dampingFactor={0.06}
      rotateSpeed={0.8}
      enablePan={false}
      minDistance={1.8}
      maxDistance={7.0}
      minPolarAngle={Math.PI / 4.5}
      maxPolarAngle={Math.PI / 2 + 0.02}
      onStart={() => {
        // If user touches/drags, release programmatic flight control to user
        isTransitioningRef.current = false;
        if (onUserStartOrbit) onUserStartOrbit();
      }}
    />
  );
}
