'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card';
import { Badge } from '@ui/badge';
import { Button } from '@ui/button';
import { Progress } from '@ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs';
import { ScrollArea } from '@ui/scroll-area';
import { Separator } from '@ui/separator';
import { 
  Activity, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Cpu, 
  HardDrive, 
  Zap,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  Eye,
  BarChart3,
  Settings,
  Workflow,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

// Type definitions based on Flowbee architecture
interface WorkflowExecutionRecord {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'failed' | 'pending';
  progress: number;
  startTime: string;
  estimatedCompletion?: string;
  completedTime?: string;
  failedTime?: string;
  totalMethods: number;
  completedMethods: number;
  failedMethods: number;
  currentMethod?: string;
  priority: 'high' | 'medium' | 'low';
  error?: string;
}

interface MethodExecutionRecord {
  name: string;
  status: 'running' | 'completed' | 'failed' | 'pending';
  duration?: number;
  startTime?: string;
  endTime?: string;
  threadUsage: number;
  memoryUsage: number;
  type: 'sync_cpu' | 'async_io';
  progress?: number;
}

interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  activeThreads: number;
  totalThreads: number;
  queuedMethods: number;
  runningWorkflows: number;
  completedToday: number;
  failureRate: number;
}

interface SystemMetricsCardProps {
  title: string;
  value: number;
  unit: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down';
  trendValue?: string;
}

interface StatusIconProps {
  status: 'running' | 'completed' | 'failed' | 'pending';
  className?: string;
}

interface StatusBadgeProps {
  status: 'running' | 'completed' | 'failed' | 'pending';
}

interface PriorityBadgeProps {
  priority: 'high' | 'medium' | 'low';
}

interface WorkflowCardProps {
  workflow: WorkflowExecutionRecord;
}

interface MethodExecutionRowProps {
  method: MethodExecutionRecord;
}

// Mock data - replace with real API calls
const mockWorkflows: WorkflowExecutionRecord[] = [
  {
    id: 'wf-001',
    name: 'Video Processing Pipeline',
    status: 'running',
    progress: 65,
    startTime: '2025-06-11T10:30:00Z',
    estimatedCompletion: '2025-06-11T11:45:00Z',
    totalMethods: 8,
    completedMethods: 5,
    failedMethods: 0,
    currentMethod: 'extract_transcript',
    priority: 'high'
  },
  {
    id: 'wf-002', 
    name: 'Audio Enhancement',
    status: 'completed',
    progress: 100,
    startTime: '2025-06-11T09:15:00Z',
    completedTime: '2025-06-11T10:20:00Z',
    totalMethods: 6,
    completedMethods: 6,
    failedMethods: 0,
    priority: 'medium'
  },
  {
    id: 'wf-003',
    name: 'Metadata Extraction',
    status: 'failed',
    progress: 45,
    startTime: '2025-06-11T08:45:00Z',
    failedTime: '2025-06-11T09:30:00Z',
    totalMethods: 5,
    completedMethods: 2,
    failedMethods: 1,
    currentMethod: 'validate_quality',
    priority: 'low',
    error: 'Network timeout during audio download'
  }
];

const mockMethods: MethodExecutionRecord[] = [
  {
    name: 'extract_video_id',
    status: 'completed',
    duration: 2.3,
    startTime: '10:30:15',
    endTime: '10:30:17',
    threadUsage: 15,
    memoryUsage: 24,
    type: 'sync_cpu'
  },
  {
    name: 'download_audio',
    status: 'completed', 
    duration: 45.7,
    startTime: '10:30:17',
    endTime: '10:31:03',
    threadUsage: 40,
    memoryUsage: 156,
    type: 'async_io'
  },
  {
    name: 'enhance_audio',
    status: 'completed',
    duration: 12.4,
    startTime: '10:31:03', 
    endTime: '10:31:15',
    threadUsage: 60,
    memoryUsage: 89,
    type: 'sync_cpu'
  },
  {
    name: 'extract_transcript',
    status: 'running',
    duration: 67.2,
    startTime: '10:31:15',
    threadUsage: 85,
    memoryUsage: 245,
    type: 'sync_cpu',
    progress: 78
  },
  {
    name: 'translate_text',
    status: 'pending',
    threadUsage: 0,
    memoryUsage: 0,
    type: 'async_io'
  }
];

const mockSystemMetrics: SystemMetrics = {
  cpuUsage: 67,
  memoryUsage: 42,
  activeThreads: 12,
  totalThreads: 16,
  queuedMethods: 8,
  runningWorkflows: 3,
  completedToday: 47,
  failureRate: 2.1
};

const StatusIcon: React.FC<StatusIconProps> = ({ status, className = "w-4 h-4" }) => {
  switch (status) {
    case 'running':
      return <Activity className={`${className} text-blue-500 animate-pulse`} />;
    case 'completed':
      return <CheckCircle className={`${className} text-green-500`} />;
    case 'failed':
      return <XCircle className={`${className} text-red-500`} />;
    case 'pending':
      return <Clock className={`${className} text-gray-400`} />;
    default:
      return <Clock className={`${className} text-gray-400`} />;
  }
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    running: 'default',
    completed: 'secondary', 
    failed: 'destructive',
    pending: 'outline'
  };
  
  return (
    <Badge variant={variants[status]} className="capitalize">
      {status}
    </Badge>
  );
};

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const colors: Record<string, string> = {
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', 
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  };
  
  return (
    <Badge className={colors[priority]} variant="outline">
      {priority}
    </Badge>
  );
};

const WorkflowCard: React.FC<WorkflowCardProps> = ({ workflow }) => {
  const formatTime = (timeStr: string): string => {
    return new Date(timeStr).toLocaleTimeString();
  };
  
  const getElapsedTime = (startTime: string, endTime?: string): string => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const diff = Math.floor((end.getTime() - start.getTime()) / 1000 / 60);
    return `${diff}m`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusIcon status={workflow.status} />
            <CardTitle className="text-base font-semibold">{workflow.name}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <PriorityBadge priority={workflow.priority} />
            <StatusBadge status={workflow.status} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{workflow.completedMethods}/{workflow.totalMethods} methods</span>
        </div>
        
        <Progress value={workflow.progress} className="h-2" />
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Started</div>
            <div className="font-medium">{formatTime(workflow.startTime)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">
              {workflow.status === 'running' ? 'ETA' : workflow.status === 'completed' ? 'Completed' : 'Failed'}
            </div>
            <div className="font-medium">
              {workflow.status === 'running' && workflow.estimatedCompletion 
                ? formatTime(workflow.estimatedCompletion)
                : workflow.completedTime 
                ? formatTime(workflow.completedTime)
                : workflow.failedTime
                ? formatTime(workflow.failedTime)
                : 'N/A'
              }
            </div>
          </div>
        </div>
        
        {workflow.currentMethod && (
          <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
            <Activity className="w-3 h-3 text-blue-500 animate-pulse" />
            <span className="text-sm font-medium">Current: {workflow.currentMethod}</span>
          </div>
        )}
        
        {workflow.error && (
          <div className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-950 rounded-md">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-red-700 dark:text-red-300">{workflow.error}</span>
          </div>
        )}
        
        <div className="flex items-center gap-1">
          <Button size="sm" variant="outline" className="h-7">
            <Eye className="w-3 h-3 mr-1" />
            View
          </Button>
          {workflow.status === 'running' && (
            <Button size="sm" variant="outline" className="h-7">
              <PauseCircle className="w-3 h-3 mr-1" />
              Pause
            </Button>
          )}
          {workflow.status === 'failed' && (
            <Button size="sm" variant="outline" className="h-7">
              <RotateCcw className="w-3 h-3 mr-1" />
              Retry
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const MethodExecutionRow: React.FC<MethodExecutionRowProps> = ({ method }) => {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-3">
        <StatusIcon status={method.status} />
        <div>
          <div className="font-medium text-sm">{method.name}</div>
          <div className="text-xs text-muted-foreground">{method.type}</div>
        </div>
      </div>
      
      <div className="flex items-center gap-6 text-sm">
        {method.status === 'running' && method.progress && (
          <div className="flex items-center gap-2">
            <Progress value={method.progress} className="w-16 h-1" />
            <span className="text-xs">{method.progress}%</span>
          </div>
        )}
        
        <div className="text-right">
          <div className="font-medium">
            {method.duration ? `${method.duration}s` : method.status === 'running' ? 'Running...' : 'Pending'}
          </div>
          <div className="text-xs text-muted-foreground">
            {method.startTime && `Started ${method.startTime}`}
          </div>
        </div>
        
        <div className="text-right min-w-20">
          <div className="text-xs text-muted-foreground">CPU/Mem</div>
          <div className="font-medium text-xs">{method.threadUsage}% / {method.memoryUsage}MB</div>
        </div>
      </div>
    </div>
  );
};

const SystemMetricsCard: React.FC<SystemMetricsCardProps> = ({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  trend, 
  trendValue 
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}{unit}</p>
            {trend && (
              <div className="flex items-center gap-1 mt-1">
                {trend === 'up' ? (
                  <TrendingUp className="w-3 h-3 text-green-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                )}
                <span className="text-xs text-muted-foreground">{trendValue}</span>
              </div>
            )}
          </div>
          <Icon className="w-8 h-8 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
};

const WorkflowOrchestrationDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');
  const [refreshInterval, setRefreshInterval] = useState<number>(5);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      // Simulate real-time updates
      console.log('Refreshing dashboard data...');
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const handleTabChange = (value: string): void => {
    setSelectedTab(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Workflow className="w-8 h-8 text-primary" />
              Flowbee Orchestration Dashboard
            </h1>
            <p className="text-muted-foreground">Monitor and manage your workflow execution in real-time</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button size="sm">
              <PlayCircle className="w-4 h-4 mr-2" />
              New Workflow
            </Button>
          </div>
        </div>

        {/* System Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SystemMetricsCard
            title="CPU Usage"
            value={mockSystemMetrics.cpuUsage}
            unit="%"
            icon={Cpu}
            trend="up"
            trendValue="+5.2%"
          />
          <SystemMetricsCard
            title="Memory Usage" 
            value={mockSystemMetrics.memoryUsage}
            unit="%"
            icon={HardDrive}
            trend="down"
            trendValue="-2.1%"
          />
          <SystemMetricsCard
            title="Active Threads"
            value={mockSystemMetrics.activeThreads}
            unit={`/${mockSystemMetrics.totalThreads}`}
            icon={Zap}
          />
          <SystemMetricsCard
            title="Completed Today"
            value={mockSystemMetrics.completedToday}
            unit=""
            icon={CheckCircle}
            trend="up"
            trendValue="+12"
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workflows">Active Workflows</TabsTrigger>
            <TabsTrigger value="methods">Method Execution</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Recent Workflows */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Recent Workflows
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-80">
                      <div className="space-y-3">
                        {mockWorkflows.map((workflow) => (
                          <WorkflowCard key={workflow.id} workflow={workflow} />
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
              
              {/* Quick Stats */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">System Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Running Workflows</span>
                      <Badge>{mockSystemMetrics.runningWorkflows}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Queued Methods</span>
                      <Badge variant="outline">{mockSystemMetrics.queuedMethods}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Failure Rate</span>
                      <Badge variant="destructive">{mockSystemMetrics.failureRate}%</Badge>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Thread Utilization</span>
                        <span className="text-sm font-medium">
                          {mockSystemMetrics.activeThreads}/{mockSystemMetrics.totalThreads}
                        </span>
                      </div>
                      <Progress value={(mockSystemMetrics.activeThreads / mockSystemMetrics.totalThreads) * 100} />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Start New Workflow
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Analytics
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      System Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
            </div>
          </TabsContent>

          <TabsContent value="workflows" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Workflows</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {mockWorkflows.map((workflow) => (
                    <WorkflowCard key={workflow.id} workflow={workflow} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="methods" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Method Execution Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockMethods.map((method, index) => (
                    <MethodExecutionRow key={index} method={method} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4" />
                    <p>Analytics charts would be rendered here</p>
                    <p className="text-sm">Integration with Chart.js or Recharts</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Resource Utilization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4" />
                    <p>Resource utilization graphs</p>
                    <p className="text-sm">Real-time CPU, Memory, Thread usage</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Auto-refresh indicator */}
        {autoRefresh && (
          <div className="fixed bottom-4 right-4">
            <Badge variant="outline" className="bg-background">
              <Activity className="w-3 h-3 mr-1 animate-pulse" />
              Auto-refreshing every {refreshInterval}s
            </Badge>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default WorkflowOrchestrationDashboard;