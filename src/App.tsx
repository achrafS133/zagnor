import { useState } from 'react';
import NexusScene from './components/NexusScene';
import HUD from './components/HUD';
import type { DataNode } from './data/mockData';
import './App.css';

function App() {
  const [selectedNode, setSelectedNode] = useState<DataNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<DataNode | null>(null);

  return (
    <>
      <NexusScene
        selectedNode={selectedNode}
        hoveredNode={hoveredNode}
        onSelectNode={setSelectedNode}
        onHoverNode={setHoveredNode}
      />
      <HUD selectedNode={selectedNode} onClose={() => setSelectedNode(null)} />
    </>
  );
}

export default App;
