import create from 'zustand';
import { useCallback } from 'react';

import { IAutomateConnectionParams } from '../types';
import { ethereum, SECOND_MILLIS } from '../constants';
import { useMetamask, useStore as metamaskStore } from './useMetamask';

interface IAutomateStoreState {
  connected: boolean;
  account: string | null;
  chainId: number | null;
  connectionParams: IAutomateConnectionParams;
}

interface IAutomateStoreMethods {
  connect: () => Promise<IAutomateStoreState>;
  checkConnection: () => Promise<ICheckConnectionResult>;
  reset: () => Promise<void>;
  eagerConnect: () => Promise<void>;
}

interface ICheckConnectionResult {
  connected: boolean;
  connectionParams: IAutomateConnectionParams;
}

interface IAutomateHook extends IAutomateStoreState, IAutomateStoreMethods {}

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const AUTOMATE_MD5_HASH_ADDRESS = '0x00000000e7fdc80c0728d856260f92fde10af019';

const defaultState: IAutomateStoreState = {
  connected: false,
  account: null,
  chainId: null,
  connectionParams: {} as any,
};

const useStore = create<IAutomateStoreState>(() => defaultState);

let automateConnectionCheckIntervalId: any;
metamaskStore.subscribe((state, prevState) => {
  const connectedStateChanged = state.connected !== prevState.connected;
  if (!connectedStateChanged) {
    return;
  }

  clearInterval(automateConnectionCheckIntervalId);
  if (state.connected) {
    automateConnectionCheckIntervalId = setInterval(checkConnection, 5 * SECOND_MILLIS);
  }
});

async function checkConnection(): Promise<ICheckConnectionResult> {
  try {
    const params = await getConnectionParams();

    const ret = { connected: true, connectionParams: params };

    useStore.setState(ret);

    return ret;
  } catch (e) {
    console.error(e);
    return { connected: false, connectionParams: {} as any };
  }
}

let triedEagerConnect = false;

function useAutomateConnection(): IAutomateHook {
  const metamaskState = useMetamask();
  const automateState = useStore();

  const reset = useCallback(async () => {
    metamaskState.reset();
    useStore.setState(defaultState);
  }, [metamaskState]);

  const connect = useCallback(async (): Promise<IAutomateStoreState> => {
    const mmState = await metamaskState.connect();
    if (!mmState.connected) {
      reset();

      return defaultState;
    }

    const { connected, connectionParams } = await checkConnection();

    const ret = {
      connected,
      connectionParams,
      account: mmState.account,
      chainId: mmState.chainId,
    };

    useStore.setState(ret);

    return ret;
  }, [metamaskState, reset]);

  const eagerConnect = useCallback(async () => {
    if (!triedEagerConnect && ethereum.selectedAddress) {
      triedEagerConnect = true;
      connect();
    }
  }, [connect]);

  return {
    ...automateState,
    connect,
    reset,
    checkConnection,
    account: metamaskState.account,
    chainId: metamaskState.chainId,
    eagerConnect,
  };
}

async function getConnectionParams(): Promise<IAutomateConnectionParams> {
  const res = (await ethereum.request<any>({
    method: 'eth_call',
    params: [
      {
        from: ZERO_ADDRESS,
        to: AUTOMATE_MD5_HASH_ADDRESS,
      },
    ],
  }))!;
  if (res.client !== 'automate') {
    throw new Error('The user is not connected to Automate');
  }
  return res.params;
}

export { useAutomateConnection };
