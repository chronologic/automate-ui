import create from 'zustand';

import { ChainId, StrategyBlock } from '../constants';
import { IStrategyBlockTx, IStrategyRepetition, StrategyBlockTxs } from '../types';

interface IStrategyStore {
  txs: StrategyBlockTxs;
  setTx: (key: StrategyBlock, tx: IStrategyBlockTx) => void;
  repetitions: IStrategyRepetition[];
  setRepetitions: (repetitions: IStrategyRepetition[]) => void;
  chainId: ChainId | null;
  setChainId: (id: ChainId) => void;
}

export const useStrategyStore = create<IStrategyStore>((set) => ({
  txs: {} as any,
  setTx: (key, tx) => set((state) => ({ txs: { ...state.txs, [key]: tx } })),
  repetitions: [],
  setRepetitions: (repetitions) => set(() => ({ repetitions })),
  chainId: null,
  setChainId: (chainId) => set(() => ({ chainId })),
}));
