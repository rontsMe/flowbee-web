// src/components/charts/index.ts

/**
 * Chart Components Index
 * Purpose: Clean exports for all chart components and utilities
 * Usage: import { LineChart, useChartData } from '@/components/charts'
 */

// ============================================
// CHART COMPONENTS
// ============================================

export { default as LineChart } from './LineChart';
export { default as AreaChart } from './AreaChart'; 
export { default as BarChart } from './BarChart';
export { default as ChartGrid } from './ChartGrid';

// ============================================
// TYPES AND INTERFACES
// ============================================

export type {
  ChartProps,
  ChartDataPoint,
  TooltipData,
  ChartType,
  ChartGridProps,
  ChartOpacityConfig
} from './types';

export {
  ChartOpacityManager,
  DEFAULT_CHART_TYPE,
  DEFAULT_OPACITY,
  DEFAULT_SHOW_GRID,
  DEFAULT_SHOW_Y_AXIS,
  DEFAULT_SHOW_X_AXIS,
  DEFAULT_CHART_OPACITY_CONFIG
} from './types';

// ============================================
// HOOKS
// ============================================

export {
  useChartData,
  useChartBounds,
  useTooltipPosition,
  useResolvedColor
} from './chartHooks';

export type {
  ChartBounds,
  ChartCalculations
} from './chartHooks';

// ============================================
// UTILITIES
// ============================================

export {
  formatTooltipTime,
  formatValue,
  calculateYTicks,
  generateChartPoints,
  calculateXLabels,
  findDataBounds,
  addBoundsPadding,
  generateGradientId,
  pointsToSVGString,
  createAreaPolygonPoints,
  isValidChartType,
  isValidOpacity,
  isValidChartData,
  debounce
} from './chartUtils';

// ============================================
// CHART COMPONENT MAP FOR DYNAMIC RENDERING
// ============================================

import LineChart from './LineChart';
import AreaChart from './AreaChart';
import BarChart from './BarChart';

/**
 * Chart component mapping for dynamic rendering
 * Usage: const ChartComponent = CHART_COMPONENTS['line'];
 */
export const CHART_COMPONENTS = {
  line: LineChart,
  area: AreaChart,
  bar: BarChart
} as const;

// ============================================
// UTILITY FUNCTIONS FOR COMMON PATTERNS
// ============================================

/**
 * Get chart component by type
 * @param chartType - Chart type string
 * @returns Chart component or null
 */
export function getChartComponent(chartType: string) {
  if (isValidChartType(chartType)) {
    return CHART_COMPONENTS[chartType];
  }
  return null;
}

/**
 * Create chart props with defaults
 * @param overrides - Props to override defaults
 * @returns Complete chart props with defaults applied
 */
export function createChartProps(overrides: Partial<ChartProps> & Pick<ChartProps, 'data' | 'color'>): ChartProps {
  return {
    showGrid: DEFAULT_SHOW_GRID,
    showYAxis: DEFAULT_SHOW_Y_AXIS, 
    showXAxis: DEFAULT_SHOW_X_AXIS,
    isExpanded: false,
    ...overrides
  };
}