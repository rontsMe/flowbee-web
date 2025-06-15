// src/components/features/workflow-dashboard/components/RecentIssues/RecentIssues.tsx

"use client";

import React, { useState } from 'react';
import type { WorkflowFailure } from '@compound/workflow';
import styles from './RecentIssues.module.css';

export interface RecentIssuesProps {
  failures: WorkflowFailure[];
  maxItems?: number;
  showResolved?: boolean;
  className?: string;
  title?: string;
}

/**
 * RecentIssues Component
 * 
 * Purpose: Display recent workflow failures and errors
 * Reusability: 🔄 Moderately reusable for error logs, incident history, activity feeds
 * Architecture: CSS Modules + globals1.css design tokens
 */
export const RecentIssues: React.FC<RecentIssuesProps> = ({
  failures,
  maxItems = 5,
  showResolved = true,
  className = '',
  title = 'Recent Issues'
}) => {
  const [filter, setFilter] = useState<'all' | 'unresolved' | 'resolved'>('all');
  const [expanded, setExpanded] = useState<string[]>([]);

  // Filter failures based on current filter
  const filteredFailures = failures.filter(failure => {
    if (filter === 'unresolved') return !failure.resolved;
    if (filter === 'resolved') return failure.resolved;
    return true;
  });

  // Apply maxItems limit
  const displayedFailures = filteredFailures.slice(0, maxItems);

  const getIssueIcon = (error: string, resolved: boolean) => {
    if (resolved) return '✓';
    
    // Categorize errors
    if (error.includes('timeout')) return '⏱';
    if (error.includes('rate limit')) return '🚫';
    if (error.includes('memory')) return '💾';
    if (error.includes('auth')) return '🔐';
    if (error.includes('network') || error.includes('connection')) return '🌐';
    return '⚠';
  };

  const getIssueSeverity = (error: string, resolved: boolean) => {
    if (resolved) return 'resolved';
    
    // High severity issues
    if (error.includes('memory allocation failed') || 
        error.includes('system crash') || 
        error.includes('critical')) return 'critical';
    
    // Medium severity issues  
    if (error.includes('timeout') || 
        error.includes('connection') ||
        error.includes('auth failed')) return 'high';
    
    // Low severity issues
    if (error.includes('rate limit') || 
        error.includes('retry')) return 'medium';
    
    return 'low';
  };

  const toggleExpanded = (timestamp: string) => {
    setExpanded(prev => 
      prev.includes(timestamp) 
        ? prev.filter(t => t !== timestamp)
        : [...prev, timestamp]
    );
  };

  const formatRelativeTime = (timestamp: string) => {
    // Simple relative time formatting (in real app, use a library like date-fns)
    return timestamp;
  };

  if (displayedFailures.length === 0) {
    return (
      <div className={`${styles.container} ${className}`}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>✨</div>
          <div className={styles.emptyText}>No recent issues</div>
          <div className={styles.emptySubtext}>
            {filter === 'unresolved' ? 'All issues have been resolved' : 'Everything is running smoothly'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${className}`}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        
        {/* Filter Controls */}
        {showResolved && failures.length > 0 && (
          <div className={styles.filters}>
            <button
              className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({failures.length})
            </button>
            <button
              className={`${styles.filterButton} ${filter === 'unresolved' ? styles.active : ''}`}
              onClick={() => setFilter('unresolved')}
            >
              Unresolved ({failures.filter(f => !f.resolved).length})
            </button>
            <button
              className={`${styles.filterButton} ${filter === 'resolved' ? styles.active : ''}`}
              onClick={() => setFilter('resolved')}
            >
              Resolved ({failures.filter(f => f.resolved).length})
            </button>
          </div>
        )}
      </div>

      {/* Issues List */}
      <div className={styles.issuesList}>
        {displayedFailures.map((failure, index) => {
          const isExpanded = expanded.includes(failure.timestamp);
          const severity = getIssueSeverity(failure.error, failure.resolved);
          const icon = getIssueIcon(failure.error, failure.resolved);
          
          return (
            <div 
              key={`${failure.timestamp}-${index}`}
              className={`${styles.issueItem} ${styles[`severity-${severity}`]}`}
            >
              <div className={styles.issueHeader}>
                <div className={styles.issueLeft}>
                  <span className={`${styles.issueIcon} ${styles[`severity-${severity}`]}`}>
                    {icon}
                  </span>
                  <div className={styles.issueInfo}>
                    <div className={styles.issueStep}>
                      <span className={styles.stepName}>{failure.step}</span>
                      <span className={styles.issueTime}>
                        {formatRelativeTime(failure.timestamp)}
                      </span>
                    </div>
                    <div className={styles.issueError}>
                      {failure.error}
                    </div>
                  </div>
                </div>
                
                <div className={styles.issueRight}>
                  {failure.resolved && (
                    <span className={styles.resolvedBadge}>Resolved</span>
                  )}
                  <button
                    className={styles.expandButton}
                    onClick={() => toggleExpanded(failure.timestamp)}
                    aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                  >
                    {isExpanded ? '−' : '+'}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className={styles.issueDetails}>
                  <div className={styles.detailItem}>
                    <strong>Step:</strong> {failure.step}
                  </div>
                  <div className={styles.detailItem}>
                    <strong>Error:</strong> {failure.error}
                  </div>
                  <div className={styles.detailItem}>
                    <strong>Timestamp:</strong> {failure.timestamp}
                  </div>
                  <div className={styles.detailItem}>
                    <strong>Status:</strong> {failure.resolved ? 'Resolved' : 'Unresolved'}
                  </div>
                  <div className={styles.detailItem}>
                    <strong>Severity:</strong> <span className={styles[`severity-${severity}`]}>{severity}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Show More */}
      {filteredFailures.length > maxItems && (
        <div className={styles.showMore}>
          <button className={styles.showMoreButton}>
            Show {filteredFailures.length - maxItems} more issues
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentIssues;