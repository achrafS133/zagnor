import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { DataNode } from '../data/mockData';

interface Props {
  nodes: DataNode[];
}

function ConnectionLine({ from, to, index }: { from: THREE.Vector3; to: THREE.Vector3; index: number }) {
  const lineRef = useRef<THREE.Line>(null!);

  const geometry = useMemo(() => {
    const mid = new THREE.Vector3().lerpVectors(from, to, 0.5);
    mid.y += 0.5;
    const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
    const points = curve.getPoints(30);
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [from, to]);

  const material = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: new THREE.Color('#00f0ff'),
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
    });
  }, []);

  useEffect(() => {
    if (lineRef.current) {
      lineRef.current.geometry = geometry;
      lineRef.current.material = material;
    }
  }, [geometry, material]);

  useFrame(({ clock }) => {
    if (!lineRef.current) return;
    const t = clock.getElapsedTime();
    material.opacity = 0.35 + Math.sin(t * 1.5 + index * 0.7) * 0.15;
  });

  return <primitive ref={lineRef} object={new THREE.Line(geometry, material)} />;
}

export default function ConnectionLines({ nodes }: Props) {
  const connections = useMemo(() => {
    const result: { from: THREE.Vector3; to: THREE.Vector3 }[] = [];
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));

    for (const node of nodes) {
      for (const targetId of node.connections) {
        const target = nodeMap.get(targetId);
        if (target) {
          result.push({
            from: new THREE.Vector3(...node.position),
            to: new THREE.Vector3(...target.position),
          });
        }
      }
    }
    return result;
  }, [nodes]);

  return (
    <group>
      {connections.map((conn, i) => (
        <ConnectionLine key={i} from={conn.from} to={conn.to} index={i} />
      ))}
    </group>
  );
}
