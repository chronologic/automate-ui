import { ChainId, StrategyBlock } from '../../constants';
import { AssetType, IStrategy, IStrategyBlockTx } from '../../types';
import { getTx as getVerseClaimTx } from './Blocks/Ethereum_Verse_Claim';
import { getTx as getBridgeworldClaimTx } from './Blocks/Arbitrum_Bridgeworld_Claim';

export const strategies: IStrategy[] = [
  {
    url: 'bridgeworld-claim',
    comingSoon: false,
    imageSrc: './img/atlas-mine.jpg',
    title: 'Claim Rewards',
    subtitle: 'Bridgeworld (Atlas Mine)',
    assetType: AssetType.Ethereum,
    chainId: ChainId.arbitrum,
    description: `Use this strategy when you want to periodically claim $MAGIC earned in the Atlas Mine.`,
    blocks: [StrategyBlock.Arbitrum_Bridgeworld_Claim],
  },
  {
    url: 'bridgeworld-claim-and-send',
    comingSoon: false,
    imageSrc: './img/atlas-mine2.jpg',
    title: 'Claim & Send Rewards',
    subtitle: 'Bridgeworld (Atlas Mine)',
    assetType: AssetType.Ethereum,
    chainId: ChainId.arbitrum,
    description: `Use this strategy when you want to periodically claim $MAGIC earned in the Atlas Mine and then immediately send some $MAGIC to a different address.`,
    blocks: [StrategyBlock.Arbitrum_Bridgeworld_Claim, StrategyBlock.Arbitrum_Magic_Send],
    fallbacks: {
      [StrategyBlock.Arbitrum_Magic_Send]: getBridgeworldClaimTx,
    },
  },
  {
    url: '',
    comingSoon: true,
    title: 'Send Legions Questing',
    subtitle: 'Bridgeworld (Ivory Tower)',
    imageSrc: './img/ivory-tower.jpg',
    assetType: AssetType.Ethereum,
    chainId: ChainId.arbitrum,
    description: ``,
    blocks: [],
  },
  {
    url: 'magic-dragon-dao-claim',
    comingSoon: false,
    imageSrc: './img/magic-dragon.jpg',
    title: 'Claim Rewards',
    subtitle: 'Magic Dragon DAO',
    assetType: AssetType.Ethereum,
    chainId: ChainId.arbitrum,
    description: `Use this strategy when you want to periodically claim $MAGIC earned in Magic Dragon DAO.`,
    blocks: [StrategyBlock.Arbitrum_MagicDragon_Claim],
  },
  {
    url: '',
    comingSoon: true,
    title: 'Claim Rewards',
    subtitle: 'Tales of Elleria',
    imageSrc: './img/tales-of-alleria.jpg',
    assetType: AssetType.Ethereum,
    chainId: ChainId.arbitrum,
    description: ``,
    blocks: [],
  },
  {
    url: '',
    comingSoon: true,
    title: 'Go on Quests',
    subtitle: 'SmithyDAO',
    imageSrc: './img/smithy.jpg',
    assetType: AssetType.Ethereum,
    chainId: ChainId.arbitrum,
    description: ``,
    blocks: [],
  },
  {
    url: '',
    comingSoon: true,
    title: 'Claim Rewards',
    subtitle: 'BattleFly',
    imageSrc: './img/battlefly.jpg',
    assetType: AssetType.Ethereum,
    chainId: ChainId.arbitrum,
    description: ``,
    blocks: [],
  },
  /// hidden blocks
  {
    url: 'verse-claim-and-send',
    comingSoon: false,
    imageSrc: './img/verse.jpg',
    title: 'Claim and Send $VERSE',
    subtitle: 'Verse',
    assetType: AssetType.Ethereum,
    chainId: ChainId.ethereum,
    description: `Use this strategy when you want to periodically claim and send vested $VERSE.`,
    blocks: [StrategyBlock.Ethereum_Verse_Claim, StrategyBlock.Ethereum_Verse_Send],
    fallbacks: {
      [StrategyBlock.Ethereum_Verse_Send]: getVerseClaimTx,
    },
    hidden: true,
  },
].map((row, i) => ({ ...row, id: i }));

export function getStrategyByUrl(url: string): IStrategy {
  return strategies.find((s) => s.url === url)!;
}

export function getFallback(stragegyUrl: string, blockName: StrategyBlock): IStrategyBlockTx | undefined {
  const strategy = getStrategyByUrl(stragegyUrl);
  const fallbacks = strategy.fallbacks;
  if (!fallbacks) return;
  if (!fallbacks[blockName]) return;

  return fallbacks[blockName]!();
}
