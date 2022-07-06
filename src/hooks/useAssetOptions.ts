import create from 'zustand';
import { persist } from 'zustand/middleware';
import uniqBy from 'lodash/uniqBy';

import { ChainId, ETH_ADDRESS } from '../constants';
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
  asset?: IAssetStorageItem;
  assetOptions: IAssetStorageItem[];
}

interface IAssetStoreMethods {
  addAsset: (asset: IAssetStorageItem) => void;
  addAssets: (assets: IAssetStorageItem[]) => void;
}

interface IAssetOptionsHook extends IAssetStoreState, IAssetStoreMethods {}

const defaultAssets: IAssetStorageItem[] = Object.values(ChainId)
  .filter(Number)
  .map((chainId) => ({
    assetType: AssetType.Ethereum,
    chainId: chainId as ChainId,
    address: ETH_ADDRESS,
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
  const mergedAssets = [...defaultAssets, ...storedAssets, ...assets];
  const filteredAssets = mergedAssets.filter((item) => item.address && item.decimals);
  const normalizedAssets = filteredAssets.map((item) => ({
    ...item,
    address: item.address.toLowerCase(),
    name: isEmptyName(item.name) ? shortAddress(item.address) : item.name,
  }));
  const uniqueAssets = uniqBy(normalizedAssets, (item) =>
    `${item.assetType}.${item.chainId}.${item.address}`.toLowerCase()
  );
  const addressNameRegex = /0x[0-9a-f]+\.\.\.[0-9a-f]+/i;
  const nameForLastSort = 'zzzzzz';
  const sortedAssets = uniqueAssets.sort((a, b) => {
    const filterNameA = addressNameRegex.test(a.name || '')
      ? `${nameForLastSort}_${a.name}`
      : a.name || nameForLastSort;
    const filterNameB = addressNameRegex.test(b.name || '')
      ? `${nameForLastSort}_${b.name}`
      : b.name || nameForLastSort;

    return filterNameA.localeCompare(filterNameB);
  });

  useAssetOptionsStore.setState({ assetOptions: sortedAssets });
}

const useAssetOptions = ({
  assetType,
  chainId,
  address,
  allowEth,
}: { assetType?: AssetType; chainId?: ChainId; address?: string; allowEth?: boolean } = {}): IAssetOptionsHook => {
  const state = useAssetOptionsStore();
  const assetOptions = useMemo(
    () =>
      state.assetOptions.filter(
        (item) =>
          (item.assetType === assetType || !assetType) &&
          (item.chainId === chainId || !chainId) &&
          (allowEth ? true : item.address !== ETH_ADDRESS)
      ),
    [allowEth, assetType, chainId, state.assetOptions]
  );
  const asset = useMemo(
    () => assetOptions.find((item) => item.address.toLowerCase() === address?.toLowerCase()),
    [address, assetOptions]
  );

  return {
    ...state,
    asset,
    assetOptions,
    addAsset,
    addAssets,
  };
};

export { useAssetOptions, useAssetOptionsStore };
