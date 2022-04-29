export const MOBILE_SCREEN_THRESHOLD = 800;
export const SMALL_SCREEN_THRESHOLD = 960;
export const TABLET_SCREEN_THRESHOLD = 1200;
export const SECOND_MILLIS = 1000;
export const MINUTE_MILLIS = 60 * SECOND_MILLIS;
export enum Network {
  None = 'None',
  Ethereum = 'Ethereum',
  Arbitrum = 'Arbitrum',
  Ropsten = 'Ropsten',
  ArbitrumRinkeby = 'ArbitrumRinkeby',
}
export enum ChainId {
  None = '',
  Arbitrum = 42161,
  Ethereum = 1,
  Ropsten = 3,
  ArbitrumRinkeby = 421611,
}
export enum ConfirmationTime {
  immediate = '',
  oneDay = '1d',
  threeDays = '3d',
  fiveDays = '5d',
}
export enum NetworkScanUrl {
  None = '',
  Arbitrum = 'https://arbiscan.io/',
  Ethereum = 'https://etherscan.io/',
  Ropsten = 'https://ropsten.etherscan.io/',
  ArbitrumRinkeby = 'https://testnet.arbiscan.io/',
}
export enum BlockchainExplorer {
  None = '',
  Arbitrum = 'Arbiscan',
  Ethereum = 'Etherscan',
  Ropsten = 'Ropsten Etherscan',
  ArbitrumRinkeby = 'Testnet Arbiscan',
}
