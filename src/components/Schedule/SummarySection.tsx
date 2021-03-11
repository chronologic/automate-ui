import { Tooltip } from 'carbon-components-react';
import { iconHelpSolid } from 'carbon-icons';
import { BigNumber } from 'ethers/utils';
import * as moment from 'moment';
import * as React from 'react';

import { IAsset } from 'src/models';
import { bigNumberToString } from 'src/utils';
import { toDataUrl } from '../../lib/blockies';
import SelectiveDisplay from './SelectiveDisplay';

interface ISummarySectionProps {
  baseAssetName: string;
  chainId: number;
  conditionalAsset: IAsset;
  isNetworkSupported: boolean;
  networkName: string | undefined;
  senderBalance: BigNumber;
  senderNonce: number;
  signedAsset: IAsset;
  signedGasLimit: BigNumber;
  signedGasPrice: BigNumber;
  signedRecipient: string;
  signedSender: string;
  signedNonce: number;
  timeScheduling: boolean;
  timeCondition?: number;
  timeConditionTZ?: string;
  maxTxCost: BigNumber;
}

export default class SummarySection extends React.Component<
  ISummarySectionProps
> {
  public render() {
    const {
      baseAssetName,
      chainId,
      conditionalAsset,
      signedAsset,
      signedRecipient,
      signedSender,
      networkName,
      isNetworkSupported,
      senderBalance,
      senderNonce,
      timeScheduling,
      timeCondition,
      timeConditionTZ
    } = this.props;

    let formattedDate = '';

    if (timeCondition && timeConditionTZ) {
      formattedDate =
        moment.tz(timeCondition, timeConditionTZ).format('DD/MM/YYYY h:mma') +
        ' ' +
        timeConditionTZ;
    }

    const notSupportedNetwork = (
      <span className="bx--tag bx--tag--experimental">{`Network with id ${chainId} is not supported ✖`}</span>
    );
    const supportedNetwork = (
      <span className="bx--tag bx--tag--community">{`${networkName} ✔`}</span>
    );

    return (
      <div className="bx--row">
        <div className="bx--col-xs-6 main-section">
          <div className="bx--label">SUMMARY</div>
          <div className="schedule-summary">
            <div className="schedule-summary_party">
              {signedSender && (
                <img
                  src={toDataUrl(signedSender)}
                  className="schedule-summary_party_blockie"
                />
              )}
              <div className="schedule-summary_party_address">
                <SelectiveDisplay first={6} last={4} text={signedSender} />
              </div>
              <div className="schedule-summary_party_nonce">
                {senderNonce ? (
                  <>
                    Nonce: <b className="font-weight-600">{senderNonce}</b>
                  </>
                ) : (
                  ''
                )}
              </div>
              <div className="schedule-summary_party_balance">
                {senderBalance ? (
                  <>
                    Balance:{' '}
                    <b className="font-weight-600">
                      {bigNumberToString(senderBalance)} {baseAssetName}
                    </b>
                  </>
                ) : (
                  ''
                )}
              </div>
            </div>
            <div className="schedule-summary_details">
              <div className="schedule-summary_details_amount">
                {signedAsset.amount} {signedAsset.name}
              </div>
              <div className="schedule-summary_details_network">
                {signedSender
                  ? isNetworkSupported
                    ? supportedNetwork
                    : notSupportedNetwork
                  : ''}
              </div>
              <div className="schedule-summary_details_arrow" />
              <div className="schedule-summary_details_condition">
                when
                <br />
                <SelectiveDisplay first={6} last={4} text={signedSender} />{' '}
                balance of {conditionalAsset.name} is {'>= '}
                <b className="schedule-summary_details_condition_highlighted-asset">{`${conditionalAsset.amount} ${conditionalAsset.name}`}</b>
                <br />
                {timeScheduling && timeCondition && formattedDate && (
                  <>
                    and
                    <br />
                    Not before {`{${formattedDate}}`}
                    &nbsp;
                    <Tooltip
                      showIcon={true}
                      triggerText={''}
                      icon={iconHelpSolid}
                      triggerClassName="schedule-execute-tooltip-trigger"
                    >
                      {moment(timeCondition).format('DD/MM/YYYY h:mma')}{' '}
                      {moment.tz.guess()}
                    </Tooltip>
                    <br />
                  </>
                )}
                <div>{this.getNonceInfo()}</div>
                <div>{this.getTxCostInfo()}</div>
                <div>{this.getGasInfo()}</div>
              </div>
            </div>
            <div className="schedule-summary_party">
              {signedRecipient && (
                <img
                  src={toDataUrl(signedRecipient)}
                  className="schedule-summary_party_blockie"
                />
              )}
              <div className="schedule-summary_party_address">
                <SelectiveDisplay first={6} last={4} text={signedRecipient} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private getNonceInfo(): JSX.Element {
    const { signedNonce, senderNonce } = this.props;

    if (signedNonce == null || senderNonce == null) {
      return <></>;
    }

    let status = (
      <span className="bx--tag bx--tag--experimental">
        ✖ - nonce lower than account nonce
      </span>
    );

    if (signedNonce === senderNonce) {
      status = <span className="bx--tag bx--tag--community">✔</span>;
    } else if (signedNonce > senderNonce) {
      status = (
        <span className="bx--tag bx--tag--private">
          ! - There's a gap between nonces
        </span>
      );
    }

    return (
      <>
        Transaction nonce: <b className="font-weight-600">{signedNonce}</b>{' '}
        {status}
      </>
    );
  }

  private getTxCostInfo(): JSX.Element {
    const { baseAssetName, maxTxCost, senderBalance } = this.props;

    if (maxTxCost == null || senderBalance == null) {
      return <></>;
    }

    let status;

    if (maxTxCost.gt(senderBalance)) {
      status = (
        <span className="bx--tag bx--tag--private">
          ! - sender balance too low to cover tx cost
        </span>
      );
    } else {
      status = (
        <span className="bx--tag bx--tag--community">
          ✔ sender balance enough to cover tx cost
        </span>
      );
    }

    return (
      <>
        Max tx cost:{' '}
        <b className="font-weight-600">
          {bigNumberToString(maxTxCost)} {baseAssetName}
        </b>{' '}
        {status}
      </>
    );
  }

  private getGasInfo(): JSX.Element {
    const { baseAssetName, signedGasLimit, signedGasPrice } = this.props;

    if (baseAssetName !== 'ETH') {
      return <></>;
    }

    return (
      <>
        Gas price:{' '}
        <b className="font-weight-600">
          {bigNumberToString(signedGasPrice, 9, 0)} Gwei
        </b>{' '}
        Gas limit:{' '}
        <b className="font-weight-600">
          {bigNumberToString(signedGasLimit, 0, 0)}
        </b>{' '}
      </>
    );
  }
}
