import { StrategyBlock } from '../../../constants';
import { default as Arbitrum_Bridgeworld_Claim } from './Arbitrum_Bridgeworld_Claim';
import { default as Arbitrum_Magic_Send } from './Arbitrum_Magic_Send';

export { default as Repeat } from './Repeat';

const blockForName: {
  [key in StrategyBlock]: () => JSX.Element;
} = {
  'arbitrum:bridgeworld:claim': Arbitrum_Bridgeworld_Claim,
  'arbitrum:magic:send': Arbitrum_Magic_Send,
};

export { blockForName };
