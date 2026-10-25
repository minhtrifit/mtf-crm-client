import { useCallback } from 'react';
import { getLenis } from '@/+core/services/lenis';
import { useScrollPosition } from './useScrollPosition';

export function useScrollToTop() {
  const isVisible = useScrollPosition();
  const scrollToTop = useCallback((behavior: ScrollBehavior = 'smooth') => {
    const lenis = getLenis();

    if (!lenis) {
      window.scrollTo(0, 0);
      return;
    }

    lenis.scrollTo(0, {
      immediate: behavior === 'instant',
    });
  }, []);

  return { scrollToTop, isVisible };
}
