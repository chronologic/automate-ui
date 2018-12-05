import { TextInput } from 'carbon-components-react';
import { ethers } from 'ethers';
import * as React from 'react';
import { TokenAPI } from 'src/api/TokenAPI';

interface IAssetProps {
  label: string;
  amountLabel: string;
  chainId: number;
  disabled: boolean;
  address?: string;
  name?: string;
  amount?: string;
  decimals?: number;

  onChange?: (args: IAssetState) => void;
  onValidationError?: (error: string) => void;
}

export interface IAssetState {
  address: string;
  amount: string;
  name: string;
  decimals: number;
  validationError: string;
}

class Asset extends React.Component<IAssetProps, IAssetState> {
  constructor(props: IAssetProps) {
    super(props);
    this.state = {
      address: props.address!,
      amount: "",
      decimals: 0,
      name: props.name!,
      validationError: ''
    };
    this.tryResolveTokenFromProps(props);
  }

  public componentWillReceiveProps(props: IAssetProps) {
    // not so nice hack to update name of the asset
    this.tryResolveTokenFromProps(props);
  }

  public render() {
    const resolveToken = this.resolveToken.bind(this);
    const parseAmount = this.parseAmount.bind(
      this
    );

    let amount = '';
    if (this.state.amount !== '') {
      amount = TokenAPI.withDecimals(
        this.state.amount,
        this.state.decimals
      ).toString();
    }

    return (
      <div>
        <div className="bx--row row-padding">
          <div className="bx--col-xs-6">
            <TextInput
              id="ConditionalAsset"
              labelText={this.props.label}
              value={this.state.address || this.props.address}
              // tslint:disable-next-line:jsx-no-lambda
              onChange={(e: any) => resolveToken(e.target.value)}
              disabled={this.props.disabled}
              invalid={this.state.validationError !== ''}
              invalidText={this.state.validationError}
            />
          </div>
          <div className="bx--col-xs-2">
            <TextInput
              id="ConditionalAssetName"
              className="bx--col-xs-6"
              labelText="Asset name"
              value={this.state.name}
              disabled={true}
            />
          </div>
        </div>
        <div className="bx--row row-padding">
          <div className="bx--col-xs-6">
            <TextInput
              id="ConditionalAssetAmount"
              labelText={this.props.amountLabel}
              value={amount}
              // tslint:disable-next-line:jsx-no-lambda
              onChange={(e: any) => parseAmount(e.target.value)}
              disabled={
                this.props.disabled
              }
            />
          </div>
        </div>
      </div>
    );
  }

  private async parseAmount(amount: string) {
    try {
      const parsed = TokenAPI.withoutDecimals(
        amount,
        this.state.decimals
      );

      if (parsed.gte(0)) {
        this.setState({ amount: parsed.toString() });
      }
      // tslint:disable-next-line:no-empty
    } catch (e) {}
  }

  private tryResolveTokenFromProps(props: IAssetProps) {
    if (props.address && props.address !== '') {
      this.resolveToken(props.address!, props.chainId);
    } else if (props.name) {
      this.setState({ name: props.name! });
    }
  }

  private async resolveToken(address: string, chainId?: number) {
    let validationError = '';
    let name = address === '' ? 'ETH' : '';
    let decimals = address === '' ? 18 : 0;

    if (address !== '') {
      try {
        ethers.utils.getAddress(address);
      } catch (e) {
        validationError = 'Wrong asset address';
      }

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
      address,
      amount: this.state.amount,
      decimals,
      name,
      validationError
    };
    this.setState({ ...newState });
    if (this.props.onChange) {
      this.props.onChange({ ...newState });
    }
    if (this.props.onValidationError && validationError) {
      this.props.onValidationError(validationError);
    }
  }
}

export default Asset;
