import create from 'zustand';
import { persist } from 'zustand/middleware';

import { IAssetStorageItem } from '../../hooks';

export type BatchColumn = 'address' | 'amount' | 'notes' | 'gasPrice' | 'gasLimit';
export type BatchDelimiter = 'tab' | 'comma';

interface IBatchConfigStorageState {
  columns: BatchColumn[];
  delimiter: BatchDelimiter;
  asset?: IAssetStorageItem;
}

interface IBatchConfigStorageMethods {
  update: (partialConfig: Partial<IBatchConfigStorageState>) => void;
}

interface IBatchConfigStorageHook extends IBatchConfigStorageState, IBatchConfigStorageMethods {}

const defaultState: IBatchConfigStorageState = {
  columns: ['address', 'amount', 'notes'],
  delimiter: 'tab',
  asset: undefined,
};

const useBatchConfigStorageStore = create<IBatchConfigStorageState>(
  persist(() => defaultState, {
    name: 'batch-config',
    getStorage: () => localStorage,
  }) as any
);

function updateConfig(partialConfig: Partial<IBatchConfigStorageState>) {
  const state = useBatchConfigStorageStore.getState();

  useBatchConfigStorageStore.setState({ ...state, ...partialConfig });
}

const useBatchConfigStorage = (): IBatchConfigStorageHook => {
  const state = useBatchConfigStorageStore();

  return {
    ...state,
    update: updateConfig,
  };
};

export { useBatchConfigStorage, useBatchConfigStorageStore };
