// src/components/ui/status-indicator/StatusIndicator.tsx

"use client";

import React from 'react';
import styles from './StatusIndicator.module.css';
import classnames from 'classnames';

export interface StatusIndicatorProps {
  status: string; // e.g. 'success', 'error', 'warning', 'info'
  size?: 'xs' | 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'md',
  animated = false,
  className = ''
}) => {

  return (
    <div 
          className={classnames(
        styles.indicator,
        styles[`size-${size}`],
        styles[`status-${status}`],
        animated && styles.animated,
        className
      )}
      data-status={status}
      data-size={size}
      role="img"
      aria-label={`Status: ${status}`}
    />
  );
};

export default StatusIndicator;