// src/components/metrics/MetricCard.tsx

'use client';

import React, { useRef, useState, useMemo, useCallback } from 'react';
import { Card, CardContent } from '@ui/card';
import { Button } from '@ui/button';
import { Expand, Minimize2 } from 'lucide-react';
import { cn } from '@lib/utils';
import { useResizeHandler } from '@hooks/useResizeHandler';
import { useDebounce } from '@hooks/useDebounce';

// Import generic charts
import { LineChart, AreaChart, BarChart, TooltipData, ChartType } from './charts';

// Import metrics components
import TimeRangeSelector from './TimeRangeSelector';
import Tooltip from './Tooltip';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  spec?: string;
  timeRange?: string;
  onTimeRangeChange?: (range: string) => void;
  className?: string;
  chartType: ChartType;
  data: { timestamp: number; value: number }[];
  color: string;
  opacity?: number;
  showGrid?: boolean;
  showYAxis?: boolean; 
  showXAxis?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  spec,
  timeRange,
  onTimeRangeChange,
  className,
  chartType,
  data,
  color,
  opacity,
  showGrid,
  showYAxis,
  showXAxis
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleHidingSiblings = useCallback((shouldHide: boolean) => {
    const card = cardRef.current;
    if (!card) return;

    const parent = card.parentElement;
    if (!parent) return;

    const allCards = Array.from(parent.children);
    const index = allCards.indexOf(card);
    if (index === -1) return;

    const computedStyle = getComputedStyle(parent);
    const columnCount = computedStyle.gridTemplateColumns.split(' ').length;

    const rowStart = Math.floor(index / columnCount) * columnCount;
    const rowEnd = rowStart + columnCount;

    allCards.forEach((el, i) => {
      if (i >= rowStart && i < rowEnd && el !== card) {
        (el as HTMLElement).style.display = shouldHide ? 'none' : '';
      }
    });
  }, []);

  const onToggleExpand = () => {
    const newState = !isExpanded;
    handleHidingSiblings(newState);
    setIsExpanded(newState);
  };

  // Provide dummy values for index and previousSiblings to match ExpandedCardState type
  const debouncedExpandedCard = useDebounce(
    isExpanded ? { title, index: 0, previousSiblings: [] } : null,
    150
  );

  useResizeHandler(() => {
    if (isExpanded) {
      // First unhide all cards
      handleHidingSiblings(false);
      // Then recalculate and hide new siblings
      setTimeout(() => handleHidingSiblings(true), 0);
    }
  }, debouncedExpandedCard);

  const chartConfig = useMemo(() => ({
    showGrid: showGrid ?? true,
    showYAxis: showYAxis ?? isExpanded,
    showXAxis: isExpanded 
  }), [showGrid, showYAxis, showXAxis, isExpanded]);
  

  const styles = {
    container: cn(
      "w-full",
      isExpanded ? "col-span-full scale-[1.02] z-10" : "col-span-1",
      "transition-all duration-500 ease-in-out"
    ),
    header: "flex justify-between items-center mb-2", // ✅ Changed to horizontal layout
    title: "text-lg font-semibold text-foreground",
    spec: "text-sm text-muted-foreground",
    valueContainer: "flex items-baseline gap-1",
    value: "text-xl font-medium text-foreground",
    unit: "text-base text-muted-foreground",
    card: cn(
      "relative transition-all duration-500",
      "hover:border-muted-foreground",
      "bg-card border border-border",
      "shadow-sm backdrop-blur-sm",
      "px-0 py-0 pr-0" // ✅ Reduced right padding
    ),
    cardExpanded: "h-72", // ✅ Increased height from h-64 to h-72
    cardCollapsed: "aspect-video",
    cardContent: "h-full p-0",
    contentContainer: "h-full flex flex-col",
    controlsContainer: "flex justify-between items-center mb-1 pl-4 pr-1 pt-1", // ✅ Reduced padding and margin
    controlsGroup: "flex items-center gap-2",
    expandIcon: "w-4 h-4 text-muted-foreground transition-all duration-200",
    chartContainer: "flex-1 min-h-0 pl-[6px] pr-[2px] pb-[6px] overflow-visible", // ✅ Reduced padding for more chart space
    chartContainerExpanded: "flex-1 min-h-0 pl-[6px] pr-[2px] pb-[6px] overflow-visible" // ✅ Reduced padding for more chart space
  };

  const chartComponents = {
    line: LineChart,
    area: AreaChart,
    bar: BarChart
  };

  const createChart = () => {
    const ChartComponent = chartComponents[chartType];

    if (!ChartComponent) {
      console.warn(`Unknown chart type: ${chartType}`);
      return <div className="flex items-center justify-center h-full text-muted-foreground">Invalid chart type</div>;
    }

    return (
      <ChartComponent
        data={data}
        color={color}
        isExpanded={isExpanded}
        opacity={opacity}
        unit={unit}
        showGrid={chartConfig.showGrid}
        showYAxis={chartConfig.showYAxis}
        showXAxis={chartConfig.showXAxis}
        onHover={setTooltip}
      />
    );
  };

  return (
    <>
      <div ref={cardRef} className={cn(styles.container, className)}>
        {/* ✅ Updated header layout - horizontal with justify-between, no expand button */}
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>{title}</h3>
          </div>
          <div>
            {spec && <p className={styles.spec}>{spec}</p>}
          </div>
        </div>

        <Card className={cn(styles.card, isExpanded ? styles.cardExpanded : styles.cardCollapsed)}>
          <CardContent className={styles.cardContent}>
            <div className={styles.contentContainer}>
              {/* ✅ Expand button positioned at top-right corner */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleExpand}
                className={cn(
                  "absolute top-1 right-1 p-1 h-auto flex-shrink-0 z-20", // ✅ Moved closer to corner
                  "transition-all duration-200",
                  "hover:bg-secondary hover:scale-110",
                  "active:scale-95"
                )}
                aria-label={isExpanded ? "Collapse chart" : "Expand chart"}
              >
                {isExpanded ? (
                  <Minimize2 className={styles.expandIcon} />
                ) : (
                  <Expand className={styles.expandIcon} />
                )}
              </Button>

              <div className={styles.controlsContainer}>
                <div className={styles.valueContainer}>
                  <span className={styles.value}>{value}</span>
                  {unit && <span className={styles.unit}>{unit}</span>}
                </div>

                <div className={styles.controlsGroup}>
                  {isExpanded && onTimeRangeChange && timeRange && (
                    <div className="mr-8"> {/* ✅ Added margin to avoid overlap with collapse button */}
                      <TimeRangeSelector activeRange={timeRange} onRangeChange={onTimeRangeChange} />
                    </div>
                  )}
                </div>
              </div>

              <div className={cn(isExpanded ? styles.chartContainerExpanded : styles.chartContainer)}>
                {createChart()}
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