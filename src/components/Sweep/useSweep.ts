import { useCallback, useEffect } from 'react';
import create from 'zustand';
import { persist } from 'zustand/middleware';

interface ISweepStoreState {
  spenderAddr: string;
  fromAddr: string;
  toAddr: string;
}

interface ISweepStoreMethods {
  setSpenderAddr: (address: string) => void;
  setFromAddr: (address: string) => void;
  setToAddr: (address: string) => void;
}

interface ISweepStoreHook extends ISweepStoreState, ISweepStoreMethods {}

const defaultState: ISweepStoreState = {
  spenderAddr: '',
  fromAddr: '',
  toAddr: '',
};

const useSweepOptionsStore = create<ISweepStoreState>(
  persist(() => defaultState, {
    name: 'sweep-store',
    getStorage: () => localStorage,
  }) as any
);

const useSweepStore = (): ISweepStoreHook => {
  const state = useSweepOptionsStore();
  const setSpenderAddr = useCallback((address: string) => useSweepOptionsStore.setState({ spenderAddr: address }), []);
  const setFromAddr = useCallback((address: string) => useSweepOptionsStore.setState({ fromAddr: address }), []);
  const setToAddr = useCallback((address: string) => useSweepOptionsStore.setState({ toAddr: address }), []);

  return {
    ...state,
    setSpenderAddr,
    setFromAddr,
    setToAddr,
  };
};

export { useSweepStore, useSweepOptionsStore };
