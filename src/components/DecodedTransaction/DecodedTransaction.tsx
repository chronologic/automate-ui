import { TextInput } from 'carbon-components-react';
import * as React from 'react';
import { IDecodedTransaction } from 'src/api/SentinelAPI';

import DecodedAsset from '../Asset/DecodedAsset';
import Skeleton from '../Skeleton/Skeleton';

interface IDecodedTransactionView extends IDecodedTransaction {
  skeleton: boolean;
}

class DecodedTransaction extends React.Component<IDecodedTransactionView, any> {
  public render() {
    if (this.props.skeleton && !this.props.signedSender) {
      return <Skeleton />;
    }

    const network = this.props.signedChain.chainId
      ? `${this.props.signedChain.chainName} [id: ${
          this.props.signedChain.chainId
        }]`
      : '';

    return (
      <div>
        <DecodedAsset {...this.props.signedAsset} />
        <div className="bx--row row-padding">
          <div className="bx--col-xs-6">
            <TextInput
              labelText="Transaction receiver"
              disabled={true}
              value={this.props.signedRecipient}
            />
          </div>
        </div>
        <div className="bx--row row-padding">
          <div className="bx--col-xs-6">
            <TextInput
              labelText="Transaction Nonce"
              disabled={true}
              value={this.props.signedNonce || ""}
            />
          </div>
        </div>
        <div className="bx--row row-padding">
          <div className="bx--col-xs-6">
            <TextInput labelText="Network" disabled={true} value={network} />
          </div>
        </div>
      </div>
    );
  }
}

export default DecodedTransaction;
