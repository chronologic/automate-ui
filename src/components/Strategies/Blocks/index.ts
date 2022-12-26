import { StrategyBlock } from '../../../constants';
import { default as Arbitrum_Bridgeworld_Claim } from './Arbitrum_Bridgeworld_Claim';
import { default as Arbitrum_Magic_Send } from './Arbitrum_Magic_Send';
import { default as Arbitrum_MagicDragon_Claim } from './Arbitrum_MagicDragon_Claim';
import { default as Ethereum_Verse_Claim } from './Ethereum_Verse_Claim';
import { default as Ethereum_Verse_Send } from './Ethereum_Verse_Send';

export { default as Repeat } from './Repeat';
export { default as SigningPopup } from '../SigningPopup';

interface IBlockConfig {
  component: () => JSX.Element;
  requiresFallback: boolean;
}

const blockConfig: {
  [key in StrategyBlock]: IBlockConfig;
} = {
  'arbitrum:bridgeworld:claim': { component: Arbitrum_Bridgeworld_Claim, requiresFallback: false },
  'arbitrum:magic:send': { component: Arbitrum_Magic_Send, requiresFallback: true },
  'arbitrum:magicdragon:claim': { component: Arbitrum_MagicDragon_Claim, requiresFallback: false },
  'ethereum:verse:claim': { component: Ethereum_Verse_Claim, requiresFallback: false },
  'ethereum:verse:send': { component: Ethereum_Verse_Send, requiresFallback: false },
};

export { blockConfig };
