// src/components/compound/workflow/WorkflowTable/WorkflowTable.tsx

"use client";

import React from 'react';
import { StatusIndicator } from '@ui/status-indicator';
import ActionDropdown  from '@ui/action-dropdown';
import styles from './WorkflowTable.module.css';

// Import types
export interface WorkflowFailure {
  timestamp: string;
  step: string;
  error: string;
  resolved: boolean;
}

export interface Workflow {
  id: string;
  name: string;
  status: 'running' | 'paused' | 'failed' | 'idle';
  lastRun: string;
  avgDuration: string;
  cpu: string;
  memory: string;
  execRate: string;
  execCount24h: number;
  apiTags: string[];
  recentFailures: WorkflowFailure[];
}

export interface WorkflowTableProps {
  workflows: Workflow[];
  onRowClick?: (workflow: Workflow) => void;
  onAction?: (action: string, workflowId: string) => void;
  className?: string;
}

/**
 * WorkflowTable Compound Component
 * 
 * Purpose: Display workflows in tabular format with actions
 * Reusability: 🔄 Moderately reusable for different workflow types, task lists
 * Architecture: CSS Modules + globals1.css design tokens + UI components
 */
export const WorkflowTable: React.FC<WorkflowTableProps> = ({
  workflows,
  onRowClick,
  onAction,
  className = ''
}) => {
  const getSuccessErrorCount = (workflow: Workflow) => {
    const errors = workflow.recentFailures?.length || 0;
    const total = workflow.execCount24h;
    const success = total - errors;
    return { success, errors };
  };

  const getQueueAvg = (workflowId: string): string => {
    switch (workflowId) {
      case '1': return '2.3min';
      case '2': return '15.7min';
      default: return '45.2min';
    }
  };

  const getBottleneck = (workflowId: string): { text: string; severity: 'warning' | 'error' } => {
    switch (workflowId) {
      case '1': return { text: 'API rate', severity: 'warning' };
      case '2': return { text: 'Memory', severity: 'error' };
      default: return { text: 'CPU', severity: 'error' };
    }
  };

  const getDataRate = (workflowId: string): string => {
    switch (workflowId) {
      case '1': return '0.3x';
      case '2': return '4.4x';
      default: return '1.0x';
    }
  };

  const getActionsForWorkflow = (workflow: Workflow) => {
    const baseActions = {
      running: [
        { label: 'Pause', action: 'pause', color: 'warning' as const },
        { label: 'Stop', action: 'stop', color: 'error' as const }
      ],
      paused: [
        { label: 'Resume', action: 'resume', color: 'success' as const },
        { label: 'Stop', action: 'stop', color: 'error' as const }
      ],
      failed: [
        { label: 'Restart', action: 'restart', color: 'primary' as const },
        { label: 'Edit', action: 'edit', color: 'secondary' as const }
      ],
      idle: [
        { label: 'Run', action: 'run', color: 'primary' as const },
        { label: 'Edit', action: 'edit', color: 'secondary' as const }
      ]
    };

    return baseActions[workflow.status] || [];
  };

  const handleRowClick = (workflow: Workflow) => {
    onRowClick?.(workflow);
  };

  const handleAction = (action: string, workflowId: string) => {
    onAction?.(action, workflowId);
  };

  return (
    <div className={`${styles.tableContainer} ${className}`}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>Name</th>
            <th className={styles.th}>Queue Avg</th>
            <th className={styles.th}>Bottleneck</th>
            <th className={styles.th}>Data Rate</th>
            <th className={styles.th}>CPU (%)</th>
            <th className={styles.th}>Memory (GB)</th>
            <th className={styles.th}>Tags</th>
            <th className={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {workflows.map((workflow) => {
            const { success, errors } = getSuccessErrorCount(workflow);
            const bottleneck = getBottleneck(workflow.id);
            
            return (
              <tr 
                key={workflow.id}
                className={styles.tr}
                onClick={() => handleRowClick(workflow)}
              >
                <td className={styles.td}>
                  <div className={styles.nameCell}>
                    <div className={styles.nameRow}>
                      <StatusIndicator 
                        status={workflow.status} 
                        size="sm" 
                        animated={workflow.status === 'running'}
                      />
                      <span className={styles.workflowName}>
                        {workflow.name}
                      </span>
                    </div>
                    <div className={styles.statsRow}>
                      {success}/{errors}
                    </div>
                  </div>
                </td>
                
                <td className={styles.td}>
                  <span className={styles.metricValue}>
                    {getQueueAvg(workflow.id)}
                  </span>
                </td>
                
                <td className={styles.td}>
                  <span className={`${styles.bottleneck} ${styles[`severity-${bottleneck.severity}`]}`}>
                    {bottleneck.text}
                  </span>
                </td>
                
                <td className={styles.td}>
                  <span className={styles.metricValue}>
                    {getDataRate(workflow.id)}
                  </span>
                </td>
                
                <td className={styles.td}>
                  <span className={styles.metricValue}>
                    {workflow.cpu.replace('%', '')}
                  </span>
                </td>
                
                <td className={styles.td}>
                  <span className={styles.metricValue}>
                    {workflow.memory.replace(' GB', '')}
                  </span>
                </td>
                
                <td className={styles.td}>
                  <div className={styles.tags}>
                    {workflow.apiTags.map((tag) => (
                      <span key={tag} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                
                <td className={styles.td}>
                  <ActionDropdown
                    actions={getActionsForWorkflow(workflow)}
                    onAction={(action) => handleAction(action, workflow.id)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default WorkflowTable;