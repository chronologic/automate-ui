import { Button, Loading, Tile } from 'carbon-components-react';
import * as React from 'react';

import {
  ICancelResponse,
  IScheduleAccessKey,
  IScheduledTransaction,
  SentinelAPI,
  Status
} from 'src/api/SentinelAPI';
import { AssetType, IDecodedTransaction, IError } from 'src/models';
import DecodedConditionalAsset from '../Asset/DecodedConditionalAsset';
import DecodedTransaction from '../DecodedTransaction/DecodedTransaction';
import SenderInformation from '../Sender/SenderInformation';
import TimeCondition from './TimeCondition';
import TransactionStatus from './TransactionStatus';

interface IViewProps {
  match: {
    params: IScheduleAccessKey;
  };
  onChange: () => void;
}

interface IView {
  decodedTransaction: IDecodedTransaction;
  scheduledTransaction: IScheduledTransaction;
  errors: string[];
  cancelResponse?: ICancelResponse | IError;
}

const platformImgUrl = {
  [AssetType.Ethereum]: '/assets/eth.svg',
  [AssetType.Polkadot]: '/assets/dot.svg'
};

class View extends React.Component<IViewProps, IView> {
  public async componentDidMount() {
    const response = await SentinelAPI.get(this.props.match.params);

    if ((response as any).errors) {
      this.setState({
        errors: (response as any).errors
      });
    } else {
      const scheduledTransaction = response as IScheduledTransaction;
      const decodeResponse = await SentinelAPI.decode(
        scheduledTransaction.signedTransaction,
        scheduledTransaction.assetType
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
      this.state.scheduledTransaction &&
      this.state.scheduledTransaction.status !== Status.Pending;
    const cancel = this.cancel.bind(this);
    const cancelStatus = this.renderResponse();

    return this.state && this.state.errors ? (
      <Tile>{this.state.errors.join('<br/>')}</Tile>
    ) : (
      <div className="view-transaction">
        <div className="bx--type-gamma">Platform</div>
        <div className="platform-info">
          <embed
            type="image/svg+xml"
            src={platformImgUrl[this.state.scheduledTransaction.assetType]}
            height="40"
          />
          <div className="platform-info-title">
            {this.state.scheduledTransaction.assetType}
          </div>
        </div>
        <div className="bx--type-gamma">Transaction Status</div>
        <TransactionStatus
          {...{
            ...this.state.scheduledTransaction,
            ...this.state.decodedTransaction
          }}
        />
        <div className="bx--type-gamma">Transaction Information</div>
        <SenderInformation skeleton={true} {...this.state.decodedTransaction} />
        <div className="bx--type-gamma">Transaction Info</div>
        <DecodedTransaction
          {...this.state.decodedTransaction}
          skeleton={true}
        />
        <div className="bx--type-gamma">Conditions</div>
        <DecodedConditionalAsset
          {...this.state.scheduledTransaction.conditionalAsset}
        />
        <TimeCondition {...this.state.scheduledTransaction} />
        <br />
        <Button kind="danger" disabled={executed} onClick={cancel}>
          Cancel transaction
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
      return <Tile>You have successfully cancelled your transaction !</Tile>;
    }
  }

  private async cancel() {
    const cancelResponse = await SentinelAPI.cancel(this.props.match.params);
    if ((cancelResponse as ICancelResponse).status === Status.Cancelled) {
      const scheduledTransaction = {
        ...this.state.scheduledTransaction,
        status: Status.Cancelled
      };
      this.setState({ scheduledTransaction });
      this.props.onChange();
    }

    this.setState({ cancelResponse });
  }
}

export default View;
