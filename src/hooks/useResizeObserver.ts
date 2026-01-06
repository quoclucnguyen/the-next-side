import { useState, useEffect } from 'react';

export interface ResizeObserverState {
  isOverflowing: boolean;
  containerWidth: number;
  containerHeight: number;
}

/**
 * Hook to observe element resize changes and detect overflow
 * Uses ResizeObserver API for efficient size monitoring
 */
export function useResizeObserver(ref: React.RefObject<HTMLElement>): ResizeObserverState {
  const [state, setState] = useState<ResizeObserverState>({
    isOverflowing: false,
    containerWidth: 0,
    containerHeight: 0,
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updateState = () => {
      const { width, height } = element.getBoundingClientRect();
      const isOverflowing = element.scrollWidth > element.clientWidth || 
                           element.scrollHeight > element.clientHeight;

      setState({
        isOverflowing,
        containerWidth: width,
        containerHeight: height,
      });
    };

    // Initial state
    updateState();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const isOverflowing = element.scrollWidth > element.clientWidth || 
                           element.scrollHeight > element.clientHeight;

        setState({
          isOverflowing,
          containerWidth: width,
          containerHeight: height,
        });
      }
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [ref]);

  return state;
}
