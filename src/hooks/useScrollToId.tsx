import { useCallback } from 'react';

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

    window.scrollTo({
      top,
      behavior,
    });
  }, []);

  return scrollToId;
};
