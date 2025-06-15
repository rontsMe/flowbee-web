// src/components/features/workflow-dashboard/WorkflowDashboardComplete.tsx

"use client";

import React, { useState } from 'react';
import { WorkflowTable, WorkflowDrawer } from '@compound/workflow';
import { DependencyGraph, QuickStats, ApiHealth, RecentIssues } from './components';
import type { Workflow } from '@compound/workflow';
import type { ApiHealthData } from './components';
import styles from './WorkflowDashboard.module.css';

// Mock API health data
const mockApiHealth: ApiHealthData[] = [
  { 
    name: 'YouTube', 
    status: 'healthy', 
    latency: '245ms', 
    uptime: '99.9%',
    errorRate: '0.01%',
    lastCheck: '30s ago',
    region: 'US-East'
  },
  { 
    name: 'OpenAI', 
    status: 'degraded', 
    latency: '1.2s', 
    uptime: '97.1%',
    errorRate: '2.3%',
    lastCheck: '45s ago',
    region: 'US-West'
  },
  { 
    name: 'Supabase', 
    status: 'healthy', 
    latency: '180ms', 
    uptime: '99.8%',
    errorRate: '0.05%',
    lastCheck: '15s ago',
    region: 'EU-Central'
  }
];

// Mock workflow data
const mockWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'data-cleaner',
    status: 'running',
    lastRun: '2m ago',
    avgDuration: '38s',
    cpu: '45%',
    memory: '1.2 GB',
    execRate: '15/min',
    execCount24h: 780,
    apiTags: ['YouTube', 'Supabase'],
    recentFailures: [
      { timestamp: '3h ago', step: 'transcribe', error: 'timeout', resolved: true }
    ]
  },
  {
    id: '2',
    name: 'ai-summarizer',
    status: 'paused',
    lastRun: '1h ago',
    avgDuration: '6.1s',
    cpu: '82%',
    memory: '3.5 GB',
    execRate: '3/min',
    execCount24h: 95,
    apiTags: ['OpenAI', 'Slack'],
    recentFailures: [
      { timestamp: '2h ago', step: 'summarize', error: 'API rate limit exceeded', resolved: true },
      { timestamp: '4h ago', step: 'summarize', error: 'connection timeout', resolved: true },
      { timestamp: '6h ago', step: 'fetchContent', error: 'auth failed', resolved: true }
    ]
  },
  {
    id: '3',
    name: 'image-processor',
    status: 'failed',
    lastRun: '45m ago',
    avgDuration: '2.3s',
    cpu: '12%',
    memory: '800 MB',
    execRate: '8/min',
    execCount24h: 240,
    apiTags: ['S3', 'ImageKit'],
    recentFailures: [
      { timestamp: '45m ago', step: 'processImage', error: 'memory allocation failed', resolved: false },
      { timestamp: '1h ago', step: 'processImage', error: 'memory allocation failed', resolved: false },
      { timestamp: '2h ago', step: 'processImage', error: 'invalid image format', resolved: false },
      { timestamp: '3h ago', step: 'processImage', error: 'memory allocation failed', resolved: false },
      { timestamp: '4h ago', step: 'fetchImage', error: 'S3 timeout', resolved: true }
    ]
  }
];

export interface WorkflowDashboardCompleteProps {
  className?: string;
}

/**
 * Complete Workflow Dashboard
 * 
 * Purpose: Full-featured dashboard with all components integrated
 * Architecture: CSS Modules + globals1.css design tokens + compound components
 * Features: Table, drawer with dependency graph, performance charts, stats, API health, recent issues
 */
export const WorkflowDashboardComplete: React.FC<WorkflowDashboardCompleteProps> = ({
  className = ''
}) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const handleRowClick = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedWorkflow(null), 300);
  };

  const handleAction = (action: string, workflowId: string) => {
    console.log(`Action: ${action} on workflow: ${workflowId}`);
    // TODO: Implement actual workflow actions via API
    
    // Mock action feedback
    switch (action) {
      case 'pause':
        console.log('Pausing workflow...');
        break;
      case 'resume':
        console.log('Resuming workflow...');
        break;
      case 'stop':
        console.log('Stopping workflow...');
        break;
      case 'restart':
        console.log('Restarting workflow...');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  return (
    <div className={`${styles.dashboard} ${className}`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Workflows</h1>
          <p className={styles.subtitle}>
            Monitor automation pipelines and system performance
          </p>
        </div>
        
        <div className={styles.headerActions}>
          <button className={styles.refreshButton}>
            Refresh
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Workflow Table */}
        <WorkflowTable
          workflows={mockWorkflows}
          onRowClick={handleRowClick}
          onAction={handleAction}
          className={styles.workflowTable}
        />
      </div>

      {/* Workflow Drawer with ALL Components */}
      {selectedWorkflow && (
        <WorkflowDrawer
          workflow={selectedWorkflow}
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
        >
          <>
            {/* Dependency Graph */}
            <DependencyGraph 
              workflowId={selectedWorkflow.id}
            />

            {/* Performance Charts */}
            {/* <PerformanceCharts 
              updateInterval={2000}
              title="Real-time Performance"
            /> */}

            {/* Quick Stats */}
            <QuickStats workflow={selectedWorkflow} />

            {/* API Health */}
            <ApiHealth apis={mockApiHealth} />

            {/* Recent Issues */}
            <RecentIssues 
              failures={selectedWorkflow.recentFailures}
              maxItems={5}
              showResolved={true}
            />
          </>
        </WorkflowDrawer>
      )}
    </div>
  );
};

export default WorkflowDashboardComplete;