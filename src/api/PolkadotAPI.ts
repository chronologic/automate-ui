import axios from 'axios';
import { BigNumber } from 'ethers';

import { IDecodedTransaction, IError, PolkadotChainId } from '../types';
import { API_URL } from '../env';

interface IPolkadotTx {
  signer: string;
  nonce: number;
  accountNonce: number;
  chainId: number;
  chainName: string;
  assetName: string;
  hash: string;
  dest?: string;
  value?: string;
  decimals?: number;
}

export const DOT = { name: 'DOT', decimals: 12 };

const api = axios.create({
  baseURL: API_URL + '/polkadot',
});

const getBalance = async (address: string, chainId: PolkadotChainId) => {
  const res = await api.get('balance', {
    params: {
      address,
      chainId,
    },
  });

  return (res as any).balance as string;
};

const parseTx: (tx: string, chainId: PolkadotChainId) => Promise<IDecodedTransaction | IError> = async (
  tx,
  chainId
) => {
  try {
    const { data: parsed } = await api.get<IPolkadotTx>('parseTx', {
      params: {
        chainId,
        tx,
      },
    });
    const decoded: IDecodedTransaction = {
      maxTxCost: BigNumber.from(0),
      senderBalance: BigNumber.from(0),
      senderNonce: parsed.accountNonce,
      signedAsset: {
        address: '',
        amount: parsed.value || '0',
        decimals: parsed.decimals || 18,
        name: parsed.assetName,
        symbol: parsed.assetName,
      },
      signedChain: {
        chainId: parsed.chainId,
        chainName: parsed.chainName,
      },
      signedGasLimit: BigNumber.from(0),
      signedGasPrice: BigNumber.from(0),
      signedNonce: parsed.nonce,
      signedRecipient: parsed.dest || '',
      signedSender: parsed.signer,
      transactionHash: parsed.hash,
    };

    return decoded;
  } catch (e: any) {
    return e?.response?.data;
  }
};

const getNextNonce = async (address: string, chainId: PolkadotChainId) => {
  const res = await api.get('nextNonce', {
    params: {
      address,
      chainId,
    },
  });

  return (res as any).nonce as number;
};

const toExport = {
  getBalance,
  getNextNonce,
  parseTx,
};

export default toExport;
