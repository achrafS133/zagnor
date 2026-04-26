import { useEffect, useState } from 'react';
import { globalMetrics, type DataNode } from '../data/mockData';

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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
              <line x1="12" y1="22" x2="12" y2="15.5" />
              <polyline points="22 8.5 12 15.5 2 8.5" />
            </svg>
          </div>
          <span className="hud-logo-text">Zagnor</span>
        </div>

        <div className="hud-status">
          <div className="status-pill">
            <span className="status-dot" />
            <span>NEXUS ONLINE</span>
          </div>
          <div className="status-pill">
            {time.toLocaleTimeString('en-US', { hour12: false })}
          </div>
        </div>
      </div>

      {/* ────── Side Nav ────── */}
      <div className="side-nav">
        <button className="side-nav-btn active" title="Topology View">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <circle cx="4" cy="4" r="2" />
            <circle cx="20" cy="4" r="2" />
            <circle cx="4" cy="20" r="2" />
            <circle cx="20" cy="20" r="2" />
            <line x1="6" y1="6" x2="10" y2="10" />
            <line x1="18" y1="6" x2="14" y2="10" />
            <line x1="6" y1="18" x2="10" y2="14" />
            <line x1="18" y1="18" x2="14" y2="14" />
          </svg>
        </button>
        <button className="side-nav-btn" title="Metrics">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" />
          </svg>
        </button>
        <button className="side-nav-btn" title="Settings">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        </button>
      </div>

      {/* ────── Bottom Metrics ────── */}
      <div className="hud-bottom">
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

        {/* ────── Detail Panel ────── */}
        {selectedNode && (
          <div className="detail-panel">
            <div className="detail-panel-header">
              <span className="detail-panel-title">{selectedNode.name}</span>
              <button className="detail-panel-close" onClick={onClose}>✕</button>
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
