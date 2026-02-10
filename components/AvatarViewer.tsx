"use client";

import React, { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment, ContactShadows, Html } from "@react-three/drei";
import * as THREE from "three";

interface ModelProps {
  url: string;
  isTalking: boolean;
  scale?: number;
  position?: [number, number, number];
}

const Model = ({ url, isTalking, scale = 2, position = [0, -3, 0] }: ModelProps) => {
  const { scene } = useGLTF(url);
  const modelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (modelRef.current) {
      const time = state.clock.getElapsedTime();
      // Nhún nhảy nhẹ
      modelRef.current.position.y = position[1] + Math.sin(time * 2) * 0.02;
      
      // Xoay nhẹ qua lại (Trục Z local = Trục Y world do đã xoay -90 độ X)
      if (isTalking) {
        modelRef.current.rotation.z = Math.sin(time * 10) * 0.05; 
      } else {
        modelRef.current.rotation.z = Math.sin(time * 2) * 0.02;
      }
    }
  });

  return (
    <primitive 
      object={scene} 
      ref={modelRef} 
      scale={scale} 
      position={position} 
      // [FIX QUAN TRỌNG] Xoay -90 độ để dựng đứng model lên
      rotation={[-Math.PI / 2, 0, 0]} 
    />
  );
};

// Loader ẩn, không hiện chữ làm phiền
const Loader = () => null;

interface AvatarViewerProps {
  url: string;
  isTalking: boolean;
  theme: 'hacker' | 'sakura';
}

function AvatarCanvas({ url, isTalking, theme }: AvatarViewerProps) {
  const [hasError, setHasError] = useState(false);

  // Nếu lỗi thì ẩn luôn, không hiện khung xấu xí
  if (hasError) return null;

  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas 
        // Camera góc rộng vừa phải để thấy toàn thân
        camera={{ position: [0, 1, 4], fov: 40 }} 
        className="w-full h-full block"
        gl={{ preserveDrawingBuffer: true, alpha: true }} 
      >
        {theme === 'sakura' ? (
          <>
            <ambientLight intensity={1.2} />
            <spotLight position={[2, 5, 5]} intensity={1} color="#fff" />
            <spotLight position={[-2, 2, 5]} intensity={0.5} color="#ffc1e3" />
            <Environment preset="sunset" />
          </>
        ) : (
          <>
            <ambientLight intensity={1} />
            <pointLight position={[10, 10, 10]} intensity={1} />
          </>
        )}

        <Suspense fallback={<Loader />}>
            <ErrorBoundary setHasError={setHasError}>
                <Model 
                    url={url} 
                    isTalking={isTalking} 
                    scale={theme === 'sakura' ? 1.8 : 1.8} 
                    position={[0, -1.6, 0]} 
                />
            </ErrorBoundary>
        </Suspense>

        <ContactShadows opacity={0.3} scale={5} blur={2} far={4} color="#000000" />
        
        {/* Cho phép xoay nhẹ */}
        <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            minPolarAngle={Math.PI / 2.5} 
            maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>
    </div>
  );
}

export default function AvatarViewer(props: AvatarViewerProps) {
  return <AvatarCanvas key={props.url} {...props} />;
}

class ErrorBoundary extends React.Component<{ setHasError: (v: boolean) => void, children: React.ReactNode }> {
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: any) { this.props.setHasError(true); }
  render() { return this.props.children; }
}