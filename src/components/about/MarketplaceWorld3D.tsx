import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, ContactShadows, Float, PresentationControls } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

function Model() {
  const modelRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/Marketplace World.glb");

  // Auto-rotation animation
  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
      modelRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={0.5}
    >
      <primitive
        ref={modelRef}
        object={scene.clone()}
        scale={2.5}
        position={[0, -1, 0]}
      />
    </Float>
  );
}

export function MarketplaceWorld3D() {
  return (
    <motion.div
      className="w-full h-full relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Canvas
        camera={{ position: [0, 2, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          {/* Lighting Setup */}
          <ambientLight intensity={0.5} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.3}
            penumbra={1}
            intensity={2}
            castShadow
            color="#a855f7"
          />
          <spotLight
            position={[-10, 10, -10]}
            angle={0.3}
            penumbra={1}
            intensity={1.5}
            color="#06b6d4"
          />
          <pointLight position={[0, 5, 0]} intensity={1} color="#ec4899" />

          {/* Environment for better reflections */}
          <Environment preset="city" />

          {/* Interactive Controls */}
          <PresentationControls
            global
            config={{ mass: 2, tension: 500 }}
            snap={{ mass: 4, tension: 1500 }}
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 3, Math.PI / 3]}
            azimuth={[-Math.PI / 1.4, Math.PI / 2]}
          >
            <Model />
          </PresentationControls>

          {/* Contact Shadows */}
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.5}
            scale={10}
            blur={2}
            far={4}
          />

          {/* Optional: OrbitControls for full manual control */}
          {/* <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
          /> */}
        </Suspense>
      </Canvas>

      {/* Loading overlay */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm pointer-events-none z-10"
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <div className="text-sm text-purple-300 font-medium">Loading Marketplace World...</div>
        </div>
      </motion.div>

      {/* Interactive hint */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 pointer-events-none z-10"
      >
        <p className="text-xs text-purple-200 font-medium">Kéo để xoay mô hình 3D</p>
      </motion.div>
    </motion.div>
  );
}

// Preload the model
useGLTF.preload("/models/Marketplace World.glb");
