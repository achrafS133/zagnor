import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';
import type { DataNode } from '../data/mockData';

const STATUS_COLORS: Record<string, string> = {
  healthy: '#34d399',
  warning: '#fbbf24',
  critical: '#ef4444',
};

const TYPE_SIZES: Record<string, number> = {
  cluster: 0.6,
  keyspace: 0.4,
  table: 0.25,
  query: 0.15,
};

interface Props {
  node: DataNode;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (node: DataNode) => void;
  onHover: (node: DataNode | null) => void;
}

export default function DataNodeMesh({ node, isSelected, isHovered, onSelect, onHover }: Props) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);
  const [localHover, setLocalHover] = useState(false);

  const baseSize = TYPE_SIZES[node.type] || 0.3;
  const color = STATUS_COLORS[node.status] || '#00f0ff';
  const scale = isSelected ? 1.4 : isHovered || localHover ? 1.2 : 1;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Floating bob
    if (meshRef.current) {
      meshRef.current.position.y = node.position[1] + Math.sin(t * 0.8 + node.position[0]) * 0.1;
      meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, scale, 0.1));
    }

    // Glow pulsation
    if (glowRef.current) {
      const pulse = 1 + Math.sin(t * 2 + node.position[0] * 2) * 0.15;
      glowRef.current.scale.setScalar(baseSize * 2.5 * pulse);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = isSelected ? 0.5 : 0.25;
    }

    // Ring rotation
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.5;
      ringRef.current.rotation.x = Math.sin(t * 0.3) * 0.3;
    }
  });

  return (
    <group position={node.position}>
      {/* Outer glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} depthWrite={false} />
      </mesh>

      {/* Selection ring */}
      {(isSelected || isHovered || localHover) && (
        <mesh ref={ringRef}>
          <torusGeometry args={[baseSize * 1.8, 0.015, 16, 64]} />
          <meshBasicMaterial color={isSelected ? '#00f0ff' : '#a855f7'} transparent opacity={0.6} />
        </mesh>
      )}

      {/* Core sphere */}
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onSelect(node); }}
        onPointerEnter={(e) => { e.stopPropagation(); setLocalHover(true); onHover(node); document.body.style.cursor = 'pointer'; }}
        onPointerLeave={() => { setLocalHover(false); onHover(null); document.body.style.cursor = 'auto'; }}
      >
        {node.type === 'cluster' ? (
          <icosahedronGeometry args={[baseSize, 1]} />
        ) : node.type === 'keyspace' ? (
          <octahedronGeometry args={[baseSize, 0]} />
        ) : (
          <sphereGeometry args={[baseSize, 24, 24]} />
        )}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 2.5 : 1.2}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.95}
          toneMapped={false}
        />
      </mesh>

      {/* Label */}
      <Billboard position={[0, baseSize + 0.35, 0]}>
        <Text
          fontSize={0.18}
          color={isSelected || localHover ? '#ffffff' : '#cbd5e1'}
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.015}
          outlineColor="#000000"
        >
          {node.name}
        </Text>
      </Billboard>
    </group>
  );
}
