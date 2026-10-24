import { useCallback } from 'react';
import { getLenis } from '@/+core/services/lenis';

export function useScrollToTop() {
  return useCallback((behavior: ScrollBehavior = 'smooth') => {
    const lenis = getLenis();

    if (!lenis) {
      window.scrollTo(0, 0);
      return;
    }

    lenis.scrollTo(0, {
      immediate: behavior === 'instant',
    });
  }, []);
}
