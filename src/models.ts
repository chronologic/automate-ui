import { BigNumber } from 'ethers/utils';

export enum AssetType {
  Ethereum = 'ethereum',
  Polkadot = 'polkadot'
}

export enum PolkadotChainId {
  PolkadotMainnet = 1,
  EdgewareMainnet = 2
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
  baseAssetName?: string;
}

export interface IDecodedTransaction {
  transactionHash?: string;
  signedAsset: IAsset;
  signedRecipient: string;
  signedSender: string;
  signedChain: INetwork;
  signedNonce: number;
  signedGasPrice: BigNumber;
  signedGasLimit: BigNumber;
  senderNonce: number;
  senderBalance: BigNumber;
  maxTxCost: BigNumber;
}

export interface ISubmitParams {
  email: string;
  refundAddress: string;
}
