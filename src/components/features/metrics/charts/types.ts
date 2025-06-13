// src/components/charts/types.ts

/**
 * Generic Chart Types - Domain Agnostic
 * Purpose: Reusable chart types with zero domain knowledge (SRP)
 * Follows: SOLID - No dependencies on metrics, CPU, memory, etc.
 * 
 * Charts automatically calculate:
 * - Y-axis values from data min/max
 * - X-axis values from data timestamps
 * - Grid positioning and tick marks
 * 
 * Parent controls:
 * - Data, color, opacity
 * - Grid/axis visibility (showGrid, showYAxis, showXAxis)
 */

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
  
  // ============================================
  // CHART CONFIGURATION INTERFACES
  // ============================================
  
  /**
   * Chart Opacity Configuration
   * Purpose: Default opacity values by chart type only (SRP)
   */
  export interface ChartOpacityConfig {
    readonly byType: Record<ChartType, number>;
    readonly expanded: number;
    readonly collapsed: number;
    readonly grid: Record<ChartType, number>;
  }
  
  /**
   * Chart Props - Completely Generic
   * Purpose: Base props for all chart components (SRP)
   * Parent controls: color, opacity, data, axis/grid visibility
   * Chart controls: rendering, interactions, value calculations
   */
  export interface ChartProps {
    data: ChartDataPoint[];
    color: string;                    // ✅ Required from parent
    isExpanded?: boolean;
    opacity?: number;                 // ✅ Optional number (e.g., 70 → opacity-70)
    unit?: string;
    
    // ✅ Grid/Axis control - all default to false
    showGrid?: boolean;               // Grid lines visibility
    showYAxis?: boolean;              // Y-axis numeric values
    showXAxis?: boolean;              // X-axis time values
    
    onHover?: (tooltip: TooltipData | null) => void;
  }
  
  /**
   * Chart Grid Props
   * Purpose: Grid component configuration
   */
  export interface ChartGridProps {
    yTicks: { value: number; y: number }[];
    data: ChartDataPoint[];
    showGrid: boolean;                // ✅ Grid lines visibility
    showYAxis: boolean;               // ✅ Y-axis numeric values
    showXAxis: boolean;               // ✅ X-axis time values
    opacity: number;                  // ✅ Grid opacity as number
  }
  
  // ============================================
  // TYPE DEFINITIONS
  // ============================================
  
  export type ChartType = 'line' | 'bar' | 'area';
  
  // ============================================
  // CHART OPACITY MANAGEMENT
  // ============================================
  
  /**
   * Default opacity configuration for chart types
   * Purpose: Chart-type specific defaults only (no domain knowledge)
   */
  export const DEFAULT_CHART_OPACITY_CONFIG: ChartOpacityConfig = {
    byType: {
      line: 60,        // Line charts need good visibility
      area: 40,        // Area charts can be more subtle  
      bar: 80          // Bar charts need strong presence
    },
    expanded: 90,      // More visible when expanded
    collapsed: 60,     // More subtle when collapsed
    grid: {
      line: 20,        // Grid should be subtle
      area: 15,        // Even more subtle
      bar: 25          // Slightly more visible
    }
  };
  
  /**
   * ChartOpacityManager Class
   * Purpose: Generic opacity management for chart types only (SRP)
   * Follows: SOLID - Single responsibility, no domain knowledge
   */
  export class ChartOpacityManager {
    private readonly config: ChartOpacityConfig;
  
    constructor(config?: Partial<ChartOpacityConfig>) {
      this.config = {
        ...DEFAULT_CHART_OPACITY_CONFIG,
        ...config
      };
    }
  
    /**
     * normalizeOpacity - Convert number to Tailwind opacity class
     * Purpose: Ensures valid Tailwind opacity format
     * @param opacity number - Opacity value (0-100)
     * @returns string - Tailwind opacity class
     */
    public normalizeOpacity(opacity: number): string {
      const clampedOpacity = Math.max(0, Math.min(100, Math.round(opacity)));
      return `opacity-${clampedOpacity}`;
    }
  
    /**
     * getOpacity - Get appropriate opacity for chart type and state
     * Purpose: Determine optimal opacity based on chart type and expansion
     * @param chartType ChartType - Type of chart (line, area, bar)
     * @param isExpanded boolean - Whether chart is expanded
     * @param userOpacity number - User-provided opacity override
     * @returns string - Tailwind opacity class
     */
    public getOpacity(
      chartType: ChartType, 
      isExpanded: boolean = false, 
      userOpacity?: number
    ): string {
      // User override takes precedence
      if (userOpacity !== undefined) {
        return this.normalizeOpacity(userOpacity);
      }
      
      // Expanded state override
      if (isExpanded) {
        return this.normalizeOpacity(this.config.expanded);
      }
      
      // Chart type specific opacity
      const defaultOpacity = this.config.byType[chartType];
      return this.normalizeOpacity(defaultOpacity);
    }
  
    /**
     * getGridOpacity - Get grid-specific opacity (lighter than chart)
     * Purpose: Provide subtle grid opacity for better chart readability
     * @param chartType ChartType - Type of chart for grid opacity
     * @param baseOpacity number - Base opacity to derive from (optional)
     * @returns string - Grid-appropriate opacity class
     */
    public getGridOpacity(chartType: ChartType, baseOpacity?: number): string {
      if (baseOpacity !== undefined) {
        // Make grid 30% of base opacity, minimum 10
        const gridOpacity = Math.max(10, Math.floor(baseOpacity * 0.3));
        return this.normalizeOpacity(gridOpacity);
      }
      
      // Use chart-type specific grid default
      const defaultGridOpacity = this.config.grid[chartType];
      return this.normalizeOpacity(defaultGridOpacity);
    }
  
    /**
     * validateOpacity - Validate opacity value is within bounds
     * Purpose: Ensure opacity values are safe for rendering
     * @param opacity number - Opacity to validate
     * @returns boolean - Whether opacity is valid
     */
    public validateOpacity(opacity: number): boolean {
      return opacity >= 0 && opacity <= 100 && Number.isFinite(opacity);
    }
  }
  
  // ============================================
  // RE-EXPORTS FROM UTILITIES
  // ============================================
  
  // Re-export commonly used utilities for convenience
  export { 
    formatTooltipTime, 
    formatValue, 
    generateGradientId,
    isValidChartType,
    isValidOpacity 
  } from './chartUtils';
  
  export { useChartData, useChartBounds, useTooltipPosition } from './chartHooks';
  
  // ============================================
  // DEFAULT VALUES
  // ============================================
  
  export const DEFAULT_CHART_TYPE: ChartType = 'line';
  export const DEFAULT_OPACITY = 80;
  export const DEFAULT_GRID_OPACITY = 20;
  export const DEFAULT_COLOR = 'hsl(var(--primary))';
  
  // ✅ Grid/Axis defaults - all false
  export const DEFAULT_SHOW_GRID = false;
  export const DEFAULT_SHOW_Y_AXIS = false;
  export const DEFAULT_SHOW_X_AXIS = false;
  
  // Chart update intervals
  export const CHART_UPDATE_INTERVAL = 1500; // milliseconds