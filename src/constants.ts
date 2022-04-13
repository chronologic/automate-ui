export const MOBILE_SCREEN_THRESHOLD = 800;
export const SMALL_SCREEN_THRESHOLD = 960;
export const TABLET_SCREEN_THRESHOLD = 1200;
export const SECOND_MILLIS = 1000;
export const MINUTE_MILLIS = 60 * SECOND_MILLIS;
export enum Network {
  None = '',
  Ethereum = 'ethereum',
  Arbitrum = 'arbitrum',
}
export enum ChainId {
  Arbitrum = 42161,
}
export const AUTOMATE_BLOCK_EXPLORER_URL = 'https://automate.chronologic.network/transactions?query=';
