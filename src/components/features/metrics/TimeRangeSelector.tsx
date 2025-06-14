// src/components/features/metrics/TimeRangeSelector.tsx

"use client";

import React from 'react';
import { TimeRangeSelectorProps, TIME_RANGES } from './types';
import styles from './TimeRangeSelector.module.css';

/**
 * TimeRangeSelector Component - Refactored with CSS Modules
 * 
 * Purpose: Time range selection buttons for metrics
 * Features: Active state, hover effects, keyboard accessible
 * Architecture: CSS Modules + primitive tokens, no Tailwind
 */
const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  activeRange,
  onRangeChange
}) => {
  const handleRangeClick = (range: string) => {
    onRangeChange(range);
  };

  const handleKeyDown = (event: React.KeyboardEvent, range: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleRangeClick(range);
    }
  };

  return (
    <div className={styles.container} role="tablist" aria-label="Time range selector">
      {TIME_RANGES.map((range) => {
        const isActive = activeRange === range.value;
        
        // Determine button classes
        const buttonClasses = [
          styles.rangeButton,
          isActive ? styles.rangeButtonActive : ''
        ].filter(Boolean).join(' ');

        return (
          <button
            key={range.value}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            className={buttonClasses}
            onClick={() => handleRangeClick(range.value)}
            onKeyDown={(e) => handleKeyDown(e, range.value)}
            aria-label={`Set time range to ${range.label}`}
          >
            {range.label}
          </button>
        );
      })}
    </div>
  );
};

export default TimeRangeSelector;