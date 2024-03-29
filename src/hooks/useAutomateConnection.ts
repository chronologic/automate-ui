import create from 'zustand';
import { useCallback } from 'react';

import { IAutomateConnectionParams } from '../types';
import { ethereum, Network, SECOND_MILLIS } from '../constants';
import { useMetamask, useStore as metamaskStore } from './useMetamask';
import { notifications } from './connectionNotifications';
import { useAuth } from './useAuth';
import { useEthereum } from './useEthereum';

interface IAutomateStoreState {
  connected: boolean;
  account: string | null;
  chainId: number | null;
  connectionParams: IAutomateConnectionParams;
}

interface IConnectParams {
  notifySuccess?: boolean;
  desiredNetwork?: Network;
}

interface IAutomateStoreMethods {
  connect: (params?: IConnectParams) => Promise<IAutomateStoreState>;
  checkConnection: (desiredNetwork?: Network) => Promise<ICheckConnectionResult>;
  reset: () => Promise<void>;
  eagerConnect: () => Promise<void>;
}

interface ICheckConnectionResult {
  connected: boolean;
  connectionParams: IAutomateConnectionParams;
  wrongNetwork: boolean;
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

async function checkConnection(desiredNetwork?: Network): Promise<ICheckConnectionResult> {
  let wrongNetwork = false;
  try {
    const params = await getConnectionParams();

    if (desiredNetwork && params.network !== desiredNetwork) {
      wrongNetwork = true;
      useStore.setState(defaultState);
      throw notifications.connectedWrongNetwork(params.network, desiredNetwork);
    }

    const ret = { connected: true, connectionParams: params, wrongNetwork };

    useStore.setState(ret);

    return ret;
  } catch (e) {
    console.error(e);
    useStore.setState(defaultState);
    return { connected: false, connectionParams: {} as any, wrongNetwork };
  }
}

let triedEagerConnect = false;

function useAutomateConnection(): IAutomateHook {
  const metamaskState = useMetamask();
  const ethereumState = useEthereum();
  const automateState = useStore();
  const { user } = useAuth();

  const reset = useCallback(async () => {
    metamaskState.reset();
    useStore.setState(defaultState);
  }, [metamaskState]);

  const connect = useCallback(
    async ({
      notifySuccess,
      desiredNetwork,
    }: { notifySuccess?: boolean; desiredNetwork?: Network } = {}): Promise<IAutomateStoreState> => {
      triedEagerConnect = true;
      const mmState = await metamaskState.connect();
      if (!mmState.connected) {
        reset();

        return defaultState;
      }

      const { connected, connectionParams, wrongNetwork } = await checkConnection(desiredNetwork);

      if (wrongNetwork) {
        throw new Error('wrong network');
      }
      if (!connected) {
        throw notifications.notConnectedtoAutomate();
      }
      if (user?.apiKey && connectionParams?.apiKey !== user?.apiKey) {
        throw notifications.apiKeyMismatch();
      }
      if (connected && notifySuccess) {
        notifications.connectedToAutomate(connectionParams.network);
      }

      const ret = {
        connected,
        connectionParams,
        account: mmState.account,
        chainId: mmState.chainId,
      };

      useStore.setState(ret);

      return ret;
    },
    [metamaskState, reset, user?.apiKey]
  );

  const eagerConnect = useCallback(async () => {
    if (!triedEagerConnect && ethereumState.isAddressReady && ethereum?.selectedAddress) {
      triedEagerConnect = true;
      connect();
    }
  }, [connect, ethereumState.isAddressReady]);

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
