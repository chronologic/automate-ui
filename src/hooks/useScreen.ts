import create from 'zustand';
import throttle from 'lodash/throttle';

import { SCREEN_BREAKPOINT } from '../constants';

interface IScreenStoreState {
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  isXxl: boolean;
}

interface IScreenStoreMethods {}

interface IScreenHook extends IScreenStoreState, IScreenStoreMethods {}

const defaultState: IScreenStoreState = {
  isXs: false,
  isSm: false,
  isMd: false,
  isLg: false,
  isXl: false,
  isXxl: false,
};

const useStore = create<IScreenStoreState>(() => defaultState);

const updateScreenThrottled = throttle(() => updateScreen(), 100);

window.addEventListener('resize', updateScreenThrottled);

function updateScreen() {
  const width = window.innerWidth;

  const newState: IScreenStoreState = {
    isXs: true,
    isSm: width >= SCREEN_BREAKPOINT.SM,
    isMd: width >= SCREEN_BREAKPOINT.MD,
    isLg: width >= SCREEN_BREAKPOINT.LG,
    isXl: width > SCREEN_BREAKPOINT.XL,
    isXxl: width > SCREEN_BREAKPOINT.XXL,
  };

  useStore.setState(newState);
}

const useScreen = (): IScreenHook => {
  const state = useStore();

  return state;
};

export { useScreen, useStore };
