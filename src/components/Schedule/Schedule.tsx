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

interface ISentinelProps {
  onChange: () => void;
}

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

class Schedule extends React.Component<ISentinelProps, ISentinelState> {
  constructor(props: ISentinelProps) {
    super(props);
    this.state = defaultState;
  }

  public render() {
    const send = this.send.bind(this);

    const response = this.renderResponse();

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
          <div className="bx--col-xs-6 main-section">
            <div className="grid-layout">
              <div className="grid-item span-1 grid-item-1">
                <input
                  tabIndex={-1}
                  data-tile-input={true}
                  id="tile-id"
                  className="bx--tile-input"
                  defaultValue="tile"
                  type="checkbox"
                  name="tiles"
                  title="tile"
                />
                <label
                  htmlFor="tile-id"
                  aria-label="tile"
                  className="bx--tile bx--tile--selectable"
                  data-tile="selectable"
                  tabIndex={0}
                >
                  <div className="bx--tile__checkmark">
                    <svg
                      focusable="false"
                      preserveAspectRatio="xMidYMid meet"
                      style={{ willChange: 'transform' }}
                      xmlns="http://www.w3.org/2000/svg"
                      width={16}
                      height={16}
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                    >
                      <path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zM7 11L4.3 8.3l.9-.8L7 9.3l4-3.9.9.8L7 11z" />
                      <path
                        d="M7 11L4.3 8.3l.9-.8L7 9.3l4-3.9.9.8L7 11z"
                        opacity={0}
                      />
                    </svg>
                  </div>
                  <div className="bx--tile-content">
                    <div className="asset-center">
                      <embed
                        type="image/svg+xml"
                        src={'./assets/eth.svg'}
                        height={120}
                      />
                      <p className="icon-label">Ethereum</p>
                    </div>
                  </div>
                </label>
              </div>
              <div className="grid-item span-1 grid-item-2">
                <input
                  tabIndex={-1}
                  data-tile-input={true}
                  id="tile-id"
                  className="bx--tile-input"
                  defaultValue="tile"
                  type="checkbox"
                  name="tiles"
                  title="tile"
                />
                <label
                  htmlFor="tile-id"
                  aria-label="tile"
                  className="bx--tile bx--tile--selectable"
                  data-tile="selectable"
                  tabIndex={0}
                >
                  <div className="bx--tile__checkmark">
                    <svg
                      focusable="false"
                      preserveAspectRatio="xMidYMid meet"
                      style={{ willChange: 'transform' }}
                      xmlns="http://www.w3.org/2000/svg"
                      width={16}
                      height={16}
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                    >
                      <path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zM7 11L4.3 8.3l.9-.8L7 9.3l4-3.9.9.8L7 11z" />
                      <path
                        d="M7 11L4.3 8.3l.9-.8L7 9.3l4-3.9.9.8L7 11z"
                        opacity={0}
                      />
                    </svg>
                  </div>
                  <div className="bx--tile-content">
                    <div className="asset-center">
                      <embed
                        type="image/svg+xml"
                        src={'./assets/dot.svg'}
                        height={120}
                      />
                      <p className="icon-label">Polkadot</p>
                    </div>
                  </div>
                </label>
              </div>
              <div className="grid-item span-2 grid-item-3">
                <input
                  tabIndex={-1}
                  data-tile-input={true}
                  id="tile-id"
                  className="bx--tile-input"
                  defaultValue="tile"
                  type="checkbox"
                  name="tiles"
                  title="tile"
                />
                <label
                  htmlFor="tile-id"
                  aria-label="tile"
                  className="bx--tile bx--tile--selectable"
                  data-tile="selectable"
                  tabIndex={0}
                >
                  <div className="bx--tile__checkmark">
                    <svg
                      focusable="false"
                      preserveAspectRatio="xMidYMid meet"
                      style={{ willChange: 'transform' }}
                      xmlns="http://www.w3.org/2000/svg"
                      width={16}
                      height={16}
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                    >
                      <path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zM7 11L4.3 8.3l.9-.8L7 9.3l4-3.9.9.8L7 11z" />
                      <path
                        d="M7 11L4.3 8.3l.9-.8L7 9.3l4-3.9.9.8L7 11z"
                        opacity={0}
                      />
                    </svg>
                  </div>
                  <div className="bx--tile-content">
                    <div className="asset-left">
                      <embed
                        type="image/svg+xml"
                        src={'./assets/usdt.svg'}
                        height={45}
                      />
                      <p className="icon-label">Tether</p>
                    </div>
                  </div>
                </label>
              </div>
              <div className="grid-item span-2 grid-item-4">
                <input
                  tabIndex={-1}
                  data-tile-input={true}
                  id="tile-id"
                  className="bx--tile-input"
                  defaultValue="tile"
                  type="checkbox"
                  name="tiles"
                  title="tile"
                />
                <label
                  htmlFor="tile-id"
                  aria-label="tile"
                  className="bx--tile bx--tile--selectable"
                  data-tile="selectable"
                  tabIndex={0}
                >
                  <div className="bx--tile__checkmark">
                    <svg
                      focusable="false"
                      preserveAspectRatio="xMidYMid meet"
                      style={{ willChange: 'transform' }}
                      xmlns="http://www.w3.org/2000/svg"
                      width={16}
                      height={16}
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                    >
                      <path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zM7 11L4.3 8.3l.9-.8L7 9.3l4-3.9.9.8L7 11z" />
                      <path
                        d="M7 11L4.3 8.3l.9-.8L7 9.3l4-3.9.9.8L7 11z"
                        opacity={0}
                      />
                    </svg>
                  </div>
                  <div className="bx--tile-content">
                    <div className="asset-left">
                      <embed
                        type="image/svg+xml"
                        src={'./assets/usdc.svg'}
                        height={45}
                      />
                      <p className="icon-label">USD Coin</p>
                    </div>
                  </div>
                </label>
              </div>
              <div className="grid-item span-2 grid-item-5">
                <input
                  tabIndex={-1}
                  data-tile-input={true}
                  id="tile-id"
                  className="bx--tile-input"
                  defaultValue="tile"
                  type="checkbox"
                  name="tiles"
                  title="tile"
                />
                <label
                  htmlFor="tile-id"
                  aria-label="tile"
                  className="bx--tile bx--tile--selectable"
                  data-tile="selectable"
                  tabIndex={0}
                >
                  <div className="bx--tile__checkmark">
                    <svg
                      focusable="false"
                      preserveAspectRatio="xMidYMid meet"
                      style={{ willChange: 'transform' }}
                      xmlns="http://www.w3.org/2000/svg"
                      width={16}
                      height={16}
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                    >
                      <path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zM7 11L4.3 8.3l.9-.8L7 9.3l4-3.9.9.8L7 11z" />
                      <path
                        d="M7 11L4.3 8.3l.9-.8L7 9.3l4-3.9.9.8L7 11z"
                        opacity={0}
                      />
                    </svg>
                  </div>
                  <div className="bx--tile-content">
                    <div className="asset-left">
                      <embed
                        type="image/svg+xml"
                        src={'./assets/kitty.svg'}
                        height={45}
                      />
                      <p className="icon-label">Cryptokitties</p>
                    </div>
                  </div>
                </label>
              </div>
              <div className="grid-item span-2 grid-item-6">
                <input
                  tabIndex={-1}
                  data-tile-input={true}
                  id="tile-id"
                  className="bx--tile-input"
                  defaultValue="tile"
                  type="checkbox"
                  name="tiles"
                  title="tile"
                />
                <label
                  htmlFor="tile-id"
                  aria-label="tile"
                  className="bx--tile bx--tile--selectable"
                  data-tile="selectable"
                  tabIndex={0}
                >
                  <div className="bx--tile__checkmark">
                    <svg
                      focusable="false"
                      preserveAspectRatio="xMidYMid meet"
                      style={{ willChange: 'transform' }}
                      xmlns="http://www.w3.org/2000/svg"
                      width={16}
                      height={16}
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                    >
                      <path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zM7 11L4.3 8.3l.9-.8L7 9.3l4-3.9.9.8L7 11z" />
                      <path
                        d="M7 11L4.3 8.3l.9-.8L7 9.3l4-3.9.9.8L7 11z"
                        opacity={0}
                      />
                    </svg>
                  </div>
                  <div className="bx--tile-content">
                    <div className="asset-left">
                      <embed
                        type="image/png"
                        src={'./assets/axie.png'}
                        height={45}
                      />
                      <p className="icon-label">Axie Infinity</p>
                    </div>
                  </div>
                </label>
              </div>
              <div className="grid-item span-2 grid-item-7">
                <input
                  tabIndex={-1}
                  data-tile-input={true}
                  id="tile-id"
                  className="bx--tile-input"
                  defaultValue="tile"
                  type="checkbox"
                  name="tiles"
                  title="tile"
                />
                <label
                  htmlFor="tile-id"
                  aria-label="tile"
                  className="bx--tile bx--tile--selectable"
                  data-tile="selectable"
                  tabIndex={0}
                >
                  <div className="bx--tile__checkmark">
                    <svg
                      focusable="false"
                      preserveAspectRatio="xMidYMid meet"
                      style={{ willChange: 'transform' }}
                      xmlns="http://www.w3.org/2000/svg"
                      width={16}
                      height={16}
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                    >
                      <path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zM7 11L4.3 8.3l.9-.8L7 9.3l4-3.9.9.8L7 11z" />
                      <path
                        d="M7 11L4.3 8.3l.9-.8L7 9.3l4-3.9.9.8L7 11z"
                        opacity={0}
                      />
                    </svg>
                  </div>
                  <div className="bx--tile-content">
                    <div className="asset-left">
                      <embed
                        type="image/svg+xml"
                        src={'./assets/snx.svg'}
                        height={45}
                      />
                      <p className="icon-label">Synthetix</p>
                    </div>
                  </div>
                </label>
              </div>
              <div className="grid-item span-2 grid-item-8">
                <input
                  tabIndex={-1}
                  data-tile-input={true}
                  id="tile-id"
                  className="bx--tile-input"
                  defaultValue="tile"
                  type="checkbox"
                  name="tiles"
                  title="tile"
                />
                <label
                  htmlFor="tile-id"
                  aria-label="tile"
                  className="bx--tile bx--tile--selectable"
                  data-tile="selectable"
                  tabIndex={0}
                >
                  <div className="bx--tile__checkmark">
                    <svg
                      focusable="false"
                      preserveAspectRatio="xMidYMid meet"
                      style={{ willChange: 'transform' }}
                      xmlns="http://www.w3.org/2000/svg"
                      width={16}
                      height={16}
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                    >
                      <path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zM7 11L4.3 8.3l.9-.8L7 9.3l4-3.9.9.8L7 11z" />
                      <path
                        d="M7 11L4.3 8.3l.9-.8L7 9.3l4-3.9.9.8L7 11z"
                        opacity={0}
                      />
                    </svg>
                  </div>
                  <div className="bx--tile-content">
                    <div className="asset-left">
                      <embed
                        type="image/svg+xml"
                        src={'./assets/dai.svg'}
                        height={45}
                      />
                      <p className="icon-label">Multi-Collateral Dai</p>
                    </div>
                  </div>
                </label>
              </div>
              <div className="grid-item span-2 grid-item-9">
                <input
                  tabIndex={-1}
                  data-tile-input={true}
                  id="tile-id"
                  className="bx--tile-input"
                  defaultValue="tile"
                  type="checkbox"
                  name="tiles"
                  title="tile"
                />
                <label
                  htmlFor="tile-id"
                  aria-label="tile"
                  className="bx--tile bx--tile--selectable"
                  data-tile="selectable"
                  tabIndex={0}
                >
                  <div className="bx--tile__checkmark">
                    <svg
                      focusable="false"
                      preserveAspectRatio="xMidYMid meet"
                      style={{ willChange: 'transform' }}
                      xmlns="http://www.w3.org/2000/svg"
                      width={16}
                      height={16}
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                    >
                      <path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zM7 11L4.3 8.3l.9-.8L7 9.3l4-3.9.9.8L7 11z" />
                      <path
                        d="M7 11L4.3 8.3l.9-.8L7 9.3l4-3.9.9.8L7 11z"
                        opacity={0}
                      />
                    </svg>
                  </div>
                  <div className="bx--tile-content">
                    <div className="asset-left">
                      <embed
                        type="image/svg+xml"
                        src={'./assets/mana.svg'}
                        height={45}
                      />
                      <p className="icon-label">Decentraland</p>
                    </div>
                  </div>
                </label>
              </div>
              <div className="grid-item span-2 grid-item-10">
                <input
                  tabIndex={-1}
                  data-tile-input={true}
                  id="tile-id"
                  className="bx--tile-input"
                  defaultValue="tile"
                  type="checkbox"
                  name="tiles"
                  title="tile"
                />
                <label
                  htmlFor="tile-id"
                  aria-label="tile"
                  className="bx--tile bx--tile--selectable"
                  data-tile="selectable"
                  tabIndex={0}
                >
                  <div className="bx--tile__checkmark">
                    <svg
                      focusable="false"
                      preserveAspectRatio="xMidYMid meet"
                      style={{ willChange: 'transform' }}
                      xmlns="http://www.w3.org/2000/svg"
                      width={16}
                      height={16}
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                    >
                      <path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zM7 11L4.3 8.3l.9-.8L7 9.3l4-3.9.9.8L7 11z" />
                      <path
                        d="M7 11L4.3 8.3l.9-.8L7 9.3l4-3.9.9.8L7 11z"
                        opacity={0}
                      />
                    </svg>
                  </div>
                  <div className="bx--tile-content">
                    <div className="asset-left">
                      <embed
                        type="image/png"
                        src={'./assets/heroes.png'}
                        height={45}
                      />
                      <p className="icon-label">My Crypto Heroes</p>
                    </div>
                  </div>
                </label>
              </div>
              <div className="grid-item span-2 grid-item-11">
                <input
                  tabIndex={-1}
                  data-tile-input={true}
                  id="tile-id"
                  className="bx--tile-input"
                  defaultValue="tile"
                  type="checkbox"
                  name="tiles"
                  title="tile"
                />
                <label
                  htmlFor="tile-id"
                  aria-label="tile"
                  className="bx--tile bx--tile--selectable"
                  data-tile="selectable"
                  tabIndex={0}
                >
                  <div className="bx--tile__checkmark">
                    <svg
                      focusable="false"
                      preserveAspectRatio="xMidYMid meet"
                      style={{ willChange: 'transform' }}
                      xmlns="http://www.w3.org/2000/svg"
                      width={16}
                      height={16}
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                    >
                      <path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zM7 11L4.3 8.3l.9-.8L7 9.3l4-3.9.9.8L7 11z" />
                      <path
                        d="M7 11L4.3 8.3l.9-.8L7 9.3l4-3.9.9.8L7 11z"
                        opacity={0}
                      />
                    </svg>
                  </div>
                  <div className="bx--tile-content">
                    <div className="asset-left">
                      <embed
                        type="image/png"
                        src={'./assets/hot.png'}
                        height={45}
                      />
                      <p className="icon-label">Holochain</p>
                    </div>
                  </div>
                </label>
              </div>
              <div className="grid-item span-2 grid-item-12">
                <input
                  tabIndex={-1}
                  data-tile-input={true}
                  id="tile-id"
                  className="bx--tile-input"
                  defaultValue="tile"
                  type="checkbox"
                  name="tiles"
                  title="tile"
                />
                <label
                  htmlFor="tile-id"
                  aria-label="tile"
                  className="bx--tile bx--tile--selectable"
                  data-tile="selectable"
                  tabIndex={0}
                >
                  <div className="bx--tile__checkmark">
                    <svg
                      focusable="false"
                      preserveAspectRatio="xMidYMid meet"
                      style={{ willChange: 'transform' }}
                      xmlns="http://www.w3.org/2000/svg"
                      width={16}
                      height={16}
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                    >
                      <path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zM7 11L4.3 8.3l.9-.8L7 9.3l4-3.9.9.8L7 11z" />
                      <path
                        d="M7 11L4.3 8.3l.9-.8L7 9.3l4-3.9.9.8L7 11z"
                        opacity={0}
                      />
                    </svg>
                  </div>
                  <div className="bx--tile-content">
                    <div className="asset-left">
                      <embed
                        type="image/svg+xml"
                        src={'./assets/link.svg'}
                        height={45}
                      />
                      <p className="icon-label">Chainlink</p>
                    </div>
                  </div>
                </label>
              </div>
              <div className="grid-item span-2 grid-item-13">
                <input
                  tabIndex={-1}
                  data-tile-input={true}
                  id="tile-id"
                  className="bx--tile-input"
                  defaultValue="tile"
                  type="checkbox"
                  name="tiles"
                  title="tile"
                />
                <label
                  htmlFor="tile-id"
                  aria-label="tile"
                  className="bx--tile bx--tile--selectable"
                  data-tile="selectable"
                  tabIndex={0}
                >
                  <div className="bx--tile__checkmark">
                    <svg
                      focusable="false"
                      preserveAspectRatio="xMidYMid meet"
                      style={{ willChange: 'transform' }}
                      xmlns="http://www.w3.org/2000/svg"
                      width={16}
                      height={16}
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                    >
                      <path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zM7 11L4.3 8.3l.9-.8L7 9.3l4-3.9.9.8L7 11z" />
                      <path
                        d="M7 11L4.3 8.3l.9-.8L7 9.3l4-3.9.9.8L7 11z"
                        opacity={0}
                      />
                    </svg>
                  </div>
                  <div className="bx--tile-content">
                    <div className="asset-left">
                      <embed
                        type="image/png"
                        src={'./assets/gods.png'}
                        height={45}
                      />
                      <p className="icon-label">Gods Unchained</p>
                    </div>
                  </div>
                </label>
              </div>
              <div className="grid-item span-2 grid-item-14">
                <input
                  tabIndex={-1}
                  data-tile-input={true}
                  id="tile-id"
                  className="bx--tile-input"
                  defaultValue="tile"
                  type="checkbox"
                  name="tiles"
                  title="tile"
                />
                <label
                  htmlFor="tile-id"
                  aria-label="tile"
                  className="bx--tile bx--tile--selectable"
                  data-tile="selectable"
                  tabIndex={0}
                >
                  <div className="bx--tile__checkmark">
                    <svg
                      focusable="false"
                      preserveAspectRatio="xMidYMid meet"
                      style={{ willChange: 'transform' }}
                      xmlns="http://www.w3.org/2000/svg"
                      width={16}
                      height={16}
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                    >
                      <path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zM7 11L4.3 8.3l.9-.8L7 9.3l4-3.9.9.8L7 11z" />
                      <path
                        d="M7 11L4.3 8.3l.9-.8L7 9.3l4-3.9.9.8L7 11z"
                        opacity={0}
                      />
                    </svg>
                  </div>
                  <div className="bx--tile-content">
                    <div className="asset-left">
                      <embed
                        type="image/svg+xml"
                        src={'./assets/erc20.svg'}
                        height={45}
                      />
                      <p className="icon-label">Other ERC20 Tokens</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
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
                    href="https://www.myetherwallet.com/interface/send-offline"
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
                    href="https://www.youtube.com/watch?v=KBsY_iuOB-E"
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
            timeScheduling={this.state.timeScheduling}
            timeCondition={this.state.timeCondition}
            timeConditionTZ={this.state.timeConditionTZ}
          />
        )}
        <div className={`bx--col-xs-6 main-section`}>
          <div className="bx--row row-padding carbon--center">
            <Button onClick={send} disabled={this.scheduleButtonDisabled}>
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
        </div>
        {response}
        <div className="bx--row carbon--center">
          <div className="main-section footer">
            <ul>
              <li>
                <a
                  href="https://blog.chronologic.network/tagged/automate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bx--tooltip--definition"
                >
                  <button
                    className="bx--tooltip__trigger"
                    type="button"
                    aria-describedby="definition-tooltip"
                  >
                    What is Automate?
                  </button>
                  <div
                    id="definition-tooltip"
                    role="tooltip"
                    className="bx--tooltip--definition__bottom"
                  >
                    <span className="bx--tooltip__caret" />
                    <p>Conditional scheduling for Ethereum network</p>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="https://app.chronologic.network"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bx--tooltip--definition"
                >
                  <button
                    className="bx--tooltip__trigger"
                    type="button"
                    aria-describedby="definition-tooltip"
                  >
                    Chronos &amp; Other dApps
                  </button>
                  <div
                    id="definition-tooltip"
                    role="tooltip"
                    className="bx--tooltip--definition__bottom"
                  >
                    <span className="bx--tooltip__caret" />
                    <p>
                      Chronos, Run a Timenode &amp; our other scheduling dApps
                    </p>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="https://chronologic.zendesk.com/hc/en-us"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bx--tooltip--definition"
                >
                  <button
                    className="bx--tooltip__trigger"
                    type="button"
                    aria-describedby="definition-tooltip"
                  >
                    Support
                  </button>
                  <div
                    id="definition-tooltip"
                    role="tooltip"
                    className="bx--tooltip--definition__bottom"
                  >
                    <span className="bx--tooltip__caret" />
                    <p>Contact ChronoLogic team by submitting a request</p>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="https://blog.chronologic.network"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bx--tooltip--definition"
                >
                  <button
                    className="bx--tooltip__trigger"
                    type="button"
                    aria-describedby="definition-tooltip"
                  >
                    Blog
                  </button>
                  <div
                    id="definition-tooltip"
                    role="tooltip"
                    className="bx--tooltip--definition__bottom"
                  >
                    <span className="bx--tooltip__caret" />
                    <p>Stay updated by subscribing to our Medium</p>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/ChronoLogicETH"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon-link"
                >
                  <svg viewBox="0 0 512 512" width="32px">
                    <path d="M419.6 168.6c-11.7 5.2-24.2 8.7-37.4 10.2 13.4-8.1 23.8-20.8 28.6-36 -12.6 7.5-26.5 12.9-41.3 15.8 -11.9-12.6-28.8-20.6-47.5-20.6 -42 0-72.9 39.2-63.4 79.9 -54.1-2.7-102.1-28.6-134.2-68 -17 29.2-8.8 67.5 20.1 86.9 -10.7-0.3-20.7-3.3-29.5-8.1 -0.7 30.2 20.9 58.4 52.2 64.6 -9.2 2.5-19.2 3.1-29.4 1.1 8.3 25.9 32.3 44.7 60.8 45.2 -27.4 21.4-61.8 31-96.4 27 28.8 18.5 63 29.2 99.8 29.2 120.8 0 189.1-102.1 185-193.6C399.9 193.1 410.9 181.7 419.6 168.6z" />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/chronologicnetwork"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon-link"
                >
                  <svg viewBox="0 0 32 32" width="27px">
                    <path d="M 26.070313 3.996094 C 25.734375 4.011719 25.417969 4.109375 25.136719 4.21875 L 25.132813 4.21875 C 24.847656 4.332031 23.492188 4.902344 21.433594 5.765625 C 19.375 6.632813 16.703125 7.757813 14.050781 8.875 C 8.753906 11.105469 3.546875 13.300781 3.546875 13.300781 L 3.609375 13.277344 C 3.609375 13.277344 3.25 13.394531 2.875 13.652344 C 2.683594 13.777344 2.472656 13.949219 2.289063 14.21875 C 2.105469 14.488281 1.957031 14.902344 2.011719 15.328125 C 2.101563 16.050781 2.570313 16.484375 2.90625 16.722656 C 3.246094 16.964844 3.570313 17.078125 3.570313 17.078125 L 3.578125 17.078125 L 8.460938 18.722656 C 8.679688 19.425781 9.949219 23.597656 10.253906 24.558594 C 10.433594 25.132813 10.609375 25.492188 10.828125 25.765625 C 10.933594 25.90625 11.058594 26.023438 11.207031 26.117188 C 11.265625 26.152344 11.328125 26.179688 11.390625 26.203125 C 11.410156 26.214844 11.429688 26.21875 11.453125 26.222656 L 11.402344 26.210938 C 11.417969 26.214844 11.429688 26.226563 11.441406 26.230469 C 11.480469 26.242188 11.507813 26.246094 11.558594 26.253906 C 12.332031 26.488281 12.953125 26.007813 12.953125 26.007813 L 12.988281 25.980469 L 15.871094 23.355469 L 20.703125 27.0625 L 20.8125 27.109375 C 21.820313 27.550781 22.839844 27.304688 23.378906 26.871094 C 23.921875 26.433594 24.132813 25.875 24.132813 25.875 L 24.167969 25.785156 L 27.902344 6.65625 C 28.007813 6.183594 28.035156 5.742188 27.917969 5.3125 C 27.800781 4.882813 27.5 4.480469 27.136719 4.265625 C 26.769531 4.046875 26.40625 3.980469 26.070313 3.996094 Z M 25.96875 6.046875 C 25.964844 6.109375 25.976563 6.101563 25.949219 6.222656 L 25.949219 6.234375 L 22.25 25.164063 C 22.234375 25.191406 22.207031 25.25 22.132813 25.308594 C 22.054688 25.371094 21.992188 25.410156 21.667969 25.28125 L 15.757813 20.75 L 12.1875 24.003906 L 12.9375 19.214844 C 12.9375 19.214844 22.195313 10.585938 22.59375 10.214844 C 22.992188 9.84375 22.859375 9.765625 22.859375 9.765625 C 22.886719 9.3125 22.257813 9.632813 22.257813 9.632813 L 10.082031 17.175781 L 10.078125 17.15625 L 4.242188 15.191406 L 4.242188 15.1875 C 4.238281 15.1875 4.230469 15.183594 4.226563 15.183594 C 4.230469 15.183594 4.257813 15.171875 4.257813 15.171875 L 4.289063 15.15625 L 4.320313 15.144531 C 4.320313 15.144531 9.53125 12.949219 14.828125 10.71875 C 17.480469 9.601563 20.152344 8.476563 22.207031 7.609375 C 24.261719 6.746094 25.78125 6.113281 25.867188 6.078125 C 25.949219 6.046875 25.910156 6.046875 25.96875 6.046875 Z " />
                  </svg>
                </a>
              </li>
            </ul>
            ChronoLogic {new Date().getFullYear()}
          </div>
        </div>
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
      const emptyTransaction: IDecodedTransaction = {
        senderNonce: defaultState.senderNonce,
        signedAsset: defaultState.signedAsset,
        signedChain: defaultState.signedChain,
        signedNonce: defaultState.signedNonce,
        signedRecipient: defaultState.signedRecipient,
        signedSender: defaultState.signedSender
      };

      this.setState({
        ...emptyTransaction,
        conditionalAsset: {
          ...emptyTransaction.signedAsset
        },
        loadingSignedTransaction: false,
        signedTransaction,
        signedTransactionIsValid: false,
        timeCondition: defaultState.timeCondition,
        timeScheduling: defaultState.timeScheduling
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
        signedTransactionIsValid: true,
        timeCondition: defaultState.timeCondition,
        timeScheduling: defaultState.timeScheduling
      });
    }
  }

  private get conditionalAsset() {
    return this.state.conditionalAsset &&
      this.state.conditionalAsset.amount !== ''
      ? this.state.conditionalAsset
      : this.state.signedAsset;
  }

  private get scheduleButtonDisabled() {
    const success =
      this.state.sentinelResponse &&
      (this.state.sentinelResponse as IScheduleAccessKey).id;

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
    this.props.onChange();
  }
}

export default Schedule;
