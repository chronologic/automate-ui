import {
  Button,
  Form,
  TextArea,
  TextInput,
  Tile
} from 'carbon-components-react';
import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  IDecodedTransaction,
  IError,
  IScheduleAccessKey,
  SentinelAPI
} from 'src/api/SentinelAPI';
import { TokenAPI } from 'src/api/TokenAPI';

import Asset from '../Asset/Asset';
import DecodedTransaction from '../DecodedTransaction/DecodedTransaction';

interface ISentinelState extends IDecodedTransaction {
  conditionAssetAmount: string;
  conditionAsset: string;
  conditionAssetDecimals: number;
  conditionAssetName: string;
  conditionAssetValidationError: string;
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
      conditionAssetDecimals: 18,
      conditionAssetName: '',
      conditionAssetValidationError: '',
      sentinelResponse: undefined,
      signedAmount: '',
      signedAsset: '',
      signedAssetDecimals: 0,
      signedAssetName: '',
      signedChainId: 0,
      signedETHAmount: '',
      signedRecipient: '',
      signedSender: '',
      signedTransaction: '',
      signedTransactionIsValid: true
    };
  }

  public render() {
    const send = this.send.bind(this);
    const decode = this.decode.bind(this);
    const parseConditionalAssetAmount = this.parseConditionalAssetAmount.bind(
      this
    );
    let conditionAssetAmount = '';
    if (this.state.conditionAssetAmount !== '') {
      conditionAssetAmount = TokenAPI.withDecimals(
        this.state.conditionAssetAmount,
        this.state.conditionAssetDecimals
      ).toString();
    }

    const emitConditional = (args: any) => {
      const { address, decimals } = args;
      this.setState({
        conditionAsset: address,
        conditionAssetDecimals: decimals
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
            chainId={this.state.signedChainId}
            disabled={this.state.signedTransaction === ''}
            emit={emitConditional}
            name={this.state.signedAssetName}
          />
          <div className="bx--row row-padding">
            <div className="bx--col-xs-6">
              <TextInput
                id="ConditionalAssetAmount"
                labelText="Conditional asset amount (transfer when balance >= condition) [transaction amount when empty]"
                value={conditionAssetAmount}
                // tslint:disable-next-line:jsx-no-lambda
                onChange={(e: any) =>
                  parseConditionalAssetAmount(e.target.value)
                }
                disabled={
                  this.state.signedTransaction === '' ||
                  this.state.conditionAssetValidationError !== ''
                }
              />
            </div>
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
            You have successfully scheduled transaction ! <br/>
            <br/>
            Please save this link: <br/>
            <Link to={link}>
              {window.location.href}
              {link}
            </Link>
        </Tile>
      );
    }
  }

  private async parseConditionalAssetAmount(amount: string) {
    try {
      // tslint:disable-next-line:no-debugger
      debugger;
      const parsed = TokenAPI.withoutDecimals(
        amount,
        this.state.conditionAssetDecimals
      );

      if (parsed.gte(0)) {
        this.setState({ conditionAssetAmount: parsed.toString() });
      }
      // tslint:disable-next-line:no-empty
    } catch (e) {}
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
        : this.state.signedAmount || this.state.signedETHAmount;

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
