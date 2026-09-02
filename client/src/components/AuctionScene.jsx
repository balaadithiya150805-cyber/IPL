import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Float, Html, PerspectiveCamera } from '@react-three/drei';
import { motion } from 'framer-motion';
import { usePlayerImage } from '../utils/playerImages';
import * as THREE from 'three';

function AuctionTable() {
  return (
    <group position={[0, -1.7, 0]} rotation={[-0.03, 0, 0]}>
      <mesh receiveShadow>
        <boxGeometry args={[9, 0.22, 4]} />
        <meshStandardMaterial color="#1c222a" metalness={0.8} roughness={0.28} />
      </mesh>
      <mesh position={[0, -0.85, 0]}>
        <boxGeometry args={[6.8, 1.5, 1.5]} />
        <meshStandardMaterial color="#10151b" metalness={0.5} roughness={0.5} />
      </mesh>
      {[-3.8, 3.8].map((x) => (
        <mesh key={x} position={[x, -0.8, 0]}>
          <cylinderGeometry args={[0.12, 0.16, 1.6, 16]} />
          <meshStandardMaterial color="#8d7448" metalness={0.9} roughness={0.24} />
        </mesh>
      ))}
    </group>
  );
}

function Spotlight() {
  return (
    <group position={[0, 3.2, -1]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[2.2, 4.5, 32, 1, true]} />
        <meshBasicMaterial color="#c9a96a" transparent opacity={0.045} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <pointLight color="#e7c98b" intensity={18} distance={9} decay={2} />
    </group>
  );
}

function BidRipple({ active }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const pulse = active ? (Math.sin(state.clock.elapsedTime * 3) + 1) / 2 : 0;
    ref.current.scale.setScalar(1 + pulse * 0.3);
    ref.current.material.opacity = active ? 0.16 - pulse * 0.08 : 0.035;
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.56, 0]}>
      <ringGeometry args={[1.8, 1.83, 64]} />
      <meshBasicMaterial color="#d7b875" transparent opacity={0.035} />
    </mesh>
  );
}

function PlayerShowcase({ player }) {
  const realPlayerImage = usePlayerImage(player);
  if (!player || !realPlayerImage) return null;

  return (
    <Html center transform distanceFactor={4.2} position={[0, 0.25, -1.08]} zIndexRange={[1, 2]}>
      <motion.div
        className="scene-player-photo"
        whileHover={{ scale: 1.045 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <img src={realPlayerImage} alt={player.name} draggable="false" />
      </motion.div>
    </Html>
  );
}

function AuctionGeometry({ active, player }) {
  return (
    <>
      <color attach="background" args={["#0b0e12"]} />
      <fog attach="fog" args={["#0b0e12", 7, 18]} />
      <ambientLight intensity={0.35} color="#b8c0c8" />
      <directionalLight position={[-5, 6, 4]} intensity={2.2} color="#f0dfb5" castShadow />
      <directionalLight position={[5, 2, 1]} intensity={0.7} color="#8ba0b5" />
      <Spotlight />
      <Float speed={0.5} rotationIntensity={0.03} floatIntensity={0.12}>
        <mesh position={[0, 0.25, -1.3]} castShadow>
          <boxGeometry args={[2.1, 2.65, 0.14]} />
          <meshStandardMaterial color="#202832" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.25, -1.21]}>
          <boxGeometry args={[1.82, 2.37, 0.035]} />
          <meshStandardMaterial color="#303c48" metalness={0.2} roughness={0.5} />
        </mesh>
        <PlayerShowcase player={player} />
      </Float>
      <AuctionTable />
      <BidRipple active={active} />
      <ContactShadows position={[0, -1.58, 0]} opacity={0.45} scale={12} blur={2.5} far={4} />
      <Environment preset="city" environmentIntensity={0.28} />
    </>
  );
}

export default function AuctionScene({ hasBid, player }) {
  return (
    <div className="auction-scene" aria-hidden="true">
      <Canvas shadows dpr={[1, 1.5]}>
        <PerspectiveCamera makeDefault position={[0, 0.6, 8.5]} fov={38} />
        <AuctionGeometry active={hasBid} player={player} />
      </Canvas>
    </div>
  );
}
