import { useEffect, useState } from 'react';
import { globalMetrics, type DataNode } from '../data/mockData';
import { Network, BarChart3, Settings, X, Activity, Cpu, Database, Shield } from 'lucide-react';

interface Props {
  selectedNode: DataNode | null;
  onClose: () => void;
}

function AnimatedNumber({ value, decimals = 0, suffix = '' }: { value: number; decimals?: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame: number;
    const start = display;
    const diff = value - start;
    const duration = 800;
    let startTime: number;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(start + diff * eased);
      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <>{display.toFixed(decimals)}{suffix}</>;
}

export default function HUD({ selectedNode, onClose }: Props) {
  const [time, setTime] = useState(new Date());
  const [activeView, setActiveView] = useState<'topology' | 'metrics' | 'settings'>('topology');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hud-overlay">
      {/* Background mesh */}
      <div className="bg-mesh" />

      {/* ────── Top Bar ────── */}
      <div className="hud-top">
        <div className="hud-logo">
          <div className="hud-logo-icon">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="hud-logo-text">Zagnor</span>
        </div>

        <div className="hud-status">
          <div className="status-pill">
            <div className="status-dot" />
            <span>NEXUS ONLINE</span>
          </div>
          <div className="status-pill">
            {time.toLocaleTimeString('en-US', { hour12: false })}
          </div>
        </div>
      </div>

      {/* ────── Side Nav ────── */}
      <div className="side-nav">
        <button 
          className={`side-nav-btn ${activeView === 'topology' ? 'active' : ''}`} 
          title="Topology View"
          onClick={() => setActiveView('topology')}
        >
          <Network size={20} />
        </button>
        <button 
          className={`side-nav-btn ${activeView === 'metrics' ? 'active' : ''}`} 
          title="Metrics"
          onClick={() => setActiveView('metrics')}
        >
          <BarChart3 size={20} />
        </button>
        <button 
          className={`side-nav-btn ${activeView === 'settings' ? 'active' : ''}`} 
          title="Settings"
          onClick={() => setActiveView('settings')}
        >
          <Settings size={20} />
        </button>
      </div>

      {/* ────── View Content ────── */}
      <div className="hud-bottom">
        {activeView === 'topology' && (
          <div className="metrics-row">
            <div className="metric-card">
              <div className="metric-label">Total Nodes</div>
              <div className="metric-value cyan">
                <AnimatedNumber value={globalMetrics.totalNodes} />
              </div>
              <div className="metric-sub">All clusters</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Throughput</div>
              <div className="metric-value purple">
                <AnimatedNumber value={globalMetrics.totalThroughput} suffix=" ops/s" />
              </div>
              <div className="metric-sub">Aggregated</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Avg Latency</div>
              <div className="metric-value amber">
                <AnimatedNumber value={globalMetrics.avgLatency} decimals={1} suffix=" ms" />
              </div>
              <div className="metric-sub">P50</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Uptime</div>
              <div className="metric-value green">
                <AnimatedNumber value={globalMetrics.uptime} decimals={2} suffix="%" />
              </div>
              <div className="metric-sub">Last 30d</div>
            </div>
          </div>
        )}

        {activeView === 'metrics' && (
          <div className="metrics-row">
            <div className="metric-card">
              <div className="metric-label">CPU Load</div>
              <div className="metric-value cyan">
                <AnimatedNumber value={42} suffix="%" />
              </div>
              <div className="metric-sub"><Cpu size={10} className="inline mr-1" /> Avg Usage</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Memory</div>
              <div className="metric-value purple">
                <AnimatedNumber value={68} suffix="%" />
              </div>
              <div className="metric-sub"><Database size={10} className="inline mr-1" /> 16GB Total</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Net Traffic</div>
              <div className="metric-value amber">
                <AnimatedNumber value={450} suffix=" Mb/s" />
              </div>
              <div className="metric-sub">Inbound/Outbound</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Security</div>
              <div className="metric-value green">
                <Shield size={24} />
              </div>
              <div className="metric-sub">Protected</div>
            </div>
          </div>
        )}

        {activeView === 'settings' && (
          <div className="metrics-row">
            <div className="metric-card" style={{ width: '100%', minWidth: '400px' }}>
              <div className="metric-label">Environment Settings</div>
              <div className="flex gap-4 mt-2">
                <button className="status-pill hover:bg-slate-800 transition-colors">Toggle Night Mode</button>
                <button className="status-pill hover:bg-slate-800 transition-colors">Reset Camera</button>
                <button className="status-pill hover:bg-slate-800 transition-colors">Export Logs</button>
              </div>
            </div>
          </div>
        )}

        {/* ────── Detail Panel ────── */}
        {selectedNode && (
          <div className="detail-panel">
            <div className="detail-panel-header">
              <span className="detail-panel-title">{selectedNode.name}</span>
              <button className="detail-panel-close" onClick={onClose}><X size={18} /></button>
            </div>
            <div className="detail-row">
              <span className="detail-key">Type</span>
              <span className="detail-val">{selectedNode.type}</span>
            </div>
            <div className="detail-row">
              <span className="detail-key">Status</span>
              <span className="detail-val" style={{ color: selectedNode.status === 'healthy' ? '#34d399' : selectedNode.status === 'warning' ? '#fbbf24' : '#ef4444' }}>
                {selectedNode.status.toUpperCase()}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-key">Latency</span>
              <span className="detail-val">{selectedNode.metrics.latency} ms</span>
            </div>
            <div className="detail-row">
              <span className="detail-key">Throughput</span>
              <span className="detail-val">{selectedNode.metrics.throughput.toLocaleString()} ops/s</span>
            </div>
            <div className="detail-row">
              <span className="detail-key">Storage</span>
              <span className="detail-val">{selectedNode.metrics.storage}</span>
            </div>
            <div className="detail-row">
              <span className="detail-key">Replicas</span>
              <span className="detail-val">{selectedNode.metrics.replicas}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
