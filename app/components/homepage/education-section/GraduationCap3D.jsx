import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function GraduationCap3D({ isHovered }) {
  const meshRef = useRef();
  const { nodes, materials } = useGLTF('/models/graduation_cap.glb');

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Smooth rotation
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    
    // Add slight tilt when hovered
    if (isHovered) {
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        -0.2,
        0.1
      );
    } else {
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        0,
        0.1
      );
    }
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={0.5}
      floatingRange={[0, 0.5]}
    >
      <group ref={meshRef} dispose={null} scale={1.5}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.cap_base.geometry}
          position={[0, 0, 0]}
        >
          <MeshDistortMaterial
            color="#1a237e"
            envMapIntensity={0.8}
            clearcoat={0.8}
            clearcoatRoughness={0.2}
            metalness={0.8}
            roughness={0.4}
            distort={isHovered ? 0.2 : 0.1}
            speed={2}
          />
        </mesh>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.tassel.geometry}
          position={[0.8, 0.2, 0]}
        >
          <MeshDistortMaterial
            color="#ffd700"
            envMapIntensity={1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            metalness={0.9}
            roughness={0.3}
            distort={isHovered ? 0.3 : 0.15}
            speed={3}
          />
        </mesh>
      </group>
    </Float>
  );
}

useGLTF.preload('/models/graduation_cap.glb'); 