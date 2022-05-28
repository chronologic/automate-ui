import { BigNumber } from 'ethers';

import { ChainId, Network, StrategyBlock } from './constants';

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
    header: string;
    text: string;
    textAccent: string;
    accent: string;
    accentGradient: string;
    shadow: string;
    border: string;
    weak: string;
    disabled: string;
    disabledText: string;
  };
  assets: {
    logoMain: string;
    logoPartner?: string;
  };
  urls?: {
    partnerHomepage: string;
  };
}
export interface IThemeProps {
  theme: ITheme;
}

export interface IUser {
  login: string;
  apiKey: string;
  source?: string;
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
  fromLabel: string;
  to: string;
  toLabel: string;
  method: string;
  methodLabel: string;
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
  gasPaid: number;
  gasSaved: number;
}

export interface IUserCredits {
  user: number;
  community: number;
}

export interface IAuthParams {
  login: string;
  password: string;
  source?: string;
  signup: boolean;
}

export interface IResetPasswordParams {
  login: string;
  password?: string;
  token?: string;
}

export interface IStrategy {
  id: number;
  url: string;
  title: string;
  subtitle: string;
  assetType: AssetType;
  chainId: ChainId;
  description: string;
  imageSrc: string;
  comingSoon: boolean;
  blocks: StrategyBlock[];
}

export interface IStrategyBlockTx {
  to: string;
  data: string;
  asset?: string;
  amount?: string;
}

export interface IStrategyPrepTx {
  assetType: AssetType;
  chainId: ChainId;
  from: string;
  to: string;
  data: string;
}

export interface IStrategyPrepTxWithConditions extends IStrategyPrepTx {
  order: number;
  isLastForNonce?: boolean;
  priority: number;
  conditionAsset?: string;
  conditionAmount?: string;
  timeCondition?: number;
  timeConditionTZ?: string;
}

export interface IStrategyPrepResponse {
  instanceId: string;
  expiresAt: string;
}

export interface IStrategyRepetition {
  time: number;
  tz: string;
}

export type StrategyBlockTxs = {
  [key in StrategyBlock]: IStrategyBlockTx;
};

export interface IAutomateConnectionParams {
  apiKey: string;
  email: string;
  draft?: boolean;
  gasPriceAware?: boolean;
  gasPrice?: number;
  confirmationTime?: string;
  network: Network;
}
