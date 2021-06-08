import { BigNumber } from 'ethers';

export enum AssetType {
  Ethereum = 'ethereum',
  Polkadot = 'polkadot',
}

export enum PolkadotChainId {
  PolkadotMainnet = 1,
  EdgewareMainnet = 2,
}

export interface IError {
  errors: string[];
}

export interface IAsset {
  address: string;
  amount: string;
  decimals: number;
  name: string;
  symbol?: string;
}

export interface IAssetState extends IAsset {
  validationError: string;
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

export interface ITheme {
  name: string;
  colors: {
    body: string;
    text: string;
    textAccent: string;
    accent: string;
    accentGradient: string;
    shadow: string;
    border: string;
    weak: string;
  };
}
export interface IThemeProps {
  theme: ITheme;
}

export interface IUser {
  login: string;
  apiKey: string;
}

export interface IUserWithExpiration extends IUser {
  expirationDate?: string;
}

export enum Status {
  Pending,
  Cancelled,
  Completed,
  Error,
  StaleNonce,
  PendingConfirmations,
  PendingPayment,
  PendingPaymentConfirmations,
  PaymentExpired,
  Draft,
}

export interface IScheduledForUser {
  id: string;
  assetType: AssetType;
  signedTransaction: string;
  conditionAsset: string;
  conditionAssetName: string;
  conditionAssetDecimals: number;
  conditionAmount: string;
  status: Status;
  statusName: string;
  transactionHash: string;
  error: string;
  from: string;
  to: string;
  nonce: number;
  chainId: number;
  conditionBlock: number;
  timeCondition: number;
  timeConditionTZ: string;
  gasPrice: string;
  gasPriceAware: boolean;
  executionAttempts: number;
  lastExecutionAttempt: string;
  assetName: string;
  assetDecimals: number;
  assetAmount: number;
  assetValue: number;
  assetContract: string;
  createdAt: string;
  executedAt: string;
  txKey: string;
  notes: string;
}
