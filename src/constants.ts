export const MOBILE_SCREEN_THRESHOLD = 800;
export const SMALL_SCREEN_THRESHOLD = 960;
export const TABLET_SCREEN_THRESHOLD = 1200;
export const SECOND_MILLIS = 1000;
export const MINUTE_MILLIS = 60 * SECOND_MILLIS;
export enum Network {
  None = '',
  Ethereum = 'Ethereum',
  Arbitrum = 'Arbitrum',
  Ropsten = 'Ropsten',
  ArbitrumRinkeby = 'ArbitrumRinkeby',
}
export enum ChainId {
  Arbitrum = 42161,
  Ethereum = 1,
  Ropsten = 3,
  ArbitrumRinkeby = 421611,
}
export enum ConfirmationTime {
  immediate = '0d', // 0
  oneDay = '1d', // 1
  threeDays = '3d', // 2
  fiveDays = '5d', // 3
}
