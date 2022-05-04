import create from 'zustand';

import { ethereum } from '../constants';

interface IMetamaskStoreState {
  connected: boolean;
  account: string | null;
  chainId: number | null;
}

interface IMetamaskStoreMethods {
  connect: () => Promise<IMetamaskStoreState>;
  reset: () => Promise<void>;
}

interface IMetamaskHook extends IMetamaskStoreState, IMetamaskStoreMethods {}

const defaultState: IMetamaskStoreState = {
  connected: false,
  account: null,
  chainId: null,
};

const useStore = create<IMetamaskStoreState>(() => defaultState);

async function connect(): Promise<IMetamaskStoreState> {
  const account = await requestAccount();
  const chainId = await requestChainId();
  const connected = true;

  const newPartialState = { account, chainId, connected };

  useStore.setState(newPartialState);

  return newPartialState;
}

async function requestAccount() {
  const [account] = (await ethereum.request<[string]>({ method: 'eth_requestAccounts' }))!;

  return account!;
}

async function requestChainId() {
  const chainId = (await ethereum.request<string>({ method: 'eth_chainId' }))!;

  return Number(chainId);
}

async function reset() {
  useStore.setState(defaultState);
}

const useMetamask = (): IMetamaskHook => {
  const state = useStore();

  return {
    ...state,
    connect,
    reset,
  };
};

export { useMetamask, useStore };
