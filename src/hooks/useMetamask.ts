import create from 'zustand';

import { ethereum } from '../constants';
import { useStore as useEthereumStore } from './useEthereum';
import { notifications } from './connectionNotifications';

interface IMetamaskStoreState {
  connected: boolean;
  account: string | null;
  chainId: number | null;
}

interface IMetamaskStoreMethods {
  connect: () => Promise<IMetamaskStoreState>;
  reset: () => Promise<void>;
  changeNetwork: (id: number) => Promise<void>;
}

interface IMetamaskHook extends IMetamaskStoreState, IMetamaskStoreMethods {}

const defaultState: IMetamaskStoreState = {
  connected: false,
  account: null,
  chainId: null,
};

const useStore = create<IMetamaskStoreState>(() => defaultState);

async function connect(): Promise<IMetamaskStoreState> {
  const isMetamaskInstalled = !!(ethereum as any)?.isMetaMask;
  if (!isMetamaskInstalled) {
    reset();
    throw notifications.metamaskNotInstalled();
  }

  const account = await requestAccount();

  if (!account) {
    reset();
    throw notifications.noConnectedAccounts();
  }

  const chainId = await requestChainId();
  const connected = true;

  const newState = { account, chainId, connected };

  useStore.setState(newState);

  return newState;
}

export async function requestAccount() {
  let account: string;
  const connectedAccounts = (await ethereum.request<[string]>({ method: 'eth_requestAccounts' }))!;

  if (connectedAccounts.length === 0) {
    await ethereum.request({
      method: 'wallet_requestPermissions',
      params: [
        {
          eth_accounts: {},
        },
      ],
    });
    const newAccounts = (await ethereum.request<[string]>({ method: 'eth_requestAccounts' }))!;
    account = newAccounts[0]!;
  } else {
    account = connectedAccounts[0]!;
  }

  return account!;
}

async function requestChainId() {
  const chainId = (await ethereum.request<string>({ method: 'eth_chainId' }))!;

  return Number(chainId);
}

async function reset() {
  useStore.setState(defaultState);
}

async function changeNetwork(id: number) {
  await ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: `0x${id.toString(16)}` }],
  });
}

useEthereumStore.subscribe((state) => {
  if (state.isReady) {
    ethereum.on('accountsChanged', handleAccountsChanged as any);
    ethereum.on('chainChanged', handleChainChanged as any);
  }
});

function handleAccountsChanged(accounts: string[]) {
  useStore.setState({ account: accounts[0] });
}

function handleChainChanged(chainIdHex: string) {
  useStore.setState({ chainId: Number(chainIdHex) });
}

const useMetamask = (): IMetamaskHook => {
  const state = useStore();

  return {
    ...state,
    connect,
    reset,
    changeNetwork,
  };
};

export { useMetamask, useStore };
