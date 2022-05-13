import { StrategyBlock } from '../../../constants';
import { default as Arbitrum_Bridgeworld_Claim } from './Arbitrum_Bridgeworld_Claim';
import { default as Arbitrum_Magic_Send } from './Arbitrum_Magic_Send';

export { default as Repeat } from './Repeat';
export { default as SigningPopup } from '../SigningPopup';

const blockConfig: {
  [key in StrategyBlock]: { component: () => JSX.Element; requiresFallback: boolean };
} = {
  'arbitrum:bridgeworld:claim': { component: Arbitrum_Bridgeworld_Claim, requiresFallback: false },
  'arbitrum:magic:send': { component: Arbitrum_Magic_Send, requiresFallback: true },
};

export { blockConfig };
