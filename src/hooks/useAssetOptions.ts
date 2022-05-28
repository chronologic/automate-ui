import create from 'zustand';
import { persist } from 'zustand/middleware';
import uniqBy from 'lodash/uniqBy';

import { ChainId } from '../constants';
import { AssetType } from '../types';

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
  const filteredAssets = mergedAssets.filter((item) => item.address && item.decimals && item.name);
  const uniqueAssets = uniqBy(filteredAssets, (item) => `${item.assetType}.${item.chainId}.${item.address}`);

  useAssetOptionsStore.setState({ assetOptions: uniqueAssets });
}

const useAssetOptions = (): IAssetOptionsHook => {
  const state = useAssetOptionsStore();

  return {
    ...state,
    addAsset,
    addAssets,
  };
};

export { useAssetOptions, useAssetOptionsStore };
