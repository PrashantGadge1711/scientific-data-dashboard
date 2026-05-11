import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useLabStore } from '../../store/labStore';

interface GlassInstrumentProps {
  pulseIntensity: number;
}

function GlassInstrument({ pulseIntensity }: GlassInstrumentProps) {
  const meshRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    if (coreRef.current) {
      const scale = 1 + pulseIntensity * 0.15 * Math.sin(state.clock.elapsedTime * 3);
      coreRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={meshRef}>
      {/* Main glass cylinder body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 3, 32]} />
        <meshPhysicalMaterial
          color="#06b6d4"
          metalness={0.1}
          roughness={0.1}
          transmission={0.9}
          thickness={0.5}
          transparent
          opacity={0.4}
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Inner core with glow */}
      <mesh ref={coreRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 2.5, 32]} />
        <meshPhysicalMaterial
          color="#8b5cf6"
          metalness={0.3}
          roughness={0.2}
          transmission={0.6}
          thickness={0.3}
          transparent
          opacity={0.7}
          emissive="#8b5cf6"
          emissiveIntensity={0.5 + pulseIntensity * 0.5}
        />
      </mesh>

      {/* Top cap */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[1.3, 1.3, 0.1, 32]} />
        <meshPhysicalMaterial
          color="#06b6d4"
          metalness={0.8}
          roughness={0.2}
          transmission={0.3}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Bottom cap */}
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[1.3, 1.3, 0.1, 32]} />
        <meshPhysicalMaterial
          color="#06b6d4"
          metalness={0.8}
          roughness={0.2}
          transmission={0.3}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Ring accents */}
      {[0.5, 0, -0.5, -1].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <torusGeometry args={[1.35, 0.03, 16, 100]} />
          <meshPhysicalMaterial
            color="#06b6d4"
            metalness={0.9}
            roughness={0.1}
            emissive="#06b6d4"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 2,
          ]}
        >
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshPhysicalMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={2}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

function Scene() {
  const { currentData } = useLabStore();
  const pulseIntensity = (currentData.purity - 95) / 5; // Normalize 95-100 to 0-1

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#06b6d4" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#8b5cf6" />
      <pointLight position={[0, 5, 5]} intensity={0.5} color="#10b981" />
      
      <GlassInstrument pulseIntensity={pulseIntensity} />
    </>
  );
}

export default function DigitalTwin() {
  const [mounted, setMounted] = useState(false);
  const { currentData } = useLabStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-pulse text-cyan-400 text-sm">Initializing 3D Engine...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
      
      {/* Overlay data display */}
      <div className="absolute bottom-4 left-4 right-4 glass rounded-lg p-3 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400">Instrument Status</span>
          <span className="text-cyan-400 font-mono">ACTIVE</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <div className="text-slate-500">Temp</div>
            <div className="text-cyan-300 font-mono">{currentData.temperature.toFixed(1)}°C</div>
          </div>
          <div>
            <div className="text-slate-500">Pressure</div>
            <div className="text-purple-300 font-mono">{currentData.pressure.toFixed(1)} kPa</div>
          </div>
          <div>
            <div className="text-slate-500">Purity</div>
            <div className="text-green-300 font-mono">{currentData.purity.toFixed(1)}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
