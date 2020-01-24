import axios from 'axios';
import { IDecodedTransaction, IError, PolkadotChainId } from 'src/models';

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

export const KSM = { name: 'KSM', decimals: 12 };

const API_URL: string = process.env.REACT_APP_API_URL + '/polkadot';

const api = axios.create({
  baseURL: API_URL
});

const getBalance = async (address: string, chainId: PolkadotChainId) => {
  const res = await api.get('balance', {
    params: {
      address,
      chainId
    }
  });

  return (res as any).balance as string;
};

const parseTx: (
  tx: string,
  chainId: PolkadotChainId
) => Promise<IDecodedTransaction | IError> = async (tx, chainId) => {
  try {
    const { data: parsed } = await api.get<IPolkadotTx>('parseTx', {
      params: {
        chainId,
        tx
      }
    });
    const decoded: IDecodedTransaction = {
      senderNonce: parsed.accountNonce,
      signedAsset: {
        address: '',
        amount: parsed.value || '0',
        decimals: parsed.decimals || 18,
        name: parsed.assetName
      },
      signedChain: {
        chainId: parsed.chainId,
        chainName: parsed.chainName
      },
      signedNonce: parsed.nonce,
      signedRecipient: parsed.dest || '',
      signedSender: parsed.signer,
      transactionHash: parsed.hash
    };

    return decoded;
  } catch (e) {
    return e.response.data;
  }
};

const getNextNonce = async (address: string, chainId: PolkadotChainId) => {
  const res = await api.get('nextNonce', {
    params: {
      address,
      chainId
    }
  });

  return (res as any).nonce as number;
};

export default {
  getBalance,
  getNextNonce,
  parseTx
};
