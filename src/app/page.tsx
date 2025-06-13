// app/page.tsx
'use client';
import React, { useState, useEffect } from 'react';

// Import existing metrics components
import { 
  SystemMetricCard,
  ChartDataPoint,
  SystemMetricId,
  ChartType,
  generateMockData,
  getDataPointsCount,
  DEFAULT_SYSTEM_METRICS,
  CHART_UPDATE_INTERVAL
} from '@components/features/metrics';

// Import UI components
import { Badge } from '@ui/badge';
import PageContainer from '@layout/PageContainer';

/**
 * Enhanced Dashboard Page
 * 
 * Purpose: Main dashboard utilizing existing metrics components and globals.css theming
 * Features: System Overview and Processing Overview sections matching the design
 * 
 * Methods:
 * - updateSystemData(): Update real-time system metrics data
 * - updateProcessingData(): Update real-time processing metrics data  
 * - render(): Return dashboard layout using existing metric components
 */
export default function DashboardPage() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [timeRanges, setTimeRanges] = useState<Record<string, string>>({
    'cpu': '30m',
    'memory': '30m', 
    'gpu': '30m',
    'disk': '30m',
    'executions-per-minute': '30m',
    'method-duration': '30m',
    'queue-size': '30m',
    'concurrency-level': '30m'
  });

  // System metrics data state
  const [systemData, setSystemData] = useState({
    'cpu': [] as ChartDataPoint[],
    'memory': [] as ChartDataPoint[],
    'gpu': [] as ChartDataPoint[],
    'disk': [] as ChartDataPoint[]
  });

  // Processing metrics data state  
  const [processingData, setProcessingData] = useState({
    'executions-per-minute': [] as ChartDataPoint[],
    'method-duration': [] as ChartDataPoint[],
    'queue-size': [] as ChartDataPoint[],
    'concurrency-level': [] as ChartDataPoint[]
  });

  // Processing stats
  const [processingStats, setProcessingStats] = useState({
    successRate: 96.4,
    successCount: 30,
    failureCount: 10
  });

  // Color mapping objects
  const colorsAvailable = {
    "coral/red": "oklch(0.72 0.16 20)",
    "blue": "oklch(0.65 0.19 240)", 
    "teal/green": "oklch(0.75 0.15 160)",
    "gold/yellow": "oklch(0.80 0.17 80)",
    "purple": "oklch(0.70 0.18 280)"
  };

  const cardColors = {
    // System Overview colors
    'cpu': colorsAvailable["coral/red"],
    'memory': colorsAvailable["blue"],
    'gpu': colorsAvailable["teal/green"],
    'disk': colorsAvailable["gold/yellow"],
    
    // Processing Overview colors
    'executions-per-minute': colorsAvailable["blue"],
    'method-duration': colorsAvailable["purple"],
    'queue-size': colorsAvailable["gold/yellow"],
    'concurrency-level': colorsAvailable["teal/green"]
  };

  // CSS-in-JS styles using Tailwind utilities and globals.css theming
  const styles = {
    container: "space-y-8 p-6",
    
    sectionHeader: "flex items-center justify-between mb-6",
    sectionTitle: "text-2xl font-bold text-foreground",
    
    systemSection: "space-y-6",
    processingSection: "space-y-6",
    
    metricsGrid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
    expandedGrid: "w-full",
    
    successBadge: `
      flex items-center gap-2 px-3 py-1.5
      bg-secondary/50 text-foreground
      border border-border/20
      rounded-full
      backdrop-blur-sm
      shadow-sm
    `,
    
    successDot: "w-2 h-2 bg-green-500 rounded-full animate-pulse",
    successText: "text-sm font-medium"
  };

  /**
   * updateSystemData - Update system metrics with realistic fluctuations
   * Purpose: Maintain real-time system monitoring data
   */
  const updateSystemData = () => {
    const timestamp = Date.now();
    
    setSystemData(prev => ({
      'cpu': [
        ...prev['cpu'].slice(-(getDataPointsCount(timeRanges['cpu']) - 1)),
        { timestamp, value: Math.max(0, Math.min(100, 59 + (Math.random() - 0.5) * 20)) }
      ],
      'memory': [
        ...prev['memory'].slice(-(getDataPointsCount(timeRanges['memory']) - 1)),
        { timestamp, value: Math.max(0, Math.min(100, 41 + (Math.random() - 0.5) * 15)) }
      ],
      'gpu': [
        ...prev['gpu'].slice(-(getDataPointsCount(timeRanges['gpu']) - 1)),
        { timestamp, value: Math.max(0, Math.min(100, 14 + (Math.random() - 0.5) * 12)) }
      ],
      'disk': [
        ...prev['disk'].slice(-(getDataPointsCount(timeRanges['disk']) - 1)),
        { timestamp, value: Math.max(0, Math.min(100, 73 + (Math.random() - 0.5) * 8)) }
      ]
    }));
  };

  /**
   * updateProcessingData - Update processing metrics with realistic fluctuations  
   * Purpose: Maintain real-time processing performance data
   */
  const updateProcessingData = () => {
    const timestamp = Date.now();
    
    setProcessingData(prev => ({
      'executions-per-minute': [
        ...prev['executions-per-minute'].slice(-(getDataPointsCount(timeRanges['executions-per-minute']) - 1)),
        { timestamp, value: Math.max(0, 796 + (Math.random() - 0.5) * 100) }
      ],
      'method-duration': [
        ...prev['method-duration'].slice(-(getDataPointsCount(timeRanges['method-duration']) - 1)),
        { timestamp, value: Math.max(0, 263 + (Math.random() - 0.5) * 50) }
      ],
      'queue-size': [
        ...prev['queue-size'].slice(-(getDataPointsCount(timeRanges['queue-size']) - 1)),
        { timestamp, value: Math.max(0, 21 + (Math.random() - 0.5) * 10) }
      ],
      'concurrency-level': [
        ...prev['concurrency-level'].slice(-(getDataPointsCount(timeRanges['concurrency-level']) - 1)),
        { timestamp, value: Math.max(0, 6 + (Math.random() - 0.5) * 3) }
      ]
    }));

    // Update processing stats occasionally
    if (Math.random() < 0.1) {
      setProcessingStats(prev => ({
        successRate: Math.max(90, Math.min(100, prev.successRate + (Math.random() - 0.5) * 2)),
        successCount: prev.successCount + Math.floor(Math.random() * 3),
        failureCount: prev.failureCount + (Math.random() < 0.3 ? 1 : 0)
      }));
    }
  };

  // Initialize and update data
  useEffect(() => {
    // Generate initial system data
    const generateInitialSystemData = (id: string, baseValue: number, variance: number) => {
      const count = getDataPointsCount(timeRanges[id]);
      return generateMockData(baseValue, variance, count);
    };

    // Generate initial processing data
    const generateInitialProcessingData = (id: string, baseValue: number, variance: number) => {
      const count = getDataPointsCount(timeRanges[id]);
      return generateMockData(baseValue, variance, count);
    };

    setSystemData({
      'cpu': generateInitialSystemData('cpu', 59, 20),
      'memory': generateInitialSystemData('memory', 41, 15),
      'gpu': generateInitialSystemData('gpu', 14, 12),
      'disk': generateInitialSystemData('disk', 73, 8)
    });

    setProcessingData({
      'executions-per-minute': generateInitialProcessingData('executions-per-minute', 796, 100),
      'method-duration': generateInitialProcessingData('method-duration', 263, 50),
      'queue-size': generateInitialProcessingData('queue-size', 21, 10),
      'concurrency-level': generateInitialProcessingData('concurrency-level', 6, 3)
    });

    const systemInterval = setInterval(updateSystemData, CHART_UPDATE_INTERVAL);
    const processingInterval = setInterval(updateProcessingData, CHART_UPDATE_INTERVAL + 500);
    
    return () => {
      clearInterval(systemInterval);
      clearInterval(processingInterval);
    };
  }, [timeRanges]);

  const handleCardToggle = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  const handleTimeRangeChange = (cardId: string, range: string) => {
    setTimeRanges(prev => ({ ...prev, [cardId]: range }));
  };

  // System metrics configuration matching the design
  const systemMetrics = [
    {
      id: 'cpu' as SystemMetricId,
      label: 'CPU',
      spec: 'AMD 4-core processor',
      value: systemData['cpu'][systemData['cpu'].length - 1]?.value?.toFixed(0) || '59',
      unit: '%',
      chartType: 'line' as ChartType,
      data: systemData['cpu'],
      timeRange: timeRanges['cpu']
    },
    {
      id: 'memory' as SystemMetricId,
      label: 'Memory', 
      spec: '32 GB RAM',
      value: systemData['memory'][systemData['memory'].length - 1]?.value?.toFixed(0) || '41',
      unit: '%',
      chartType: 'area' as ChartType,
      data: systemData['memory'],
      timeRange: timeRanges['memory']
    },
    {
      id: 'gpu' as SystemMetricId,
      label: 'GPU',
      spec: 'NVIDIA GPU', 
      value: systemData['gpu'][systemData['gpu'].length - 1]?.value?.toFixed(0) || '14',
      unit: '%',
      chartType: 'line' as ChartType,
      data: systemData['gpu'],
      timeRange: timeRanges['gpu']
    },
    {
      id: 'disk' as SystemMetricId,
      label: 'Disk',
      spec: '1TB NVMe SSD',
      value: systemData['disk'][systemData['disk'].length - 1]?.value?.toFixed(0) || '73', 
      unit: '%',
      chartType: 'area' as ChartType,
      data: systemData['disk'],
      timeRange: timeRanges['disk']
    }
  ];

  // Processing metrics configuration matching the design
  const performanceMetrics = [
    {
      id: 'executions-per-minute',
      label: 'Executions per Minute',
      value: processingData['executions-per-minute'][processingData['executions-per-minute'].length - 1]?.value?.toFixed(0) || '796',
      unit: '',
      chartType: 'bar' as ChartType,
      data: processingData['executions-per-minute'],
      timeRange: timeRanges['executions-per-minute']
    },
    {
      id: 'method-duration', 
      label: 'Average Method Duration',
      value: processingData['method-duration'][processingData['method-duration'].length - 1]?.value?.toFixed(0) || '263',
      unit: 'ms',
      chartType: 'area' as ChartType,
      data: processingData['method-duration'],
      timeRange: timeRanges['method-duration']
    },
    {
      id: 'queue-size',
      label: 'Queue Size', 
      value: processingData['queue-size'][processingData['queue-size'].length - 1]?.value?.toFixed(0) || '21',
      unit: '',
      chartType: 'area' as ChartType,
      data: processingData['queue-size'],
      timeRange: timeRanges['queue-size']
    },
    {
      id: 'concurrency-level',
      label: 'Concurrency Level',
      value: processingData['concurrency-level'][processingData['concurrency-level'].length - 1]?.value?.toFixed(0) || '6',
      unit: '',
      chartType: 'line' as ChartType, 
      data: processingData['concurrency-level'],
      timeRange: timeRanges['concurrency-level']
    }
  ];

  return (
    <PageContainer>
      <div className={styles.container}>
        
        {/* System Overview Section */}
        <div className={styles.systemSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>System Overview</h2>
          </div>

          {/* System Metrics Grid */}
          {expandedCard && systemMetrics.find(m => m.id === expandedCard) ? (
            <div className={styles.expandedGrid}>
              {systemMetrics.find(m => m.id === expandedCard) && (
                <SystemMetricCard
                  {...systemMetrics.find(m => m.id === expandedCard)!}
                  color={cardColors[expandedCard as keyof typeof cardColors]} 
                  isExpanded={true}
                  onToggleExpand={() => handleCardToggle(expandedCard)}
                  timeRange={systemMetrics.find(m => m.id === expandedCard)!.timeRange}
                  onTimeRangeChange={(range) => handleTimeRangeChange(expandedCard, range)}
                />
              )}
            </div>
          ) : (
            <div className={styles.metricsGrid}>
              {systemMetrics.map(metric => (
                <SystemMetricCard
                  key={metric.id}
                  {...metric}
                  color={cardColors[metric.id]} // ✅ Pass explicit color
                  isExpanded={false}
                  onToggleExpand={() => handleCardToggle(metric.id)}
                  timeRange={metric.timeRange}
                  onTimeRangeChange={(range) => handleTimeRangeChange(metric.id, range)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Processing Overview Section */}
        <div className={styles.processingSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Processing Overview</h2>
            
            {/* Success/Failure Rate Badge */}
            <Badge variant="secondary" className={styles.successBadge}>
              <div className={styles.successDot}></div>
              <span className={styles.successText}>
                Success/failure {processingStats.successRate.toFixed(1)}% {processingStats.successCount}/{processingStats.failureCount}
              </span>
            </Badge>
          </div>

          {/* Processing Metrics Grid */}
          {expandedCard && performanceMetrics.find(m => m.id === expandedCard) ? (
            <div className={styles.expandedGrid}>
              {performanceMetrics.find(m => m.id === expandedCard) && (
                <SystemMetricCard
                  {...performanceMetrics.find(m => m.id === expandedCard)!}
                  id={performanceMetrics.find(m => m.id === expandedCard)!.id as SystemMetricId}
                  color={cardColors[expandedCard]} // ✅ Pass explicit color
                  isExpanded={true}
                  onToggleExpand={() => handleCardToggle(expandedCard)}
                  timeRange={performanceMetrics.find(m => m.id === expandedCard)!.timeRange}
                  onTimeRangeChange={(range) => handleTimeRangeChange(expandedCard, range)}
                />
              )}
            </div>
          ) : (
            <div className={styles.metricsGrid}>
              {performanceMetrics.map(metric => (
                <SystemMetricCard
                  key={metric.id}
                  {...metric}
                  id={metric.id as SystemMetricId}
                  color={cardColors[metric.id]} // ✅ Pass explicit color
                  isExpanded={false}
                  onToggleExpand={() => handleCardToggle(metric.id)}
                  timeRange={metric.timeRange}
                  onTimeRangeChange={(range) => handleTimeRangeChange(metric.id, range)}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </PageContainer>
  );
}