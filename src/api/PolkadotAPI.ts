import axios from 'axios';
import { IDecodedTransaction, IError } from 'src/models';

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

const API_URL: string = process.env.REACT_APP_API_URL + '/polkadot';

const api = axios.create({
  baseURL: API_URL
});

const getBalance = async (address: string) => {
  const res = await api.get('balance', {
    params: {
      address
    }
  });

  return (res as any).balance as string;
};

const parseTx: (
  tx: string
) => Promise<IDecodedTransaction | IError> = async tx => {
  try {
    const { data: parsed } = await api.get<IPolkadotTx>('parseTx', {
      params: {
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

const getNextNonce = async (address: string) => {
  const res = await api.get('nextNonce', {
    params: {
      address
    }
  });

  return (res as any).nonce as number;
};

export default {
  getBalance,
  getNextNonce,
  parseTx
};
