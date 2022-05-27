import { notification } from 'antd';

import { capitalizeFirstLetter } from '../utils';

export const notifications = Object.freeze({
  metamaskNotInstalled() {
    notification.error({
      message: (
        <span>
          <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer">
            Metamask extension
          </a>{' '}
          is required to connect Automate. Please install it and refresh the page.
        </span>
      ),
    });
  },
  connectedToAutomate(connectedNetwork: string) {
    notification.success({
      message: `You're connected to Automate ${capitalizeFirstLetter(connectedNetwork)} Network!`,
    });
  },
  connectedWrongNetwork(connectedNetwork: string, desiredNetwork: string) {
    notification.error({
      message: (
        <span>
          Metamask is connected to <b>{capitalizeFirstLetter(connectedNetwork)}</b> Network, please change it to
          Automate's <b>{capitalizeFirstLetter(desiredNetwork)}</b> Network.
        </span>
      ),
    });
  },
  notConnectedtoAutomate() {
    notification.error({
      message: (
        <span>
          You're not connected to Automate. Make sure to select Automate Network in MetaMask's network dropdown or
          follow the
          <br />
          <a
            href="https://blog.chronologic.network/how-to-sign-up-to-automate-and-claim-your-magic-rewards-cf67fca1ddb3"
            target="_blank"
            rel="noopener noreferrer"
          >
            setup instructions
          </a>{' '}
          to add the network.
        </span>
      ),
      duration: 5,
    });
  },
  apiKeyMismatch() {
    notification.error({
      message: <span>API key mismatch. Make sure your Metamask network RPC URL matches your logged in user.</span>,
    });
  },
});
