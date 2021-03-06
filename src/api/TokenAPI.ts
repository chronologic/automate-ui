import { ethers } from 'ethers';
import { IAssetState } from 'src/components/Asset/ConditionalAsset';
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

  public static async resolveToken(
    address: string,
    chainId: number
  ): Promise<IAssetState> {
    let validationError = '';
    let { name, decimals } = ETH;

    if (address) {
      try {
        ethers.utils.getAddress(address);
      } catch (e) {
        validationError = 'Wrong asset address';
      }
    }

    if (!validationError) {
      try {
        const tokenInfo = await TokenAPI.tokenInfo(address, chainId);
        decimals = tokenInfo.decimals;
        name = tokenInfo.name;
      } catch (e) {
        validationError = 'Asset is not ERC-20 compatible';
      }
    }

    return {
      address,
      amount: '',
      decimals,
      name,
      validationError
    };
  }
}
