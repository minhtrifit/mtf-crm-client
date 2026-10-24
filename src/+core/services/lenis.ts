import Lenis from 'lenis';

let lenisInstance: Lenis | null = null;

export const createLenis = () => {
  if (!lenisInstance) {
    lenisInstance = new Lenis({
      autoRaf: true,
      smoothWheel: true,
      syncTouch: true,
      syncTouchLerp: 0.075,
      touchInertiaExponent: 1.7,
      lerp: 0.1,
      allowNestedScroll: true,
    });
  }

  return lenisInstance;
};

export const getLenis = () => {
  return lenisInstance;
};

export const destroyLenis = () => {
  lenisInstance?.destroy();
  lenisInstance = null;
};
