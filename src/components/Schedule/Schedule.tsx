import {
  Button,
  Form,
  TextArea,
  TextInput,
  Tile
} from 'carbon-components-react';
import { BigNumber } from 'ethers/utils';
import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  IDecodedTransaction,
  IError,
  IScheduleAccessKey,
  SentinelAPI
} from 'src/api/SentinelAPI';
import { TokenAPI } from 'src/api/TokenAPI';

import DecodedTransaction from '../DecodedTransaction/DecodedTransaction';

interface ISentinelState extends IDecodedTransaction {
  conditionAssetAmount: string;
  conditionAsset: string;
  conditionAssetDecimals: number;
  conditionAssetName: string;
  sentinelResponse: IScheduleAccessKey | IError | undefined;
  signedTransaction: string;
  signedTransactionIsValid: boolean;
}

class Schedule extends React.Component<{}, ISentinelState> {
  constructor(props: any) {
    super(props);
    this.state = {
      conditionAsset: '',
      conditionAssetAmount: '',
      conditionAssetDecimals: 1,
      conditionAssetName: '',
      sentinelResponse: undefined,
      signedAmount: '',
      signedAsset: '',
      signedAssetDecimals: 1,
      signedAssetName: '',
      signedRecipient: '',
      signedSender: '',
      signedTransaction: '',
      signedTransactionIsValid: true
    };
  }

  public render() {
    const send = this.send.bind(this);
    const decode = this.decode.bind(this);

    const conditionAssetAmount = TokenAPI.normalizeDecimals(
      this.state.conditionAssetAmount,
      this.state.conditionAssetDecimals
    );
    const conditionalAssetName = this.state.conditionAssetName ? `[ERC-20: ${
      this.state.conditionAssetName
    }]` : '';

    const response = this.renderResponse();

    return (
      <div>
        <Form>
          <div className="bx--row row-padding">
            <TextArea
              id="SignedTx"
              className="bx--col-xs-6"
              labelText="Signed transaction"
              rows={10}
              value={this.state.signedTransaction}
              // tslint:disable-next-line:jsx-no-lambda
              onChange={(e: any) => decode(e.target.value)}
              invalid={!this.state.signedTransactionIsValid}
              invalidText="Signed transaction is invalid"
            />
          </div>
          <div className="bx--type-gamma">Decoded Transaction</div>
          <DecodedTransaction {...this.state} skeleton={false} />
          <div className="bx--type-gamma">Conditional Parameters</div>
          <div className="bx--row row-padding">
            <TextInput
              className="bx--col-xs-6"
              labelText="Conditional asset"
              value={this.state.conditionAsset}
              // tslint:disable-next-line:jsx-no-lambda
              onChange={(e: any) =>
                this.setState({ conditionAsset: e.target.value })
              }
            />
            <TextInput
              className="bx--col-xs-2"
              labelText="Asset name"
              value={conditionalAssetName}
              disabled={true}
            />
          </div>
          <div className="bx--row row-padding">
            <TextInput
              className="bx--col-xs-6"
              labelText="Conditional asset amount (transfer when balance >= condition) [transaction amount when empty]"
              value={conditionAssetAmount}
              // tslint:disable-next-line:jsx-no-lambda
              onChange={(e: any) =>
                this.setState({ conditionAssetAmount: e.target.value })
              }
            />
            
          </div>
          <div className="bx--row row-padding">
            <Button onClick={send}>Schedule</Button>
          </div>
        </Form>
        {response}
      </div>
    );
  }

  private renderResponse() {
    if (!this.state.sentinelResponse) {
      return <div />;
    } else if ((this.state.sentinelResponse as any).errors) {
      const error = this.state.sentinelResponse as IError;
      return <Tile>{error.errors.join('\n')}</Tile>;
    } else {
      const response = this.state.sentinelResponse as IScheduleAccessKey;
      const link = `/view/${response.id}/${response.key}`;
      return (
        <Tile>
          <Link to={link}>
            ${window.location.href}
            {link}
          </Link>
        </Tile>
      );
    }
  }

  private async decode(signedTransaction: string) {
    const scheduledTransaction = await SentinelAPI.decode(signedTransaction);
    if ((scheduledTransaction as any).errors) {
      this.setState({
        signedTransaction,
        signedTransactionIsValid: false
      });
    } else {
      const transaction = scheduledTransaction as IDecodedTransaction;
      this.setState({
        conditionAsset: transaction.signedAsset,
        conditionAssetAmount: transaction.signedAmount,
        conditionAssetDecimals: transaction.signedAssetDecimals,
        conditionAssetName: transaction.signedAssetName,
        signedAmount: transaction.signedAmount,
        signedAsset: transaction.signedAsset,
        signedAssetDecimals: transaction.signedAssetDecimals,
        signedAssetName: transaction.signedAssetName,
        signedRecipient: transaction.signedRecipient,
        signedSender: transaction.signedSender,
        signedTransaction,
        signedTransactionIsValid: true
      });
    }
  }

  private async send() {
    const dec = new BigNumber(10).pow(this.state.conditionAssetDecimals);
    const conditionAmount =
      this.state.conditionAssetAmount !== ''
        ? new BigNumber(this.state.conditionAssetAmount).mul(dec).toString()
        : this.state.signedAmount;

    const payload = {
      conditionAmount,
      conditionAsset: this.state.conditionAsset,
      signedTransaction: this.state.signedTransaction
    };

    const sentinelResponse = await SentinelAPI.schedule(payload);
    this.setState({ sentinelResponse });
  }
}

export default Schedule;
