import create from 'zustand';

import { ethereum } from '../constants';
import { notifications } from './connectionNotifications';

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
  const isMetamaskInstalled = !!ethereum;
  if (!isMetamaskInstalled) {
    reset();
    throw notifications.metamaskNotInstalled();
  }

  const account = await requestAccount();
  const chainId = await requestChainId();
  const connected = true;

  const newState = { account, chainId, connected };

  useStore.setState(newState);

  return newState;
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

function handleAccountsChanged(accounts: string[]) {
  useStore.setState({ account: accounts[0] });
}

ethereum?.on('accountsChanged', handleAccountsChanged as any);

const useMetamask = (): IMetamaskHook => {
  const state = useStore();

  return {
    ...state,
    connect,
    reset,
  };
};

export { useMetamask, useStore };
