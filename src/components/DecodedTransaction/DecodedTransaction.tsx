import { TextInput } from 'carbon-components-react';
import * as React from 'react';
import { IDecodedTransaction } from 'src/api/SentinelAPI';
import { TokenAPI } from 'src/api/TokenAPI';

import Skeleton from '../Skeleton/Skeleton';

interface IDecodedTransactionView extends IDecodedTransaction {
  skeleton: boolean;
}

class DecodedTransaction extends React.Component<IDecodedTransactionView, any> {
  public render() {
    if (this.props.skeleton && !this.props.signedSender) {
      return <Skeleton/>;
    }

    const signedAmount = TokenAPI.normalizeDecimals(this.props.signedAmount, this.props.signedAssetDecimals);
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