import React from 'react';
import { TextInput } from 'carbon-components-react';

import Skeleton from '../Skeleton/Skeleton';

interface IScheduledTransactionProps {
  signedSender: string;
  senderNonce: number;
  skeleton: boolean;
}

class SenderInformation extends React.Component<IScheduledTransactionProps, any> {
  public render() {
    if (this.props.skeleton && !this.props.signedSender) {
      return <Skeleton />;
    }

    return (
      <div>
        <div className="bx--row row-padding">
          <div className="bx--col-xs-12">
            <TextInput
              id="senderAddress"
              labelText="Sender address"
              helperText="Sender address decoded from Signed Transaction"
              disabled={true}
              value={this.props.signedSender}
            />
          </div>
        </div>
        <div className="bx--row row-padding">
          <div className="bx--col-xs-12">
            <TextInput
              id="senderNonce"
              labelText="Sender nonce"
              helperText="Current sender nonce for the network signed in the transaction"
              disabled={true}
              value={isNaN(this.props.senderNonce) ? '' : this.props.senderNonce}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default SenderInformation;
