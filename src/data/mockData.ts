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

export const mockNodes: DataNode[] = [
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

export const globalMetrics = {
  totalNodes: 9,
  totalThroughput: 101_900,
  avgLatency: 10.4,
  uptime: 99.97,
};
