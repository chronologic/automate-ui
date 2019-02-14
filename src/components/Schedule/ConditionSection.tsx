import {
  Checkbox,
  ComposedModal,
  DropdownV2,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TextInput
} from 'carbon-components-react';
import * as React from 'react';
import { IAsset } from 'src/api/SentinelAPI';
import { ETH, TokenAPI } from 'src/api/TokenAPI';
import DateTimePicker from '../DateTimePicker/DateTimePicker';
import SelectiveDisplay from './SelectiveDisplay';

interface IConditionSectionProps {
  active: boolean;
  chainId: number;
  conditionalAsset: IAsset;
  signedAsset: IAsset;
  signedSender: string;
  timeScheduling: boolean;

  onConditionalAssetChange: (args: IAsset) => void;
  onTimeConditionChange: (timeCondition: number, tz: string) => void;
  onTimeConditionValidatorError: (error: string) => void;
  setTimeScheduling: (checked: any) => void;
}

interface IConditionAssetOption {
  address: string;
  label: string;
}

interface IConditionSectionState {
  customAssetAddressModalOpen: boolean;
  validationError: string;
}

export default class ConditionSection extends React.Component<
  IConditionSectionProps,
  IConditionSectionState
> {
  public constructor(props: IConditionSectionProps) {
    super(props);

    this.state = {
      customAssetAddressModalOpen: false,
      validationError: ''
    };
  }

  public render() {
    const {
      active,
      conditionalAsset,
      signedAsset,
      signedSender,
      onTimeConditionValidatorError,
      onTimeConditionChange,
      setTimeScheduling,
      timeScheduling
    } = this.props;

    const conditionAssetOptions: IConditionAssetOption[] = [
      {
        address: '',
        label: 'ETH'
      }
    ];

    if (signedAsset.name.toLowerCase() !== ETH.name.toLowerCase()) {
      conditionAssetOptions.push({
        address: signedAsset.address,
        label: signedAsset.name
      });
    }

    if (
      !conditionAssetOptions.find(
        asset => asset.address === conditionalAsset.address
      )
    ) {
      conditionAssetOptions.push({
        address: conditionalAsset.address,
        label: conditionalAsset.name
      });
    }

    const selectedConditionAsset = conditionAssetOptions.find(
      item => item && item.label === conditionalAsset.name
    );

    return (
      <>
        <div
          className={`bx--row  ${
            active ? 'main-section-blue ' : ''
          }schedule-condition`}
        >
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
                <DropdownV2
                  label=""
                  items={conditionAssetOptions}
                  light={true}
                  // tslint:disable-next-line
                  itemToString={(item: IConditionAssetOption) =>
                    item ? item.label : ''
                  }
                  onChange={this.onSelectedAssetChange}
                  selectedItem={selectedConditionAsset}
                />
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
                  labelText={
                    timeScheduling
                      ? `Execute transaction on`
                      : `Use Time Scheduling`
                  }
                  onChange={setTimeScheduling}
                />
                {timeScheduling && (
                  <DateTimePicker
                    onChange={onTimeConditionChange}
                    onValidationError={onTimeConditionValidatorError}
                    light={true}
                    disabled={false}
                  />
                )}
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
                    label: 'Unknown'
                  }
                });
              }}
              invalid={!!this.state.validationError}
              invalidText={this.state.validationError}
              open={true}
            />
          </ModalBody>
          <ModalFooter
            primaryButtonText="Done"
            primaryButtonDisabled={false}
            secondaryButtonText=""
            // tslint:disable-next-line:jsx-no-lambda
            onRequestClose={() =>
              this.setState({ customAssetAddressModalOpen: false })
            }
            // tslint:disable-next-line:jsx-no-lambda
            onRequestSubmit={() => {
              this.setState({ customAssetAddressModalOpen: false });
            }}
          />
        </ComposedModal>
      </>
    );
  }

  private onSelectedAssetChange = async ({
    selectedItem
  }: {
    selectedItem: IConditionAssetOption;
  }) => {
    if (selectedItem.label === 'ETH') {
      this.props.onConditionalAssetChange({
        ...this.props.conditionalAsset,
        address: '',
        ...ETH
      });

      this.setState({
        validationError: ''
      });
    } else {
      const {
        address,
        decimals,
        name,
        validationError
      } = await TokenAPI.resolveToken(selectedItem.address, this.props.chainId);

      this.setState({
        validationError
      });

      this.props.onConditionalAssetChange({
        ...this.props.conditionalAsset,
        address,
        decimals,
        name
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
      amount
    });
  };
}
