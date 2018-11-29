import { ethers } from 'ethers';
import { BigNumber } from 'ethers/utils';
import { ERC20 } from './erc20';

export class TokenAPI {
  public static normalizeDecimals(amount: string, decimals: number) {
    const dec = new BigNumber(10).pow(decimals);
    
    return new BigNumber(amount).div(dec);
  }

  public static async tokenInfo(address: string, chainId: number) {
    const token = new ethers.Contract(
      address,
      ERC20,
      ethers.getDefaultProvider(ethers.utils.getNetwork(chainId))
    );
    const name = await token.name();
    const decimals = await token.decimals();

    return { name, decimals };
  }
}