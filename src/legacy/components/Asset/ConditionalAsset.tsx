import * as React from 'react';

import { ETH, TokenAPI } from '../../../api/TokenAPI';
import { IAsset, IAssetState } from '../../../models';
import Asset from './Asset';

interface IAssetProps {
  chainId: number;
  disabled: boolean;

  onChange: (args: IAsset) => void;
  onValidationError: (error: string) => void;
}

class ConditionalAsset extends React.Component<IAssetProps, IAssetState> {
  constructor(props: IAssetProps) {
    super(props);
    this.state = {
      ...ETH,
      address: '',
      amount: '',
      validationError: '',
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
    let amount = '';
    if (!Number.isNaN(parsed)) {
      amount = parsed.toString();

      if (newAmount[newAmount.length - 1] === '.') {
        amount += '.';
      }
    }

    this.setState({ amount });
    if (this.props.onChange) {
      const newState = {
        ...this.state,
        amount,
      };
      this.props.onChange(newState);
    }
  }

  private async resolveToken(address: string, chainId?: number): Promise<void> {
    const { name, decimals, validationError } = await TokenAPI.resolveToken(address, chainId || this.props.chainId);

    const newState = {
      ...this.state,
      address,
      decimals,
      name,
      validationError,
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
