import { TextInput } from 'carbon-components-react';
import * as React from 'react';
import { IAsset } from 'src/api/SentinelAPI';

interface IAssetProps extends IAsset {
  label: string;
  amountLabel: string;
  
  disabled: boolean;
  validationError?: string;
  onChange?: (args: any) => void;
  onValidationError?: (error: string) => void;
}

class Asset extends React.Component<IAssetProps, any> {
  public render() {
    return (
      <div>
        <div className="bx--row row-padding">
          <div className="bx--col-xs-6">
            <TextInput
              id="Address"
              labelText={this.props.label}
              value={this.props.address}
              // tslint:disable-next-line:jsx-no-lambda
              onChange={(e: any) => {
                if (this.props.onChange) {
                  this.props.onChange(e.target.value);
                }
              }}
              disabled={this.props.disabled}
              invalid={!!this.props.validationError}
              invalidText={this.props.validationError}
            />
          </div>
          <div className="bx--col-xs-2">
            <TextInput
              id="Name"
              className="bx--col-xs-6"
              labelText="Asset name"
              value={this.props.name}
              disabled={true}
            />
          </div>
        </div>
        <div className="bx--row row-padding">
          <div className="bx--col-xs-6">
            <TextInput
              id="Amount"
              labelText={this.props.amountLabel}
              value={this.props.amount}
              // tslint:disable-next-line:jsx-no-lambda
              disabled={
                this.props.disabled
              }
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Asset;
