import create from 'zustand';

import { StrategyBlock } from '../constants';
import { IStrategyPrepTxBase, IStrategyRepetition } from '../types';

interface IStrategyStore {
  txs: {
    [key in StrategyBlock]: IStrategyPrepTxBase;
  };
  setTx: (key: StrategyBlock, tx: IStrategyPrepTxBase) => void;
  repetitions: IStrategyRepetition[];
  setRepetitions: (repetitions: IStrategyRepetition[]) => void;
}

export const useStrategyStore = create<IStrategyStore>((set) => ({
  txs: {} as any,
  setTx: (key, tx) => set((state) => ({ txs: { ...state.txs, [key]: tx } })),
  repetitions: [],
  setRepetitions: (repetitions) => set(() => ({ repetitions })),
}));
