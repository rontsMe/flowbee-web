// hooks/useResizeHandler.ts

import { useEffect } from 'react';
import { ExpandedCardState } from '@features/metrics/types';

/**
 * useResizeHandler - Custom hook for window resize handling
 * Purpose: Manages resize event listener with performance optimization
 * Only attaches listener when there's an expanded card (performance)
 * 
 * @param callback - Function to call on window resize
 * @param expandedCard - Current expanded card state (null if none expanded)
 */
export const useResizeHandler = (
  callback: () => void,
  expandedCard: ExpandedCardState | null
): void => {
  
  useEffect(() => {
    // Only attach resize listener if there's an expanded card
    if (!expandedCard) {
      return;
    }

    const handleResize = () => {
      callback();
    };

    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
    
  }, [callback, expandedCard]); // Re-attach when expandedCard changes
};