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
}

const blockConfig: {
  [key in StrategyBlock]: IBlockConfig;
} = {
  'arbitrum:bridgeworld:claim': { component: Arbitrum_Bridgeworld_Claim },
  'arbitrum:magic:send': { component: Arbitrum_Magic_Send },
  'arbitrum:magicdragon:claim': { component: Arbitrum_MagicDragon_Claim },
  'ethereum:verse:claim': { component: Ethereum_Verse_Claim },
  'ethereum:verse:send': { component: Ethereum_Verse_Send },
};

export { blockConfig };
