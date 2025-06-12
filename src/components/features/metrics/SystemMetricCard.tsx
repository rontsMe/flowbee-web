// src/components/metrics/SystemMetricCard.tsx
import React, { useState } from 'react';
import MetricCard from './MetricCard';
import LineChart from './charts/LineChart';
import BarChart from './charts/BarChart';
import AreaChart from './charts/AreaChart';
import Tooltip from './Tooltip';
import { 
  SystemMetricCardProps, 
  TooltipData, 
  ChartComponentMap,
  getChartColor 
} from './types';

/**
 * SystemMetricCard Component
 * 
 * Purpose: High-level system metric card that creates and manages chart components
 * Responsibility: Chart selection, color mapping, tooltip management, composition
 * 
 * Key Features:
 * - Extends base MetricCard via composition
 * - Automatically selects chart component based on chartType
 * - Manages tooltip state for chart interactions
 * - Uses system color mapping from theme
 * - SOLID compliant - delegates layout to MetricCard
 * 
 * @param id - System metric identifier (cpu, memory, gpu, disk)
 * @param label - Display label (e.g., "CPU", "Memory")
 * @param spec - Optional specification text (e.g., "AMD 4-core processor")
 * @param value - Current metric value
 * @param unit - Optional unit (%, GB, etc.)
 * @param chartType - Type of chart to render
 * @param data - Chart data points
 * @param isExpanded - Whether card is expanded
 * @param onToggleExpand - Callback to toggle expansion
 * @param timeRange - Current time range selection
 * @param onTimeRangeChange - Callback for time range changes
 * @param className - Additional CSS classes
 * @returns SystemMetricCard JSX element
 */
const SystemMetricCard: React.FC<SystemMetricCardProps> = ({
  id,
  label,
  spec,
  value,
  unit,
  chartType,
  data,
  isExpanded,
  onToggleExpand,
  timeRange,
  onTimeRangeChange,
  className
}) => {
  // Tooltip state management
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  // Chart component mapping
  const chartComponents: ChartComponentMap = {
    line: LineChart,
    bar: BarChart,
    area: AreaChart
  };

  // Get chart component and color
  const ChartComponent = chartComponents[chartType];
  const chartColor = getChartColor(id, 'system');

  // Create chart element with props
  const chartElement = (
    <ChartComponent
      data={data}
      isExpanded={isExpanded}
      color={chartColor}
      unit={unit}
      onHover={setTooltip}
    />
  );

  return (
    <>
      <MetricCard
        title={label}
        value={value}
        unit={unit}
        spec={spec}
        isExpanded={isExpanded}
        onToggleExpand={onToggleExpand}
        timeRange={timeRange}
        onTimeRangeChange={onTimeRangeChange}
        className={className}
      >
        {chartElement}
      </MetricCard>
      
      {/* Tooltip overlay */}
      {tooltip && <Tooltip tooltip={tooltip} />}
    </>
  );
};

export default SystemMetricCard;