import { Button, Tile } from 'carbon-components-react';
import * as React from 'react';
import {
  IDecodedTransaction,
  IScheduledTransaction,
  SentinelAPI
} from 'src/api/SentinelAPI';

import DecodedTransaction from '../DecodedTransaction/DecodedTransaction';
import TransactionStatus from './TransactionStatus';

interface IView extends IScheduledTransaction, IDecodedTransaction {
  errors: string[];
}

class View extends React.Component<any, IView> {
  public async componentDidMount() {
    const response = await SentinelAPI.get(this.props.match.params);

    if ((response as any).errors) {
      this.setState({
        errors: (response as any).errors
      });
    } else {
      const scheduledTransaction = response as IScheduledTransaction;
      const decodeResponse = await SentinelAPI.decode(
        scheduledTransaction.signedTransaction
      );
      if ((response as any).errors) {
        this.setState({
          errors: (response as any).errors
        });
      } else {
        const decodedTransaction = decodeResponse as IDecodedTransaction;

        this.setState({ ...decodedTransaction, ...scheduledTransaction });
      }
    }
  }

  public render() {
    const executed = this.state && this.state.transactionHash;

    return this.state && this.state.errors ? (
      <Tile>{this.state.errors.join('<br/>')}</Tile>
    ) : (
      <div>
        <div className="bx--type-gamma">Transaction Status</div>
        <TransactionStatus {...this.state} />
        <div className="bx--type-gamma">Transaction Info</div>
        <DecodedTransaction {...this.state} skeleton={true} />
        <Button className='bx--btn--danger' disabled={executed}>Cancel watching</Button>
      </div>
    );
  }
}

export default View;
