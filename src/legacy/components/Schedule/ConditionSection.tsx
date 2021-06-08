import {
  Checkbox,
  ComposedModal,
  Dropdown,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TextInput,
  Tooltip,
} from 'carbon-components-react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import React from 'react';

import { DOT } from '../../../api/PolkadotAPI';
import { ETH, TokenAPI } from '../../../api/TokenAPI';
import { IAsset } from '../../../types';
import { AssetType } from '../../../types';
import DateTimePicker from '../DateTimePicker/DateTimePicker';
import SelectiveDisplay from './SelectiveDisplay';

interface IConditionSectionProps {
  active: boolean;
  chainId: number;
  conditionalAsset: IAsset;
  selectedAsset: AssetType | null;
  signedAsset: IAsset;
  signedSender: string;
  timeScheduling: boolean;
  gasPriceAware: boolean;

  onConditionalAssetChange: (args: IAsset) => void;
  onTimeConditionChange: (timeCondition: number, tz: string) => void;
  onTimeConditionValidatorError: (error: string) => void;
  setTimeScheduling: (checked: any) => void;
  setGasPriceAware: (checked: any) => void;
}

interface IConditionAssetOption {
  address: string;
  label: string;
}

interface IConditionSectionState {
  customAssetAddressModalOpen: boolean;
  validationError: string;
}

export default class ConditionSection extends React.Component<IConditionSectionProps, IConditionSectionState> {
  public constructor(props: IConditionSectionProps) {
    super(props);

    this.state = {
      customAssetAddressModalOpen: false,
      validationError: '',
    };
  }

  public render() {
    const {
      active,
      conditionalAsset,
      gasPriceAware,
      signedAsset,
      signedSender,
      onTimeConditionValidatorError,
      onTimeConditionChange,
      selectedAsset,
      setGasPriceAware,
      setTimeScheduling,
      timeScheduling,
    } = this.props;

    const isEthereum = selectedAsset === AssetType.Ethereum;
    let defaultAssetName = 'ETH';
    if (selectedAsset === AssetType.Polkadot) {
      defaultAssetName = DOT.name;
    }

    const conditionAssetOptions: IConditionAssetOption[] = [
      {
        address: '',
        label: defaultAssetName,
      },
    ];

    if (signedAsset.name.toLowerCase() !== ETH.name.toLowerCase()) {
      conditionAssetOptions.push({
        address: signedAsset.address,
        label: signedAsset.name,
      });
    }

    if (!conditionAssetOptions.find((asset) => asset.address === conditionalAsset.address)) {
      conditionAssetOptions.push({
        address: conditionalAsset.address,
        label: conditionalAsset.name,
      });
    }

    const selectedConditionAsset = conditionAssetOptions.find((item) => item && item.label === conditionalAsset.name);

    return (
      <>
        <div className={`bx--row  ${active ? 'main-section-blue ' : ''}schedule-condition`}>
          <div className={`bx--col-xs-6 main-section`}>
            <div className="bx--label">WHEN</div>
            <div className="schedule-condition_content">
              <div className="schedule-condition_content_sender">
                Sender{' '}
                <span className="schedule-condition_content_sender_address">
                  <SelectiveDisplay first={6} last={4} text={signedSender} />
                </span>
              </div>
              <div>balance of</div>
              <div className="schedule-condition_content_asset">
                {isEthereum ? (
                  <Dropdown
                    id="conditionAsset"
                    titleText="Asset"
                    label=""
                    items={conditionAssetOptions}
                    light={true}
                    // tslint:disable-next-line
                    itemToString={(item: IConditionAssetOption) => (item ? item.label : '')}
                    onChange={this.onSelectedAssetChange}
                    selectedItem={selectedConditionAsset}
                  />
                ) : (
                  selectedConditionAsset?.label
                )}
                {isEthereum && (
                  <div
                    className="schedule-condition_content_asset_custom"
                    // tslint:disable-next-line
                    onClick={() => {
                      if (active) {
                        this.setState({ customAssetAddressModalOpen: true });
                      }
                    }}
                  >
                    + Custom
                  </div>
                )}
              </div>
              <div>is greater or equal to</div>
              <div className="schedule-condition_content_asset-amount">
                <TextInput
                  id="condition-section-asset-amount-input"
                  value={conditionalAsset.amount}
                  onChange={this.onAmountChange}
                  labelText=""
                  light={true}
                />
              </div>
            </div>
            <div className="bx--row row-padding bx--type-gamma">
              <div className="bx--col-xs-12 timescheduling-wrapper">
                <Checkbox
                  id="timeScheduling"
                  labelText={timeScheduling ? `Execute transaction on` : `Use Time Scheduling`}
                  onChange={setTimeScheduling}
                  checked={timeScheduling}
                />
                {timeScheduling && (
                  <DateTimePicker
                    onChange={onTimeConditionChange}
                    onValidationError={onTimeConditionValidatorError}
                    light={true}
                    disabled={false}
                  />
                )}
                <div
                  className="bx--col-xs-12 timescheduling-wrapper"
                  style={{ visibility: isEthereum ? 'visible' : 'hidden' }}
                >
                  <Checkbox
                    id="gasPriceAware"
                    labelText="Delay execution until gas price is low enough"
                    onChange={setGasPriceAware}
                    checked={gasPriceAware}
                  />
                  <Tooltip
                    showIcon={true}
                    triggerText={''}
                    renderIcon={QuestionCircleOutlined as any}
                    triggerClassName="schedule-execute-tooltip-trigger"
                  >
                    Your transaction might get stuck or get rejected if network gas prices are too high at the time of
                    execution.
                    <br />
                    This will make Automate wait for gas prices to go down before executing the transaction, even if you
                    defined a balance and/or time condition.
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ComposedModal
          open={this.state.customAssetAddressModalOpen}
          // tslint:disable-next-line:jsx-no-lambda
          onClose={() => this.setState({ customAssetAddressModalOpen: false })}
        >
          <ModalHeader title="Add custom asset to watch" />
          <ModalBody>
            <TextInput
              id="Address"
              labelText={'Condition asset address'}
              helperText={'ERC20 token address'}
              value={conditionalAsset.address}
              // tslint:disable-next-line:jsx-no-lambda
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                const target = e.target as HTMLInputElement;

                this.onSelectedAssetChange({
                  selectedItem: {
                    address: target.value,
                    label: 'Unknown',
                  },
                });
              }}
              invalid={!!this.state.validationError}
              invalidText={this.state.validationError}
            />
          </ModalBody>
          <ModalFooter
            primaryButtonText="Done"
            primaryButtonDisabled={false}
            secondaryButtonText=""
            // tslint:disable-next-line:jsx-no-lambda
            onRequestClose={() => this.setState({ customAssetAddressModalOpen: false })}
            // tslint:disable-next-line:jsx-no-lambda
            onRequestSubmit={() => {
              this.setState({ customAssetAddressModalOpen: false });
            }}
          />
        </ComposedModal>
      </>
    );
  }

  private onSelectedAssetChange = async ({ selectedItem }: { selectedItem: IConditionAssetOption }) => {
    if (selectedItem.label === 'ETH') {
      this.props.onConditionalAssetChange({
        ...this.props.conditionalAsset,
        address: '',
        ...ETH,
      });

      this.setState({
        validationError: '',
      });
    } else {
      const { address, decimals, name, validationError } = await TokenAPI.resolveToken(
        selectedItem.address,
        this.props.chainId
      );

      this.setState({
        validationError,
      });

      this.props.onConditionalAssetChange({
        ...this.props.conditionalAsset,
        address,
        decimals,
        name,
      });
    }
  };

  private onAmountChange = (event: React.FormEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const newAmount = target.value;

    const parsed = Number.parseFloat(newAmount);
    let amount = '';
    if (!Number.isNaN(parsed)) {
      amount = parsed.toString();

      if (newAmount[newAmount.length - 1] === '.') {
        amount += '.';
      }
    }

    this.props.onConditionalAssetChange({
      ...this.props.conditionalAsset,
      amount,
    });
  };
}
