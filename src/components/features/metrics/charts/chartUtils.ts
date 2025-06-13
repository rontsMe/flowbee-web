// src/components/charts/chartUtils.ts

import { ChartDataPoint, ChartType } from './types';

/**
 * Chart Utility Functions
 * Purpose: Pure utility functions for chart calculations and formatting (SRP)
 * Follows: SOLID - No side effects, pure functions only
 */

// ============================================
// FORMATTING UTILITIES
// ============================================

/**
 * Formats a timestamp for tooltip display
 * @param timestamp - Unix timestamp
 * @returns Formatted time string
 */
export function formatTooltipTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
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

// ============================================
// CHART CALCULATION UTILITIES
// ============================================

/**
 * Calculates Y-axis ticks for a dataset
 * @param minValue - Minimum value from data
 * @param maxValue - Maximum value from data
 * @returns Array of tick objects with value and y position
 */
export function calculateYTicks(minValue: number, maxValue: number): { value: number; y: number }[] {
  const range = maxValue - minValue || 1;
  
  return [
    { value: maxValue, y: 10 },
    { value: minValue + (range * 0.75), y: 27.5 },
    { value: minValue + (range * 0.5), y: 45 },
    { value: minValue + (range * 0.25), y: 62.5 },
    { value: minValue, y: 80 }
  ];
}

/**
 * Generates chart points from data with normalized coordinates
 * @param data - Raw chart data
 * @param minValue - Minimum value for normalization
 * @param maxValue - Maximum value for normalization
 * @returns Array of chart points with x, y coordinates
 */
export function generateChartPoints(
  data: ChartDataPoint[], 
  minValue: number, 
  maxValue: number
): { x: number; y: number; data: ChartDataPoint }[] {
  if (data.length === 0) return [];
  
  const range = maxValue - minValue || 1;
  
  return data.map((point, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((point.value - minValue) / range) * 80;
    return { x, y, data: point };
  });
}

/**
 * Calculates X-axis time labels from data
 * @param data - Chart data with timestamps
 * @param labelCount - Number of labels to generate (default: 5)
 * @returns Array of label objects with timestamp and x position
 */
export function calculateXLabels(
  data: ChartDataPoint[], 
  labelCount: number = 5
): { timestamp: number; x: number }[] {
  if (data.length === 0) return [];
  
  const positions = Array.from({ length: labelCount }, (_, i) => i / (labelCount - 1));
  
  return positions.map((position) => {
    const dataIndex = Math.floor(position * (data.length - 1));
    return {
      timestamp: data[dataIndex]?.timestamp || 0,
      x: position * 100
    };
  });
}

/**
 * Finds min and max values from chart data
 * @param data - Chart data points
 * @returns Object with min and max values
 */
export function findDataBounds(data: ChartDataPoint[]): { min: number; max: number } {
  if (data.length === 0) {
    return { min: 0, max: 0 };
  }
  
  const values = data.map(d => d.value);
  return {
    min: Math.min(...values),
    max: Math.max(...values)
  };
}

/**
 * Adds padding to data bounds for better visualization
 * @param min - Minimum value
 * @param max - Maximum value  
 * @param paddingPercent - Padding percentage (default: 10%)
 * @returns Padded bounds
 */
export function addBoundsPadding(
  min: number, 
  max: number, 
  paddingPercent: number = 0.1
): { min: number; max: number } {
  const range = max - min || 1;
  const padding = range * paddingPercent;
  
  return {
    min: min - padding,
    max: max + padding
  };
}

// ============================================
// SVG/RENDERING UTILITIES
// ============================================

/**
 * Generates a unique gradient ID for SVG charts
 * @param color - Color string
 * @returns Deterministic gradient ID
 */
export function generateGradientId(color: string): string {
  const colorHash = color.replace(/[^a-zA-Z0-9]/g, '');
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
 * Converts chart points to SVG polyline points string
 * @param points - Array of chart points with x, y coordinates
 * @returns SVG points string
 */
export function pointsToSVGString(points: { x: number; y: number }[]): string {
  return points.map(p => `${p.x},${p.y}`).join(' ');
}

/**
 * Creates SVG polygon points for area charts
 * @param points - Array of chart points
 * @returns SVG polygon points string
 */
export function createAreaPolygonPoints(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  
  const linePoints = pointsToSVGString(points);
  return `0,100 ${linePoints} 100,100`;
}

// ============================================
// VALIDATION UTILITIES
// ============================================

/**
 * Type guard to check if a chart type is valid
 * @param chartType - The chart type string
 * @returns True if it's a valid chart type
 */
export function isValidChartType(chartType: string): chartType is ChartType {
  return ['line', 'bar', 'area'].includes(chartType);
}

/**
 * Type guard to check if opacity value is valid
 * @param opacity - The opacity value
 * @returns True if it's a valid opacity
 */
export function isValidOpacity(opacity: number): boolean {
  return opacity >= 0 && opacity <= 100 && Number.isFinite(opacity);
}

/**
 * Validates chart data array
 * @param data - Chart data to validate
 * @returns True if data is valid for rendering
 */
export function isValidChartData(data: ChartDataPoint[]): boolean {
  return Array.isArray(data) && 
         data.length > 0 && 
         data.every(point => 
           typeof point.timestamp === 'number' && 
           typeof point.value === 'number' && 
           Number.isFinite(point.timestamp) && 
           Number.isFinite(point.value)
         );
}

// ============================================
// DEBOUNCE UTILITY
// ============================================

/**
 * Debounce function for performance optimization
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T, 
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}