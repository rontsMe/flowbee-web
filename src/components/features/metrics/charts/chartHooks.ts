// src/components/charts/chartHooks.ts

import { useState, useEffect, useMemo, useCallback } from 'react';
import { ChartDataPoint } from './types';
import { 
  findDataBounds, 
  addBoundsPadding, 
  calculateYTicks, 
  calculateXLabels,
  generateChartPoints,
  debounce,
  isValidChartData
} from './chartUtils';

/**
 * Chart Hooks - Custom React Hooks for Chart State Management
 * Purpose: Reusable hooks for chart calculations and state (SRP)
 * Follows: SOLID - Single responsibility per hook
 */

// ============================================
// CHART DATA BOUNDS INTERFACE
// ============================================

export interface ChartBounds {
  min: number;
  max: number;
}

export interface ChartCalculations {
  bounds: ChartBounds;
  yTicks: { value: number; y: number }[];
  xLabels: { timestamp: number; x: number }[];
  chartPoints: { x: number; y: number; data: ChartDataPoint }[];
  isLoading: boolean;
  hasValidData: boolean;
}

// ============================================
// MAIN CHART DATA HOOK
// ============================================

/**
 * useChartData Hook
 * Purpose: Smart chart data management with efficient bounds tracking
 * Features: 
 * - Auto-updates on data changes
 * - Bounds reset on time range change
 * - Debounced calculations for live data
 * - Memoized expensive calculations
 * 
 * @param data - Chart data points
 * @param timeRange - Current time range (triggers bounds reset)
 * @param debounceMs - Debounce interval for live updates (default: 200ms)
 * @returns Chart calculations and state
 */
export function useChartData(
  data: ChartDataPoint[],
  timeRange?: string,
  debounceMs: number = 200
): ChartCalculations {
  
  // Stored bounds state (persists across data updates)
  const [storedBounds, setStoredBounds] = useState<ChartBounds>({ 
    min: Infinity, 
    max: -Infinity 
  });
  
  // Loading state for async calculations
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Reset bounds when time range changes
  useEffect(() => {
    setStoredBounds({ min: Infinity, max: -Infinity });
  }, [timeRange]);
  
  // Validate data
  const hasValidData = useMemo(() => 
    isValidChartData(data), 
    [data]
  );
  
  // Debounced bounds calculation
  const updateBoundsIfNeeded = useCallback(
    debounce((newData: ChartDataPoint[]) => {
      if (!hasValidData) return;
      
      setIsLoading(true);
      
      const { min: newMin, max: newMax } = findDataBounds(newData);
      
      // Only update if new data exceeds stored bounds
      setStoredBounds(current => {
        const needsUpdate = newMin < current.min || newMax > current.max;
        
        if (needsUpdate) {
          return {
            min: Math.min(newMin, current.min === Infinity ? newMin : current.min),
            max: Math.max(newMax, current.max === -Infinity ? newMax : current.max)
          };
        }
        
        return current;
      });
      
      setIsLoading(false);
    }, debounceMs),
    [hasValidData, debounceMs]
  );
  
  // Trigger bounds check when data changes
  useEffect(() => {
    updateBoundsIfNeeded(data);
  }, [data, updateBoundsIfNeeded]);
  
  // Final bounds with padding (memoized)
  const finalBounds = useMemo(() => {
    if (!hasValidData || storedBounds.min === Infinity) {
      return { min: 0, max: 100 };
    }
    
    return addBoundsPadding(storedBounds.min, storedBounds.max, 0.1);
  }, [storedBounds, hasValidData]);
  
  // Y-axis ticks (memoized)
  const yTicks = useMemo(() => 
    calculateYTicks(finalBounds.min, finalBounds.max),
    [finalBounds]
  );
  
  // X-axis labels (memoized)
  const xLabels = useMemo(() => 
    hasValidData ? calculateXLabels(data, 5) : [],
    [data, hasValidData]
  );
  
  // Chart points for rendering (memoized)
  const chartPoints = useMemo(() => 
    hasValidData ? generateChartPoints(data, finalBounds.min, finalBounds.max) : [],
    [data, finalBounds, hasValidData]
  );
  
  return {
    bounds: finalBounds,
    yTicks,
    xLabels,
    chartPoints,
    isLoading,
    hasValidData
  };
}

// ============================================
// SPECIALIZED HOOKS
// ============================================

/**
 * useChartBounds Hook
 * Purpose: Simplified bounds tracking without full calculations
 * @param data - Chart data points
 * @param timeRange - Current time range
 * @returns Just bounds information
 */
export function useChartBounds(
  data: ChartDataPoint[],
  timeRange?: string
): { bounds: ChartBounds; isValid: boolean } {
  
  const [storedBounds, setStoredBounds] = useState<ChartBounds>({ 
    min: Infinity, 
    max: -Infinity 
  });
  
  // Reset on time range change
  useEffect(() => {
    setStoredBounds({ min: Infinity, max: -Infinity });
  }, [timeRange]);
  
  // Update bounds when data changes
  useEffect(() => {
    if (!isValidChartData(data)) return;
    
    const { min: newMin, max: newMax } = findDataBounds(data);
    
    setStoredBounds(current => {
      const needsUpdate = newMin < current.min || newMax > current.max;
      
      if (needsUpdate) {
        return {
          min: Math.min(newMin, current.min === Infinity ? newMin : current.min),
          max: Math.max(newMax, current.max === -Infinity ? newMax : current.max)
        };
      }
      
      return current;
    });
  }, [data]);
  
  const finalBounds = useMemo(() => {
    if (storedBounds.min === Infinity) {
      return { min: 0, max: 100 };
    }
    return addBoundsPadding(storedBounds.min, storedBounds.max);
  }, [storedBounds]);
  
  return {
    bounds: finalBounds,
    isValid: isValidChartData(data)
  };
}

/**
 * useResolvedColor Hook
 * Purpose: Resolve CSS custom properties in color values for SVG compatibility
 * @param color - Color string (may contain CSS vars like hsl(var(--chart-5)))
 * @returns Resolved color string with CSS vars computed
 */
export function useResolvedColor(color: string): string {
  return useMemo(() => {
    // If color doesn't contain CSS custom property, return as-is  
    if (!color.includes('var(')) {
      return color;
    }

    // Extract CSS custom property: hsl(var(--chart-5)) → --chart-5
    const cssVarMatch = color.match(/var\((--[\w-]+)\)/);
    if (!cssVarMatch) {
      return color; // Fallback if regex doesn't match
    }

    const cssVarName = cssVarMatch[1]; // --chart-5
    
    // Get computed CSS custom property value
    try {
      const computedValue = getComputedStyle(document.documentElement)
        .getPropertyValue(cssVarName)
        .trim();
      
      if (computedValue) {
        // Replace var(--chart-5) with actual value
        return color.replace(/var\(--[\w-]+\)/, computedValue);
      }
    } catch (error) {
      console.warn(`Failed to resolve CSS custom property ${cssVarName}:`, error);
    }
    
    // Fallback to original color if resolution fails
    return color;
  }, [color]);
}
/**
 * useTooltipPosition Hook  
 * Purpose: Manages tooltip positioning and data extraction
 * @param chartPoints - Chart points for closest point calculation
 * @param svgRef - SVG element reference (nullable for React compatibility)
 * @returns Tooltip management functions
 */
export function useTooltipPosition(
  chartPoints: { x: number; y: number; data: ChartDataPoint }[],
  svgRef: React.RefObject<SVGSVGElement | null>  // ✅ Fixed: Accept nullable ref
) {
  
  const findClosestPoint = useCallback((mouseEvent: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || chartPoints.length === 0) return null;
    
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((mouseEvent.clientX - rect.left) / rect.width) * 100;
    const closestPointIndex = Math.round((x / 100) * (chartPoints.length - 1));
    
    return chartPoints[closestPointIndex] || null;
  }, [chartPoints, svgRef]);
  
  const getTooltipData = useCallback((mouseEvent: React.MouseEvent<SVGSVGElement>, unit?: string) => {
    const closestPoint = findClosestPoint(mouseEvent);
    
    if (!closestPoint) return null;
    
    return {
      x: mouseEvent.clientX,
      y: mouseEvent.clientY,
      timestamp: closestPoint.data.timestamp,
      value: closestPoint.data.value,
      unit
    };
  }, [findClosestPoint]);
  
  return {
    findClosestPoint,
    getTooltipData
  };
}