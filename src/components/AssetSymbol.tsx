import { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import { isEmptyName, shortAddress } from '../utils';
import { ChainId } from '../constants';

interface IRawCache {
  [key: string]: string;
}

interface IPromiseCache {
  [key: string]: Promise<string>;
}

interface IProps {
  chainId: ChainId;
  name: string;
  address: string;
}

const cacheStorageKey = 'assetImages';
const promiseCache: IPromiseCache = {};
const rawCache: IRawCache = {};
const coingeckoApi = axios.create({ baseURL: 'https://api.coingecko.com/api/v3' });
const coingeckoPlatformForChainId: {
  [key in ChainId]?: string;
} = {
  [ChainId.arbitrum]: 'arbitrum-one',
  [ChainId.ethereum]: 'ethereum',
};

initCache();

const xfitToken = '0x4aa41bC1649C9C3177eD16CaaA11482295fC7441';
const xfai = '0xd622dbd384d8c682f1dfe2ec18809c6bcd09bd40';

const mapping: { [key: string]: string } = {
  [xfai]: xfitToken,
};

export default function AssetSymbol({ chainId, name, address }: IProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    _getImageUrl();

    async function _getImageUrl() {
      const url = await getImageUrl(chainId, name, address);
      setImageUrl(url);
    }
  }, [address, chainId, name]);

  const _name = isEmptyName(name) ? '' : name;
  const title = _name || address;
  const displayName = _name ? _name : address ? shortAddress(address, 4) : '-';

  return (
    <Content>
      {(imageUrl && !error && <img src={imageUrl} alt={title} title={title} onError={() => setError(true)} />) || (
        <span>{displayName}</span>
      )}
    </Content>
  );
}

const Content = styled.span`
  display: inline-block;
  img {
    width: 3rem;
  }
`;

function initCache(): void {
  const _rawCache: IRawCache = JSON.parse(localStorage.getItem(cacheStorageKey) || '{}');
  Object.keys(_rawCache).forEach((key) => {
    rawCache[key] = _rawCache[key];
    promiseCache[key] = Promise.resolve(_rawCache[key]);
  });
}

async function getImageUrl(chainId: ChainId, name: string, address: string): Promise<string> {
  const safeName = (name || '').toLowerCase();
  const safeAddress = (address || '').toLowerCase();
  const mappedAddress = mapping[safeAddress] || safeAddress;
  const key = `${chainId}.${safeName}.${mappedAddress || ''}`;

  if (promiseCache[key] != null) {
    return promiseCache[key];
  }

  const promise = (async () => {
    try {
      const platform = coingeckoPlatformForChainId[chainId];
      const { data: assetData } = await (safeName === 'eth'
        ? coingeckoApi.get('/coins/ethereum')
        : coingeckoApi.get(`/coins/${platform}/contract/${mappedAddress}`));
      const url = assetData.image.thumb;
      updateCache(key, url);

      return url;
    } catch (e) {
      console.error(e);
      updateCache(key, '');
    }
  })();

  promiseCache[key] = promise;

  return promise;
}

function updateCache(key: string, value: string): void {
  rawCache[key] = value;
  localStorage.setItem(cacheStorageKey, JSON.stringify(rawCache));
}
