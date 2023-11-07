import { ethers } from 'ethers';
import React, { useEffect, useCallback } from 'react';
import create from 'zustand';

import { ChainId, Network } from '../../constants';
import { IAssetStorageItem } from '../../hooks';

import {
  BatchColumn,
  BatchDelimiter,
  useBatchConfigStorage,
  useBatchConfigStorageStore,
} from './useBatchConfigStorage';

export interface IBatchNetworkConfig {
  name: Network;
  chainId: ChainId;
  label: string;
  icon: React.ReactNode;
}

export interface IBatchColumnConfig {
  name: BatchColumn;
  label: string;
  canDeselect: boolean;
  parser(value: string, options?: any): string;
}

interface IBatchDelimiterConfig {
  name: BatchDelimiter;
  label: string;
  symbol: string;
  fileType: string;
}

const batchNetworks: {
  [name in Network]?: IBatchNetworkConfig;
} = {
  [Network.ethereum]: {
    name: Network.ethereum,
    chainId: ChainId.ethereum,
    label: 'Ethereum',
    icon: <img alt="Ethereum" src="/assets/eth.svg" width="36" height="36" />,
  },
  [Network.arbitrum]: {
    name: Network.arbitrum,
    chainId: ChainId.arbitrum,
    label: 'Arbitrum',
    icon: <img alt="Arbitrum" src="/assets/arbitrum.svg" width="36" height="36" />,
  },
};

const batchColumns: {
  [name in BatchColumn]: IBatchColumnConfig;
} = {
  address: {
    name: 'address',
    label: 'Address',
    canDeselect: false,
    parser: (address: string) => ethers.utils.getAddress(address),
  },
  amount: {
    name: 'amount',
    label: 'Amount',
    canDeselect: false,
    parser: (amount: string, { asset }: { asset: IAssetStorageItem }) =>
      ethers.utils.parseUnits(amount.split(',').join('').split('$').join(''), asset.decimals).toString(),
  },
  notes: {
    name: 'notes',
    label: 'Notes',
    canDeselect: true,
    parser: (notes: string) => notes,
  },
  gasPrice: {
    name: 'gasPrice',
    label: 'Gas Price (gwei)',
    canDeselect: true,
    parser: (gwei: string) => ethers.utils.parseUnits(gwei, 'gwei').toString(),
  },
  gasLimit: {
    name: 'gasLimit',
    label: 'Gas Limit',
    canDeselect: true,
    parser: (value: string) => value,
  },
};

const batchDelimiters: {
  [name in BatchDelimiter]: IBatchDelimiterConfig;
} = {
  tab: {
    name: 'tab',
    label: 'Tab',
    symbol: '\t',
    fileType: 'TSV',
  },
  comma: {
    name: 'comma',
    label: 'Comma',
    symbol: ',',
    fileType: 'CSV',
  },
};

export interface IBatchConfigState {
  networks: IBatchNetworkConfig[];
  selectedNetwork?: IBatchNetworkConfig;
  columns: IBatchColumnConfig[];
  selectedColumns: IBatchColumnConfig[];
  delimiters: IBatchDelimiterConfig[];
  selectedDelimiter?: IBatchDelimiterConfig;
  selectedAsset?: IAssetStorageItem;
  isValidConfig: boolean;
}

interface IBatchConfigMethods {
  selectNetwork: (network: Network) => void;
  selectDelimiter: (delimiter: BatchDelimiter) => void;
  selectColumns: (names: BatchColumn[]) => void;
  selectAsset: (asset: IAssetStorageItem) => void;
}

interface IBatchConfigHook extends IBatchConfigState, IBatchConfigMethods {}

const defaultState: IBatchConfigState = {
  networks: Object.keys(batchNetworks).map((name) => batchNetworks[name as Network]!),
  selectedNetwork: undefined,
  columns: [],
  selectedColumns: [],
  delimiters: Object.keys(batchDelimiters).map((name) => batchDelimiters[name as BatchDelimiter]),
  selectedDelimiter: undefined,
  selectedAsset: undefined,
  isValidConfig: false,
};

const useBatchConfigStore = create<IBatchConfigState>(() => defaultState);

const useBatchConfig = (): IBatchConfigHook => {
  const storageState = useBatchConfigStorage();
  const state = useBatchConfigStore();

  const selectNetwork = useCallback((network: Network) => {
    useBatchConfigStorageStore.setState({ network });
    useBatchConfigStore.setState({ selectedNetwork: batchNetworks[network] });
    useBatchConfigStorageStore.setState({ asset: undefined });
  }, []);

  const selectDelimiter = useCallback((delimiter: BatchDelimiter) => {
    useBatchConfigStorageStore.setState({ delimiter });
  }, []);

  const selectColumns = useCallback((names: BatchColumn[]) => {
    useBatchConfigStorageStore.setState({ columns: names });
  }, []);

  const selectAsset = useCallback((asset: IAssetStorageItem) => {
    useBatchConfigStorageStore.setState({ asset });
    useBatchConfigStore.setState({ selectedAsset: asset });
  }, []);

  useEffect(() => {
    useBatchConfigStore.setState({ selectedNetwork: batchNetworks[storageState.network] });
  }, [storageState.network]);

  useEffect(() => {
    const allColumnNames = Object.keys(batchColumns) as BatchColumn[];
    const selectedColumnNames = storageState.columns;
    const allSortedColumnNames = [
      ...selectedColumnNames,
      ...allColumnNames.filter((name) => !selectedColumnNames.includes(name)),
    ];

    const columns = allSortedColumnNames.map((name) => batchColumns[name as BatchColumn]);
    const selectedColumns = selectedColumnNames.map((name) => batchColumns[name as BatchColumn]);

    useBatchConfigStore.setState({ columns, selectedColumns });
  }, [storageState.columns]);

  useEffect(() => {
    useBatchConfigStore.setState({ selectedDelimiter: batchDelimiters[storageState.delimiter] });
  }, [storageState.delimiter]);

  useEffect(() => {
    useBatchConfigStore.setState({ selectedAsset: storageState.asset });
  }, [storageState.asset]);

  useEffect(() => {
    const isValidConfig = !!(
      state.selectedNetwork &&
      state.selectedColumns.length > 0 &&
      state.selectedDelimiter &&
      state.selectedAsset
    );
    useBatchConfigStore.setState({ isValidConfig });
  }, [state.selectedAsset, state.selectedColumns.length, state.selectedDelimiter, state.selectedNetwork]);

  return {
    ...state,
    selectNetwork,
    selectColumns,
    selectDelimiter,
    selectAsset,
  };
};

export { useBatchConfig, useBatchConfigStore };
