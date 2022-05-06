import { MetaMaskInpageProvider } from '@metamask/providers';

export const MOBILE_SCREEN_THRESHOLD = 800;
export const SMALL_SCREEN_THRESHOLD = 960;
export const TABLET_SCREEN_THRESHOLD = 1200;
export const SECOND_MILLIS = 1000;
export const MINUTE_MILLIS = 60 * SECOND_MILLIS;

export const ethereum = (window as any).ethereum as MetaMaskInpageProvider;

export enum Network {
  none = 'none',
  ethereum = 'ethereum',
  arbitrum = 'arbitrum',
  ropsten = 'ropsten',
  arbitrumRinkeby = 'arbitrumRinkeby',
}
export enum ChainId {
  none = -1,
  arbitrum = 42161,
  ethereum = 1,
  ropsten = 3,
  arbitrumRinkeby = 421611,
}
export enum ConfirmationTime {
  immediate = '',
  oneDay = '1d',
  threeDays = '3d',
  fiveDays = '5d',
}

export enum StrategyBlock {
  Arbitrum_Bridgeworld_Claim = 'arbitrum:bridgeworld:claim',
  Arbitrum_Magic_Send = 'arbitrum:magic:send',
}

export enum RepeatFrequency {
  Hourly = 'hour',
  Daily = 'day',
  Weekly = 'week',
  Monthly = 'month',
}

export enum BlockExplorerUrl {
  none = '',
  arbitrum = 'https://arbiscan.io/',
  ethereum = 'https://etherscan.io/',
  ropsten = 'https://ropsten.etherscan.io/',
  arbitrumRinkeby = 'https://testnet.arbiscan.io/',
}
export enum BlockExplorerName {
  none = '',
  arbitrum = 'Arbiscan',
  ethereum = 'Etherscan',
  ropsten = 'Ropsten Etherscan',
  arbitrumRinkeby = 'Testnet Arbiscan',
}
