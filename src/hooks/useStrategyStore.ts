import create from 'zustand';

import { StrategyBlock } from '../constants';
import { IStrategyPrepTxBase } from '../types';

type Txs = {
  [key in StrategyBlock]: IStrategyPrepTxBase;
};
type TxSetter = (key: StrategyBlock, tx: IStrategyPrepTxBase) => void;

interface IStrategyStore {
  txs: Txs;
  setTx: TxSetter;
}

export const useStrategyStore = create<IStrategyStore>((set) => ({
  txs: {} as any,
  setTx: (key, tx) => set((state) => ({ txs: { ...state.txs, [key]: tx } })),
}));
