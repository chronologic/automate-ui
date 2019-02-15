import * as React from 'react';
import { IAsset } from 'src/api/SentinelAPI';
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
      senderNonce
    } = this.props;

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
                <b className="schedule-summary_details_condition_highlighted-asset">{`${
                  conditionalAsset.amount
                } ${conditionalAsset.name}`}</b>
                <br />
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

    let status = `✖ - nonce lower than account nonce`;

    if (signedNonce === senderNonce) {
      status = `✔`;
    } else if (signedNonce > senderNonce) {
      status = `! - There's a gap between nonces`;
    }

    return (
      <>
        Transaction nonce: <b className="font-weight-600">{signedNonce}</b> (
        {status})
      </>
    );
  }
}
