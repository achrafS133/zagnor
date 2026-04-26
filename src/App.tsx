import { useState, useMemo } from 'react';
import NexusScene from './components/NexusScene';
import HUD from './components/HUD';
import { defaultNodes, getGlobalMetrics, type DataNode } from './data/mockData';
import './App.css';

function App() {
  const [nodes, setNodes] = useState<DataNode[]>(defaultNodes);
  const [selectedNode, setSelectedNode] = useState<DataNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<DataNode | null>(null);

  const globalMetrics = useMemo(() => getGlobalMetrics(nodes), [nodes]);

  return (
    <>
      <NexusScene
        nodes={nodes}
        selectedNode={selectedNode}
        hoveredNode={hoveredNode}
        onSelectNode={setSelectedNode}
        onHoverNode={setHoveredNode}
      />
      <HUD 
        nodes={nodes}
        setNodes={setNodes}
        globalMetrics={globalMetrics}
        selectedNode={selectedNode} 
        onClose={() => setSelectedNode(null)} 
      />
    </>
  );
}

export default App;
