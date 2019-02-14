import { Button, TextArea, Tile, Tooltip } from 'carbon-components-react';
import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  IAsset,
  IDecodedTransaction,
  IError,
  IScheduleAccessKey,
  SentinelAPI
} from 'src/api/SentinelAPI';
import { ETH, TokenAPI } from 'src/api/TokenAPI';

import ConditionSection from './ConditionSection';
import SummarySection from './SummarySection';

import { iconHelpSolid } from 'carbon-icons';

const SUPPORTED_NETWORKS = {
  1: 'Mainnet',
  3: 'Ropsten',
  4: 'Rinkeby',
  42: 'Kovan'
};

interface ISentinelState extends IDecodedTransaction {
  conditionalAsset: IAsset;
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
  conditionalAsset: {
    ...ETH,
    address: '',
    amount: ''
  },
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
  constructor(props: {}) {
    super(props);
    this.state = defaultState;
  }

  public render() {
    const send = this.send.bind(this);

    const response = this.renderResponse();
    const success =
      this.state.sentinelResponse &&
      (this.state.sentinelResponse as IScheduleAccessKey).id;

    const conditionSectionActive = Boolean(
      this.state.signedTransaction && this.state.signedTransactionIsValid
    );

    return (
      <div>
        <div className="bx--row">
          <div
            className={`bx--col-xs-6 main-section${
              conditionSectionActive ? '' : ' main-section-blue'
            }`}
          >
            <div className="bx--label">
              EXECUTE{' '}
              <Tooltip
                showIcon={true}
                triggerText={''}
                icon={iconHelpSolid}
                triggerClassName="schedule-execute-tooltip-trigger"
              >
                <p>
                  Please follow a step-by-step tutorial on how to sign Tx using
                  MyEtherWallet for later use in Automate.
                </p>
                <div className={`bx--tooltip__footer`}>
                  <a
                    href="https://youtu.be/qsG2UdOL8j4"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`bx--link`}
                  >
                    Watch Tutorial
                  </a>
                </div>
              </Tooltip>
            </div>

            <TextArea
              id="SignedTx"
              labelText=""
              rows={5}
              value={this.state.signedTransaction}
              placeholder="Paste the signed transaction here"
              // tslint:disable-next-line:jsx-no-lambda
              onChange={(e: any) => this.decode(e.target.value.trim())}
              invalid={!this.state.signedTransactionIsValid}
              invalidText="Signed transaction is invalid"
            />
          </div>
        </div>
        <ConditionSection
          active={conditionSectionActive}
          chainId={this.state.signedChain.chainId}
          conditionalAsset={this.state.conditionalAsset}
          signedAsset={this.state.signedAsset}
          signedSender={this.state.signedSender}
          onConditionalAssetChange={this.emitConditional}
          onTimeConditionChange={this.emitDateTime}
          onTimeConditionValidatorError={this.onTimeConditionValidatorError}
          setTimeScheduling={this.setTimeScheduling}
          timeScheduling={this.state.timeScheduling}
        />
        {this.state.signedSender && (
          <SummarySection
            chainId={this.state.signedChain.chainId}
            isNetworkSupported={this.isNetworkSupported(
              this.state.signedChain.chainId
            )}
            networkName={this.getNetworkName(this.state.signedChain.chainId)}
            conditionalAsset={this.state.conditionalAsset}
            senderNonce={this.state.senderNonce}
            signedAsset={this.state.signedAsset}
            signedNonce={this.state.signedNonce}
            signedRecipient={this.state.signedRecipient}
            signedSender={this.state.signedSender}
          />
        )}
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
        {response}
      </div>
    );
  }

  private isNetworkSupported(networkId: number): boolean {
    return Boolean(this.getNetworkName(networkId));
  }

  private getNetworkName(networkId: number): string | undefined {
    return SUPPORTED_NETWORKS[this.state.signedChain.chainId];
  }

  private emitConditional = (conditionalAsset: IAsset) => {
    this.setState({
      conditionalAsset
    });
  };

  private emitDateTime = (timeCondition: number, tz: string) => {
    this.setState({
      timeCondition,
      timeConditionIsValid: true,
      timeConditionTZ: tz
    });
  };

  private onTimeConditionValidatorError = (error: string) => {
    this.setState({ timeConditionIsValid: !error });
  };

  private setTimeScheduling = (checked: any) => {
    this.setState({ timeScheduling: checked });
  };

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
        conditionalAsset: {
          ...transaction.signedAsset
        },
        signedTransaction,
        signedTransactionIsValid: true
      });
    }
  }

  get conditionalAsset() {
    return this.state.conditionalAsset &&
      this.state.conditionalAsset.amount !== ''
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
    const timeConditionTZ = timeCondition ? this.state.timeConditionTZ! : '';

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
