import { useEffect, useState } from 'react';

export const useScrollPosition = (triggerPosition: number = 300) => {
  const [isPassed, setIsPassed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsPassed(scrollY >= triggerPosition);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // check lần đầu

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [triggerPosition]);

  return isPassed;
};
