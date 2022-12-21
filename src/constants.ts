import { MetaMaskInpageProvider } from '@metamask/providers';

// matches Antd https://ant.design/components/grid/#Col
export const SCREEN_BREAKPOINT = Object.freeze({
  XXL: 1600,
  XL: 1200,
  LG: 992,
  MD: 768,
  SM: 576,
});

export const SECOND_MILLIS = 1000;
export const MINUTE_MILLIS = 60 * SECOND_MILLIS;

export const ethereum = (window as any).ethereum as MetaMaskInpageProvider;

export const ETH_ADDRESS = 'eth';

export const strategyPathKey = 'strategyPath';

export const MAGIC_ADDRESS = '0x539bdE0d7Dbd336b79148AA742883198BBF60342';
export const MAGIC_DECIMAL_UNIT = 'ether';

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
  Arbitrum_MagicDragon_Claim = 'arbitrum:magicdragon:claim',
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
