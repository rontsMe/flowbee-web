// src/components/features/metrics/SystemMetricCard.tsx

"use client";

import React from 'react';
import { SystemMetricCardProps } from './types';
import styles from './SystemMetricCard.module.css';

const SystemMetricCard: React.FC<SystemMetricCardProps> = ({
  title,
  titleRight,
  children,
  className = '',
  columns = { default: 1, md: 2, lg: 2, xl: 2 }
}) => {
  const gridClasses = [
    styles.grid,
    styles[`gridDefault${columns.default || 1}`],
    columns.sm ? styles[`gridSm${columns.sm}`] : '',
    columns.md ? styles[`gridMd${columns.md}`] : '',
    columns.lg ? styles[`gridLg${columns.lg}`] : '',
    columns.xl ? styles[`gridXl${columns.xl}`] : ''
  ].filter(Boolean).join(' ');

  const containerClasses = [styles.container, className].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {(title || titleRight) && (
        <div className={styles.headerRow}>
          <div className={styles.title}>{typeof title === 'string' ? <h2>{title}</h2> : title}</div>
          {titleRight && <div className={styles.titleRight}>{titleRight}</div>}
        </div>
      )}

      <div className={gridClasses}>
        {children}
      </div>
    </div>
  );
};

export default SystemMetricCard;
