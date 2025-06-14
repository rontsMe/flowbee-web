// src/components/features/metrics/MetricCard.tsx

"use client";

import React, { useState, useRef, useMemo } from 'react';
import { Expand, Minimize2 } from 'lucide-react';
import { Card, CardContent } from '@ui/card';
import { Button } from '@ui/button';
import TimeRangeSelector from './TimeRangeSelector';
import Tooltip from './Tooltip';
import { MetricCardProps, TooltipData } from './types';
import { LineChart, AreaChart, BarChart } from './charts';
import styles from './MetricCard.module.css';

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  spec,
  isExpanded,
  onToggleExpand,
  timeRange,
  onTimeRangeChange,
  className = '',
  data = [],
  chartType = 'line',
  color,
  opacity,
  showGrid = true,
  showYAxis = true,
  showXAxis = true
}) => {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const chartConfig = useMemo(() => ({
    showGrid,
    showYAxis,
    showXAxis: isExpanded
  }), [showGrid, showYAxis, showXAxis, isExpanded]);

  const chartComponents = {
    line: LineChart,
    area: AreaChart,
    bar: BarChart
  };

  const ChartComponent = chartComponents[chartType];

  return (
    <>
      <div ref={cardRef} className={`${styles.container} ${isExpanded ? styles.containerExpanded : styles.containerCollapsed} ${className}`}>
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <h3 className={styles.title}>{title}</h3>
            {spec && <span className={styles.specInline}>– {spec}</span>}
          </div>
          <div className={styles.valueContainer}>
            <span className={styles.value}>{value}</span>
            {unit && <span className={styles.unit}>{unit}</span>}
          </div>
        </div>

        <Card className={`${styles.card} ${isExpanded ? styles.cardExpanded : styles.cardCollapsed}`}>
          <CardContent className={styles.cardContent}>
            <div className={styles.contentContainer}>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleExpand}
                className={styles.expandButton}
                aria-label={isExpanded ? "Collapse chart" : "Expand chart"}
              >
                {isExpanded ? (
                  <Minimize2 className={styles.expandIcon} />
                ) : (
                  <Expand className={styles.expandIcon} />
                )}
              </Button>

              <div className={styles.controlsContainer}>
                <div className={styles.controlsGroup}>
                  {isExpanded && onTimeRangeChange && timeRange && (
                    <TimeRangeSelector 
                      activeRange={timeRange} 
                      onRangeChange={onTimeRangeChange} 
                    />
                  )}
                </div>
              </div>

              <div className={isExpanded ? styles.chartContainerExpanded : styles.chartContainer}>
                {ChartComponent ? (
                  <ChartComponent
                    data={data}
                    color={color}
                    unit={unit}
                    isExpanded={isExpanded}
                    opacity={opacity}
                    showGrid={chartConfig.showGrid}
                    showYAxis={chartConfig.showYAxis}
                    showXAxis={chartConfig.showXAxis}
                    onHover={setTooltip}
                  />
                ) : (
                  <div className={styles.errorContainer}>Invalid chart type</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {tooltip && <Tooltip tooltip={tooltip} />}
    </>
  );
};

export default MetricCard;