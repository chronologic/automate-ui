import { Button, Form, TextArea, Tile } from 'carbon-components-react';
import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  IDecodedTransaction,
  IError,
  IScheduleAccessKey,
  SentinelAPI
} from 'src/api/SentinelAPI';

import Asset, { IAssetState } from '../Asset/AssetX';
import DecodedTransaction from '../DecodedTransaction/DecodedTransaction';

interface ISentinelState extends IDecodedTransaction {
  conditionAssetAmount: string;
  conditionAsset: string;
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
      sentinelResponse: undefined,
      signedAsset: {address: '', decimals: 0, name: '', amount: ''},
      signedChainId: 0,
      signedRecipient: '',
      signedSender: '',
      signedTransaction: '',
      signedTransactionIsValid: true
    };
  }

  public render() {
    const send = this.send.bind(this);
    const decode = this.decode.bind(this);

    const emitConditional = (args: IAssetState) => {
      this.setState({
        conditionAsset: args.address,
        conditionAssetAmount: args.amount
      });
    };

    const response = this.renderResponse();

    return (
      <div>
        <Form>
          <div className="bx--row row-padding">
            <div className="bx--col-xs-6">
              <TextArea
                id="SignedTx"
                labelText="Signed transaction"
                rows={7}
                value={this.state.signedTransaction}
                // tslint:disable-next-line:jsx-no-lambda
                onChange={(e: any) => decode(e.target.value)}
                invalid={!this.state.signedTransactionIsValid}
                invalidText="Signed transaction is invalid"
              />
            </div>
          </div>
          <div className="bx--row row-padding bx--type-gamma">
            Decoded Transaction
          </div>
          <DecodedTransaction {...this.state} skeleton={false} />
          <div className="bx--row row-padding bx--type-gamma">
            Conditional Parameters
          </div>
          <Asset
            label="Conditional asset"
            amountLabel="Conditional asset amount (transfer when balance >= condition) [transaction amount when empty]"
            chainId={this.state.signedChainId}
            disabled={this.state.signedTransaction === ''}
            onChange={emitConditional}
          />
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
          You have successfully scheduled transaction ! <br />
          <br />
          Please save this link: <br />
          <Link to={link}>
            {window.location.href}
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
        ...transaction,
        signedTransaction,
        signedTransactionIsValid: true
      });
    }
  }

  private async send() {
    const conditionAmount =
      this.state.conditionAssetAmount !== ''
        ? this.state.conditionAssetAmount
        : this.state.signedAsset.amount;

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
