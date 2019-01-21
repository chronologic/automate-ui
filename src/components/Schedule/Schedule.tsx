import { Button, Checkbox, TextArea, Tile } from 'carbon-components-react';
import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  IAsset,
  IDecodedTransaction,
  IError,
  IScheduleAccessKey,
  SentinelAPI
} from 'src/api/SentinelAPI';
import { TokenAPI } from 'src/api/TokenAPI';

import ConditionalAsset from '../Asset/ConditionalAsset';
import DateTimePicker from '../DateTimePicker/DateTimePicker';
import DecodedTransaction from '../DecodedTransaction/DecodedTransaction';
import SenderInformation from '../Sender/SenderInformation';

interface ISentinelState extends IDecodedTransaction {
  conditionalAsset?: IAsset;
  conditionalAssetIsValid: boolean;
  sentinelResponse?: IScheduleAccessKey | IError;
  signedTransaction: string;
  signedTransactionIsValid: boolean;

  timeScheduling: boolean;
  timeCondition?: number;
  timeConditionIsValid: boolean;
  timeConditionTZ?: string;
}

const defaultState = {
  conditionalAssetIsValid: true,
  senderNonce: NaN,
  sentinelResponse: undefined,
  signedAsset: { address: '', decimals: 0, name: '', amount: '' },
  signedChain: { chainId: 0, chainName: '' },
  signedNonce: NaN,
  signedRecipient: '',
  signedSender: '',
  signedTransaction: '',
  signedTransactionIsValid: true,
  timeConditionIsValid: false,
  timeScheduling: false
};

class Schedule extends React.Component<{}, ISentinelState> {
  constructor(props: any) {
    super(props);
    this.state = defaultState;
  }

  public render() {
    const send = this.send.bind(this);
    const decode = this.decode.bind(this);

    const emitConditional = (conditionalAsset: IAsset) => {
      this.setState({
        conditionalAsset
      });
    };

    const emitDateTime = (timeCondition: number, tz: string) => {
      this.setState({ timeConditionIsValid: true, timeCondition, timeConditionTZ: tz });
    };

    const onTimeConditionValidatorError = (error: string) => {
      this.setState({ timeConditionIsValid: !error });
    };

    const onValidationError = (error: string) => {
      this.setState({ conditionalAssetIsValid: !error });
    };

    const response = this.renderResponse();
    const success =
      this.state.sentinelResponse &&
      (this.state.sentinelResponse as IScheduleAccessKey).id;

    return (
      <div>
        <div className="bx--row row-padding">
          <div className="bx--col-xs-6">
            <TextArea
              id="SignedTx"
              labelText="Signed transaction"
              helperText="Standard Ethereum signed transaction. Please use https://www.myetherwallet.com/#offline-transaction to create and sign. Tutorial coming soon."
              rows={7}
              value={this.state.signedTransaction}
              // tslint:disable-next-line:jsx-no-lambda
              onChange={(e: any) => decode(e.target.value)}
              invalid={!this.state.signedTransactionIsValid}
              invalidText="Signed transaction is invalid"
            />
          </div>
        </div>
        <div className="bx--row row-padding bx--type-gamma">Sender</div>
        <SenderInformation {...this.state} skeleton={false} />
        <div className="bx--row row-padding bx--type-gamma">
          Decoded Transaction
        </div>
        <DecodedTransaction {...this.state} skeleton={false} />
        <div className="bx--row row-padding bx--type-gamma">
          Conditional Parameters
        </div>
        <ConditionalAsset
          chainId={this.state.signedChain.chainId}
          disabled={this.state.signedTransaction === ''}
          onChange={emitConditional}
          onValidationError={onValidationError}
        />
        <div className="bx--row row-padding bx--type-gamma">
          Time scheduling
        </div>
        <Checkbox
          id="timeScheduling"
          labelText="Execute transaction on"
          // tslint:disable-next-line:jsx-no-lambda
          onChange={(checked: any) =>
            this.setState({ timeScheduling: checked })
          }
        />
        <DateTimePicker
          onChange={emitDateTime}
          onValidationError={onTimeConditionValidatorError}
          disabled={!this.state.timeScheduling}
        />
        <div className="bx--row row-padding">
          <Button
            onClick={send}
            disabled={
              !this.state.conditionalAssetIsValid ||
              !this.state.signedTransactionIsValid ||
              !this.state.signedTransaction ||
              (this.state.timeScheduling && !this.state.timeConditionIsValid) ||
              success
            }
          >
            Schedule
          </Button>
        </div>
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
      const reset = () => this.setState(defaultState);
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
          <br />
          <br />
          <Button onClick={reset}>Schedule another one</Button>
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
    const conditionalAsset =
      this.state.conditionalAsset && this.state.conditionalAsset.amount !== ''
        ? this.state.conditionalAsset
        : this.state.signedAsset;

    const conditionAmount = TokenAPI.withoutDecimals(
      conditionalAsset.amount,
      conditionalAsset.decimals
    ).toString();

    const timeCondition = this.state.timeCondition || 0;
    const timeConditionTZ = timeCondition ? this.state.timeConditionTZ! : "";

    const payload = {
      conditionAmount,
      conditionAsset: conditionalAsset.address,
      signedTransaction: this.state.signedTransaction,
      timeCondition,
      timeConditionTZ
    };

    const sentinelResponse = await SentinelAPI.schedule(payload);
    this.setState({ sentinelResponse });
  }
}

export default Schedule;
