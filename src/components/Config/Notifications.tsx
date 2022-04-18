import { notification } from 'antd';

export const Notifications = (message: string, connected_network: string, desired_network: string) => {
  switch (message) {
    case 'success':
      return notification.success({ message: `You're connected to Automate ${connected_network} Network!` });
    case 'Metamasknotinstalled':
      return notification.error({
        message: (
          <span>
            Metamask is not installed. Metamask is required to connect Automate. Install the{' '}
            <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer">
              Metamask extension.
            </a>{' '}
            If you have installed refresh the page.
          </span>
        ),
      });
    case 'ConnectedWrongNetwork':
      return notification.error({
        message: (
          <span>
            You're connected to Automate <b> {connected_network.toUpperCase()} </b> Network, Please change it to
            Automate's <b>{desired_network.toUpperCase()} </b> Network for Automate to track your transactions.
          </span>
        ),
      });
    case 'NotConnectedtoAutomate':
      return notification.error({
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
  }
};
