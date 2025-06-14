// components/kbar/result-item.tsx
import type { ActionId, ActionImpl } from 'kbar';
import * as React from 'react';
import styles from './KBarResultItem.module.css';

const ResultItem = React.forwardRef(
  (
    {
      action,
      active,
      currentRootActionId
    }: {
      action: ActionImpl;
      active: boolean;
      currentRootActionId: ActionId;
    },
    ref: React.Ref<HTMLDivElement>
  ) => {
    const ancestors = React.useMemo(() => {
      if (!currentRootActionId) return action.ancestors;
      const index = action.ancestors.findIndex(
        (ancestor) => ancestor.id === currentRootActionId
      );
      return action.ancestors.slice(index + 1);
    }, [action.ancestors, currentRootActionId]);

    return (
      <div
        ref={ref}
        className={`${styles.resultItem} ${active ? styles.resultItemActive : ''}`}
      >
        {active && (
          <div className={styles.activeIndicator}></div>
        )}
        
        <div className={styles.contentContainer}>
          {action.icon && (
            <div className={styles.iconContainer}>
              {action.icon}
            </div>
          )}
          
          <div className={styles.textContainer}>
            {ancestors.length > 0 && (
              <div className={styles.breadcrumbContainer}>
                {ancestors.map((ancestor) => (
                  <React.Fragment key={ancestor.id}>
                    <span className={styles.breadcrumbItem}>
                      {ancestor.name}
                    </span>
                    <span className={styles.breadcrumbSeparator}>&rsaquo;</span>
                  </React.Fragment>
                ))}
              </div>
            )}
            
            <div className={styles.actionName}>
              {action.name}
            </div>
            
            {action.subtitle && (
              <div className={styles.actionSubtitle}>
                {action.subtitle}
              </div>
            )}
          </div>
        </div>
        
        {action.shortcut?.length ? (
          <div className={styles.shortcutContainer}>
            {action.shortcut.map((sc, i) => (
              <kbd key={sc + i} className={styles.shortcutKey}>
                {sc}
              </kbd>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
);

ResultItem.displayName = 'KBarResultItem';

export default ResultItem;