import { useEffect, useRef } from 'react';

export const useThrottledEffect = (callback: () => any, delay: number, deps: any[]) => {
  const lastRan = useRef(Date.now());

  useEffect(
    () => {
      const handler = setTimeout(function () {
        if (Date.now() - lastRan.current >= delay) {
          callback();
          lastRan.current = Date.now();
        }
      }, delay - (Date.now() - lastRan.current));

      return () => {
        clearTimeout(handler);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [delay, ...deps]
  );
};
