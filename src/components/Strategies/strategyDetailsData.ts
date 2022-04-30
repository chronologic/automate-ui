import { ChainId, StrategyBlock } from '../../constants';
import { AssetType, IStrategy } from '../../types';

export const strategies: {
  [key: string]: IStrategy;
} = {
  'bridgeworld-claim': {
    title: 'Claim Atlas Mine rewards',
    assetType: AssetType.Ethereum,
    chainId: ChainId.Arbitrum,
    description: `Use this strategy when you want to periodically claim $MAGIC earned during a vested release.`,
    blocks: [StrategyBlock.Arbitrum_Bridgeworld_Claim],
  },
  'bridgeworld-claim-and-send': {
    title: 'Claim and send Atlas Mine rewards',
    assetType: AssetType.Ethereum,
    chainId: ChainId.Arbitrum,
    description: `Use this strategy when you want to periodically claim $MAGIC earned during a vested release.
This strategy combines two steps for you: claiming $MAGIC and sending it to a specified wallet address.`,
    blocks: [StrategyBlock.Arbitrum_Bridgeworld_Claim, StrategyBlock.Arbitrum_Magic_Send],
  },
};
