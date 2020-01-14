import { TextInput } from 'carbon-components-react';
import * as React from 'react';
import { IAsset } from 'src/models';

interface IAssetProps extends IAsset {
  label: string;
  helperLabel?: string;
  amountLabel: string;
  amountHelperLabel?: string;

  disabled: boolean;
  validationError?: string;
  onAddressChange?: (args: string) => void;
  onAmountChange?: (args: string) => void;
  onValidationError?: (error: string) => void;
}

class Asset extends React.Component<IAssetProps, any> {
  public render() {
    return (
      <div>
        <div className="bx--row row-padding">
          <div className="bx--col-xs-12">
            <TextInput
              id="Address"
              labelText={this.props.label}
              helperText={this.props.helperLabel}
              value={this.props.address}
              // tslint:disable-next-line:jsx-no-lambda
              onChange={(e: any) => {
                if (this.props.onAddressChange) {
                  this.props.onAddressChange(e.target.value);
                }
              }}
              disabled={this.props.disabled}
              invalid={!!this.props.validationError}
              invalidText={this.props.validationError}
            />
          </div>
          <div className="bx--col-xs-12">
            <TextInput
              id="Name"
              className="bx--col-xs-12"
              labelText="Asset name"
              value={this.props.name}
              disabled={true}
            />
          </div>
        </div>
        <div className="bx--row row-padding">
          <div className="bx--col-xs-12">
            <TextInput
              id="Amount"
              labelText={this.props.amountLabel}
              helperText={this.props.amountHelperLabel}
              value={this.props.amount}
              // tslint:disable-next-line:jsx-no-lambda
              onChange={(e: any) => {
                if (this.props.onAmountChange) {
                  this.props.onAmountChange(e.target.value);
                }
              }}
              disabled={this.props.disabled}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Asset;
