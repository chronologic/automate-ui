import { notification } from 'antd';

import { capitalizeFirstLetter } from '../../utils';

export const notifications = Object.freeze({
  connectedToAutomate(connectedNetwork: string) {
    notification.success({
      message: `You're connected to Automate ${capitalizeFirstLetter(connectedNetwork)} Network!`,
    });
  },
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
  connectedWrongNetwork(connectedNetwork: string, desiredNetwork: string) {
    notification.error({
      message: (
        <span>
          You're connected to Automate <b> {capitalizeFirstLetter(connectedNetwork)} </b> Network, Please change it to
          Automate's <b>{capitalizeFirstLetter(desiredNetwork)} </b> Network for Automate to track your transactions.
        </span>
      ),
    });
  },
  NotConnectedtoAutomate() {
    notification.error({
      message: (
        <span>
          You're not connected to Automate. Make sure you followed the
          <br />
          <a
            href="https://blog.chronologic.network/how-to-use-automate-with-xfai-785065a4f306"
            target="_blank"
            rel="noopener noreferrer"
          >
            setup instructions
          </a>{' '}
          correctly.
        </span>
      ),
    });
  },
});