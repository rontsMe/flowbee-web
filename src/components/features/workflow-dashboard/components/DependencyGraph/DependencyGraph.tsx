// src/components/features/workflow-dashboard/components/DependencyGraph/DependencyGraph.tsx

"use client";

import React, { useState } from 'react';
import styles from './DependencyGraph.module.css';

export interface DependencyStep {
  id: string;
  name: string;
  duration: string;
  type: 'api' | 'internal' | 'storage';
  api?: {
    name: string;
    direction: 'up' | 'down';
    status: 'healthy' | 'degraded' | 'down';
  };
  isBottleneck?: boolean;
  tooltip?: string;
}

export interface DependencyGraphProps {
  workflowId: string;
  steps?: DependencyStep[];
  className?: string;
}

/**
 * DependencyGraph Component
 * 
 * Purpose: Visual representation of workflow steps and dependencies
 * Reusability: ⚫ Workflow-specific, could be abstracted to generic ProcessFlow
 * Architecture: CSS Modules + globals1.css design tokens
 */
export const DependencyGraph: React.FC<DependencyGraphProps> = ({
  workflowId,
  steps: propSteps,
  className = ''
}) => {
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);

  // Mock data based on workflowId if no steps provided
  const getStepsForWorkflow = (id: string): DependencyStep[] => {
    switch (id) {
      case '1':
        return [
          {
            id: 'fetch',
            name: 'fetchVideo',
            duration: '12s',
            type: 'api',
            api: { name: 'YouTube', direction: 'up', status: 'healthy' },
            tooltip: 'Fetches video data from YouTube API. Average: 8-15s, Current: 12s'
          },
          {
            id: 'transcribe',
            name: 'transcribe',
            duration: '8s',
            type: 'api',
            api: { name: 'OpenAI', direction: 'up', status: 'degraded' },
            isBottleneck: true,
            tooltip: 'Transcribes audio using OpenAI. BOTTLENECK - Usually 3.2s, currently 8s'
          },
          {
            id: 'clean',
            name: 'cleanText',
            duration: '0.2s',
            type: 'internal',
            tooltip: 'Internal text cleaning. Consistent 0.1-0.3s performance'
          },
          {
            id: 'store',
            name: 'store',
            duration: '0.5s',
            type: 'storage',
            api: { name: 'Supabase', direction: 'down', status: 'healthy' },
            tooltip: 'Stores processed data in Supabase. Average: 0.3-0.7s'
          }
        ];
      case '2':
        return [
          {
            id: 'fetch',
            name: 'fetchContent',
            duration: '3.2s',
            type: 'api',
            api: { name: 'Slack', direction: 'up', status: 'healthy' }
          },
          {
            id: 'summarize',
            name: 'summarize',
            duration: '15.8s',
            type: 'api',
            api: { name: 'OpenAI', direction: 'up', status: 'degraded' },
            isBottleneck: true
          },
          {
            id: 'notify',
            name: 'notify',
            duration: '1.1s',
            type: 'api',
            api: { name: 'Slack', direction: 'down', status: 'healthy' }
          }
        ];
      default:
        return [
          {
            id: 'fetch',
            name: 'fetchImage',
            duration: '2.1s',
            type: 'storage',
            api: { name: 'S3', direction: 'up', status: 'healthy' }
          },
          {
            id: 'process',
            name: 'processImage',
            duration: '45.2s',
            type: 'internal',
            isBottleneck: true
          },
          {
            id: 'store',
            name: 'storeResult',
            duration: '1.8s',
            type: 'storage',
            api: { name: 'ImageKit', direction: 'down', status: 'healthy' }
          }
        ];
    }
  };

  const steps = propSteps || getStepsForWorkflow(workflowId);

  const getStepTypeColor = (type: string) => {
    switch (type) {
      case 'api': return 'api';
      case 'internal': return 'internal';
      case 'storage': return 'storage';
      default: return 'api';
    }
  };

  const getApiStatusColor = (status?: string) => {
    switch (status) {
      case 'healthy': return 'success';
      case 'degraded': return 'warning';
      case 'down': return 'error';
      default: return 'neutral';
    }
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>Dependency Graph</h3>
        
        {/* API Legend on LEFT */}
        <div className={styles.legend}>
          <div className={styles.legendSection}>
            <span className={styles.legendTitle}>API Status:</span>
            <div className={styles.legendItems}>
              <div className={styles.legendItem}>
                <span className={`${styles.legendArrow} ${styles.statusSuccess}`}>↑</span>
                <span>Healthy</span>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.legendArrow} ${styles.statusWarning}`}>↑</span>
                <span>Degraded</span>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.legendArrow} ${styles.statusError}`}>↑</span>
                <span>Down</span>
              </div>
            </div>
          </div>
          
          <div className={styles.legendSection}>
            <span className={styles.legendTitle}>Services:</span>
            <div className={styles.legendItems}>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles.typeApi}`}></div>
                <span>API</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles.typeInternal}`}></div>
                <span>Internal</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles.typeStorage}`}></div>
                <span>Storage</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.graphContainer}>
        <div className={styles.stepsContainer}>
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              {/* Step Node */}
              <div className={styles.stepWrapper}>
                {/* API Arrow */}
                {step.api && (
                  <div 
                    className={`${styles.apiArrow} ${styles[`direction-${step.api.direction}`]} ${styles[`status-${getApiStatusColor(step.api.status)}`]}`}
                  >
                    <div className={styles.apiLabel}>
                      <span className={`${styles.apiStatus} ${styles[`status-${getApiStatusColor(step.api.status)}`]}`}>
                        ●
                      </span>
                      {step.api.name}
                    </div>
                    <div className={styles.arrow}>
                      {step.api.direction === 'up' ? '↑' : '↓'}
                    </div>
                  </div>
                )}
                
                {/* Step Node */}
                <div 
                  className={`${styles.step} ${styles[`type-${getStepTypeColor(step.type)}`]} ${
                    step.isBottleneck ? styles.bottleneck : ''
                  } ${hoveredStep === step.id ? styles.hovered : ''}`}
                  onMouseEnter={() => setHoveredStep(step.id)}
                  onMouseLeave={() => setHoveredStep(null)}
                  title={step.tooltip}
                >
                  <div className={styles.stepName}>{step.name}</div>
                  <div className={styles.stepDuration}>{step.duration}</div>
                  {step.isBottleneck && (
                    <div className={styles.bottleneckIndicator}>!</div>
                  )}
                </div>
              </div>

              {/* Arrow between steps */}
              {index < steps.length - 1 && (
                <div className={styles.flowArrow}>→</div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Bottleneck Legend */}
        {steps.some(step => step.isBottleneck) && (
          <div className={styles.bottleneckLegend}>
            <div className={styles.bottleneckLine}></div>
            <span>Bottleneck</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DependencyGraph;