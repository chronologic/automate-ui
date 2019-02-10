import { Icon } from 'carbon-components-react';
import { iconUser } from 'carbon-icons';
import * as React from 'react';
import { IAsset } from 'src/api/SentinelAPI';
import HighlightedDisplay from './HighlightedDisplay';

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

    return (
      <div className="bx--row">
        <div className="bx--col-xs-6 main-section">
          <div className="bx--label">SUMMARY</div>
          <div className="schedule-summary">
            <div className="schedule-summary_party">
              <Icon icon={iconUser} width="32px" height="32px" fill="#9B9B9B" />
              <div className="schedule-summary_party_label">Sender</div>
              <div className="schedule-summary_party_address">
                <HighlightedDisplay
                  first={6}
                  last={4}
                  color="#2f4ffd"
                  text={signedSender}
                  fontWeight={600}
                />
              </div>
              <div className="schedule-summary_party_nonce">
                {senderNonce ? `Nonce: ${senderNonce}` : ''}
              </div>
            </div>
            <div className="schedule-summary_details">
              <div className="schedule-summary_details_amount">
                {signedAsset.amount} {signedAsset.name}
              </div>
              <div className="schedule-summary_details_network">
                {signedSender
                  ? `Network: ${chainId} (${networkName} - supported ${
                      isNetworkSupported ? '✔' : '✖'
                    })`
                  : ''}
              </div>
              <div className="schedule-summary_details_arrow" />
              <div className="schedule-summary_details_condition">
                when
                <br />
                SENDER balance of {conditionalAsset.name} is >={' '}
                {`${conditionalAsset.amount} ${conditionalAsset.name}`}
                <br />
                {this.getNonceInfo()}
              </div>
            </div>
            <div className="schedule-summary_party">
              <Icon icon={iconUser} width="32px" height="32px" fill="#9B9B9B" />
              <div className="schedule-summary_party_label">Receiver</div>
              <div className="schedule-summary_party_address">
                <HighlightedDisplay
                  first={6}
                  last={4}
                  color="#2f4ffd"
                  text={signedRecipient}
                  fontWeight={600}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private getNonceInfo(): string {
    const { signedNonce, senderNonce } = this.props;

    if (!signedNonce || !senderNonce) {
      return '';
    }

    let status = `✖ - nonce lower than account nonce`;

    if (signedNonce === senderNonce) {
      status = `✔`;
    } else if (signedNonce > senderNonce) {
      status = `! - There's a gap between nonces`;
    }

    return `Transaction nonce: ${signedNonce} (${status})`;
  }
}
