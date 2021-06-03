import { Button, FormItem, Link, Loading, TextInput, Tile } from 'carbon-components-react';
import * as React from 'react';

import {
  ICancelResponse,
  IScheduleAccessKey,
  IScheduledTransaction,
  SentinelAPI,
  Status,
} from '../../../api/SentinelAPI';
import { AssetType, IDecodedTransaction, IError, PolkadotChainId } from '../../../types';
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

const getAssetNameAndImage = (assetType: AssetType, chainId: any): [string, string] => {
  if (assetType === AssetType.Ethereum) {
    return ['Ethereum', '/assets/eth.svg'];
  } else if (assetType === AssetType.Polkadot) {
    if (chainId === PolkadotChainId.PolkadotMainnet) {
      return ['Polkadot', '/assets/dot.svg'];
    } else if (chainId === PolkadotChainId.EdgewareMainnet) {
      return ['Edgeware', '/assets/edg.svg'];
    }
  }

  return ['', ''];
};

class View extends React.Component<IViewProps, IView> {
  public async componentDidMount() {
    const response = await SentinelAPI.get(this.props.match.params);

    if ((response as any).errors) {
      this.setState({
        errors: (response as any).errors,
      });
    } else {
      const scheduledTransaction = response as IScheduledTransaction;
      const decodeResponse = await SentinelAPI.decode(
        scheduledTransaction.signedTransaction,
        scheduledTransaction.assetType,
        scheduledTransaction.chainId
      );
      if ((response as any).errors) {
        this.setState({
          errors: (response as any).errors,
        });
      } else {
        console.log({ scheduledTransaction, decodeResponse });
        const decodedTransaction = decodeResponse as IDecodedTransaction;

        this.setState({ decodedTransaction, scheduledTransaction });
      }
    }
  }

  public render() {
    if (!this.state) {
      return <Loading />;
    }

    const { scheduledTransaction } = this.state;
    const cancellable =
      this.state.scheduledTransaction &&
      [Status.Pending, Status.Draft].includes(this.state.scheduledTransaction.status);
    const cancel = this.cancel.bind(this);
    const cancelStatus = this.renderResponse();
    const [assetName, assetImgUrl] = getAssetNameAndImage(scheduledTransaction.assetType, scheduledTransaction.chainId);

    return this.state && this.state.errors ? (
      <Tile>{this.state.errors.join('<br/>')}</Tile>
    ) : (
      <div className="view-transaction">
        <div className="bx--type-gamma">Platform</div>
        <div className="platform-info">
          <embed type="image/svg+xml" src={assetImgUrl} height="40" width="40" />
          <div className="platform-info-title">{assetName}</div>
        </div>
        <div className="bx--type-gamma">Payment Information</div>
        <div>
          <div className="bx--row row-padding">
            <TextInput
              id="paymentAddress"
              className="bx--col-xs-12"
              labelText="Payment address"
              disabled={true}
              value={scheduledTransaction.paymentAddress}
            />
          </div>
          <div className="bx--row row-padding">
            {scheduledTransaction.paymentTx ? (
              <FormItem>
                <label className="bx--label">Payment transaction hash</label>
                <Link
                  href={'https://etherscan.io/tx/' + scheduledTransaction.paymentTx}
                  className="bx--text-input bx--col-xs-12"
                  target="_blank"
                >
                  {scheduledTransaction.paymentTx}
                </Link>
              </FormItem>
            ) : (
              <TextInput
                id="paymentTxHash"
                className="bx--col-xs-12"
                labelText="Payment transaction hash"
                disabled={true}
                value={'Pending'}
              />
            )}
          </div>
        </div>
        <div className="bx--type-gamma">Transaction Status</div>
        <TransactionStatus
          {...{
            ...scheduledTransaction,
            ...this.state.decodedTransaction,
          }}
        />
        <div className="bx--type-gamma">Transaction Information</div>
        <SenderInformation skeleton={true} {...this.state.decodedTransaction} />
        <div className="bx--type-gamma">Transaction Info</div>
        <DecodedTransaction {...this.state.decodedTransaction} skeleton={true} assetName={assetName} />
        <div className="bx--type-gamma">Conditions</div>
        <DecodedConditionalAsset {...scheduledTransaction.conditionalAsset} />
        <TimeCondition {...scheduledTransaction} />
        <br />
        <Button kind="danger" disabled={!cancellable} onClick={cancel}>
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
        status: Status.Cancelled,
      };
      this.setState({ scheduledTransaction });
      this.props.onChange();
    }

    this.setState({ cancelResponse });
  }
}

export default View;
