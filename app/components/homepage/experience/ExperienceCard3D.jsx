import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Center, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

export default function ExperienceCard3D({ position, rotation, experience, onClick }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  const targetRotation = useRef(0);
  const currentRotation = useRef(0);
  const targetY = useRef(0);
  const currentY = useRef(0);
  const targetScale = useRef(1);
  const currentScale = useRef(1);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (hovered) {
      targetRotation.current = Math.sin(t * 1.5) * 0.1;
      targetY.current = Math.sin(t * 2) * 0.12 + 0.3;
      targetScale.current = 1.06;
    } else {
      targetRotation.current = Math.sin(t * 0.4) * 0.025;
      targetY.current = 0;
      targetScale.current = 1;
    }

    currentRotation.current = THREE.MathUtils.lerp(currentRotation.current, targetRotation.current, 0.1);
    currentY.current = THREE.MathUtils.lerp(currentY.current, targetY.current, 0.1);
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale.current, 0.1);

    if (groupRef.current) {
      groupRef.current.rotation.y = currentRotation.current;
      groupRef.current.position.y = currentY.current;
      groupRef.current.scale.setScalar(currentScale.current);
    }
  });

  const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>? &/';

  return (
    <group position={position} rotation={rotation}>
      <Center>
        <group
          ref={groupRef}
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          {/* Card body */}
          <RoundedBox args={[3, 4.2, 0.2]} radius={0.15} smoothness={6} castShadow>
            <meshPhysicalMaterial
              color={hovered ? '#0f2942' : '#131c31'}
              metalness={0.4}
              roughness={0.35}
              clearcoat={0.6}
              clearcoatRoughness={0.4}
              envMapIntensity={1.2}
              transparent
              opacity={0.96}
            />
          </RoundedBox>

          {/* Inner face */}
          <mesh position={[0, 0, 0.105]}>
            <planeGeometry args={[2.8, 4.0]} />
            <meshStandardMaterial color="#0b1220" transparent opacity={0.7} roughness={0.9} />
          </mesh>

          {/* Hover glow frame */}
          {hovered && (
            <mesh position={[0, 0, 0.108]}>
              <planeGeometry args={[2.82, 4.02]} />
              <meshBasicMaterial color="#34D399" transparent opacity={0.12} side={THREE.DoubleSide} />
            </mesh>
          )}

          {/* Top accent bar */}
          <mesh position={[0, 1.85, 0.12]}>
            <planeGeometry args={[2.4, 0.05]} />
            <meshBasicMaterial color={hovered ? '#34D399' : '#60A5FA'} transparent opacity={hovered ? 1 : 0.7} />
          </mesh>

          {/* Icon diamond (top-left) */}
          <mesh position={[-1.15, 1.55, 0.13]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.22, 0.22, 0.06]} />
            <meshPhysicalMaterial
              color={hovered ? '#34D399' : '#60A5FA'}
              emissive={hovered ? '#34D399' : '#60A5FA'}
              emissiveIntensity={hovered ? 2.5 : 1.2}
              toneMapped={false}
            />
          </mesh>

          {/* Company name */}
          <Text
            position={[0, 1.0, 0.13]}
            fontSize={0.3}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            maxWidth={2.4}
            fontWeight="bold"
            characters={CHARS}
          >
            {experience.company}
          </Text>

          {/* Role */}
          <Text
            position={[0, 0.45, 0.13]}
            fontSize={0.2}
            color={hovered ? '#34D399' : '#7dd3fc'}
            anchorX="center"
            anchorY="middle"
            maxWidth={2.4}
            fontWeight="600"
            characters={CHARS}
          >
            {experience.role}
          </Text>

          {/* Divider */}
          <mesh position={[0, 0.05, 0.13]}>
            <planeGeometry args={[1.6, 0.015]} />
            <meshBasicMaterial color="#334155" transparent opacity={0.8} />
          </mesh>

          {/* Duration */}
          <Text
            position={[0, -0.35, 0.13]}
            fontSize={0.16}
            color="#94a3b8"
            anchorX="center"
            anchorY="middle"
            maxWidth={2.4}
            characters={CHARS}
          >
            {experience.duration}
          </Text>

          {/* "Click to explore" hint on hover */}
          {hovered && (
            <Text
              position={[0, -1.55, 0.13]}
              fontSize={0.13}
              color="#34D399"
              anchorX="center"
              anchorY="middle"
              maxWidth={2.4}
              characters={CHARS}
            >
              Click to explore
            </Text>
          )}

          {/* Bottom-right diamond */}
          <mesh position={[1.15, -1.65, 0.13]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.22, 0.22, 0.06]} />
            <meshPhysicalMaterial
              color={hovered ? '#34D399' : '#60A5FA'}
              emissive={hovered ? '#34D399' : '#60A5FA'}
              emissiveIntensity={hovered ? 2.5 : 1.2}
              toneMapped={false}
            />
          </mesh>

          {/* Hover particles */}
          {hovered && (
            <points>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={60}
                  array={new Float32Array(180).map(() => (Math.random() - 0.5) * 5)}
                  itemSize={3}
                />
              </bufferGeometry>
              <pointsMaterial size={0.05} color="#34D399" transparent opacity={0.6} sizeAttenuation />
            </points>
          )}
        </group>
      </Center>
    </group>
  );
}
