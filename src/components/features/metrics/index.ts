// src/components/metrics/index.ts

// ============================================
// COMPONENT EXPORTS
// ============================================

// Base components
export { default as MetricCard } from './MetricCard';
export { default as TimeRangeSelector } from './TimeRangeSelector';
export { default as Tooltip } from './Tooltip';

// Chart components
export { default as LineChart } from './charts/LineChart';
export { default as BarChart } from './charts/BarChart';
export { default as AreaChart } from './charts/AreaChart';

// Metric card variants
export { default as SystemMetricCard } from './SystemMetricCard';

// ============================================
// TYPE EXPORTS
// ============================================

export type {
  // Core interfaces
  ChartDataPoint,
  TooltipData,
  TimeRange,
  PerformanceStats,
  
  // Component props
  MetricCardProps,
  SystemMetricCardProps,
  PerformanceMetricCardProps,
  ChartProps,
  TimeRangeSelectorProps,
  TooltipProps,
  SystemOverviewContainerProps,
  PerformanceOverviewContainerProps,
  
  // Type unions
  ChartType,
  MetricType,
  SystemMetricId,
  PerformanceMetricId,
  
  // Chart mapping
  ChartComponentMap
} from './types';

// ============================================
// UTILITY EXPORTS
// ============================================

export {
  // Constants
  TIME_RANGES,
  DATA_POINTS_COUNT,
  SYSTEM_CHART_COLORS,
  PERFORMANCE_CHART_COLORS,
  DEFAULT_TIME_RANGE,
  DEFAULT_CHART_TYPE,
  CHART_UPDATE_INTERVAL,
  PERFORMANCE_UPDATE_INTERVAL,
  DEFAULT_SYSTEM_METRICS,
  DEFAULT_PERFORMANCE_METRICS,
  
  // Utility functions
  getChartColor,
  getDataPointsCount,
  formatTooltipTime,
  formatValue,
  generateGradientId,
  generateMockData,
  
  // Type guards
  isSystemMetric,
  isPerformanceMetric,
  isValidChartType
} from './types';