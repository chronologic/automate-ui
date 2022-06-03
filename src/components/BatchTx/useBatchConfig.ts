import { useEffect, useCallback } from 'react';
import create from 'zustand';

import {
  BatchColumn,
  BatchSeparator,
  useBatchConfigStorage,
  useBatchConfigStorageStore,
} from './useBatchConfigStorage';

interface IBatchColumnConfig {
  name: BatchColumn;
  label: string;
  canDeselect: boolean;
  parser(value: string): string;
}

interface IBatchSeparatorConfig {
  name: BatchSeparator;
  label: string;
  parser(value: string): string;
}

const batchColumns: {
  [name in BatchColumn]: IBatchColumnConfig;
} = {
  address: {
    name: 'address',
    label: 'Address',
    canDeselect: false,
    parser: (value: string) => value,
  },
  amount: {
    name: 'amount',
    label: 'Amount',
    canDeselect: false,
    parser: (value: string) => value,
  },
  notes: {
    name: 'notes',
    label: 'Notes',
    canDeselect: true,
    parser: (value: string) => value,
  },
  gasPrice: {
    name: 'gasPrice',
    label: 'Gas Price (gwei)',
    canDeselect: true,
    parser: (value: string) => value,
  },
  gasLimit: {
    name: 'gasLimit',
    label: 'Gas Limit',
    canDeselect: true,
    parser: (value: string) => value,
  },
};

const batchSeparators: {
  [name in BatchSeparator]: IBatchSeparatorConfig;
} = {
  tab: {
    name: 'tab',
    label: 'Tab',
    parser: (value: string) => value,
  },
  comma: {
    name: 'comma',
    label: 'Comma',
    parser: (value: string) => value,
  },
};

interface IBatchConfigState {
  columns: IBatchColumnConfig[];
  selectedColumns: BatchColumn[];
  separators: IBatchSeparatorConfig[];
  selectedSeparator: BatchSeparator;
  selectedAsset: string;
}

interface IBatchConfigMethods {
  selectSeparator: (name: BatchSeparator) => void;
  selectColumns: (names: BatchColumn[]) => void;
  selectAsset: (name: string) => void;
}

interface IBatchConfigHook extends IBatchConfigState, IBatchConfigMethods {}

const defaultState: IBatchConfigState = {
  columns: [],
  selectedColumns: [],
  separators: Object.keys(batchSeparators).map((name) => batchSeparators[name as BatchSeparator]),
  selectedSeparator: '' as any,
  selectedAsset: '',
};

const useBatchConfigStore = create<IBatchConfigState>(() => defaultState);

const useBatchConfig = (): IBatchConfigHook => {
  const storageState = useBatchConfigStorage();
  const state = useBatchConfigStore();

  const selectedColumns = storageState.columns;
  const selectedSeparator = storageState.separator;

  const selectSeparator = useCallback((name: BatchSeparator) => {
    useBatchConfigStorageStore.setState({ separator: name });
  }, []);

  const selectColumns = useCallback((names: BatchColumn[]) => {
    useBatchConfigStorageStore.setState({ columns: names });
  }, []);

  const selectAsset = useCallback((asset: string) => {
    useBatchConfigStorageStore.setState({ asset });
  }, []);

  useEffect(() => {
    const allColumnNames = Object.keys(batchColumns);
    const sortedColumnNames = [
      ...selectedColumns,
      ...allColumnNames.filter((name) => !selectedColumns.includes(name as BatchColumn)),
    ];

    const columns = sortedColumnNames.map((name) => batchColumns[name as BatchColumn]);

    useBatchConfigStore.setState({ columns });
  }, [selectedColumns, storageState.columns]);

  return {
    ...state,
    selectedColumns,
    selectedSeparator,
    selectedAsset: storageState.asset,
    selectColumns,
    selectSeparator,
    selectAsset,
  };
};

export { useBatchConfig, useBatchConfigStore };
