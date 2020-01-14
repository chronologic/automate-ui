import { FormItem, Link, TextInput } from 'carbon-components-react';
import * as React from 'react';

import { IScheduledTransaction, Status } from 'src/api/SentinelAPI';
import { AssetType, IDecodedTransaction } from 'src/models';
import Skeleton from '../Skeleton/Skeleton';

interface ITransactionStatusProps
  extends IScheduledTransaction,
    IDecodedTransaction {}

type IExplorers = {
  [key in AssetType]: Map<number, string>;
};

class TransactionStatus extends React.Component<ITransactionStatusProps, any> {
  private explorers: IExplorers = {
    [AssetType.Ethereum]: new Map<number, string>([
      [1, 'https://etherscan.io/tx/'],
      [3, 'https://ropsten.etherscan.io/tx/'],
      [4, 'https://rinkeby.etherscan.io/tx/'],
      [42, 'https://kovan.etherscan.io/tx/']
    ]),
    [AssetType.Polkadot]: new Map<number, string>([
      [1, 'https://polkascan.io/pre/kusama-cc3/transaction/']
    ])
  };

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
            className="bx--col-xs-12"
            labelText="Transaction id"
            disabled={true}
            value={this.props.id}
          />
        </div>
        <div className="bx--row row-padding">
          <TextInput
            className="bx--col-xs-12"
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
    if (this.props.status === Status.Completed) {
      const explorerUrl = this.getExplorerUrl(
        this.props.assetType,
        this.props.signedChain.chainId,
        this.props.transactionHash as string
      );
      if (explorerUrl) {
        return (
          <FormItem>
            <label className="bx--label">Transaction hash</label>
            <Link
              href={explorerUrl}
              className="bx--text-input bx--col-xs-12"
              target="_blank"
            >
              {this.props.transactionHash}
            </Link>
          </FormItem>
        );
      } else {
        return (
          <TextInput
            className="bx--col-xs-12"
            labelText="Transaction hash"
            disabled={true}
            value={this.props.transactionHash || 'Pending'}
          />
        );
      }
    } else {
      return (
        <TextInput
          className="bx--col-xs-12"
          labelText="Transaction hash"
          disabled={true}
          value={'Pending'}
        />
      );
    }
  }

  private getExplorerUrl(assetType: AssetType, chainId: number, hash: string) {
    if (!hash) {
      return '';
    }

    const explorer = this.explorers[assetType].get(chainId);

    return explorer ? explorer + hash : '';
  }
}

export default TransactionStatus;
