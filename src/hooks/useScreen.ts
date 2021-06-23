import { useContext } from 'react';

import { ScreenContext } from '../contexts';

export function useScreen() {
  const context = useContext(ScreenContext);

  return context;
}
