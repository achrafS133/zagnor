import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stars } from '@react-three/drei';
import DataNodeMesh from './DataNodeMesh';
import ConnectionLines from './ConnectionLines';
import ParticleField from './ParticleField';
import { mockNodes, type DataNode } from '../data/mockData';

interface Props {
  selectedNode: DataNode | null;
  hoveredNode: DataNode | null;
  onSelectNode: (node: DataNode | null) => void;
  onHoverNode: (node: DataNode | null) => void;
}

export default function NexusScene({ selectedNode, hoveredNode, onSelectNode, onHoverNode }: Props) {
  return (
    <Canvas
      camera={{ position: [8, 5, 10], fov: 50, near: 0.1, far: 100 }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: false }}
      onPointerMissed={() => onSelectNode(null)}
    >
      <color attach="background" args={['#0a0a12']} />

      {/* Lighting */}
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#00f0ff" />
      <pointLight position={[-10, -5, -10]} intensity={1.5} color="#a855f7" />
      <pointLight position={[0, 5, 0]} intensity={1} color="#f472b6" />
      <directionalLight position={[5, 8, 5]} intensity={0.6} color="#ffffff" />

      {/* Stars background */}
      <Stars radius={50} depth={80} count={2000} factor={3} saturation={0.2} fade speed={0.5} />

      {/* Data visualization */}
      <ConnectionLines nodes={mockNodes} />

      {mockNodes.map((node) => (
        <DataNodeMesh
          key={node.id}
          node={node}
          isSelected={selectedNode?.id === node.id}
          isHovered={hoveredNode?.id === node.id}
          onSelect={onSelectNode}
          onHover={onHoverNode}
        />
      ))}

      <ParticleField />

      {/* Controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
        minDistance={3}
        maxDistance={25}
        enablePan
        autoRotate
        autoRotateSpeed={0.3}
      />

      <Environment preset="night" />
    </Canvas>
  );
}
