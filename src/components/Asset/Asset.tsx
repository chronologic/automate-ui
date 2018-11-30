import { TextInput } from 'carbon-components-react';
import { ethers } from 'ethers';
import * as React from 'react';
import { TokenAPI } from 'src/api/TokenAPI';

interface IAssetProps {
  label: string;
  chainId: number;
  disabled: boolean;
  emit?: (args: any) => void;
  address?: string;
}

interface IAssetState {
  address: string;
  name: string;
  validationError: string;
}

class Asset extends React.Component<IAssetProps, IAssetState> {
  constructor(props: IAssetProps) {
    super(props);
    this.state = {
      address: props.address!,
      name: '',
      validationError: ''
    }
    this.tryResolveTokenFromProps(props);
  }

  public componentWillReceiveProps(props: IAssetProps) {
    // not so nice hack to update name of the asset
    this.tryResolveTokenFromProps(props);
  }

  public render() {
    const resolveToken = this.resolveToken.bind(this);

    return (
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
    );
  }

  private tryResolveTokenFromProps(props: IAssetProps) {
    if (props.address && props.address !== '') {
      this.resolveToken(props.address!, props.chainId);
    }
  }

  private async resolveToken(address: string, chainId?: number) {
    try {
      ethers.utils.getAddress(address);
    } catch (e) {
      this.setState({
        name: address,
        validationError: 'Wrong asset address'
      });
      return;
    }

    try {
      const { name, decimals } = await TokenAPI.tokenInfo(
        address,
        chainId || this.props.chainId
      );
      if (this.props.emit) {
        this.props.emit({ address, decimals });
      }
      this.setState({
        address,
        name,
        validationError: ''
      });
    } catch (e) {
      this.setState({
        address,
        validationError: 'Asset is not ERC-20 compatible'
      });
    }
  }
}

export default Asset;
