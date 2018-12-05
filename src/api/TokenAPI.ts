import { ethers } from 'ethers';
import { ERC20 } from './erc20';

export const ETH = { name: 'ETH', decimals: 18 };

export class TokenAPI {
  public static withDecimals(amount: string, decimals: number = 18) {
    return ethers.utils.formatUnits(amount, decimals);
  }

  public static withoutDecimals(amount: string, decimals: number = 18) {
    return ethers.utils.parseUnits(amount, decimals);
  }

  public static async tokenInfo(address: string, chainId: number) {
    if (address === '') {
      return ETH;
    }
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