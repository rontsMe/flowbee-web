// src/components/ui/action-dropdown/ActionDropdown.tsx

"use client";

import React, { useState, useRef, useEffect } from 'react';
import styles from './ActionDropdown.module.css';

export interface ActionItem {
  label: string;
  action: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  disabled?: boolean;
}

export interface ActionDropdownProps {
  actions: ActionItem[];
  onAction: (action: string) => void;
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
  disabled?: boolean;
}

/**
 * ActionDropdown UI Component
 * 
 * Purpose: Reusable dropdown menu for actions
 * Reusability: ⭐⭐⭐⭐⭐ Highly reusable for workflow actions, context menus, bulk actions
 * Architecture: CSS Modules + globals1.css design tokens
 */
export const ActionDropdown: React.FC<ActionDropdownProps> = ({
  actions,
  onAction,
  trigger,
  isOpen: controlledIsOpen,
  onToggle,
  className = '',
  disabled = false
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const isOpen = controlledIsOpen ?? internalIsOpen;
  const setIsOpen = onToggle ?? setInternalIsOpen;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen, setIsOpen]);

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleActionClick = (action: string) => {
    onAction(action);
    setIsOpen(false);
  };

  const defaultTrigger = (
    <button
      className={`${styles.trigger} ${disabled ? styles.disabled : ''}`}
      onClick={handleTriggerClick}
      disabled={disabled}
      aria-expanded={isOpen}
      aria-haspopup="menu"
    >
      Actions
      <span className={styles.chevron}>▼</span>
    </button>
  );

  return (
    <div 
      ref={dropdownRef}
      className={`${styles.dropdown} ${className}`}
    >
      {trigger ? (
        <div onClick={handleTriggerClick}>
          {trigger}
        </div>
      ) : (
        defaultTrigger
      )}
      
      {isOpen && (
        <div className={styles.menu} role="menu">
          {actions.map((item) => (
            <button
              key={item.action}
              className={`${styles.menuItem} ${styles[`color-${item.color || 'primary'}`]} ${
                item.disabled ? styles.disabled : ''
              }`}
              onClick={() => handleActionClick(item.action)}
              disabled={item.disabled}
              role="menuitem"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionDropdown;