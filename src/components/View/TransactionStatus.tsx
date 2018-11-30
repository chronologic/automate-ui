import { TextInput } from 'carbon-components-react';
import * as React from 'react';
import { IScheduledTransaction, Status } from 'src/api/SentinelAPI';
import Skeleton from '../Skeleton/Skeleton';

class TransactionStatus extends React.Component<any, IScheduledTransaction> {
  public render() {
    if (!this.props || !this.props.id) {
      return <Skeleton/>;
    }
    return (
      <div>
        <div className="bx--row row-padding">
          <TextInput
            className="bx--col-xs-6"
            labelText="Transaction id"
            disabled={true}
            value={this.props.id}
          />
        </div>
        <div className="bx--row row-padding">
          <TextInput
            className="bx--col-xs-6"
            labelText="Status"
            disabled={true}
            value={Status[this.props.status]}
          />
        </div>
        <div className="bx--row row-padding">
          <TextInput
            className="bx--col-xs-6"
            labelText="Transaction hash"
            disabled={true}
            value={this.props.transactionHash || 'Pending'}
          />
        </div>
      </div>
    );
  }
}

export default TransactionStatus;
