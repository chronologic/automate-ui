export enum AssetType {
  Ethereum = 'ethereum',
  Polkadot = 'polkadot'
}

export interface IError {
  errors: string[];
}

export interface IAsset {
  address: string;
  amount: string;
  decimals: number;
  name: string;
}

export interface INetwork {
  chainId: number;
  chainName: string;
}

export interface IDecodedTransaction {
  transactionHash?: string;
  signedAsset: IAsset;
  signedRecipient: string;
  signedSender: string;
  signedChain: INetwork;
  signedNonce: number;
  senderNonce: number;
}

export interface ISubmitParams {
  email: string;
  refundAddress: string;
}
