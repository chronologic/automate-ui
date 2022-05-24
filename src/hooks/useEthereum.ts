import create from 'zustand';

import { ethereum, SECOND_MILLIS } from '../constants';
import { sleep } from '../utils';

interface IEthereumStoreState {
  isReady: boolean;
  isAddressReady: boolean;
}

interface IEthereumStoreMethods {}

interface IEthereumHook extends IEthereumStoreState, IEthereumStoreMethods {}

const defaultState: IEthereumStoreState = {
  isReady: false,
  isAddressReady: false,
};

const useStore = create<IEthereumStoreState>(() => defaultState);

init();

async function init() {
  await waitForEthereum();
  useStore.setState({ isReady: true });
  await waitForAddress();
  useStore.setState({ isAddressReady: true });
}

async function waitForEthereum(): Promise<void> {
  let maxWait = 5 * SECOND_MILLIS;
  const checkPeriod = SECOND_MILLIS / 5;
  const iterations = maxWait / checkPeriod;
  for (let i = 0; i < iterations; i++) {
    if (ethereum) {
      return;
    }
    await sleep(checkPeriod);
  }

  throw new Error('Ethereum not found :(');
}

async function waitForAddress(): Promise<void> {
  let maxWait = 5 * SECOND_MILLIS;
  const checkPeriod = SECOND_MILLIS / 5;
  const iterations = maxWait / checkPeriod;
  for (let i = 0; i < iterations; i++) {
    if (ethereum.selectedAddress) {
      return;
    }
    await sleep(checkPeriod);
  }

  throw new Error('Address not found :(');
}

const useEthereum = (): IEthereumHook => {
  const state = useStore();

  return state;
};

export { useEthereum, useStore };
