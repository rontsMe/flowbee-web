// src/components/metrics/index.ts

/**
 * Metrics Components Index
 * Purpose: Clean exports for metrics components integrated with generic charts
 * Updated: Now uses generic chart system from @/components/charts
 */

// ============================================
// COMPONENT EXPORTS
// ============================================

// Layout components
export { default as MetricCard } from './MetricCard';
export { default as SystemMetricCard } from './SystemMetricCard';
export { default as TimeRangeSelector } from './TimeRangeSelector';
export { default as Tooltip } from './Tooltip';

// Re-export generic charts for convenience
export { 
  LineChart, 
  AreaChart, 
  BarChart,
  CHART_COMPONENTS,
  useChartData,
  useChartBounds
} from './charts';

// ============================================
// TYPE EXPORTS
// ============================================

// Re-export chart types
export type {
  ChartDataPoint,
  TooltipData,
  ChartType,
  ChartProps,
  ChartBounds,
  ChartCalculations
} from './charts';

// Metrics-specific types
export type {
  TimeRange,
  PerformanceStats,
  TimeRangeSelectorProps,
  TooltipProps,
  SystemOverviewContainerProps,
  PerformanceOverviewContainerProps,
  MetricType,
  SystemMetricId,
  PerformanceMetricId
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
  CHART_UPDATE_INTERVAL,
  PERFORMANCE_UPDATE_INTERVAL,
  DEFAULT_SYSTEM_METRICS,
  DEFAULT_PERFORMANCE_METRICS,
  
  // Utility functions
  getChartColor,
  getDataPointsCount,
  generateMockData,
  
  // Type guards
  isSystemMetric,
  isPerformanceMetric
} from './types';

// Re-export chart utilities
export {
  formatTooltipTime,
  formatValue,
  generateGradientId,
  isValidChartType,
  isValidOpacity,
  isValidChartData
} from './charts';