import { StrategyBlock } from '../../../constants';
import { default as BridgeworldClaim } from './BridgeworldClaim';
import { default as MagicSend } from './MagicSend';

export { default as Repeat } from './Repeat';

const blockForName: {
  [key in StrategyBlock]: () => JSX.Element;
} = {
  'arbitrum:bridgeworld:claim': BridgeworldClaim,
  'arbitrum:magic:send': MagicSend,
};

export { blockForName };
