import { Button, TextArea, Tile } from 'carbon-components-react';
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

import ConditionSection from './ConditionSection';
import SummarySection from './SummarySection';

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

    const response = this.renderResponse();
    const success =
      this.state.sentinelResponse &&
      (this.state.sentinelResponse as IScheduleAccessKey).id;

    const conditionSectionActive = Boolean(this.state.signedTransaction && this.state.signedTransactionIsValid);

    return (
      <div>
        <div className="bx--row">
          <div className={`bx--col-xs-6 main-section${conditionSectionActive ? '' : ' main-section-blue'}`}>
            <TextArea
              id="SignedTx"
              labelText="EXECUTE"
              rows={5}
              value={this.state.signedTransaction}
              placeholder="Paste the signed transaction here"
              // tslint:disable-next-line:jsx-no-lambda
              onChange={(e: any) => decode(e.target.value)}
              invalid={!this.state.signedTransactionIsValid}
              invalidText="Signed transaction is invalid"
            />
          </div>
        </div>
        {true &&
        <>
          <ConditionSection
            active={conditionSectionActive}
            chainId={this.state.signedChain.chainId}
            conditionalAsset={this.conditionalAsset}
            signedAsset={this.state.signedAsset}
            signedSender={this.state.signedSender}
            onConditionalAssetChange={this.emitConditional}
            onTimeConditionChange={this.emitDateTime}
            onTimeConditionValidatorError={this.onTimeConditionValidatorError}
            setTimeScheduling={this.setTimeScheduling}
            timeScheduling={this.state.timeScheduling}
          />
          <SummarySection
            conditionalAsset={this.conditionalAsset}
            signedAsset={this.state.signedAsset}
            signedRecipient={this.state.signedRecipient}
            signedSender={this.state.signedSender}
          />
                  <div className="bx--row row-padding carbon--center">
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
            SCHEDULE
          </Button>
        </div>
        </>
        }
        {response}
      </div>
    );
  }

  private emitConditional = (conditionalAsset: IAsset) => {
    this.setState({
      conditionalAsset
    });
  };

  private emitDateTime = (timeCondition: number, tz: string) => {
    this.setState({ timeConditionIsValid: true, timeCondition, timeConditionTZ: tz });
  };

  private onTimeConditionValidatorError = (error: string) => {
    this.setState({ timeConditionIsValid: !error });
  };

  private setTimeScheduling = (checked : any) => {
    this.setState({ timeScheduling: checked })
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

  get conditionalAsset() {
    return this.state.conditionalAsset && this.state.conditionalAsset.amount !== ''
    ? this.state.conditionalAsset
    : this.state.signedAsset;
  }

  private async send() {
    const conditionalAsset = this.conditionalAsset;

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
