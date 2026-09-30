import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { MUSEUM_OVERVIEW_CAMERA } from '../data/exhibits';

export function CameraController({ activeExhibit, onUserStartOrbit, walkDirection = 0 }) {
  const controlsRef = useRef();
  const { camera } = useThree();

  // Programmatic flight targets
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

  // Interpolate camera smoothly on each frame + handle continuous walking
  useFrame((state, delta) => {
    if (!controlsRef.current) return;
    const cam = state.camera;

    // 1. Continuous Left / Right Walking (from touch-hold buttons, mobile swipe, or A/D keys)
    if (walkDirection !== 0) {
      isTransitioningRef.current = false;
      const speed = delta * 3.6; // comfortable walking speed
      const target = controlsRef.current.target;

      // Camera horizontal right vector
      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(cam.quaternion);
      right.y = 0;
      right.normalize();

      // Lateral step vector (walkDirection: -1 is left, 1 is right)
      const moveVec = right.clone().multiplyScalar(walkDirection * speed);

      // Arc angle around room center for natural gallery walk feeling
      const angle = -walkDirection * delta * 1.25;
      const offset = cam.position.clone().sub(target);
      offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);

      const nextPos = target.clone().add(offset).add(moveVec.multiplyScalar(0.4));
      const nextTarget = target.clone().add(moveVec.multiplyScalar(0.3));

      // Keep camera inside room boundaries (radius < 7.2m, height 1.2m - 3.8m)
      const distFromCenter = Math.sqrt(nextPos.x * nextPos.x + nextPos.z * nextPos.z);
      if (distFromCenter < 7.2) {
        cam.position.x = nextPos.x;
        cam.position.z = nextPos.z;
      }
      cam.position.y = THREE.MathUtils.clamp(nextPos.y, 1.4, 3.5);

      // Keep target within focal boundary
      const targetDist = Math.sqrt(nextTarget.x * nextTarget.x + nextTarget.z * nextTarget.z);
      if (targetDist < 4.8) {
        target.x = nextTarget.x;
        target.z = nextTarget.z;
      }

      controlsRef.current.update();
      return;
    }

    // 2. Programmatic transition to/from exhibits
    if (isTransitioningRef.current) {
      const elapsed = performance.now() - transitionStartRef.current;
      const t = Math.min(delta * 4.5, 0.2);

      cam.position.lerp(targetPosRef.current, t);
      controlsRef.current.target.lerp(targetLookAtRef.current, t);
      controlsRef.current.update();

      const distPos = cam.position.distanceTo(targetPosRef.current);
      const distTarget = controlsRef.current.target.distanceTo(targetLookAtRef.current);

      if ((distPos < 0.04 && distTarget < 0.04) || elapsed > 1800) {
        cam.position.copy(targetPosRef.current);
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
      enablePan={true}
      screenSpacePanning={true}
      panSpeed={1.0}
      touches={{
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN
      }}
      minDistance={1.2}
      maxDistance={9.5}
      minPolarAngle={Math.PI / 4.5}
      maxPolarAngle={Math.PI / 2 + 0.04}
      onStart={() => {
        isTransitioningRef.current = false;
        if (onUserStartOrbit) onUserStartOrbit();
      }}
    />
  );
}
