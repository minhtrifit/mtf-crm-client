import { useCallback } from 'react';
import { getLenis } from '@/+core/services/lenis';

type ScrollOptions = {
  offset?: number;
  behavior?: ScrollBehavior;
};

export const useScrollToId = () => {
  const scrollToId = useCallback((id: string, options?: ScrollOptions) => {
    if (!id) return;

    const element = document.getElementById(id);
    if (!element) return;

    const { offset = 0, behavior = 'smooth' } = options || {};

    const top = element.getBoundingClientRect().top + window.scrollY - offset;
    const lenis = getLenis();

    if (lenis) {
      lenis.scrollTo(top, { immediate: behavior === 'instant' });
    } else {
      window.scrollTo({
        top,
        behavior,
      });
    }
  }, []);

  return scrollToId;
};
