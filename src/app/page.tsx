'use client';
import { useTheme } from 'next-themes';
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Activity,
  Workflow,
  Database,
  BarChart3,
  FileText,
  GitBranch,
  Eye,
  Layers,
  Monitor,
  MemoryStick,
  Cpu,
  Clock,
  Sun,
  Moon,
  Bell,
  LogOut,
  Home,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreHorizontal,
  PanelLeftIcon
} from 'lucide-react';

// Import existing project components
import { Button } from '@ui/button';
import { Input } from '@ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@ui/card';
import { Badge } from '@ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  useSidebar
} from '@ui/sidebar';
import { Separator } from '@ui/separator';

// Types
interface SystemMetrics {
  threads: { current: number; max: number };
  memory: number;
  cpu: number;
  refreshRate: number;
}

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

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
}

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      variant="ghost"
      size="icon"
      className="h-8 w-8"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </Button>
  );
};


// App Sidebar using project components
const AppSidebar: React.FC<{ systemMetrics: SystemMetrics }> = ({ systemMetrics }) => {
  const primaryNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/dashboard' },
    { id: 'workflows', label: 'Workflows', icon: Workflow, href: '/workflows', badge: 12 },
    { id: 'methods', label: 'Methods', icon: Activity, href: '/methods', badge: 45 },
    { id: 'services', label: 'Services', icon: Database, href: '/services', badge: 8 },
    { id: 'templates', label: 'Templates', icon: FileText, href: '/templates' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/analytics' },
    { id: 'logs', label: 'Logs', icon: FileText, href: '/logs' }
  ];

  const devToolsItems: NavItem[] = [
    { id: 'dependency', label: 'Dependency Graph', icon: GitBranch, href: '/dev/dependency' },
    { id: 'inspector', label: 'Method Inspector', icon: Eye, href: '/dev/inspector' },
    { id: 'resolver', label: 'Resolver Viewer', icon: Layers, href: '/dev/resolver' }
  ];

  const [activeItem, setActiveItem] = useState('workflows');

  return (
    <Sidebar className="bg-sidebar">
      <SidebarHeader className="bg-sidebar">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Workflow className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-sidebar-foreground">Flowbee</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-sidebar">
        {/* Primary Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Primary</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {primaryNavItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeItem === item.id}
                    onClick={() => setActiveItem(item.id)}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator />

        {/* Dev Tools */}
        <SidebarGroup>
          <SidebarGroupLabel>Dev Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {devToolsItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeItem === item.id}
                    onClick={() => setActiveItem(item.id)}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator />

        {/* System Status */}
        <SidebarGroup>
          <SidebarGroupLabel>System Status</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-2 px-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Monitor className="w-3 h-3" />
                  <span>Threads</span>
                </div>
                <span className="font-mono">{systemMetrics.threads.current}/{systemMetrics.threads.max}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <MemoryStick className="w-3 h-3" />
                  <span>Memory</span>
                </div>
                <span className="font-mono">{systemMetrics.memory}%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Cpu className="w-3 h-3" />
                  <span>CPU</span>
                </div>
                <span className="font-mono">{systemMetrics.cpu}%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  <span>Refresh</span>
                </div>
                <span className="font-mono">{systemMetrics.refreshRate}s</span>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-sidebar">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-white">ZR</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Zahid Ronty</p>
            <p className="text-xs text-muted-foreground truncate">zahid.ronty@email.com</p>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <LogOut className="w-3 h-3" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

// Top Navbar Component using project components
const TopNavbar: React.FC = () => {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Workflows', href: '/workflows' }
  ];

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm">
        {breadcrumbs.map((item, index) => (
          <div key={item.href} className="flex items-center">
            {index > 0 && <span className="text-muted-foreground mx-2">/</span>}
            <Button
              variant="ghost"
              size="sm"
              className={`h-auto p-0 ${
                index === breadcrumbs.length - 1
                  ? 'text-blue-600 dark:text-blue-400 font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.label}
            </Button>
          </div>
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search methods, workflows, logs..."
            className="pl-10 bg-background"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Active Node Indicator */}
        <Badge variant="secondary" className="hidden lg:flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          Active: enhance_audio
        </Badge>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-4 h-4" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
            3
          </Badge>
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Profile */}
        <Button variant="ghost" size="icon">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-white">ZR</span>
          </div>
        </Button>
      </div>
    </header>
  );
};

// System Metrics Cards using project Card component
const SystemMetricsCards: React.FC = () => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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

// Workflow Card Component using project Card
const WorkflowCard: React.FC<{ workflow: WorkflowItem }> = side({ workflow }) => {
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

        {/* Progress Bar */}
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

// Workflow List Component using project Tabs
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

// Main Dashboard Component
const WorkflowOrchestrationDashboard: React.FC = () => {
  const systemMetrics: SystemMetrics = {
    threads: { current: 12, max: 16 },
    memory: 42,
    cpu: 67,
    refreshRate: 5
  };

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
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <AppSidebar systemMetrics={systemMetrics} />
        <SidebarInset className="flex flex-col bg-background">
          <TopNavbar />
          <main className="flex-1 overflow-auto p-6 bg-background">
            <SystemMetricsCards />
            <WorkflowList workflows={mockWorkflows} />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default function App() {
  return (
      <WorkflowOrchestrationDashboard />
  );
}