import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import { createFallbackCanvasTexture } from '../utils/textureHelper';

export function ExhibitItem({ exhibit, isSelected, isHovered, onSelect, onHover }) {
  const groupRef = useRef();
  const [texture, setTexture] = useState(() =>
    createFallbackCanvasTexture(exhibit.name, exhibit.title)
  );

  // Load texture safely with fallback
  useEffect(() => {
    let isMounted = true;
    const loader = new THREE.TextureLoader();
    loader.load(
      exhibit.image,
      (loadedTexture) => {
        if (isMounted) {
          loadedTexture.colorSpace = THREE.SRGBColorSpace;
          loadedTexture.needsUpdate = true;
          setTexture(loadedTexture);
        }
      },
      undefined,
      (err) => {
        console.warn(`[Museum] Image ${exhibit.image} not found. Fallback texture active.`, err);
      }
    );
    return () => {
      isMounted = false;
    };
  }, [exhibit.image, exhibit.name, exhibit.title]);

  // Subtle floating / pulse animation when hovered or selected
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    if (isSelected) {
      // Gentle breathing scale
      const s = 1 + Math.sin(state.clock.elapsedTime * 2.5) * 0.015;
      groupRef.current.scale.lerp(new THREE.Vector3(s, s, s), delta * 4);
    } else if (isHovered) {
      groupRef.current.scale.lerp(new THREE.Vector3(1.025, 1.025, 1.025), delta * 4);
    } else {
      groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 4);
    }
  });

  // Exhibit specific frame sizes
  const frameWidth = exhibit.id === 'flag' ? 2.1 : exhibit.id === 'coat-of-arms' ? 1.7 : 1.5;
  const frameHeight = exhibit.id === 'flag' ? 1.3 : exhibit.id === 'coat-of-arms' ? 1.7 : 1.9;
  const pictureWidth = frameWidth - 0.16;
  const pictureHeight = frameHeight - 0.16;

  return (
    <group
      ref={groupRef}
      position={exhibit.pedestalPosition}
      rotation={[0, exhibit.rotationY, 0]}
    >
      {/* 1. Architectural Pedestal Base */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.9, 0.7]} />
        <meshStandardMaterial
          color="#162335"
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>

      {/* Pedestal Top Plinth with Gold Edge */}
      <mesh position={[0, 0.92, 0]}>
        <boxGeometry args={[1.26, 0.05, 0.76]} />
        <meshStandardMaterial
          color="#d4af37"
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Pedestal Bottom Base Step */}
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[1.36, 0.08, 0.86]} />
        <meshStandardMaterial
          color="#0f1926"
          roughness={0.6}
        />
      </mesh>

      {/* Front Gold Plaque with Name & Number */}
      <mesh position={[0, 0.48, 0.355]}>
        <planeGeometry args={[0.8, 0.28]} />
        <meshStandardMaterial
          color="#1e2c3f"
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>

      {/* Plaque Gold Border */}
      <mesh position={[0, 0.48, 0.356]}>
        <planeGeometry args={[0.82, 0.3]} />
        <meshStandardMaterial
          color="#d4af37"
          roughness={0.2}
          metalness={0.8}
          wireframe
        />
      </mesh>

      {/* Plaque 3D Text */}
      <Text
        position={[0, 0.53, 0.36]}
        fontSize={0.07}
        color="#f5d77f"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/outfit/v11/QEUWsgEr9ERC-v3oqfv7wPb9.woff2"
      >
        {`${exhibit.number} • ${exhibit.name.toUpperCase()}`}
      </Text>
      <Text
        position={[0, 0.43, 0.36]}
        fontSize={0.045}
        color="#cbd5e1"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.7}
      >
        {exhibit.adoptedDate}
      </Text>

      {/* 2. Easel / Frame Mount behind the picture */}
      <mesh position={[0, 1.45, -0.06]}>
        <boxGeometry args={[0.1, 0.9, 0.1]} />
        <meshStandardMaterial color="#0c1420" roughness={0.7} />
      </mesh>

      {/* 3. Golden Picture Frame */}
      <group position={[0, 1.8, 0]}>
        {/* Outer Gold Frame Rim */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[frameWidth, frameHeight, 0.1]} />
          <meshStandardMaterial
            color={isSelected ? '#ffe066' : isHovered ? '#f5d77f' : '#d4af37'}
            roughness={0.25}
            metalness={0.85}
          />
        </mesh>

        {/* Inner Passe-partout (Dark Museum Mat) */}
        <mesh position={[0, 0, 0.04]}>
          <planeGeometry args={[frameWidth - 0.08, frameHeight - 0.08]} />
          <meshStandardMaterial color="#0a121c" roughness={0.8} />
        </mesh>

        {/* Artwork Canvas with Exhibit Texture */}
        <mesh position={[0, 0, 0.052]}>
          <planeGeometry args={[pictureWidth, pictureHeight]} />
          <meshStandardMaterial
            map={texture}
            roughness={0.3}
            metalness={0.05}
          />
        </mesh>

        {/* Glass reflection cover */}
        <mesh position={[0, 0, 0.055]}>
          <planeGeometry args={[pictureWidth, pictureHeight]} />
          <meshPhysicalMaterial
            transparent
            opacity={0.12}
            roughness={0.05}
            metalness={0.1}
            transmission={0.9}
            ior={1.45}
          />
        </mesh>

        {/* Interactive Tap Collider (Enlarged for Mobile Thumbs) */}
        <mesh
          position={[0, 0, 0.1]}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(exhibit);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = 'pointer';
            onHover(exhibit.id);
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'auto';
            onHover(null);
          }}
        >
          <boxGeometry args={[frameWidth + 0.3, frameHeight + 0.4, 0.3]} />
          <meshBasicMaterial visible={false} />
        </mesh>

        {/* Interactive Call-to-Action Indicator */}
        {!isSelected && (
          <Html position={[0, -frameHeight / 2 - 0.15, 0.1]} center distanceFactor={8}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(exhibit);
              }}
              className="museum-pin-btn"
              title="Толығырақ көру"
              aria-label={`${exhibit.name} жәдігерін көру`}
            >
              <span className="museum-pin-dot"></span>
              <span className="museum-pin-text">{exhibit.name}</span>
            </button>
          </Html>
        )}
      </group>

      {/* Soft spotlight pool on the floor beneath pedestal */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[1.2, 32]} />
        <meshBasicMaterial
          color="#00afca"
          transparent
          opacity={isSelected ? 0.35 : isHovered ? 0.25 : 0.12}
        />
      </mesh>
    </group>
  );
}
