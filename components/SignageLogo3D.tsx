"use client";

import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function LogoModel() {
  const { scene } = useGLTF('/models/logoCNC.glb');
  const floatRef = useRef<THREE.Group>(null);

  // Lumières animées
  const light1Ref = useRef<THREE.PointLight>(null);
  const light2Ref = useRef<THREE.PointLight>(null);

  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  const { scale, centerOffset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(clonedScene);
    const center = new THREE.Vector3();
    box.getCenter(center);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const s = 2.6 / maxDim;
    return { scale: s, centerOffset: center };
  }, [clonedScene]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Mouvement du logo : oscillation Y + Z (profondeur)
    if (floatRef.current) {
      floatRef.current.rotation.y = Math.sin(t * 0.5) * 0.42;
      floatRef.current.position.y = Math.sin(t * 0.7) * 0.12;
      // Avance / recule vers la caméra
      floatRef.current.position.z = Math.sin(t * 0.45) * 0.9;
    }

    // Lumière turquoise qui orbite lentement
    if (light1Ref.current) {
      light1Ref.current.position.x = Math.cos(t * 0.6) * 4;
      light1Ref.current.position.z = Math.sin(t * 0.6) * 4 + 3;
      light1Ref.current.intensity = 1.8 + Math.sin(t * 1.2) * 0.4;
    }

    // Lumière dorée qui orbite en opposition
    if (light2Ref.current) {
      light2Ref.current.position.x = Math.cos(t * 0.6 + Math.PI) * 3;
      light2Ref.current.position.z = Math.sin(t * 0.6 + Math.PI) * 3 + 2;
      light2Ref.current.intensity = 1.2 + Math.sin(t * 0.9 + 1) * 0.3;
    }
  });

  return (
    <>
      {/* Lumières animées */}
      <pointLight ref={light1Ref} color="#00D4FF" distance={14} decay={2} />
      <pointLight ref={light2Ref} color="#FFB347" distance={12} decay={2} />

      <group ref={floatRef}>
        <group
          scale={scale}
          position={[
            -centerOffset.x * scale,
            -centerOffset.y * scale,
            -centerOffset.z * scale,
          ]}
        >
          <primitive object={clonedScene} />
        </group>
      </group>
    </>
  );
}

function checkWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

const LogoFallback: React.FC = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="relative flex items-center justify-center">
      <div className="absolute size-24 rounded-full animate-ping" style={{ background: 'rgba(0,169,206,0.12)', animationDuration: '2.5s' }} />
      <div className="absolute size-16 rounded-full" style={{ background: 'rgba(0,169,206,0.08)', border: '1px solid rgba(0,169,206,0.25)' }} />
      <span className="relative text-2xl font-black italic uppercase tracking-tighter text-turquoise select-none">CNC</span>
    </div>
  </div>
);

export const SignageLogo3D: React.FC = () => {
  const [webglOk, setWebglOk] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    setWebglOk(checkWebGL());
  }, []);

  if (webglOk === null) return null;
  if (!webglOk) return <LogoFallback />;

  return (
    <Canvas
      frameloop="always"
      camera={{ position: [0, 0, 5], fov: 38 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.4 }}
      style={{ width: '100%', height: '100%' }}
    >
      {/* Lumière ambiante hémisphérique : ciel bleu / sol sombre */}
      <hemisphereLight args={['#1a6fa8', '#001828', 0.8]} />

      {/* Lumière principale forte depuis le haut */}
      <directionalLight position={[3, 6, 5]} intensity={2.2} color="#ffffff" />

      {/* Rim light turquoise par derrière */}
      <directionalLight position={[-2, 1, -5]} intensity={1.6} color="#00A9CE" />

      {/* Fill light chaud depuis le bas */}
      <pointLight position={[0, -3, 3]} intensity={0.7} color="#FFD580" distance={10} decay={2} />

      <Suspense fallback={null}>
        <LogoModel />
      </Suspense>
    </Canvas>
  );
};

useGLTF.preload('/models/logoCNC.glb');
