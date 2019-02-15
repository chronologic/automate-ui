import {
  Button,
  ComposedModal,
  InlineLoading,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TextArea,
  Tooltip
} from 'carbon-components-react';
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
  loadingSentinelResponse: boolean;
  loadingSignedTransaction: boolean;
  sentinelResponse?: IScheduleAccessKey | IError;
  signedTransaction: string;
  signedTransactionIsValid: boolean;

  timeScheduling: boolean;
  timeCondition?: number;
  timeConditionIsValid: boolean;
  timeConditionTZ?: string;
}

const defaultState: ISentinelState = {
  conditionalAsset: {
    ...ETH,
    address: '',
    amount: ''
  },
  conditionalAssetIsValid: true,
  loadingSentinelResponse: false,
  loadingSignedTransaction: false,
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
        <div
          className={`bx--row${
            conditionSectionActive ? '' : ' main-section-blue'
          }`}
        >
          <div className={`bx--col-xs-6 main-section`}>
            <div className="bx--label">
              EXECUTE{' '}
              <Tooltip
                showIcon={true}
                triggerText={''}
                icon={iconHelpSolid}
                triggerClassName="schedule-execute-tooltip-trigger"
              >
                <p>
                  Sign your transaction using{' '}
                  <a
                    href="https://vintage.myetherwallet.com/#offline-transaction"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`bx--link`}
                  >
                    MyEtherWallet
                  </a>{' '}
                  now.
                  <br />
                  <br />
                  Need help?
                  <br />
                  Please follow a step-by-step tutorial on how to sign Tx using
                  MyEtherWallet for later use in Automate.
                </p>
                <div className={`bx--tooltip__footer`}>
                  <a
                    href="https://youtu.be/7qdF0LHeLTc"
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
              disabled={this.state.loadingSignedTransaction}
            />

            {this.state.loadingSignedTransaction && (
              <InlineLoading
                description="Loading data..."
                className="white-loading"
              />
            )}
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
              this.state.loadingSentinelResponse ||
              !this.state.conditionalAssetIsValid ||
              !this.state.signedTransactionIsValid ||
              !this.state.signedTransaction ||
              (this.state.timeScheduling && !this.state.timeConditionIsValid) ||
              success
            }
          >
            {this.state.loadingSentinelResponse ? (
              <InlineLoading
                className="white-loading"
                description="Loading data..."
              />
            ) : (
              `SCHEDULE`
            )}
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
    let modalBody = <></>;
    const reset = () => this.setState(defaultState);
    const closeAndDoNothing = () =>
      this.setState({ sentinelResponse: undefined });

    if (!this.state.sentinelResponse) {
      modalBody = <></>;
    } else if ((this.state.sentinelResponse as any).errors) {
      const error = this.state.sentinelResponse as IError;
      modalBody = (
        <>
          <ModalHeader title="Error" />
          <ModalBody>{error.errors.join('\n')}</ModalBody>
          <ModalFooter
            primaryButtonText="Close"
            primaryButtonDisabled={false}
            secondaryButtonText=""
            onRequestClose={closeAndDoNothing}
            onRequestSubmit={closeAndDoNothing}
          />
        </>
      );
    } else {
      const response = this.state.sentinelResponse as IScheduleAccessKey;
      const link = `/view/${response.id}/${response.key}`;
      modalBody = (
        <>
          <ModalHeader title="Success" />
          <ModalBody>
            You have successfully scheduled a transaction! <br />
            <br />
            Please save this link: <br />
            <Link to={link}>
              {window.location.href}
              {link}
            </Link>
            <br />
            <br />
          </ModalBody>
          <ModalFooter
            primaryButtonText="Schedule another one"
            primaryButtonDisabled={false}
            secondaryButtonText=""
            onRequestClose={reset}
            onRequestSubmit={reset}
          />
        </>
      );
    }

    return (
      <ComposedModal
        open={Boolean(this.state.sentinelResponse)}
        onClose={closeAndDoNothing}
      >
        {modalBody}
      </ComposedModal>
    );
  }

  private async decode(signedTransaction: string) {
    this.setState({
      loadingSignedTransaction: true
    });
    const scheduledTransaction = await SentinelAPI.decode(signedTransaction);
    if ((scheduledTransaction as any).errors) {
      this.setState({
        loadingSignedTransaction: false,
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
        loadingSignedTransaction: false,
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
    this.setState({ loadingSentinelResponse: true });
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
    this.setState({ loadingSentinelResponse: false, sentinelResponse });
  }
}

export default Schedule;
