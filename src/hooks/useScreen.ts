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

const defaultState = getScreenState();

const useScreenStore = create<IScreenStoreState>(() => defaultState);

const updateScreenThrottled = throttle(() => updateScreen(), 100);

window.addEventListener('resize', updateScreenThrottled);

function updateScreen() {
  useScreenStore.setState(getScreenState());
}

function getScreenState(): IScreenStoreState {
  const width = window.innerWidth;

  return {
    isXs: true,
    isSm: width >= SCREEN_BREAKPOINT.SM,
    isMd: width >= SCREEN_BREAKPOINT.MD,
    isLg: width >= SCREEN_BREAKPOINT.LG,
    isXl: width > SCREEN_BREAKPOINT.XL,
    isXxl: width > SCREEN_BREAKPOINT.XXL,
  };
}

const useScreen = (): IScreenHook => {
  const state = useScreenStore();

  return state;
};

export { useScreen, useScreenStore };
