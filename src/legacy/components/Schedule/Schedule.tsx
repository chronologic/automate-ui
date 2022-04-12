import React from 'react';
import {
  Button,
  ComposedModal,
  InlineLoading,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TextArea,
  Tooltip,
} from 'carbon-components-react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import cn from 'classnames';
import { BigNumber } from 'ethers';

import { IScheduleAccessKey, IScheduleRequest, SentinelAPI } from '../../../api/SentinelAPI';
import { ETH, TokenAPI } from '../../../api/TokenAPI';
import { IAsset, IDecodedTransaction, IError, ISubmitParams, PolkadotChainId } from '../../../types';
import { AssetType } from '../../../types';
import AssetSelector from './AssetSelector';
import ConditionSection from './ConditionSection';
import Footer from './Footer';
import PaymentModal from './PaymentModal';
import SummarySection from './SummarySection';

const AnyButton: any = Button;

const SUPPORTED_NETWORKS = {
  [AssetType.Ethereum]: {
    1: 'Mainnet',
    3: 'Ropsten',
    4: 'Rinkeby',
    42: 'Kovan',
  },
  [AssetType.Polkadot]: {
    1: 'Polkadot',
    2: 'Edgeware Mainnet',
  },
};

interface ISentinelProps {
  onChange: () => void;
}

enum Step {
  Asset = 0,
  Transaction = 1,
  Condition = 2,
}

interface ISentinelState extends IDecodedTransaction {
  step: Step;
  conditionalAsset: IAsset;
  conditionalAssetIsValid: boolean;
  gasPriceAware: boolean;
  loadingSentinelResponse: boolean;
  loadingSignedTransaction: boolean;
  paymentModalOpen: boolean;
  selectedAsset: AssetType | null;
  selectedSymbol: string;
  selectedChainId?: PolkadotChainId;
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
    amount: '',
  },
  conditionalAssetIsValid: true,
  gasPriceAware: true,
  loadingSentinelResponse: false,
  loadingSignedTransaction: false,
  maxTxCost: BigNumber.from(0),
  paymentModalOpen: false,
  selectedAsset: null,
  selectedChainId: undefined,
  selectedSymbol: '',
  senderBalance: BigNumber.from(0),
  senderNonce: NaN,
  sentinelResponse: undefined,
  signedAsset: { address: '', decimals: 0, name: '', amount: '' },
  signedChain: { chainId: 0, chainName: '' },
  signedGasLimit: BigNumber.from(0),
  signedGasPrice: BigNumber.from(0),
  signedNonce: NaN,
  signedRecipient: '',
  signedSender: '',
  signedTransaction: '',
  signedTransactionIsValid: true,
  step: Step.Asset,
  timeConditionIsValid: false,
  timeScheduling: false,
};

const TxTooltip = ({ assetType }: { assetType: AssetType }) => {
  let toolLink = null;

  switch (assetType) {
    case AssetType.Ethereum: {
      toolLink = (
        <a
          href="https://www.myetherwallet.com/interface/send-offline"
          target="_blank"
          rel="noopener noreferrer"
          className={`bx--link`}
        >
          MyEtherWallet
        </a>
      );
      break;
    }
    case AssetType.Polkadot: {
      toolLink = (
        <a
          href="https://github.com/polkadot-js/tools/tree/master/packages/signer-cli"
          target="_blank"
          rel="noopener noreferrer"
          className={`bx--link`}
        >
          signer-cli
        </a>
      );
      break;
    }
  }

  if (!toolLink) {
    return null;
  }

  return (
    <Tooltip
      showIcon={true}
      triggerText={''}
      renderIcon={QuestionCircleOutlined as any}
      triggerClassName="schedule-execute-tooltip-trigger"
    >
      <p>
        Sign your transaction using {toolLink} now.
        <br />
        <br />
        Need help?
        <br />
        Please follow a step-by-step tutorial on how to sign Tx using MyEtherWallet for later use in Automate.
      </p>
      <div className="bx--tooltip__footer">
        <a
          href="https://www.youtube.com/watch?v=KBsY_iuOB-E"
          target="_blank"
          rel="noopener noreferrer"
          className={`bx--link`}
        >
          Watch Tutorial
        </a>
      </div>
    </Tooltip>
  );
};

class Schedule extends React.Component<ISentinelProps, ISentinelState> {
  constructor(props: ISentinelProps) {
    super(props);
    this.state = defaultState;

    this.send = this.send.bind(this);
    this.handleSelectAsset = this.handleSelectAsset.bind(this);
    this.handlePaymentModalOpen = this.handlePaymentModalOpen.bind(this);
    this.handlePaymentModalClose = this.handlePaymentModalClose.bind(this);
    this.reset = this.reset.bind(this);
  }

  public handleSelectAsset(selectedAsset: AssetType, selectedSymbol: string, selectedChainId?: PolkadotChainId): void {
    this.setState({
      selectedAsset,
      selectedChainId,
      selectedSymbol,
      step: Step.Transaction,
    });
  }

  public render() {
    const response = this.renderResponse();

    const {
      loadingSentinelResponse,
      paymentModalOpen,
      sentinelResponse,
      step,
      selectedAsset,
      selectedChainId,
      selectedSymbol,
    } = this.state;

    const conditionSectionActive = Boolean(this.state.signedTransaction && this.state.signedTransactionIsValid);

    return (
      <div>
        <AssetSelector
          active={step === Step.Asset}
          selectedSymbol={selectedSymbol}
          selectedChainId={selectedChainId}
          onClick={this.handleSelectAsset}
        />
        <div className={cn('bx--row', step === Step.Transaction ? ' main-section-blue' : '')}>
          <div className={`bx--col-xs-6 main-section`}>
            <div className="bx--label">
              EXECUTE <TxTooltip assetType={selectedAsset as AssetType} />
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
              readOnly={step !== Step.Transaction}
            />

            {this.state.loadingSignedTransaction && (
              <InlineLoading description="Loading data..." className="white-loading" />
            )}
          </div>
        </div>
        <ConditionSection
          selectedAsset={selectedAsset}
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
          gasPriceAware={this.state.gasPriceAware}
          setGasPriceAware={this.setGasPriceAware}
        />
        {this.state.signedSender && (
          <SummarySection
            baseAssetName={this.state.signedChain.baseAssetName!}
            chainId={this.state.signedChain.chainId}
            isNetworkSupported={this.isNetworkSupported(
              this.state.selectedAsset as AssetType,
              this.state.signedChain.chainId
            )}
            maxTxCost={this.state.maxTxCost}
            networkName={this.getNetworkName(this.state.selectedAsset as AssetType, this.state.signedChain.chainId)}
            conditionalAsset={this.state.conditionalAsset}
            senderBalance={this.state.senderBalance}
            senderNonce={this.state.senderNonce}
            signedAsset={this.state.signedAsset}
            signedGasLimit={this.state.signedGasLimit}
            signedGasPrice={this.state.signedGasPrice}
            signedNonce={this.state.signedNonce}
            signedRecipient={this.state.signedRecipient}
            signedSender={this.state.signedSender}
            timeScheduling={this.state.timeScheduling}
            timeCondition={this.state.timeCondition}
            timeConditionTZ={this.state.timeConditionTZ}
          />
        )}
        <div className={`bx--col-xs-6 main-section`}>
          <div className="bx--row row-padding carbon--center">
            <AnyButton onClick={this.handleScheduleClick} disabled={this.scheduleButtonDisabled}>
              {this.state.loadingSentinelResponse ? (
                <InlineLoading className="white-loading" description="Loading data..." />
              ) : (
                `SCHEDULE`
              )}
            </AnyButton>
          </div>
        </div>
        {response}
        <PaymentModal
          open={paymentModalOpen}
          loading={loadingSentinelResponse}
          sentinelResponse={sentinelResponse as IScheduleAccessKey}
          onDismiss={this.handlePaymentModalClose}
          onSubmit={this.send}
          onReset={this.reset}
        />
        <div className="bx--row carbon--center">
          <Footer />
        </div>
      </div>
    );
  }

  private isNetworkSupported(assetType: AssetType, networkId: number): boolean {
    return Boolean(this.getNetworkName(assetType, networkId));
  }

  private getNetworkName(assetType: AssetType, networkId: number): string | undefined {
    if (SUPPORTED_NETWORKS[assetType]) {
      return (SUPPORTED_NETWORKS[assetType] as any)[this.state.signedChain.chainId];
    }

    return;
  }

  private emitConditional = (conditionalAsset: IAsset) => {
    this.setState({
      conditionalAsset,
    });
  };

  private emitDateTime = (timeCondition: number, tz: string) => {
    this.setState({
      timeCondition,
      timeConditionIsValid: true,
      timeConditionTZ: tz,
    });
  };

  private onTimeConditionValidatorError = (error: string) => {
    this.setState({ timeConditionIsValid: !error });
  };

  private setTimeScheduling = (checked: any) => {
    this.setState({ timeScheduling: checked });
  };

  private setGasPriceAware = (checked: any) => {
    this.setState({ gasPriceAware: checked });
  };

  private handleScheduleClick = () => {
    this.handlePaymentModalOpen();
  };

  private handlePaymentModalOpen = () => {
    this.setState({ paymentModalOpen: true });
  };

  private handlePaymentModalClose = () => {
    this.setState({ paymentModalOpen: false });
  };

  private reset = () => {
    this.setState(defaultState);
  };

  private renderResponse() {
    let modalBody = <></>;
    const closeAndDoNothing = () => this.setState({ sentinelResponse: undefined });

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
    }

    const openModal = Boolean((this.state.sentinelResponse as any)?.errors);

    return (
      <ComposedModal open={openModal} onClose={closeAndDoNothing}>
        {modalBody}
      </ComposedModal>
    );
  }

  private async decode(signedTransaction: string) {
    const { selectedAsset, selectedChainId } = this.state;
    this.setState({
      loadingSignedTransaction: true,
    });
    const scheduledTransaction = await SentinelAPI.decode(
      signedTransaction,
      selectedAsset as AssetType,
      selectedChainId
    );

    if ((scheduledTransaction as any).errors) {
      const emptyTransaction: IDecodedTransaction = {
        maxTxCost: defaultState.maxTxCost,
        senderBalance: defaultState.senderBalance,
        senderNonce: defaultState.senderNonce,
        signedAsset: defaultState.signedAsset,
        signedChain: defaultState.signedChain,
        signedGasLimit: defaultState.signedGasLimit,
        signedGasPrice: defaultState.signedGasPrice,
        signedNonce: defaultState.signedNonce,
        signedRecipient: defaultState.signedRecipient,
        signedSender: defaultState.signedSender,
      };

      this.setState({
        ...emptyTransaction,
        conditionalAsset: {
          ...emptyTransaction.signedAsset,
        },
        loadingSignedTransaction: false,
        signedTransaction,
        signedTransactionIsValid: false,
        timeCondition: defaultState.timeCondition,
        timeScheduling: defaultState.timeScheduling,
      });
    } else {
      const transaction = scheduledTransaction as IDecodedTransaction;
      this.setState({
        ...transaction,
        conditionalAsset: {
          ...transaction.signedAsset,
        },
        loadingSignedTransaction: false,
        signedTransaction,
        signedTransactionIsValid: true,
        timeCondition: defaultState.timeCondition,
        timeScheduling: defaultState.timeScheduling,
      });
    }
  }

  private get conditionalAsset() {
    return this.state.conditionalAsset && this.state.conditionalAsset.amount !== ''
      ? this.state.conditionalAsset
      : this.state.signedAsset;
  }

  private get scheduleButtonDisabled() {
    const success = this.state.sentinelResponse && (this.state.sentinelResponse as IScheduleAccessKey).id;

    const nonceTooLow = this.state.signedNonce < this.state.senderNonce;

    return (
      this.state.loadingSentinelResponse ||
      !this.state.conditionalAssetIsValid ||
      !this.state.signedTransactionIsValid ||
      !this.state.signedTransaction ||
      (this.state.timeScheduling && !this.state.timeConditionIsValid) ||
      nonceTooLow ||
      success
    );
  }

  private async send({ email, refundAddress }: ISubmitParams) {
    this.setState({ loadingSentinelResponse: true });
    const conditionalAsset = this.conditionalAsset;

    const conditionAmount = TokenAPI.withoutDecimals(conditionalAsset.amount, conditionalAsset.decimals).toString();
    const { selectedChainId } = this.state;

    const timeCondition = this.state.timeCondition || 0;
    const timeConditionTZ = timeCondition ? this.state.timeConditionTZ! : '';

    const payload: IScheduleRequest = {
      assetType: this.state.selectedAsset as AssetType,
      chainId: selectedChainId,
      conditionAmount,
      conditionAsset: conditionalAsset.address,
      gasPriceAware: this.state.gasPriceAware,
      paymentEmail: email,
      paymentRefundAddress: refundAddress,
      signedTransaction: this.state.signedTransaction,
      timeCondition,
      timeConditionTZ,
    };

    const sentinelResponse = await SentinelAPI.schedule(payload);
    this.setState({ loadingSentinelResponse: false, sentinelResponse });
    this.props.onChange();
  }
}

export default Schedule;
