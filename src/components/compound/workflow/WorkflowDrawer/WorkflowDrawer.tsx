// src/components/compound/workflow/WorkflowDrawer/WorkflowDrawer.tsx

"use client";

import React from 'react';
import { StatusIndicator } from '@ui/status-indicator';
import type { Workflow } from '@compound/workflow';
import styles from './WorkflowDrawer.module.css';

export interface WorkflowDrawerProps {
  workflow: Workflow | null;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  className?: string;
}

/**
 * WorkflowDrawer Component
 * 
 * Purpose: Side panel with detailed workflow information
 * Reusability: 🔄 Moderately reusable for any detailed side panel, entity details
 * Architecture: CSS Modules + globals1.css design tokens
 */
export const WorkflowDrawer: React.FC<WorkflowDrawerProps> = ({
  workflow,
  isOpen,
  onClose,
  children,
  className = ''
}) => {
  if (!workflow) return null;

  // Close on ESC key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  // Prevent body scroll when drawer is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  // Don't render anything if no workflow
  if (!isOpen && !workflow) return null;

  return (
    <>
      {/* Backdrop - only render when open */}
      {isOpen && (
        <div 
          className={styles.backdrop}
          onClick={onClose}
          aria-label="Close workflow details"
        />
      )}
      
      {/* Drawer - always render for animation, but conditionally visible */}
      {(isOpen || workflow) && (
        <div 
          className={`${styles.drawer} ${isOpen ? styles.drawerOpen : styles.drawerClosed} ${className}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="drawer-title"
          style={{ 
            visibility: isOpen ? 'visible' : 'hidden',
            pointerEvents: isOpen ? 'auto' : 'none'
          }}
        >
          <div className={styles.content}>
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.headerLeft}>
                <StatusIndicator 
                  status={workflow.status} 
                  size="md" 
                  animated={workflow.status === 'running'}
                />
                <h2 id="drawer-title" className={styles.title}>
                  {workflow.name}
                </h2>
              </div>
              
              <button 
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Close workflow details"
                tabIndex={isOpen ? 0 : -1}
              >
                ✕
              </button>
            </div>

            {/* Content Area */}
            <div className={styles.body}>
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WorkflowDrawer;