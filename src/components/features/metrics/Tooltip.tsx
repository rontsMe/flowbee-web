// src/components/features/metrics/Tooltip.tsx

"use client";

import React from 'react';
import { TooltipProps, formatTooltipTime, formatValue } from './types';
import styles from './Tooltip.module.css';

/**
 * Tooltip Component - Refactored with CSS Modules
 * 
 * Purpose: Chart hover tooltip display
 * Features: Fixed positioning, formatted values, theme-aware
 * Architecture: CSS Modules + primitive tokens, no Tailwind
 */
const Tooltip: React.FC<TooltipProps> = ({ tooltip }) => {
  const { x, y, timestamp, value, unit } = tooltip;

  const tooltipStyle: React.CSSProperties = {
    left: x,
    top: y,
  };

  return (
    <div 
      className={styles.tooltip} 
      style={tooltipStyle}
      role="tooltip"
      aria-live="polite"
    >
      <div className={styles.tooltipContent}>
        <div className={styles.tooltipValue}>
          {formatValue(value, undefined, 1)}
          {unit && <span className={styles.tooltipUnit}>{unit}</span>}
        </div>
        <div className={styles.tooltipTime}>
          {formatTooltipTime(timestamp)}
        </div>
      </div>
    </div>
  );
};

export default Tooltip;