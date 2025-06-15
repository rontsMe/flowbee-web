// src/components/features/workflow-dashboard/components/QuickStats/QuickStats.tsx

"use client";

import React from 'react';
import type { Workflow } from '@compound/workflow';
import styles from './QuickStats.module.css';

export interface QuickStatsProps {
  workflow: Workflow;
  className?: string;
}

/**
 * QuickStats Component
 * 
 * Purpose: Display key workflow metrics in a compact format
 * Reusability: 🔄 Moderately reusable for different summary statistics
 * Architecture: CSS Modules + globals1.css design tokens
 * Note: Uses simple layout - could integrate with your MetricCard for more features
 */
export const QuickStats: React.FC<QuickStatsProps> = ({
  workflow,
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

  const { success, errors } = getSuccessErrorCount(workflow);
  const queueAvg = getQueueAvg(workflow.id);
  const bottleneck = getBottleneck(workflow.id);

  const getSuccessErrorTrend = () => {
    const errorRate = errors / (success + errors);
    if (errorRate === 0) return { trend: 'success' as const, text: 'No errors' };
    if (errorRate < 0.05) return { trend: 'success' as const, text: 'Low error rate' };
    if (errorRate < 0.15) return { trend: 'warning' as const, text: 'Moderate errors' };
    return { trend: 'error' as const, text: 'High error rate' };
  };

  const successErrorTrend = getSuccessErrorTrend();

  return (
    <div className={`${styles.container} ${className}`}>
      <h3 className={styles.title}>Quick Stats</h3>
      
      <div className={styles.statsGrid}>
        {/* Success/Error Metric */}
        <div className={`${styles.statCard} ${styles[`trend-${successErrorTrend.trend}`]}`}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Success/Error</span>
            <span className={`${styles.trendIndicator} ${styles[`trend-${successErrorTrend.trend}`]}`}>
              {successErrorTrend.trend === 'success' ? '✓' : 
               successErrorTrend.trend === 'warning' ? '⚠' : '✗'}
            </span>
          </div>
          <div className={styles.statValue}>
            <span className={styles.primaryValue}>{success}</span>
            <span className={styles.separator}>/</span>
            <span className={styles.errorValue}>{errors}</span>
          </div>
          <div className={styles.statSubtext}>{successErrorTrend.text}</div>
        </div>

        {/* Queue Average Metric */}
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Queue Avg</span>
          </div>
          <div className={styles.statValue}>
            <span className={styles.primaryValue}>{queueAvg}</span>
          </div>
          <div className={styles.statSubtext}>Processing time</div>
        </div>

        {/* Bottleneck Metric */}
        <div className={`${styles.statCard} ${styles[`severity-${bottleneck.severity}`]}`}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Bottleneck</span>
            <span className={`${styles.severityIndicator} ${styles[`severity-${bottleneck.severity}`]}`}>
              {bottleneck.severity === 'warning' ? '⚠' : '🔥'}
            </span>
          </div>
          <div className={styles.statValue}>
            <span className={styles.primaryValue}>{bottleneck.text}</span>
          </div>
          <div className={styles.statSubtext}>
            {bottleneck.severity === 'warning' ? 'Minor impact' : 'Major impact'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;