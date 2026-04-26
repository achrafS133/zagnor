export interface DataNode {
  id: string;
  name: string;
  type: 'cluster' | 'keyspace' | 'table' | 'query';
  status: 'healthy' | 'warning' | 'critical';
  position: [number, number, number];
  metrics: {
    latency: number;
    throughput: number;
    storage: string;
    replicas: number;
  };
  connections: string[];
}

export const defaultNodes: DataNode[] = [
  {
    id: 'core-1',
    name: 'Nexus Core',
    type: 'cluster',
    status: 'healthy',
    position: [0, 0, 0],
    metrics: { latency: 2.4, throughput: 14500, storage: '2.4 TB', replicas: 3 },
    connections: ['ks-users', 'ks-analytics', 'ks-logs'],
  },
  {
    id: 'ks-users',
    name: 'Users Keyspace',
    type: 'keyspace',
    status: 'healthy',
    position: [3, 1.5, -1],
    metrics: { latency: 3.1, throughput: 8200, storage: '480 GB', replicas: 3 },
    connections: ['tbl-profiles', 'tbl-sessions'],
  },
  {
    id: 'ks-analytics',
    name: 'Analytics Keyspace',
    type: 'keyspace',
    status: 'warning',
    position: [-3, 0.5, 1],
    metrics: { latency: 12.8, throughput: 22100, storage: '1.1 TB', replicas: 2 },
    connections: ['tbl-events', 'tbl-metrics'],
  },
  {
    id: 'ks-logs',
    name: 'Logs Keyspace',
    type: 'keyspace',
    status: 'healthy',
    position: [0, -2, 2.5],
    metrics: { latency: 5.6, throughput: 18700, storage: '860 GB', replicas: 3 },
    connections: ['tbl-audit'],
  },
  {
    id: 'tbl-profiles',
    name: 'user_profiles',
    type: 'table',
    status: 'healthy',
    position: [5, 3, -2],
    metrics: { latency: 1.8, throughput: 4200, storage: '120 GB', replicas: 3 },
    connections: [],
  },
  {
    id: 'tbl-sessions',
    name: 'active_sessions',
    type: 'table',
    status: 'healthy',
    position: [4.5, 0.5, -3],
    metrics: { latency: 0.9, throughput: 6100, storage: '45 GB', replicas: 3 },
    connections: [],
  },
  {
    id: 'tbl-events',
    name: 'event_stream',
    type: 'table',
    status: 'warning',
    position: [-5, 2, 2],
    metrics: { latency: 18.4, throughput: 15300, storage: '680 GB', replicas: 2 },
    connections: [],
  },
  {
    id: 'tbl-metrics',
    name: 'system_metrics',
    type: 'table',
    status: 'critical',
    position: [-4, -1, 0],
    metrics: { latency: 45.2, throughput: 3100, storage: '420 GB', replicas: 1 },
    connections: [],
  },
  {
    id: 'tbl-audit',
    name: 'audit_trail',
    type: 'table',
    status: 'healthy',
    position: [1, -3.5, 4],
    metrics: { latency: 3.2, throughput: 9800, storage: '210 GB', replicas: 3 },
    connections: [],
  },
];

export const enterpriseNodes: DataNode[] = [
  {
    id: 'ent-core',
    name: 'Global Mesh',
    type: 'cluster',
    status: 'healthy',
    position: [0, 0, 0],
    metrics: { latency: 1.2, throughput: 85000, storage: '12.8 TB', replicas: 5 },
    connections: ['ks-fin', 'ks-ops', 'ks-dev'],
  },
  {
    id: 'ks-fin',
    name: 'Finance DB',
    type: 'keyspace',
    status: 'healthy',
    position: [4, 1, 0],
    metrics: { latency: 0.8, throughput: 42000, storage: '4.2 TB', replicas: 5 },
    connections: ['tbl-trans', 'tbl-tax'],
  },
  {
    id: 'ks-ops',
    name: 'Operations DB',
    type: 'keyspace',
    status: 'healthy',
    position: [-4, 1, 0],
    metrics: { latency: 2.1, throughput: 31000, storage: '3.1 TB', replicas: 3 },
    connections: ['tbl-ship', 'tbl-inv'],
  },
  {
    id: 'ks-dev',
    name: 'Development DB',
    type: 'keyspace',
    status: 'warning',
    position: [0, -4, 0],
    metrics: { latency: 15.4, throughput: 12000, storage: '5.5 TB', replicas: 2 },
    connections: ['tbl-ci', 'tbl-tests'],
  },
  { id: 'tbl-trans', name: 'transactions', type: 'table', status: 'healthy', position: [6, 2, 1], metrics: { latency: 0.4, throughput: 28000, storage: '2.1 TB', replicas: 5 }, connections: [] },
  { id: 'tbl-tax', name: 'tax_records', type: 'table', status: 'healthy', position: [6, 0, -1], metrics: { latency: 1.2, throughput: 14000, storage: '2.1 TB', replicas: 3 }, connections: [] },
  { id: 'tbl-ship', name: 'shipping_logs', type: 'table', status: 'healthy', position: [-6, 2, 1], metrics: { latency: 4.5, throughput: 18000, storage: '1.5 TB', replicas: 3 }, connections: [] },
  { id: 'tbl-inv', name: 'inventory_track', type: 'table', status: 'healthy', position: [-6, 0, -1], metrics: { latency: 2.2, throughput: 13000, storage: '1.6 TB', replicas: 3 }, connections: [] },
  { id: 'tbl-ci', name: 'ci_builds', type: 'table', status: 'warning', position: [1, -6, 1], metrics: { latency: 22.1, throughput: 8000, storage: '3.2 TB', replicas: 2 }, connections: [] },
  { id: 'tbl-tests', name: 'test_coverage', type: 'table', status: 'critical', position: [-1, -6, -1], metrics: { latency: 54.8, throughput: 4000, storage: '2.3 TB', replicas: 1 }, connections: [] },
];

export const getGlobalMetrics = (nodes: DataNode[]) => {
  const totalThroughput = nodes.reduce((acc, n) => acc + n.metrics.throughput, 0);
  const avgLatency = nodes.reduce((acc, n) => acc + n.metrics.latency, 0) / nodes.length;
  const criticalCount = nodes.filter(n => n.status === 'critical').length;
  
  return {
    totalNodes: nodes.length,
    totalThroughput,
    avgLatency,
    uptime: criticalCount > 0 ? 98.42 : 99.98,
  };
};
