import create from 'zustand';
import { persist } from 'zustand/middleware';
import uniqBy from 'lodash/uniqBy';

import { ChainId } from '../constants';
import { AssetType } from '../types';
import { useMemo } from 'react';
import { isEmptyName, shortAddress } from '../utils';

export interface IAssetStorageItem {
  assetType: AssetType;
  chainId: ChainId;
  name: string;
  address: string;
  decimals: number;
}

interface IAssetStoreState {
  assetOptions: IAssetStorageItem[];
}

interface IAssetStoreMethods {
  addAsset: (asset: IAssetStorageItem) => void;
  addAssets: (assets: IAssetStorageItem[]) => void;
}

interface IAssetOptionsHook extends IAssetStoreState, IAssetStoreMethods {}

const defaultAssets: IAssetStorageItem[] = Object.values(ChainId).map((chainId) => ({
  assetType: AssetType.Ethereum,
  chainId: chainId as ChainId,
  address: '',
  name: 'ETH',
  decimals: 18,
}));

const defaultState: IAssetStoreState = {
  assetOptions: defaultAssets,
};

const useAssetOptionsStore = create<IAssetStoreState>(
  persist(() => defaultState, {
    name: 'asset-options',
    getStorage: () => localStorage,
  }) as any
);

function addAsset(asset: IAssetStorageItem) {
  addAssets([asset]);
}

function addAssets(assets: IAssetStorageItem[]) {
  const { assetOptions: storedAssets } = useAssetOptionsStore.getState();
  const mergedAssets = [...storedAssets, ...assets];
  const filteredAssets = mergedAssets.filter((item) => item.address && item.decimals);
  const normalizedAssets = filteredAssets.map((item) => ({
    ...item,
    address: item.address.toLowerCase(),
    name: isEmptyName(item.name) ? shortAddress(item.address) : item.name,
  }));
  const uniqueAssets = uniqBy(normalizedAssets, (item) =>
    `${item.assetType}.${item.chainId}.${item.address}`.toLowerCase()
  );

  useAssetOptionsStore.setState({ assetOptions: uniqueAssets });
}

const useAssetOptions = ({
  assetType,
  chainId,
}: { assetType?: AssetType; chainId?: ChainId } = {}): IAssetOptionsHook => {
  const state = useAssetOptionsStore();
  const assetOptions = useMemo(
    () =>
      state.assetOptions.filter(
        (item) => (item.assetType === assetType || !assetType) && (item.chainId === chainId || !chainId)
      ),
    [assetType, chainId, state.assetOptions]
  );

  return {
    ...state,
    assetOptions,
    addAsset,
    addAssets,
  };
};

export { useAssetOptions, useAssetOptionsStore };
