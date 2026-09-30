import React from 'react';
import * as THREE from 'three';

export function MuseumRoom() {
  return (
    <group>
      {/* 1. Gallery Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[9, 48]} />
        <meshStandardMaterial
          color="#0b1726"
          roughness={0.35}
          metalness={0.2}
        />
      </mesh>

      {/* Floor Center Medallion / Kazakh Sun Emblem Accent */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <ringGeometry args={[2.2, 2.3, 48]} />
        <meshStandardMaterial
          color="#d4af37"
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
        <ringGeometry args={[4.5, 4.58, 48]} />
        <meshStandardMaterial
          color="#1e3450"
          roughness={0.5}
          metalness={0.4}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
        <circleGeometry args={[1.5, 32]} />
        <meshBasicMaterial
          color="#00afca"
          transparent
          opacity={0.06}
        />
      </mesh>

      {/* 2. Curved Gallery Walls (Cylinder with open front) */}
      <mesh position={[0, 3.2, 0]}>
        <cylinderGeometry
          args={[8.5, 8.5, 6.4, 48, 1, true, Math.PI * 0.7, Math.PI * 1.6]}
        />
        <meshStandardMaterial
          color="#0d2138"
          roughness={0.7}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Lower Wall Wainscoting / Baseboard Trim */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry
          args={[8.46, 8.46, 0.8, 48, 1, true, Math.PI * 0.7, Math.PI * 1.6]}
        />
        <meshStandardMaterial
          color="#050d18"
          roughness={0.6}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Wall Gold Accent Stripe */}
      <mesh position={[0, 0.82, 0]}>
        <cylinderGeometry
          args={[8.44, 8.44, 0.04, 48, 1, true, Math.PI * 0.7, Math.PI * 1.6]}
        />
        <meshStandardMaterial
          color="#d4af37"
          roughness={0.3}
          metalness={0.7}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Wall Upper Gallery Crown Molding */}
      <mesh position={[0, 5.8, 0]}>
        <cylinderGeometry
          args={[8.44, 8.44, 0.15, 48, 1, true, Math.PI * 0.7, Math.PI * 1.6]}
        />
        <meshStandardMaterial
          color="#d4af37"
          roughness={0.3}
          metalness={0.7}
          side={THREE.BackSide}
        />
      </mesh>

      {/* 3. Ceiling architectural dome ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 6.4, 0]}>
        <circleGeometry args={[8.5, 48]} />
        <meshStandardMaterial
          color="#060e1a"
          roughness={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Ceiling Ambient Ring Light */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 6.35, 0]}>
        <ringGeometry args={[4.8, 5.0, 36]} />
        <meshBasicMaterial color="#ffeaa7" />
      </mesh>

      {/* 4. Architectural Accent Columns along the back arc */}
      {[-0.8, -0.27, 0.27, 0.8].map((angleOffset, idx) => {
        const angle = -Math.PI / 2 + angleOffset;
        const radius = 8.35;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <group key={idx} position={[x, 3.2, z]}>
            <mesh>
              <boxGeometry args={[0.3, 6.4, 0.3]} />
              <meshStandardMaterial
                color="#0c1a2c"
                roughness={0.5}
                metalness={0.3}
              />
            </mesh>
            <mesh position={[0, 0, 0.16]}>
              <boxGeometry args={[0.04, 6.4, 0.02]} />
              <meshStandardMaterial
                color="#d4af37"
                roughness={0.2}
                metalness={0.8}
              />
            </mesh>
          </group>
        );
      })}

      {/* Floor outer rim */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[8.4, 8.55, 48]} />
        <meshStandardMaterial
          color="#d4af37"
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>
    </group>
  );
}
