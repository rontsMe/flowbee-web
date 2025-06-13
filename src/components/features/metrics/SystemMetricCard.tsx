// src/components/metrics/SystemMetricCard.tsx

'use client';

import React, { useEffect, useState } from 'react';

import { SystemMetricCardProps } from './types';

const SystemMetricCard: React.FC<SystemMetricCardProps> = ({
  title,
  children,
  className,
  columns = { default: 1, md: 4, lg: 4, xl: 4 }
}) => {
  const [currentColumns, setCurrentColumns] = useState(columns.default || 1);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      
      if (width >= 1280) {
        setCurrentColumns(columns.xl || columns.lg || columns.md || columns.default || 1);
      } else if (width >= 1024) {
        setCurrentColumns(columns.lg || columns.md || columns.default || 1);
      } else if (width >= 768) {
        setCurrentColumns(columns.md || columns.default || 1);
      } else {
        setCurrentColumns(columns.default || 1);
      }
    };

    // Set initial columns
    updateColumns();

    // Add resize listener
    window.addEventListener('resize', updateColumns);
    
    // Cleanup
    return () => window.removeEventListener('resize', updateColumns);
  }, [columns]);

  const containerStyle: React.CSSProperties = {
    width: '100%',
    marginBottom: '2rem'
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: '1rem'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'var(--foreground)'
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gap: '1rem',
    width: '100%',
    gridTemplateColumns: `repeat(${currentColumns}, 1fr)`
  };

  return (
    <section style={containerStyle} className={className}>
      <header style={headerStyle}>
        <h2 style={titleStyle}>{title}</h2>
      </header>
      <div style={gridStyle}>
        {children}
      </div>
    </section>
  );
};

export default SystemMetricCard;