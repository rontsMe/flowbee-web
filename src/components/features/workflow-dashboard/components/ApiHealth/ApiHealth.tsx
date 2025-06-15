// src/components/features/workflow-dashboard/components/ApiHealth/ApiHealth.tsx

"use client";

import React from 'react';
import { StatusIndicator } from '@ui/status-indicator';
import styles from './ApiHealth.module.css';

export interface ApiHealthData {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  latency: string;
  uptime: string;
  errorRate?: string;
  lastCheck?: string;
  responseTime?: string;
  region?: string;
}

export interface ApiHealthProps {
  apis: ApiHealthData[];
  className?: string;
  title?: string;
  showDetails?: boolean;
}

/**
 * ApiHealth Component
 * 
 * Purpose: Monitor external API health and performance
 * Reusability: ⭐⭐⭐⭐ Highly reusable for service monitoring, status pages
 * Architecture: CSS Modules + globals1.css design tokens + StatusIndicator
 */
export const ApiHealth: React.FC<ApiHealthProps> = ({
  apis,
  className = '',
  title = 'External API Health',
  showDetails = true
}) => {
  const getStatusSummary = () => {
    const healthy = apis.filter(api => api.status === 'healthy').length;
    const degraded = apis.filter(api => api.status === 'degraded').length;
    const down = apis.filter(api => api.status === 'down').length;
    
    return { healthy, degraded, down, total: apis.length };
  };

  const getOverallStatus = () => {
    const summary = getStatusSummary();
    if (summary.down > 0) return 'down';
    if (summary.degraded > 0) return 'degraded';
    return 'healthy';
  };

  const summary = getStatusSummary();
  const overallStatus = getOverallStatus();

  const formatUptime = (uptime: string) => {
    // Enhanced uptime display
    const uptimeFloat = parseFloat(uptime.replace('%', ''));
    if (uptimeFloat >= 99.9) return { value: uptime, level: 'excellent' };
    if (uptimeFloat >= 99.0) return { value: uptime, level: 'good' };
    if (uptimeFloat >= 95.0) return { value: uptime, level: 'warning' };
    return { value: uptime, level: 'poor' };
  };

  const getLatencyLevel = (latency: string) => {
    const latencyMs = parseInt(latency.replace(/[^\d]/g, ''));
    if (latencyMs <= 100) return 'excellent';
    if (latencyMs <= 300) return 'good';
    if (latencyMs <= 1000) return 'warning';
    return 'poor';
  };

  return (
    <div className={`${styles.container} ${className}`}>
      {/* Header with Summary */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.summary}>
            <StatusIndicator status={overallStatus} size="sm" />
            <span className={styles.summaryText}>
              {summary.healthy} healthy, {summary.degraded} degraded, {summary.down} down
            </span>
          </div>
        </div>
        
        <div className={styles.headerRight}>
          <div className={`${styles.overallStatus} ${styles[`status-${overallStatus}`]}`}>
            {overallStatus === 'healthy' ? 'All Systems Operational' :
             overallStatus === 'degraded' ? 'Partial Outage' : 'Major Outage'}
          </div>
        </div>
      </div>

      {/* API Grid */}
      <div className={styles.apiGrid}>
        {apis.map((api) => {
          const uptimeData = formatUptime(api.uptime);
          const latencyLevel = getLatencyLevel(api.latency);
          
          return (
            <div key={api.name} className={`${styles.apiCard} ${styles[`status-${api.status}`]}`}>
              {/* API Header */}
              <div className={styles.apiHeader}>
                <div className={styles.apiInfo}>
                  <StatusIndicator 
                    status={api.status} 
                    size="sm" 
                    animated={api.status === 'degraded'}
                  />
                  <span className={styles.apiName}>{api.name}</span>
                  {api.region && (
                    <span className={styles.apiRegion}>{api.region}</span>
                  )}
                </div>
                <div className={`${styles.statusBadge} ${styles[`badge-${api.status}`]}`}>
                  {api.status}
                </div>
              </div>

              {/* API Metrics */}
              {showDetails && (
                <div className={styles.apiMetrics}>
                  <div className={styles.metric}>
                    <span className={styles.metricLabel}>Latency</span>
                    <span className={`${styles.metricValue} ${styles[`level-${latencyLevel}`]}`}>
                      {api.latency}
                    </span>
                  </div>
                  
                  <div className={styles.metric}>
                    <span className={styles.metricLabel}>Uptime</span>
                    <span className={`${styles.metricValue} ${styles[`level-${uptimeData.level}`]}`}>
                      {uptimeData.value}
                    </span>
                  </div>
                  
                  {api.errorRate && (
                    <div className={styles.metric}>
                      <span className={styles.metricLabel}>Error Rate</span>
                      <span className={styles.metricValue}>{api.errorRate}</span>
                    </div>
                  )}
                  
                  {api.responseTime && (
                    <div className={styles.metric}>
                      <span className={styles.metricLabel}>Response</span>
                      <span className={styles.metricValue}>{api.responseTime}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Last Check */}
              {api.lastCheck && (
                <div className={styles.lastCheck}>
                  Last checked: {api.lastCheck}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ApiHealth;