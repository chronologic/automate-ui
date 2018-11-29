import { TextInput } from 'carbon-components-react';
import { BigNumber } from 'ethers/utils/bignumber';
import * as React from 'react';

interface IDecodedTransaction {
  signedAsset: string;
  signedRecipient: string;
  signedAmount: string;
  signedAssetDecimals: number;
  signedAssetName: string;
}

class DecodedTransaction extends React.Component<IDecodedTransaction, any> {
  public render() {
    const dec = new BigNumber(10).pow(this.props.signedAssetDecimals);
    const signedAmount = new BigNumber(this.props.signedAmount).div(dec);
    const signedAsset = `${this.props.signedAsset} [ERC-20: ${
      this.props.signedAssetName
    }]`;
    
    return (
      <div>
        <div className="bx--row row-padding">
          <TextInput
            className="bx--col-xs-6"
            labelText="Transaction asset"
            disabled={true}
            value={signedAsset}
          />
        </div>
        <div className="bx--row row-padding">
          <TextInput
            className="bx--col-xs-6"
            labelText="Transaction receiver"
            disabled={true}
            value={this.props.signedRecipient}
          />
        </div>
        <div className="bx--row row-padding">
          <TextInput
            className="bx--col-xs-6"
            invalidText="Wrong input"
            labelText="Transaction amount"
            disabled={true}
            value={signedAmount}
          />
        </div>
      </div>
    );
  }
}

export default DecodedTransaction;