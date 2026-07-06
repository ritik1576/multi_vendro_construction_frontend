import React, { Suspense, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Box, Cylinder, Instances, Instance } from '@react-three/drei';
import * as THREE from 'three';

// --- Materials & Colors ---
const concreteColor = "#c7ccd4";
const brickColor = "#9a3f2f";
const steelColor = "#6b7280";
const scaffoldColor = "#d97706";

// --- Procedural Construction Components ---

const Slabs = () => (
  <group>
    {/* Foundation */}
    <Box args={[6.6, 0.4, 6.6]} position={[0, -0.2, 0]} castShadow receiveShadow>
      <meshStandardMaterial color={concreteColor} roughness={0.95} />
    </Box>
    {/* First Floor Slab */}
    <Box args={[6.4, 0.2, 6.4]} position={[0, 2, 0]} castShadow receiveShadow>
      <meshStandardMaterial color={concreteColor} roughness={0.95} />
    </Box>
    {/* Second Floor Partial Slab */}
    <Box args={[4, 0.2, 6.4]} position={[-1.2, 4, 0]} castShadow receiveShadow>
      <meshStandardMaterial color={concreteColor} roughness={0.95} />
    </Box>
  </group>
);

const Pillars = () => {
  const positions = [];
  for (let x = -2.5; x <= 2.5; x += 2.5) {
    for (let z = -2.5; z <= 2.5; z += 2.5) {
      positions.push([x, 1, z]); // Ground floor
      if (x < 2 || z < 2) {
        positions.push([x, 3, z]); // First floor partial
      }
    }
  }
  return (
    <Instances range={positions.length} castShadow receiveShadow>
      <boxGeometry args={[0.3, 2, 0.3]} />
      <meshStandardMaterial color={concreteColor} roughness={0.9} />
      {positions.map((pos, i) => (
        <Instance key={i} position={pos} />
      ))}
    </Instances>
  );
};

const Rebars = () => {
  const positions = [];
  for (let x = -2.5; x <= 2.5; x += 2.5) {
    for (let z = -2.5; z <= 2.5; z += 2.5) {
      // Shorter rebars where pillar stops, taller where it continues
      const height = (x === 2.5 && z === 2.5) ? 2.5 : 4.5;
      for (let i = 0; i < 4; i++) {
        const ox = (i % 2 === 0 ? 0.08 : -0.08);
        const oz = (i < 2 ? 0.08 : -0.08);
        positions.push([x + ox, height, z + oz]);
      }
    }
  }
  return (
    <Instances range={positions.length} castShadow>
      <cylinderGeometry args={[0.012, 0.012, 1, 8]} />
      <meshStandardMaterial color={steelColor} roughness={0.4} metalness={0.8} />
      {positions.map((pos, i) => (
        <Instance key={i} position={pos} />
      ))}
    </Instances>
  );
};

const Walls = () => (
  <group>
    {/* Ground floor back wall */}
    <Box args={[6, 2, 0.2]} position={[0, 1, -2.9]} castShadow receiveShadow>
      <meshStandardMaterial color={brickColor} roughness={0.9} />
    </Box>
    {/* Ground floor left wall with door gap */}
    <Box args={[2, 2, 0.2]} position={[-2.9, 1, -1.9]} rotation={[0, Math.PI/2, 0]} castShadow receiveShadow>
      <meshStandardMaterial color={brickColor} roughness={0.9} />
    </Box>
    <Box args={[2, 2, 0.2]} position={[-2.9, 1, 1.9]} rotation={[0, Math.PI/2, 0]} castShadow receiveShadow>
      <meshStandardMaterial color={brickColor} roughness={0.9} />
    </Box>
    {/* First floor back wall (under construction) */}
    <Box args={[4, 1, 0.2]} position={[-1, 2.5, -2.9]} castShadow receiveShadow>
      <meshStandardMaterial color={brickColor} roughness={0.9} />
    </Box>
    {/* Concrete blocks stacked on first floor */}
    <Box args={[1.5, 0.8, 0.4]} position={[1, 2.4, -1]} rotation={[0, 0.2, 0]} castShadow receiveShadow>
      <meshStandardMaterial color="#cbd5e1" roughness={0.95} />
    </Box>
  </group>
);

const Scaffolding = () => (
  <group position={[3.3, 0, -1.5]}>
    {/* Vertical poles */}
    <Cylinder args={[0.03, 0.03, 4.5, 8]} position={[0, 2.25, -1]} castShadow>
       <meshStandardMaterial color={scaffoldColor} metalness={0.5} roughness={0.5}/>
    </Cylinder>
    <Cylinder args={[0.03, 0.03, 4.5, 8]} position={[0, 2.25, 0]} castShadow>
       <meshStandardMaterial color={scaffoldColor} metalness={0.5} roughness={0.5}/>
    </Cylinder>
    <Cylinder args={[0.03, 0.03, 4.5, 8]} position={[0, 2.25, 1]} castShadow>
       <meshStandardMaterial color={scaffoldColor} metalness={0.5} roughness={0.5}/>
    </Cylinder>
    
    {/* Horizontal connections */}
    {[1, 2, 3, 4].map(y => (
      <Cylinder key={y} args={[0.03, 0.03, 2.2, 8]} position={[0, y, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
         <meshStandardMaterial color={scaffoldColor} metalness={0.5} roughness={0.5}/>
      </Cylinder>
    ))}
  </group>
);

const MaterialsPile = () => (
  <group position={[0.5, 0, 4]}>
    {/* Brick pallet */}
    <group position={[0, 0, 0]}>
      <Box args={[1.2, 0.1, 1]} position={[0, 0.05, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#854d0e" />
      </Box>
      <Box args={[1.1, 0.8, 0.9]} position={[0, 0.5, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={brickColor} roughness={0.9} />
      </Box>
    </group>
    {/* Cement bags pallet */}
    <group position={[-2, 0, 0]}>
      <Box args={[1.2, 0.1, 1]} position={[0, 0.05, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#854d0e" />
      </Box>
      <Box args={[1, 0.5, 0.8]} position={[0, 0.35, 0]} rotation={[0, 0.1, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#d1d5db" roughness={0.95} />
      </Box>
      <Box args={[0.9, 0.2, 0.7]} position={[0, 0.7, 0]} rotation={[0, -0.1, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#d1d5db" roughness={0.95} />
      </Box>
    </group>
    {/* Steel rods resting on ground */}
    <group position={[2.5, 0.06, -1]} rotation={[0, 0.4, 0]}>
      <Cylinder args={[0.06, 0.06, 3, 16]} rotation={[0, 0, Math.PI/2]} castShadow receiveShadow>
         <meshStandardMaterial color={steelColor} metalness={0.9} roughness={0.2} />
      </Cylinder>
      <Cylinder args={[0.06, 0.06, 3, 16]} position={[0, 0.1, 0.05]} rotation={[0, 0, Math.PI/2]} castShadow receiveShadow>
         <meshStandardMaterial color={steelColor} metalness={0.9} roughness={0.2} />
      </Cylinder>
    </group>
  </group>
);

const ConstructionDiorama = () => {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      // Very slow automatic rotation for architectural presentation
      groupRef.current.rotation.y = -Math.PI / 4 + Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[1.4, -0.2, 0]} scale={1.2}>
      <Slabs />
      <Pillars />
      <Rebars />
      <Walls />
      <Scaffolding />
      <MaterialsPile />
    </group>
  );
};

const CameraRig = () => {
  useFrame((state) => {
    // Subtle mouse parallax
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.pointer.x * 0.8, 0.02);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 3 + state.pointer.y * 0.8, 0.02);
    // Focus securely to the right side where the building is
    state.camera.lookAt(1.4, 0.5, 0); 
  });
  return null;
};

const Scene = () => {
  return (
    <>
      <color attach="background" args={['#0f172a']} />
      
      {/* Professional Scene Lighting - Brightened and Enhanced */}
      <ambientLight intensity={1.2} />
      <directionalLight position={[10, 15, 10]} intensity={2.2} color="#ffffff" castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0001} />
      {/* Warm key light hitting the front of the building */}
      <pointLight position={[0, 3, 5]} intensity={1.5} color="#fb923c" distance={20} />
      {/* Cool blue rim light from the back-right */}
      <spotLight position={[12, 6, -10]} intensity={1.2} color="#38bdf8" angle={1} penumbra={1} castShadow />

      {/* Main Architectural Diorama */}
      <ConstructionDiorama />

      {/* Ground Contact Shadow */}
      <ContactShadows position={[1.4, -0.4, 0]} opacity={0.7} scale={20} blur={2.5} far={10} color="#000000" />
      <Environment preset="city" />
      <CameraRig />
    </>
  );
};

const HeroSection = () => {
  const { products = [] } = useSelector(state => state.product);
  
  const productCount = products.length > 0 ? `${products.length}+` : '10,000+';
  const uniqueVendors = new Set(products.map(p => p.vendorId || p.vendorName || p.vendor_id || p.shopName).filter(Boolean));
  const supplierCount = uniqueVendors.size > 0 ? `${uniqueVendors.size}+` : '500+';

  return (
    <div className="relative bg-[#0f172a] text-white overflow-hidden min-h-[720px] lg:min-h-[calc(100vh-80px)] flex items-center w-full">
      
      {/* 3D Canvas Background - Explicitly dimensioned and positioned strictly on the right half */}
      <div className="hidden lg:block absolute right-[2%] top-[18%] w-[48vw] h-[62vh] z-0 pointer-events-none">
        <Canvas shadows camera={{ position: [0, 3, 14], fov: 40 }} dpr={[1, 2]} className="pointer-events-auto rounded-2xl">
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* Dark gradient overlay for robust text readability on desktop */}
      <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/90 to-transparent z-10 pointer-events-none" />
      <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10 pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full pointer-events-none">
        {/* Enable pointer events only on the content block so parallax works on empty space */}
        <div className="max-w-2xl relative pointer-events-auto">
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight drop-shadow-2xl">
            <span className="text-white">Construction Materials,</span><br/>
            <span className="text-blue-200 font-bold">Delivered Fast</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-200 mb-10 max-w-xl font-medium drop-shadow-lg">
            India's trusted B2B marketplace — {productCount} products from {supplierCount} verified sellers at direct wholesale prices.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-14">
            <Link to="/products" className="px-8 py-4 rounded-lg font-bold text-white bg-secondary-main shadow-lg transition-all hover:bg-secondary-dark hover:shadow-secondary-main/40 text-center hover:-translate-y-0.5 active:translate-y-0">
              Browse Catalog &rarr;
            </Link>
            <Link to="/register" className="px-8 py-4 rounded-lg font-bold text-white border border-white/30 backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-all hover:border-white/50 text-center hover:-translate-y-0.5 active:translate-y-0">
              Create Free Account
            </Link>
          </div>

          {/* Premium Glassmorphism Stats Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/20 border border-white/20 relative backdrop-blur-xl bg-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="px-2 py-4 sm:py-0 first:pt-0 sm:first:pl-2">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1 drop-shadow-md">{productCount}</div>
              <div className="text-xs text-blue-200 font-semibold uppercase tracking-wider">Building Products</div>
            </div>
            <div className="px-2 py-4 sm:py-0">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1 drop-shadow-md">{supplierCount}</div>
              <div className="text-xs text-blue-200 font-semibold uppercase tracking-wider">Verified Suppliers</div>
            </div>
            <div className="px-2 py-4 sm:py-0 last:pb-0">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1 drop-shadow-md">50+</div>
              <div className="text-xs text-blue-200 font-semibold uppercase tracking-wider">Cities Delivered</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
