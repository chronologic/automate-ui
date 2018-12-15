import { FormItem, Link, TextInput } from 'carbon-components-react';
import * as React from 'react';
import {
  IDecodedTransaction,
  IScheduledTransaction,
  Status
} from 'src/api/SentinelAPI';

import Skeleton from '../Skeleton/Skeleton';

interface ITransactionStatusProps
  extends IScheduledTransaction,
    IDecodedTransaction {}

class TransactionStatus extends React.Component<ITransactionStatusProps, any> {
  private explorers = new Map<number, string>([
    [1, 'https://kovan.etherscan.io/tx/'],
    [3, 'https://ropsten.etherscan.io/tx/'],
    [4, 'https://rinkeby.etherscan.io/tx/'],
    [42, 'https://kovan.etherscan.io/tx/']
  ]);

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
          {this.renderTransactionHash()}
        </div>
      </div>
    );
  }

  private renderTransactionHash() {
    if (this.props.transactionHash) {
      const url = this.getExplorerUrl(
        this.props.signedChain.chainId,
        this.props.transactionHash
      );
      return (
        <FormItem>
          <label className="bx--label">Transaction hash</label>
          <Link href={url} className="bx--text-input bx--col-xs-6">
            {this.props.transactionHash}
          </Link>
        </FormItem>
      );
    } else {
      return (
        <TextInput
          className="bx--col-xs-6"
          labelText="Transaction hash"
          disabled={true}
          value="Pending"
        />
      );
    }
  }

  private getExplorerUrl(chainId: number, hash: string) {
    if (!hash) {
      return Status[Status.Pending];
    }

    const explorer = this.explorers.get(chainId);

    return explorer ? explorer + hash : hash;
  }
}

export default TransactionStatus;
