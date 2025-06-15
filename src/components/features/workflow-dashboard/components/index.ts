// src/components/features/workflow-dashboard/components/index.ts

/**
 * Workflow Dashboard Components Exports
 * 
 * Purpose: Barrel exports for all dashboard feature components
 * Architecture: Following project's component export pattern
 */

// DependencyGraph
export { DependencyGraph } from './DependencyGraph/DependencyGraph';
export type { DependencyGraphProps, DependencyStep } from './DependencyGraph/DependencyGraph';

// QuickStats  
export { QuickStats } from './QuickStats/QuickStats';
export type { QuickStatsProps } from './QuickStats/QuickStats';

// ApiHealth
export { ApiHealth } from './ApiHealth/ApiHealth';
export type { ApiHealthProps, ApiHealthData } from './ApiHealth/ApiHealth';

// RecentIssues
export type { RecentIssuesProps } from './RecentIssues';
export { RecentIssues } from './RecentIssues/RecentIssues';