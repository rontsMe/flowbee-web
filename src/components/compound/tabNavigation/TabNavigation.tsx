"use client";

import React, { useState } from 'react';
import styles from './TabNavigation.module.css';

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabNavigationProps {
  tabs: TabItem[];
  defaultActiveTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
}

/**
 * TabNavigation Component
 * 
 * Purpose"use client";

import React, { useState } from 'react';
import styles from './TabNavigation.module.css';

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabNavigationProps {
  tabs: TabItem[];
  defaultActiveTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
}

/**
 * TabNavigation Component
 * 
 * Purpose: Complete tab system with navigation + content rendering
 * Features: Theme-aware, keyboard accessible, accepts React components
 * Based on: Pasted component reference with content switching
 */
export function TabNavigation({
  tabs,
  defaultActiveTab,
  onTabChange,
  className = ''
}: TabNavigationProps) {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0]?.id || '');

  const handleTabClick = (tabId: string) => {
    if (tabs.find(tab => tab.id === tabId)?.disabled) return;
    
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const handleKeyDown = (event: React.KeyboardEvent, tabId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleTabClick(tabId);
    }
  };

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className={className}>
      {/* Tab Navigation */}
      <div className={styles.tabContainer}>
        <nav className={styles.tabNavigation} role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-disabled={tab.disabled}
              tabIndex={tab.disabled ? -1 : 0}
              className={`${styles.tabButton} ${
                activeTab === tab.id ? styles.tabActive : ''
              }`}
              onClick={() => handleTabClick(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, tab.id)}
              disabled={tab.disabled}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent} role="tabpanel">
        {activeTabContent}
      </div>
    </div>
  );
}

/**
 * Example Usage with Real Components
 */
export function TabNavigationExample() {
  // Example content components
  const OverviewContent = () => (
    <div>
      <h2>System Overview</h2>
      <p>Real-time system metrics and status...</p>
    </div>
  );

  const AnalyticsContent = () => (
    <div>
      <h2>Analytics Dashboard</h2>
      <p>Charts, graphs, and data analysis...</p>
    </div>
  );

  const ReportsContent = () => (
    <div>
      <h2>Reports Center</h2>
      <p>Generated reports and exports...</p>
    </div>
  );

  const tabs: TabItem[] = [
    { 
      id: 'overview', 
      label: 'Overview',
      content: <OverviewContent />
    },
    { 
      id: 'analytics', 
      label: 'Analytics',
      content: <AnalyticsContent />
    },
    { 
      id: 'reports', 
      label: 'Reports',
      content: <ReportsContent />
    },
  ];

  const handleTabChange = (tabId: string) => {
    console.log('Active tab:', tabId);
  };

  return (
    <TabNavigation
      tabs={tabs}
      defaultActiveTab="overview"
      onTabChange={handleTabChange}
    />
  );
}

export default TabNavigation;