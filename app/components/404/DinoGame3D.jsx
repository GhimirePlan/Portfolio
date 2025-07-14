'use client';

import { useEffect, useRef, useState, forwardRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Box, 
  Environment, 
  PerspectiveCamera, 
  Text,
  Stars,
  Cloud,
  Sky,
  MeshDistortMaterial,
  Sphere,
  useAudioData,
  useDetectGPU
} from '@react-three/drei';
import * as THREE from 'three';
import OscilloscopeLoader from '../OscilloscopeLoader';

// Sound effects
const SOUNDS = {
  jump: new Audio('/sounds/jump.mp3'),
  collision: new Audio('/sounds/collision.mp3'),
  point: new Audio('/sounds/point.mp3'),
};

// Initialize sounds
Object.values(SOUNDS).forEach(sound => {
  sound.volume = 0.3;
});

const Character = forwardRef(({ position, rotation, isJumping, setIsJumping }, ref) => {
  const group = useRef();
  const meshRef = useRef();
  const jumpHeight = 3;
  const jumpDuration = 0.5;
  const [jumpTime, setJumpTime] = useState(0);

  // Forward both refs
  useEffect(() => {
    if (ref) {
      ref.current = group.current;
    }
  }, [ref]);

  useEffect(() => {
    if (isJumping) {
      SOUNDS.jump.currentTime = 0;
      SOUNDS.jump.play().catch(() => {});
    }
  }, [isJumping]);

  useFrame((state, delta) => {
    if (isJumping) {
      setJumpTime((prev) => prev + delta);
      const progress = Math.min(jumpTime / jumpDuration, 1);
      const height = Math.sin(progress * Math.PI) * jumpHeight;
      group.current.position.y = height;

      if (progress >= 1) {
        setIsJumping(false);
        setJumpTime(0);
        group.current.position.y = 0;
      }
    }

    // Add floating animation
    group.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.005;
    // Add running animation
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 10) * 0.1;
  });

  return (
    <group 
      ref={group}
      position={position}
      rotation={rotation}
    >
      {/* Collision Box (invisible) */}
      <mesh ref={meshRef} visible={false}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshBasicMaterial wireframe />
      </mesh>

      {/* Visual Character */}
      <mesh castShadow position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <MeshDistortMaterial
          color="#60A5FA"
          speed={2}
          distort={0.2}
          radius={1}
        />
      </mesh>
      {/* Trail Effect */}
      <mesh position={[-0.6, 0, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshBasicMaterial
          color="#60A5FA"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh position={[-1, 0, 0]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshBasicMaterial
          color="#60A5FA"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Glow Effect */}
      <pointLight color="#60A5FA" intensity={1} distance={3} />
    </group>
  );
});

const Obstacle = forwardRef(({ position, speed }, ref) => {
  const group = useRef();
  const meshRef = useRef();
  const [randomRotation] = useState(() => Math.random() * Math.PI * 2);

  // Forward the ref
  useEffect(() => {
    if (ref) {
      ref.current = group.current;
    }
  }, [ref]);

  useFrame((state, delta) => {
    group.current.position.x -= speed * delta;
    if (group.current.position.x < -10) {
      group.current.position.x = 10;
      // Play point sound when passing obstacle
      SOUNDS.point.currentTime = 0;
      SOUNDS.point.play().catch(() => {});
    }
    group.current.rotation.y += delta;
    group.current.rotation.z = Math.sin(state.clock.elapsedTime + randomRotation) * 0.2;
  });

  return (
    <group ref={group} position={position}>
      {/* Collision Box (invisible) */}
      <mesh ref={meshRef} visible={false}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshBasicMaterial wireframe />
      </mesh>

      {/* Visual Obstacle */}
      <mesh castShadow>
        <octahedronGeometry args={[0.5]} />
        <MeshDistortMaterial
          color="#34D399"
          speed={1}
          distort={0.3}
          radius={1}
        />
      </mesh>
      <pointLight color="#34D399" intensity={0.5} distance={2} />
    </group>
  );
});

function Ground({ speed }) {
  const groundRef = useRef();
  const gridPoints = useMemo(() => {
    const points = [];
    for (let i = -25; i <= 25; i += 1) {
      for (let j = -10; j <= 10; j += 1) {
        points.push(new THREE.Vector3(i, 0, j));
      }
    }
    return points;
  }, []);

  useFrame((state, delta) => {
    groundRef.current.position.x = ((state.clock.elapsedTime * speed) % 1) - 0.5;
  });

  return (
    <group ref={groundRef}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[50, 20]} />
        <meshStandardMaterial
          color="#1E293B"
          roughness={0.8}
          metalness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Grid Points */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={gridPoints.length}
            array={new Float32Array(gridPoints.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          color="#60A5FA"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function Particles({ count = 100 }) {
  const mesh = useRef();
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = Math.random() * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, [count]);

  useFrame((state, delta) => {
    mesh.current.rotation.y += delta * 0.1;
    mesh.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#60A5FA"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

function GameOverText({ score }) {
  const [scale, setScale] = useState(0);
  
  useEffect(() => {
    setScale(0);
    const timer = setTimeout(() => setScale(1), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <group scale={scale}>
      <Text
        position={[0, 2, 0]}
        fontSize={0.5}
        color="#60A5FA"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#1E293B"
      >
        {`Game Over! Score: ${Math.floor(score)}`}
      </Text>
      <pointLight position={[0, 2, 2]} intensity={1} color="#60A5FA" />
      <Sphere args={[0.2, 32, 32]} position={[0, 3, 0]}>
        <MeshDistortMaterial
          color="#60A5FA"
          speed={2}
          distort={0.5}
          radius={1}
        />
      </Sphere>
    </group>
  );
}

function Scene({ isPlaying, onScoreUpdate, onGameOver }) {
  const [isJumping, setIsJumping] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const characterRef = useRef();
  const obstaclesRef = useRef([]);
  const obstaclePositions = useRef([
    new THREE.Vector3(10, 0, 0),
    new THREE.Vector3(20, 0, 0),
  ]);

  // Reset game state when isPlaying changes
  useEffect(() => {
    if (isPlaying) {
      setGameOver(false);
      setScore(0);
      setSpeed(5);
      setIsJumping(false);
      // Reset obstacle positions
      obstaclePositions.current = [
        new THREE.Vector3(10, 0, 0),
        new THREE.Vector3(20, 0, 0),
      ];
    }
  }, [isPlaying]);

  // Add back the jump handler
  const handleJump = () => {
    if (!isJumping && isPlaying && !gameOver) {
      setIsJumping(true);
    }
  };

  // Add back keyboard and touch controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.code === 'Space' || e.code === 'ArrowUp') && !gameOver) {
        e.preventDefault();
        handleJump();
      }
    };

    const handleTouch = (e) => {
      if (!gameOver) {
        e.preventDefault();
        handleJump();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouch);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouch);
    };
  }, [isJumping, isPlaying, gameOver]);

  const handleGameOver = () => {
    if (!gameOver) {
      setGameOver(true);
      SOUNDS.collision.currentTime = 0;
      SOUNDS.collision.play().catch(() => {});
      onGameOver();
    }
  };

  const checkCollision = (character, obstacle) => {
    if (!character || !obstacle) return false;

    // Get world positions
    const characterPosition = new THREE.Vector3();
    const obstaclePosition = new THREE.Vector3();
    character.getWorldPosition(characterPosition);
    obstacle.getWorldPosition(obstaclePosition);

    // Define collision thresholds (made more strict)
    const horizontalThreshold = 0.8;  // Reduced from 1.0
    const verticalThreshold = 0.5;    // Reduced from 1.0

    // Calculate distances
    const horizontalDistance = Math.abs(characterPosition.x - obstaclePosition.x);
    const verticalDistance = Math.abs(characterPosition.y - obstaclePosition.y);

    // Check if character is jumping high enough to clear obstacle
    const isClearingObstacle = characterPosition.y > 1.5;

    // Return true if collision detected and character is not clearing the obstacle
    return horizontalDistance < horizontalThreshold && !isClearingObstacle;
  };

  useFrame((state, delta) => {
    if (!isPlaying || gameOver) return;

    // Update score
    setScore((prev) => {
      const newScore = prev + delta * 10;
      onScoreUpdate(Math.floor(newScore));
      return newScore;
    });

    // Increase speed over time (made more challenging)
    setSpeed((prev) => Math.min(prev + delta * 0.2, 20));

    // Check collisions
    if (characterRef.current && obstaclesRef.current.length > 0) {
      for (const obstacle of obstaclesRef.current) {
        if (obstacle && checkCollision(characterRef.current, obstacle)) {
          handleGameOver();
          break;
        }
      }
    }
  });

  return (
    <>
      <Sky sunPosition={[0, 1, 0]} turbidity={10} />
      <Stars radius={100} depth={50} count={5000} factor={4} fade />
      <Environment preset="sunset" />
      <PerspectiveCamera makeDefault position={[0, 2, 8]} />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <pointLight position={[-2, 2, -2]} intensity={0.5} color="#60A5FA" />

      <Character
        ref={characterRef}
        position={[-2, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        isJumping={isJumping}
        setIsJumping={setIsJumping}
      />

      {obstaclePositions.current.map((position, index) => (
        <Obstacle
          key={index}
          ref={el => (obstaclesRef.current[index] = el)}
          position={position}
          speed={speed}
        />
      ))}

      <Ground speed={speed} />
      <Particles />

      {/* Add decorative clouds */}
      <Cloud position={[-4, 2, -6]} speed={0.2} opacity={0.5} />
      <Cloud position={[4, 3, -5]} speed={0.1} opacity={0.3} />
      <Cloud position={[0, 4, -4]} speed={0.3} opacity={0.4} />

      {gameOver && <GameOverText score={score} />}
    </>
  );
}

export default function DinoGame3D({ isPlaying, onScoreUpdate, onGameOver }) {
  const [isLoading, setIsLoading] = useState(true);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const gpuTier = useDetectGPU();

  useEffect(() => {
    // Check for WebGL support
    try {
      const canvas = document.createElement('canvas');
      const hasWebGL = !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
      setWebGLSupported(hasWebGL && !gpuTier.isMobile && gpuTier.tier > 0);
    } catch (e) {
      console.error('WebGL detection error:', e);
      setWebGLSupported(false);
    }

    // Simulate loading time for assets
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show loader for 2 seconds

    return () => clearTimeout(timer);
  }, [gpuTier]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-md">
          <OscilloscopeLoader />
        </div>
      </div>
    );
  }

  if (!webGLSupported) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-background p-6">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 max-w-md w-full border border-gray-700/30 shadow-xl">
          <h2 className="text-2xl font-bold text-[#60A5FA] mb-4">3D Game Not Available</h2>
          <p className="text-gray-300 mb-6">Your device doesn't support WebGL or has limited 3D capabilities. Try using a different browser or device with better graphics support.</p>
          <div className="flex justify-center">
            <button 
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-400 rounded-lg font-medium text-white hover:from-blue-600 hover:to-teal-500 transition-all duration-300 shadow-lg"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Canvas 
      shadows 
      dpr={[1, 2]}
      gl={{ 
        antialias: true,
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: false,
        stencil: false,
        depth: true,
      }}
    >
      <Scene 
        isPlaying={isPlaying} 
        onScoreUpdate={onScoreUpdate}
        onGameOver={onGameOver}
      />
    </Canvas>
  );
}