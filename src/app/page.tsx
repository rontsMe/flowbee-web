// src/components/page/dashboard/DashboardPage.tsx
'use client';
import React, { useState, useEffect } from 'react';

// Import UI components
import { Button } from '@ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@ui/card';
import { Badge } from '@ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs';
import { Play, Pause, CheckCircle, XCircle, AlertCircle, MoreHorizontal, Workflow } from 'lucide-react';

// Import our metric components
import { 
  SystemMetricCard,
  ChartDataPoint,
  SystemMetricId,
  ChartType,
  generateMockData,
  getDataPointsCount,
  DEFAULT_SYSTEM_METRICS,
  CHART_UPDATE_INTERVAL
} from '@components/features/metrics';

// Layout component
import PageContainer from '@layout/PageContainer';

// Types
interface WorkflowItem {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'failed' | 'pending';
  progress: number;
  startTime: string;
  duration?: string;
  methods: number;
  priority: 'high' | 'medium' | 'low';
}

// System Performance Section using our metric cards
const SystemPerformanceSection: React.FC = () => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [timeRanges, setTimeRanges] = useState<Record<string, string>>({
    'cpu': '30m',
    'memory': '30m',
    'gpu': '30m',
    'disk': '30m'
  });
  const [systemData, setSystemData] = useState({
    'cpu': [] as ChartDataPoint[],
    'memory': [] as ChartDataPoint[],
    'gpu': [] as ChartDataPoint[],
    'disk': [] as ChartDataPoint[]
  });

  // Initialize and update system data
  useEffect(() => {
    const updateData = () => {
      const timestamp = Date.now();
      
      setSystemData(prev => ({
        'cpu': [
          ...prev['cpu'].slice(-(getDataPointsCount(timeRanges['cpu']) - 1)),
          { timestamp, value: Math.max(0, Math.min(100, 67 + (Math.random() - 0.5) * 25)) }
        ],
        'memory': [
          ...prev['memory'].slice(-(getDataPointsCount(timeRanges['memory']) - 1)),
          { timestamp, value: Math.max(0, Math.min(100, 42 + (Math.random() - 0.5) * 15)) }
        ],
        'gpu': [
          ...prev['gpu'].slice(-(getDataPointsCount(timeRanges['gpu']) - 1)),
          { timestamp, value: Math.max(0, Math.min(100, 23 + (Math.random() - 0.5) * 20)) }
        ],
        'disk': [
          ...prev['disk'].slice(-(getDataPointsCount(timeRanges['disk']) - 1)),
          { timestamp, value: Math.max(0, Math.min(100, 78 + (Math.random() - 0.5) * 12)) }
        ]
      }));
    };

    // Generate initial data
    const generateInitialData = (id: string) => {
      const count = getDataPointsCount(timeRanges[id]);
      const config = DEFAULT_SYSTEM_METRICS[id as keyof typeof DEFAULT_SYSTEM_METRICS];
      return generateMockData(config.baseValue, config.variance, count);
    };

    setSystemData({
      'cpu': generateInitialData('cpu'),
      'memory': generateInitialData('memory'),
      'gpu': generateInitialData('gpu'),
      'disk': generateInitialData('disk')
    });

    const interval = setInterval(updateData, CHART_UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, [timeRanges]);

  const handleCardToggle = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  const handleTimeRangeChange = (cardId: string, range: string) => {
    setTimeRanges(prev => ({ ...prev, [cardId]: range }));
  };

  const systemMetrics = [
    {
      id: 'cpu' as SystemMetricId,
      label: 'CPU',
      spec: 'AMD 4-core processor',
      value: systemData['cpu'][systemData['cpu'].length - 1]?.value?.toFixed(0) || '0',
      unit: '%',
      chartType: 'line' as ChartType,
      data: systemData['cpu'],
      timeRange: timeRanges['cpu']
    },
    {
      id: 'memory' as SystemMetricId,
      label: 'Memory',
      spec: '32 GB RAM',
      value: systemData['memory'][systemData['memory'].length - 1]?.value?.toFixed(0) || '0',
      unit: '%',
      chartType: 'area' as ChartType,
      data: systemData['memory'],
      timeRange: timeRanges['memory']
    },
    {
      id: 'gpu' as SystemMetricId,
      label: 'GPU',
      spec: 'NVIDIA GPU',
      value: systemData['gpu'][systemData['gpu'].length - 1]?.value?.toFixed(0) || '0',
      unit: '%',
      chartType: 'line' as ChartType,
      data: systemData['gpu'],
      timeRange: timeRanges['gpu']
    },
    {
      id: 'disk' as SystemMetricId,
      label: 'Disk',
      spec: '1TB NVMe SSD',
      value: systemData['disk'][systemData['disk'].length - 1]?.value?.toFixed(0) || '0',
      unit: '%',
      chartType: 'area' as ChartType,
      data: systemData['disk'],
      timeRange: timeRanges['disk']
    }
  ];

  return (
    <div className="space-y-6 mb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">System Performance</h2>
        <Badge variant="secondary" className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Live Monitoring
        </Badge>
      </div>

      {/* Cards Layout */}
      {expandedCard ? (
        <div className="w-full">
          {systemMetrics.find(m => m.id === expandedCard) && (
            <SystemMetricCard
              {...systemMetrics.find(m => m.id === expandedCard)!}
              isExpanded={true}
              onToggleExpand={() => handleCardToggle(expandedCard)}
              timeRange={systemMetrics.find(m => m.id === expandedCard)!.timeRange}
              onTimeRangeChange={(range) => handleTimeRangeChange(expandedCard, range)}
            />
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemMetrics.map(metric => (
            <SystemMetricCard
              key={metric.id}
              {...metric}
              isExpanded={false}
              onToggleExpand={() => handleCardToggle(metric.id)}
              timeRange={metric.timeRange}
              onTimeRangeChange={(range) => handleTimeRangeChange(metric.id, range)}
            />
          ))}
        </div>
      )}

      {expandedCard && (
        <div className="text-muted-foreground text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Real-time system metrics updating every 1.5 seconds • Hover over charts for details • Click expand icon to collapse
          </div>
        </div>
      )}
    </div>
  );
};

// Workflow Metrics Cards
const WorkflowMetricsCards: React.FC = () => {
  const metrics = [
    {
      title: 'Active Workflows',
      value: '24',
      change: '+12.5%',
      trend: 'up',
      description: 'Currently running'
    },
    {
      title: 'Completed Today',
      value: '156',
      change: '+8.2%',
      trend: 'up',
      description: 'Successfully finished'
    },
    {
      title: 'Failure Rate',
      value: '2.1%',
      change: '-0.3%',
      trend: 'down',
      description: 'Last 24 hours'
    },
    {
      title: 'Avg Response Time',
      value: '245ms',
      change: '-15ms',
      trend: 'down',
      description: 'Method execution'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <Badge variant={metric.trend === 'up' ? 'default' : 'secondary'}>
              {metric.change}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">{metric.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Workflow Card Component
const WorkflowCard: React.FC<{ workflow: WorkflowItem }> = ({ workflow }) => {
  const getStatusIcon = () => {
    switch (workflow.status) {
      case 'running':
        return <Play className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Pause className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusVariant = () => {
    switch (workflow.status) {
      case 'running':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'failed':
        return 'destructive';
      case 'pending':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getPriorityColor = () => {
    switch (workflow.priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-500';
    }
  };

  return (
    <Card className={`border-l-4 ${getPriorityColor()}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <CardTitle className="text-lg">{workflow.name}</CardTitle>
              <Badge variant={getStatusVariant()} className="flex items-center gap-1">
                {getStatusIcon()}
                {workflow.status}
              </Badge>
            </div>
            <CardDescription>
              ID: {workflow.id} • Methods: {workflow.methods} • Started: {workflow.startTime}
              {workflow.duration && ` • Duration: ${workflow.duration}`}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {workflow.status === 'running' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{workflow.progress}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${workflow.progress}%` }}
              />
            </div>
          </div>
        )}
      </CardHeader>

      <CardFooter className="flex gap-2">
        <Button variant="link" size="sm" className="p-0 h-auto text-blue-600">
          View Details
        </Button>
        <Button variant="link" size="sm" className="p-0 h-auto text-muted-foreground">
          View Logs
        </Button>
        {workflow.status === 'running' && (
          <Button variant="link" size="sm" className="p-0 h-auto text-red-600">
            Stop
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

// Workflow List Component
const WorkflowList: React.FC<{ workflows: WorkflowItem[] }> = ({ workflows }) => {
  const [filter, setFilter] = useState('all');

  const filteredWorkflows = workflows.filter(workflow => {
    if (filter === 'all') return true;
    return workflow.status === filter;
  });

  const statusCounts = workflows.reduce((acc, workflow) => {
    acc[workflow.status] = (acc[workflow.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Workflows</h2>
        <Button>Create Workflow</Button>
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="running">
            Running {statusCounts.running && <Badge className="ml-2">{statusCounts.running}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed {statusCounts.completed && <Badge className="ml-2">{statusCounts.completed}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="failed">
            Failed {statusCounts.failed && <Badge className="ml-2">{statusCounts.failed}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending {statusCounts.pending && <Badge className="ml-2">{statusCounts.pending}</Badge>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredWorkflows.map((workflow) => (
              <WorkflowCard key={workflow.id} workflow={workflow} />
            ))}
          </div>

          {filteredWorkflows.length === 0 && (
            <div className="text-center py-12">
              <Workflow className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No workflows found</h3>
              <p className="text-muted-foreground">
                {filter === 'all' ? 'No workflows have been created yet.' : `No ${filter} workflows found.`}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Main Dashboard Page Component
export default function DashboardPage() {
  const mockWorkflows: WorkflowItem[] = [
    {
      id: 'wf-001',
      name: 'Audio Enhancement Pipeline',
      status: 'running',
      progress: 75,
      startTime: '2024-06-12 10:30:00',
      methods: 8,
      priority: 'high'
    },
    {
      id: 'wf-002',
      name: 'Video Processing Workflow',
      status: 'completed',
      progress: 100,
      startTime: '2024-06-12 09:15:00',
      duration: '45m 23s',
      methods: 12,
      priority: 'medium'
    },
    {
      id: 'wf-003',
      name: 'Data Analytics Pipeline',
      status: 'failed',
      progress: 35,
      startTime: '2024-06-12 11:00:00',
      duration: '12m 45s',
      methods: 6,
      priority: 'low'
    },
    {
      id: 'wf-004',
      name: 'Image Classification Batch',
      status: 'pending',
      progress: 0,
      startTime: '2024-06-12 11:30:00',
      methods: 15,
      priority: 'high'
    },
    {
      id: 'wf-005',
      name: 'Text Processing Pipeline',
      status: 'running',
      progress: 45,
      startTime: '2024-06-12 10:45:00',
      methods: 9,
      priority: 'medium'
    },
    {
      id: 'wf-006',
      name: 'ML Model Training',
      status: 'completed',
      progress: 100,
      startTime: '2024-06-12 08:00:00',
      duration: '2h 15m',
      methods: 20,
      priority: 'high'
    }
  ];

  return (
    <PageContainer>
      <div className="space-y-8">
        
        {/* System Performance Section */}
        <SystemPerformanceSection />
        
        {/* Workflow List */}
        <WorkflowList workflows={mockWorkflows} />
      </div>
    </PageContainer>
  );
}