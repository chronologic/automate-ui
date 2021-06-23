import React, { createContext, useCallback, useEffect, useState } from 'react';
import throttle from 'lodash/throttle';

import { MOBILE_SCREEN_THRESHOLD } from '../constants';

interface IScreenContext {
  isMobile: boolean;
}

interface IProps {
  children: React.ReactNode;
}

const defaultIsMobile = checkIsScreenMobile();

export const ScreenContext = createContext<IScreenContext>({
  isMobile: defaultIsMobile,
});

export const ScreenProvider: React.FC<IProps> = ({ children }: IProps) => {
  const [isMobile, setIsMobile] = useState(defaultIsMobile);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateIsMobile = useCallback(
    throttle(() => {
      const newIsMobile = checkIsScreenMobile();
      setIsMobile(newIsMobile);
    }, 100),
    []
  );

  useEffect(() => {
    window.removeEventListener('resize', updateIsMobile);
    window.addEventListener('resize', updateIsMobile);
  }, [updateIsMobile]);

  return <ScreenContext.Provider value={{ isMobile }}>{children}</ScreenContext.Provider>;
};

function checkIsScreenMobile(): boolean {
  const width = window.innerWidth;
  return width <= MOBILE_SCREEN_THRESHOLD;
}
