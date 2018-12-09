import { TextInput } from 'carbon-components-react';
import * as React from 'react';
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
          <div className="bx--col-xs-6">
            <TextInput
              labelText="Sender address"
              disabled={true}
              value={this.props.signedSender}
            />
          </div>
        </div>
        <div className="bx--row row-padding">
          <div className="bx--col-xs-6">
            <TextInput
              labelText="Sender nonce"
              disabled={true}
              value={this.props.senderNonce || ""}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default SenderInformation;