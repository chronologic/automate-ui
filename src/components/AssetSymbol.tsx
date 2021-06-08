import { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

interface IRawCache {
  [key: string]: string;
}

interface ICache {
  [key: string]: Promise<string>;
}

interface IProps {
  name: string;
  address: string;
}

const cacheStorageKey = 'assetImages';
const cache: ICache = {};
const rawCache: IRawCache = {};
const coingeckoApi = axios.create({ baseURL: 'https://api.coingecko.com/api/v3' });

initCache();

export default function AssetSymbol({ name, address }: IProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    getUrl();

    async function getUrl() {
      const url = await getAssetUrl((name || '').toLowerCase(), address);
      setUrl(url);
    }
  }, [address, name]);

  return (
    <Content>
      {(url && !error && (
        <img src={url} alt={name || address} title={name || address} onError={() => setError(true)} />
      )) || <span>{name || '_'}</span>}
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
    cache[key] = Promise.resolve(_rawCache[key]);
  });
}

async function getAssetUrl(name: string, address: string): Promise<string> {
  if (cache[name] != null) {
    return cache[name];
  }

  if (cache[address] != null) {
    return cache[address];
  }

  const promise = (async () => {
    try {
      const { data: assetForAddress } = await (name === 'eth'
        ? coingeckoApi.get('/coins/ethereum')
        : coingeckoApi.get(`/coins/ethereum/contract/${address}`));
      const url = assetForAddress.image.small;
      if (address) {
        updateCache(address, url);
      }
      if (name && name !== '_' && name !== '-') {
        updateCache(name, url);
      }

      return url;
    } catch (e) {
      console.error(e);
      updateCache(address, '');
    }
  })();

  if (address) {
    cache[address] = promise;
  }
  if (name && name !== '_' && name !== '-') {
    cache[name] = cache[address];
  }

  return promise;
}

function updateCache(key: string, value: string): void {
  rawCache[key] = value;
  localStorage.setItem(cacheStorageKey, JSON.stringify(rawCache));
}
