import { useState, useEffect, useCallback, useRef } from 'react';

interface ScrollPosition {
  scrollX: number;
  scrollY: number;
  scrollDirection: 'up' | 'down' | null;
  isScrolled: boolean;
}

interface UseScrollPositionOptions {
  threshold?: number;
  debounceMs?: number;
}

export function useScrollPosition(options: UseScrollPositionOptions = {}): ScrollPosition {
  const { threshold = 50, debounceMs = 100 } = options;
  
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>(() => ({
    scrollX: typeof window !== 'undefined' ? window.scrollX : 0,
    scrollY: typeof window !== 'undefined' ? window.scrollY : 0,
    scrollDirection: null,
    isScrolled: typeof window !== 'undefined' ? window.scrollY > threshold : false,
  }));

  const lastScrollY = useRef(typeof window !== 'undefined' ? window.scrollY : 0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const currentScrollX = window.scrollX;
    
    // Determine scroll direction
    let scrollDirection: 'up' | 'down' | null = null;
    if (currentScrollY !== lastScrollY.current) {
      scrollDirection = currentScrollY > lastScrollY.current ? 'down' : 'up';
    }

    const newScrollPosition: ScrollPosition = {
      scrollX: currentScrollX,
      scrollY: currentScrollY,
      scrollDirection,
      isScrolled: currentScrollY > threshold,
    };

    // Clear existing timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    // Debounce the scroll position update
    scrollTimeout.current = setTimeout(() => {
      setScrollPosition(newScrollPosition);
      lastScrollY.current = currentScrollY;
    }, debounceMs);
  }, [threshold, debounceMs]);

  useEffect(() => {
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [handleScroll]);

  return scrollPosition;
}
