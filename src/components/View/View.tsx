import { Button, Loading, Tile } from 'carbon-components-react';
import * as React from 'react';
import {
  ICancelResponse,
  IDecodedTransaction,
  IError,
  IScheduledTransaction,
  SentinelAPI,
  Status,
} from 'src/api/SentinelAPI';

import DecodedConditionalAsset from '../Asset/DecodedConditionalAsset';
import DecodedTransaction from '../DecodedTransaction/DecodedTransaction';
import SenderInformation from '../Sender/SenderInformation';
import TransactionStatus from './TransactionStatus';

interface IView {
  decodedTransaction: IDecodedTransaction;
  scheduledTransaction: IScheduledTransaction;
  errors: string[];
  cancelResponse?: ICancelResponse | IError;
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

        this.setState({ decodedTransaction, scheduledTransaction });
      }
    }
  }

  public render() {
    if (!this.state) {
      return <Loading />;
    }

    const executed =
      this.state.scheduledTransaction && this.state.scheduledTransaction.status !== Status.Pending;
    const cancel = this.cancel.bind(this);
    const cancelStatus = this.renderResponse();

    return this.state && this.state.errors ? (
      <Tile>{this.state.errors.join('<br/>')}</Tile>
    ) : (
      <div>
        <div className="bx--type-gamma">Transaction Status</div>
        <TransactionStatus {...{...this.state.scheduledTransaction, ...this.state.decodedTransaction}} />
        <div className="bx--type-gamma">Transaction Information</div>
        <SenderInformation skeleton={true} {...this.state.decodedTransaction}/>
        <div className="bx--type-gamma">Transaction Info</div>
        <DecodedTransaction
          {...this.state.decodedTransaction}
          skeleton={true}
        />
        <div className="bx--type-gamma">Conditions</div>
        <DecodedConditionalAsset
          {...this.state.scheduledTransaction.conditionalAsset}
        />
        <Button
          className="bx--btn--danger"
          disabled={executed}
          onClick={cancel}
        >
          Cancel watching
        </Button>
        {cancelStatus}
      </div>
    );
  }

  private renderResponse() {
    if (!this.state || !this.state.cancelResponse) {
      return <div />;
    } else if ((this.state.cancelResponse as any).errors) {
      const error = this.state.cancelResponse as IError;
      return <Tile>{error.errors.join('\n')}</Tile>;
    } else {
      const response = this.state.cancelResponse as ICancelResponse;
      const scheduledTransaction = ({
        status: response.status
      } = this.state.scheduledTransaction);

      this.setState({ scheduledTransaction });

      return <Tile>You have successfully cancelled your transaction !</Tile>;
    }
  }

  private async cancel() {
    const cancelResponse = await SentinelAPI.cancel(this.props.match.params);
    this.setState({ cancelResponse });
  }
}

export default View;
