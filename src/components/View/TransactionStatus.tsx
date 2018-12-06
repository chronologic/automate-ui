import { TextInput } from 'carbon-components-react';
import * as React from 'react';
import { IScheduledTransaction, Status } from 'src/api/SentinelAPI';
import Skeleton from '../Skeleton/Skeleton';

class TransactionStatus extends React.Component<IScheduledTransaction, any> {
  public render() {
    if (!this.props || !this.props.id) {
      return <Skeleton />;
    }

    const status = Status[this.props.status];
    const statusText =
      this.props.status === Status.Error && this.props.error
        ? `${status} - ${this.props.error}`
        : status;

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
            value={statusText}
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
