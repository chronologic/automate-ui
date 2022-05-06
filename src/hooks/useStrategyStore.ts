import create from 'zustand';

import { StrategyBlock } from '../constants';
import { IStrategyBlockTx, IStrategyRepetition, StrategyBlockTxs } from '../types';

interface IStrategyStore {
  txs: StrategyBlockTxs;
  setTx: (key: StrategyBlock, tx: IStrategyBlockTx) => void;
  repetitions: IStrategyRepetition[];
  setRepetitions: (repetitions: IStrategyRepetition[]) => void;
}

export const useStrategyStore = create<IStrategyStore>((set) => ({
  txs: {} as any,
  setTx: (key, tx) => set((state) => ({ txs: { ...state.txs, [key]: tx } })),
  repetitions: [],
  setRepetitions: (repetitions) => set(() => ({ repetitions })),
}));
