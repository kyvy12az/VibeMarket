import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface Product3DModelProps {
  modelPath: string; // ví dụ: "/models/tshirt.glb"
  scale?: number;
  color?: string; // tùy chọn để override material color nếu muốn
}

export function Product3DModel({ modelPath, scale = 1, color }: Product3DModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const gltf = useGLTF(modelPath) as any;

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.12;
      groupRef.current.rotation.y += 0.002; // nhẹ xoay
    }
  });

  // Nếu muốn override màu cho toàn bộ mesh (tuỳ model)
  const applyColor = (obj: THREE.Object3D) => {
    obj.traverse((child: any) => {
      if (child.isMesh && child.material) {
        // clone material để không ảnh hưởng reuse
        child.material = Array.isArray(child.material)
          ? child.material.map((m: any) => m.clone())
          : child.material.clone();
        if (color) {
          if (Array.isArray(child.material)) {
            child.material.forEach((m: any) => m.color && m.color.set(color));
          } else {
            child.material.color && child.material.color.set(color);
          }
        }
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  };

  // apply color once when gltf loaded
  if (gltf && gltf.scene) applyColor(gltf.scene);

  return (
    <group ref={groupRef} dispose={null}>
      <primitive
        object={gltf.scene}
        scale={[scale, scale, scale]}
        position={[0, -0.6, 0]} // điều chỉnh cho khung nhìn
      />
    </group>
  );
}
