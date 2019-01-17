import { ethers } from 'ethers';
import * as React from 'react';
import { IAsset } from 'src/api/SentinelAPI';
import { ETH, TokenAPI } from 'src/api/TokenAPI';

import Asset from './Asset';

interface IAssetProps {
  chainId: number;
  disabled: boolean;

  onChange: (args: IAsset) => void;
  onValidationError: (error: string) => void;
}

export interface IAssetState extends IAsset {
  validationError: string;
}

class ConditionalAsset extends React.Component<IAssetProps, IAssetState> {
  constructor(props: IAssetProps) {
    super(props);
    this.state = {
      ...ETH,
      address: '',
      amount: '',
      validationError: ''
    };
  }

  public render() {
    const resolveToken = this.resolveToken.bind(this);
    const parseAmount = this.parseAmount.bind(this);

    return (
      <Asset
        {...this.state}
        amountLabel="Minimum balance of the Sender for conditional asset"
        amountHelperLabel="When empty the same asset and amount as for signed transaction will be used"
        disabled={this.props.disabled}
        label="Condition asset address"
        helperLabel="ERC20 token address or empty for ETH"
        onAddressChange={resolveToken}
        onAmountChange={parseAmount}
      />
    );
  }

  private async parseAmount(newAmount: string) {
    const parsed = Number.parseFloat(newAmount);
    let amount = "";
    if (!Number.isNaN(parsed)) {
      amount = parsed.toString();
      
      if (newAmount[newAmount.length - 1 ] === ".") {
        amount += ".";
      }
    } 
    
    this.setState({ amount });
    if (this.props.onChange) {
      const newState = {
        ...this.state,
        amount
      };
      this.props.onChange(newState);
    }

  }

  private async resolveToken(address: string, chainId?: number) {
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
        const tokenInfo = await TokenAPI.tokenInfo(
          address,
          chainId || this.props.chainId
        );
        decimals = tokenInfo.decimals;
        name = tokenInfo.name;
      } catch (e) {
        validationError = 'Asset is not ERC-20 compatible';
      }
    }

    const newState = {
      ...this.state,
      address,
      decimals,
      name,
      validationError
    };

    this.setState(newState);

    if (this.props.onChange) {
      this.props.onChange(newState);
    }
    if (this.props.onValidationError) {
      this.props.onValidationError(validationError);
    }
  }
}

export default ConditionalAsset;
