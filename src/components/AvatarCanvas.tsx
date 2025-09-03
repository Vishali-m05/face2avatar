'use client';

import { Canvas } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import AvatarManager from '@/class/AvatarManager';
import FaceLandmarkManager from '@/class/FaceLandmarkManager';
import { OrbitControls, Float, Text3D } from '@react-three/drei';
import * as THREE from 'three';

interface AvatarCanvasProps {
  width: number;
  height: number;
  url: string;
}

const AvatarCanvas = ({ width, height, url }: AvatarCanvasProps) => {
  const [scene, setScene] = useState<THREE.Scene | null>();
  const [isLoading, setIsLoading] = useState(true);
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 0.5, 1]);
  const [targetPosition, setTargetPosition] = useState<[number, number, number]>([0, 0.6, 0]);
  const avatarManagerRef = useRef(AvatarManager.getInstance());
  const requestRef = useRef(0);
  const canvasWrapperRef = useRef<HTMLDivElement>(null); // 🔥 used to find canvas later

  const animate = () => {
    const results = FaceLandmarkManager.getInstance().getResults();
    avatarManagerRef.current.updateFacialTransforms(results, true);
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const avatarManager = AvatarManager.getInstance();

    avatarManager
      .loadModel(url)
      .then(() => {
        const scene = avatarManager.getScene();

        const box = new THREE.Box3().setFromObject(scene);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const targetY = center.y + size.y * 0.3;
        const camZ = size.length() * 1.2;

        setCameraPosition([center.x, targetY, camZ]);
        setTargetPosition([center.x, targetY, center.z]);
        setScene(scene);
        setIsLoading(false);
      })
      .catch((e) => {
        alert(e);
      });
  }, [url]);

  return (
    <div
      ref={canvasWrapperRef}
      className="absolute"
      data-avatar-container
      style={{ width: width, height: height }}
    >
      <Canvas camera={{ fov: 30, position: cameraPosition }} gl={{ preserveDrawingBuffer: true }}>
        <ambientLight />
        <directionalLight />
        <OrbitControls
          target={targetPosition}
          enableDamping={false}
          enableRotate={false}
          enableZoom={false}
          enablePan={false}
        />
        {scene && <primitive object={scene} />}
        {isLoading && (
          <Float floatIntensity={1} speed={1}>
            <Text3D
              font={'../assets/fonts/Open_Sans_Condensed_Bold.json'}
              scale={0.05}
              position={[-0.1, 0.6, 0]}
              bevelEnabled
              bevelSize={0.05}
            >
              Loading...
              <meshNormalMaterial />
            </Text3D>
          </Float>
        )}
      </Canvas>
    </div>
  );
};

export default AvatarCanvas;
