import { Tooltip } from 'carbon-components-react';
import { iconHelpSolid } from 'carbon-icons';
import * as moment from 'moment';
import * as React from 'react';

import { IAsset } from 'src/models';
import { toDataUrl } from '../../lib/blockies';
import SelectiveDisplay from './SelectiveDisplay';

interface ISummarySectionProps {
  chainId: number;
  conditionalAsset: IAsset;
  isNetworkSupported: boolean;
  networkName: string | undefined;
  senderNonce: number;
  signedAsset: IAsset;
  signedRecipient: string;
  signedSender: string;
  signedNonce: number;
  timeScheduling: boolean;
  timeCondition?: number;
  timeConditionTZ?: string;
}

export default class SummarySection extends React.Component<
  ISummarySectionProps
> {
  public render() {
    const {
      chainId,
      conditionalAsset,
      signedAsset,
      signedRecipient,
      signedSender,
      networkName,
      isNetworkSupported,
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
                balance of {conditionalAsset.name} is >={' '}
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
                {this.getNonceInfo()}
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

    if (!signedNonce || !senderNonce) {
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
        Transaction nonce: <b className="font-weight-600">{signedNonce}</b>
        {status}
      </>
    );
  }
}
