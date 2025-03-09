'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Center } from '@react-three/drei';
import * as THREE from 'three';

export default function ExperienceCard3D({ position, rotation, experience, onClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const targetRotation = useRef(0);
  const currentRotation = useRef(0);

  useFrame((state, delta) => {
    if (hovered) {
      targetRotation.current = Math.sin(state.clock.elapsedTime) * 0.1;
    } else {
      targetRotation.current = 0;
    }

    currentRotation.current = THREE.MathUtils.lerp(
      currentRotation.current,
      targetRotation.current,
      0.1
    );

    if (meshRef.current) {
      meshRef.current.rotation.y = currentRotation.current;
      meshRef.current.position.y = hovered 
        ? Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.2
        : THREE.MathUtils.lerp(meshRef.current.position.y, 0, 0.1);
    }
  });

  return (
    <group position={position} rotation={rotation}>
      <Center>
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={onClick}
        >
          {/* Card base */}
          <boxGeometry args={[3, 4, 0.2]} />
          <meshPhysicalMaterial
            color={hovered ? '#4f46e5' : '#1e1b4b'}
            metalness={0.7}
            roughness={0.2}
            clearcoat={1.0}
            clearcoatRoughness={0.2}
            envMapIntensity={2}
          />

          {/* Content */}
          <group position={[0, 0, 0.11]}>
            {/* Company name */}
            <Text
              position={[0, 1.2, 0]}
              fontSize={0.3}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              characters="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"
            >
              {experience.company}
            </Text>

            {/* Role */}
            <Text
              position={[0, 0.6, 0]}
              fontSize={0.2}
              color="#94a3b8"
              anchorX="center"
              anchorY="middle"
              characters="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"
            >
              {experience.role}
            </Text>

            {/* Duration */}
            <Text
              position={[0, 0, 0]}
              fontSize={0.15}
              color="#64748b"
              anchorX="center"
              anchorY="middle"
              characters="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"
            >
              {experience.duration}
            </Text>

            {/* Description */}
            <Text
              position={[0, -0.8, 0]}
              fontSize={0.12}
              color="#94a3b8"
              anchorX="center"
              anchorY="middle"
              maxWidth={2.5}
              textAlign="center"
              characters="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"
            >
              {experience.description}
            </Text>
          </group>
        </mesh>

        {/* Decorative elements */}
        <mesh position={[-1.2, 1.6, 0.1]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.3, 0.3, 0.1]} />
          <meshPhysicalMaterial
            color="#4f46e5"
            emissive="#4f46e5"
            emissiveIntensity={hovered ? 2 : 1}
            toneMapped={false}
          />
        </mesh>

        <mesh position={[1.2, -1.6, 0.1]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.3, 0.3, 0.1]} />
          <meshPhysicalMaterial
            color="#4f46e5"
            emissive="#4f46e5"
            emissiveIntensity={hovered ? 2 : 1}
            toneMapped={false}
          />
        </mesh>

        {/* Particle system */}
        {hovered && (
          <points>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={100}
                array={new Float32Array(300).map(() => (Math.random() - 0.5) * 4)}
                itemSize={3}
              />
            </bufferGeometry>
            <pointsMaterial
              size={0.05}
              color="#4f46e5"
              transparent
              opacity={0.6}
              sizeAttenuation
            />
          </points>
        )}
      </Center>
    </group>
  );
} 