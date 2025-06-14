// src/components/metrics/types.ts

// ============================================
// CORE DATA INTERFACES
// ============================================

export interface ChartDataPoint {
  timestamp: number;
  value: number;
}

export interface TooltipData {
  x: number;
  y: number;
  timestamp: number;
  value: number;
  unit?: string;
}

export interface TimeRange {
  label: string;
  value: string;
  duration: number;
}

export interface PerformanceStats {
  successRate: number;
  successCount: number;
  failureCount: number;
}

// ============================================
// COMPONENT PROPS INTERFACES
// ============================================

/**
 * Base MetricCard Props
 * For the layout component that accepts chart as children
 */
export interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  spec?: string;
  chartType:"line"|"area"|"bar"
  isExpanded: boolean;
  onToggleExpand: () => void;
  timeRange?: string;
  onTimeRangeChange?: (range: string) => void;
  className?: string;
  data?: ChartDataPoint[];
  color: string,
  opacity:number,
  showGrid:boolean,
  showYAxis:boolean,
  showXAxis:boolean 
}

/**
 * System Metric Card Props
 * For the higher-level component that manages chart creation
 */
export interface SystemMetricCardProps {
  title: string;
  titleRight:string
  children: React.ReactNode;
  className?: string;
  columns?: {
    default?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

/**
 * Performance Metric Card Props
 * For performance metrics with different styling
 */
export interface PerformanceMetricCardProps {
  id: PerformanceMetricId;
  title: string;
  value: string | number;
  unit?: string;
  chartType: ChartType;
  data: ChartDataPoint[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  timeRange?: string;
  onTimeRangeChange?: (range: string) => void;
  className?: string;
  color?: string; // ✅ Added optional color prop for consistency
}

/**
 * Chart Component Props
 * For chart components that get injected into MetricCard
 */
export interface ChartProps {
  data: ChartDataPoint[];
  isExpanded: boolean;
  color?: string;
  unit?: string;
  onHover?: (tooltip: TooltipData | null) => void;
}

/**
 * Time Range Selector Props
 */
export interface TimeRangeSelectorProps {
  activeRange: string;
  onRangeChange: (range: string) => void;
}

/**
 * Tooltip Props
 */
export interface TooltipProps {
  tooltip: TooltipData;
}

/**
 * Container Props
 * For system and performance overview containers
 */
export interface SystemOverviewContainerProps {
  className?: string;
}

export interface PerformanceOverviewContainerProps {
  stats: PerformanceStats;
  className?: string;
}

// ============================================
// TYPE UNIONS
// ============================================

export type ChartType = 'line' | 'bar' | 'area';
export type MetricType = 'system' | 'performance';
export type SystemMetricId = 'cpu' | 'memory' | 'gpu' | 'disk';
export type PerformanceMetricId = 'executions-per-minute' | 'method-duration' | 'queue-size' | 'concurrency-level';

// ============================================
// CONSTANTS
// ============================================

export const TIME_RANGES: TimeRange[] = [
  { label: '30m', value: '30m', duration: 30 },
  { label: '1h', value: '1h', duration: 60 },
  { label: '6h', value: '6h', duration: 360 },
  { label: '12h', value: '12h', duration: 720 },
  { label: '24h', value: '24h', duration: 1440 }
];

export const DATA_POINTS_COUNT: Record<string, number> = {
  '30m': 30,
  '1h': 60,
  '6h': 72,
  '12h': 72,
  '24h': 96
};

// ============================================
// CHART COLOR MAPPINGS
// ============================================

export const SYSTEM_CHART_COLORS: Record<SystemMetricId, string> = {
  'cpu': 'hsl(var(--chart-5))',      // Coral - matches red vibes
  'memory': 'hsl(var(--chart-4))',   // Blue - memory usage
  'gpu': 'hsl(var(--chart-2))',      // Teal - matches green vibes
  'disk': 'hsl(var(--chart-3))'      // Gold - matches yellow
};

export const PERFORMANCE_CHART_COLORS: Record<PerformanceMetricId, string> = {
  'executions-per-minute': 'hsl(var(--chart-4))',  // Blue - throughput
  'method-duration': 'hsl(var(--chart-1))',        // Purple - timing
  'queue-size': 'hsl(var(--chart-3))',             // Gold - queue status
  'concurrency-level': 'hsl(var(--chart-2))'       // Teal - concurrency
};

// ============================================
// CHART COMPONENT MAPPING
// ============================================

/**
 * Chart component types for dynamic rendering
 */
export interface ChartComponentMap {
  line: React.ComponentType<ChartProps>;
  bar: React.ComponentType<ChartProps>;
  area: React.ComponentType<ChartProps>;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Gets the chart color for a specific metric
 * @param metricId - The metric identifier
 * @param type - Whether it's a system or performance metric
 * @returns CSS custom property color string
 */
export function getChartColor(metricId: string, type: MetricType): string {
  if (type === 'system') {
    return SYSTEM_CHART_COLORS[metricId as SystemMetricId] || 'hsl(var(--primary))';
  }
  
  if (type === 'performance') {
    return PERFORMANCE_CHART_COLORS[metricId as PerformanceMetricId] || 'hsl(var(--primary))';
  }
  
  return 'hsl(var(--primary))';
}

/**
 * Gets the number of data points for a time range
 * @param timeRange - The time range string
 * @returns Number of data points to display
 */
export function getDataPointsCount(timeRange: string): number {
  return DATA_POINTS_COUNT[timeRange] || 30;
}

/**
 * Formats a timestamp for tooltip display
 * @param timestamp - Unix timestamp
 * @returns Formatted time string
 */
export function formatTooltipTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString();
}

/**
 * Formats a value with unit for display
 * @param value - Numeric value
 * @param unit - Optional unit string
 * @param precision - Number of decimal places
 * @returns Formatted value string
 */
export function formatValue(value: number, unit?: string, precision: number = 1): string {
  return `${value.toFixed(precision)}${unit || ''}`;
}

/**
 * Generates a unique gradient ID for SVG charts
 * @param color - Color string
 * @returns Deterministic gradient ID (no random component)
 */
export function generateGradientId(color: string): string {
  const colorHash = color.replace(/[^a-zA-Z0-9]/g, '');
  // ✅ Use deterministic hash instead of Math.random()
  let hash = 0;
  for (let i = 0; i < colorHash.length; i++) {
    const char = colorHash.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  const uniqueId = Math.abs(hash).toString(36).substr(0, 5);
  return `gradient-${colorHash}-${uniqueId}`;
}

/**
 * Generates mock data for a metric
 * @param baseValue - Base value for generation
 * @param variance - Variance range
 * @param count - Number of data points
 * @returns Array of chart data points
 */
export function generateMockData(baseValue: number, variance: number, count: number): ChartDataPoint[] {
  return Array.from({ length: count }, (_, i) => ({
    timestamp: Date.now() - (count - 1 - i) * 1000,
    value: Math.max(0, baseValue + (Math.random() - 0.5) * variance)
  }));
}

// ============================================
// TYPE GUARDS
// ============================================

/**
 * Type guard to check if a metric ID is a system metric
 * @param metricId - The metric identifier
 * @returns True if it's a system metric
 */
export function isSystemMetric(metricId: string): metricId is SystemMetricId {
  return ['cpu', 'memory', 'gpu', 'disk'].includes(metricId);
}

/**
 * Type guard to check if a metric ID is a performance metric
 * @param metricId - The metric identifier
 * @returns True if it's a performance metric
 */
export function isPerformanceMetric(metricId: string): metricId is PerformanceMetricId {
  return ['executions-per-minute', 'method-duration', 'queue-size', 'concurrency-level'].includes(metricId);
}

/**
 * Type guard to check if a chart type is valid
 * @param chartType - The chart type string
 * @returns True if it's a valid chart type
 */
export function isValidChartType(chartType: string): chartType is ChartType {
  return ['line', 'bar', 'area'].includes(chartType);
}

// ============================================
// DEFAULT VALUES
// ============================================

export const DEFAULT_TIME_RANGE = '30m';
export const DEFAULT_CHART_TYPE: ChartType = 'line';
export const CHART_UPDATE_INTERVAL = 1500; // milliseconds
export const PERFORMANCE_UPDATE_INTERVAL = 2000; // milliseconds

// Default metric configurations
export const DEFAULT_SYSTEM_METRICS = {
  cpu: { baseValue: 67, variance: 25, chartType: 'line' as ChartType },
  memory: { baseValue: 42, variance: 15, chartType: 'area' as ChartType },
  gpu: { baseValue: 23, variance: 20, chartType: 'line' as ChartType },
  disk: { baseValue: 78, variance: 12, chartType: 'area' as ChartType }
} as const;

export const DEFAULT_PERFORMANCE_METRICS = {
  'executions-per-minute': { baseValue: 847, variance: 200, chartType: 'bar' as ChartType },
  'method-duration': { baseValue: 245, variance: 80, chartType: 'line' as ChartType },
  'queue-size': { baseValue: 23, variance: 15, chartType: 'area' as ChartType },
  'concurrency-level': { baseValue: 8, variance: 4, chartType: 'line' as ChartType }
} as const;


export interface GridConfig {
  default?: number;  // Mobile (default: 1)
  sm?: number;       // Small screens (default: 1) 
  md?: number;       // Medium screens (default: 2)
  lg?: number;       // Large screens (default: 2)
  xl?: number;       // Extra large (default: 3)
}

/**
 * State tracking for expanded card
 */
export interface ExpandedCardState {
  index: number;           // Index of expanded card
  previousSiblings: number[];  // Indices of cards that were hidden
}

/**
 * Result of row layout calculation
 */
export interface RowCalculationResult {
  cardsPerRow: number;     // How many cards fit per row currently
  totalRows: number;       // Total number of rows
  cardPositions: number[]; // Which row each card is in
}

