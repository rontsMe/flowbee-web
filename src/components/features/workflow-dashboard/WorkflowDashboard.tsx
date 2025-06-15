// src/components/features/workflow-dashboard/WorkflowDashboard.tsx

"use client";

import React, { useState } from 'react';
import { WorkflowTable } from '@compound/workflow';
import type { Workflow } from '@compound/workflow';
import styles from './WorkflowDashboard.module.css';

// Mock data - in production this would come from Zustand + SWR/React Query
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

export interface WorkflowDashboardProps {
  className?: string;
}

/**
 * WorkflowDashboard Feature Component
 * 
 * Purpose: Main dashboard for monitoring workflows
 * Architecture: CSS Modules + globals1.css design tokens + compound components
 * State: Will migrate to Zustand + SWR/React Query for real data
 */
export const WorkflowDashboard: React.FC<WorkflowDashboardProps> = ({
  className = ''
}) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  
  // TODO: Replace with Zustand state management
  // const { workflows, isLoading, error } = useWorkflows();
  // const { selectedWorkflow, setSelectedWorkflow } = useWorkflowStore();
  
  const handleRowClick = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    console.log('Workflow selected:', workflow.name);
    // TODO: Open drawer/modal or navigate to detail view
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
        
        {/* TODO: Add filters, search, refresh controls */}
        <div className={styles.headerActions}>
          <button className={styles.refreshButton}>
            Refresh
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        <WorkflowTable
          workflows={mockWorkflows}
          onRowClick={handleRowClick}
          onAction={handleAction}
          className={styles.workflowTable}
        />
        
        {/* TODO: Add workflow detail drawer/modal */}
        {selectedWorkflow && (
          <div className={styles.selectedInfo}>
            Selected: {selectedWorkflow.name}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowDashboard;