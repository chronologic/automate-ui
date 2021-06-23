import React, { createContext, useCallback, useEffect, useState } from 'react';
import throttle from 'lodash/throttle';

import { MOBILE_SCREEN_THRESHOLD, SMALL_SCREEN_THRESHOLD } from '../constants';

interface IScreenContext {
  isMobile: boolean;
  isSmall: boolean;
}

interface IProps {
  children: React.ReactNode;
}

const defaultIsMobile = checkIsScreenMobile();
const defaultIsSmall = checkIsScreenSmall();

export const ScreenContext = createContext<IScreenContext>({
  isMobile: defaultIsMobile,
  isSmall: defaultIsSmall,
});

export const ScreenProvider: React.FC<IProps> = ({ children }: IProps) => {
  const [isMobile, setIsMobile] = useState(defaultIsMobile);
  const [isSmall, setIsSmall] = useState(defaultIsSmall);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateIsMobile = useCallback(
    throttle(() => {
      const newIsMobile = checkIsScreenMobile();
      setIsMobile(newIsMobile);
    }, 100),
    []
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateIsSmall = useCallback(
    throttle(() => {
      const newIsSmall = checkIsScreenSmall();
      setIsSmall(newIsSmall);
    }, 100),
    []
  );

  useEffect(() => {
    window.removeEventListener('resize', updateIsMobile);
    window.addEventListener('resize', updateIsMobile);

    window.removeEventListener('resize', updateIsSmall);
    window.addEventListener('resize', updateIsSmall);
  }, [updateIsMobile, updateIsSmall]);

  return <ScreenContext.Provider value={{ isMobile, isSmall }}>{children}</ScreenContext.Provider>;
};

function checkIsScreenMobile(): boolean {
  const width = window.innerWidth;
  return width <= MOBILE_SCREEN_THRESHOLD;
}

function checkIsScreenSmall(): boolean {
  const width = window.innerWidth;
  return width <= SMALL_SCREEN_THRESHOLD;
}
