import { useCallback } from 'react';
import create from 'zustand';
import { notification } from 'antd';
import Web3 from 'web3';

import ERC20ABI from '../../abi/ERC20.json';
import { ethereum, Network } from '../../constants';
import { IAssetStorageItem, useAutomateConnection } from '../../hooks';
import { useBatchConfig } from './useBatchConfig';
import { ParsedTx, useBatchParser } from './useBatchParser';

interface IBatchExecuteState {
  loading: boolean;
}

interface IBatchExecuteMethods {
  onSubmit: () => void;
}

interface IBatchExecuteHook extends IBatchExecuteState, IBatchExecuteMethods {}

const web3 = new Web3(ethereum as any);

const defaultState: IBatchExecuteState = {
  loading: false,
};

const useBatchExecuteStore = create<IBatchExecuteState>(() => defaultState);

const useBatchExecute = (): IBatchExecuteHook => {
  const { selectedAsset } = useBatchConfig();
  const { isValid, parsedTxs } = useBatchParser();
  const { connect } = useAutomateConnection();
  const state = useBatchExecuteStore();

  const handleSubmit = useCallback(async () => {
    try {
      useBatchExecuteStore.setState({ loading: true });

      if (!isValid) {
        throw new Error('Inputs are not valid');
      }

      const { account } = await connect({ desiredNetwork: Network.ethereum });

      await executeTxs(parsedTxs, account!, selectedAsset!);
      notification.success({ message: 'Executed' });
    } catch (e) {
      console.error(e);
      const error = (e as any)?.message || 'Error';
      notification.error({ message: error });
    } finally {
      useBatchExecuteStore.setState({ loading: false });
    }
  }, [connect, isValid, parsedTxs, selectedAsset]);

  return {
    ...state,
    onSubmit: handleSubmit,
  };
};

async function executeTxs(txs: ParsedTx[], from: string, asset: IAssetStorageItem) {
  const erc20Contract = new web3.eth.Contract(ERC20ABI as any, asset.address);
  const promises = txs.map((tx) =>
    erc20Contract.methods
      .transfer(tx.address!.parsedValue, tx.amount!.parsedValue)
      .send({ from, gasPrice: tx.gasPrice?.parsedValue, gasLimit: tx.gasLimit?.parsedValue })
  );

  await Promise.all(promises);
}

export { useBatchExecute, useBatchExecuteStore };
