import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

export default function Education3D({ isHovered }) {
  const groupRef = useRef();
  const bookRef = useRef();
  const capRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;

    // Smooth rotation for the entire group
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;

    // Book animation
    if (bookRef.current) {
      bookRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }

    // Cap animation
    if (capRef.current) {
      capRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1 + 2;
      capRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={1}
      floatIntensity={0.8}
      floatingRange={[0, 0.5]}
    >
      <group ref={groupRef}>
        {/* Graduation Cap */}
        <group ref={capRef} position={[0, 2, 0]}>
          {/* Cap Base */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[1, 1.2, 0.2, 4]} />
            <meshStandardMaterial
              color="#1a237e"
              metalness={0.8}
              roughness={0.2}
              envMapIntensity={1}
            />
          </mesh>
          {/* Tassel */}
          <mesh castShadow receiveShadow position={[0.8, 0.2, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial
              color="#ffd700"
              metalness={0.9}
              roughness={0.1}
              envMapIntensity={1}
            />
          </mesh>
          {/* Tassel String */}
          <mesh castShadow receiveShadow position={[0.4, 0.1, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} rotation={[0, 0, Math.PI / 4]} />
            <meshStandardMaterial
              color="#ffd700"
              metalness={0.9}
              roughness={0.1}
              envMapIntensity={1}
            />
          </mesh>
        </group>

        {/* Book Stack */}
        <group ref={bookRef} position={[0, 0, 0]}>
          {[0, 0.3, 0.6].map((y, index) => (
            <group key={index} position={[0, y, 0]} rotation={[0, Math.PI * index * 0.2, 0]}>
              {/* Book Cover */}
              <mesh castShadow receiveShadow>
                <boxGeometry args={[2, 0.2, 1.5]} />
                <meshStandardMaterial
                  color={index === 0 ? "#60A5FA" : index === 1 ? "#34D399" : "#818CF8"}
                  metalness={0.5}
                  roughness={0.4}
                  envMapIntensity={1}
                />
              </mesh>
              {/* Book Pages */}
              <mesh castShadow receiveShadow position={[0, 0.05, 0]}>
                <boxGeometry args={[1.9, 0.1, 1.4]} />
                <meshStandardMaterial
                  color="#ffffff"
                  metalness={0.1}
                  roughness={0.8}
                  envMapIntensity={0.5}
                />
              </mesh>
            </group>
          ))}
        </group>

        {/* Decorative Elements */}
        <group position={[0, -0.5, 0]}>
          {/* Floating Particles */}
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh
              key={i}
              position={[
                Math.sin(i * Math.PI * 2 / 8) * 2,
                Math.cos(i * Math.PI * 2 / 8) * 0.5,
                Math.cos(i * Math.PI * 2 / 8) * 2
              ]}
            >
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? "#60A5FA" : "#34D399"}
                emissive={i % 2 === 0 ? "#60A5FA" : "#34D399"}
                emissiveIntensity={0.5}
                metalness={1}
                roughness={0.2}
              />
            </mesh>
          ))}
        </group>
      </group>
    </Float>
  );
} 