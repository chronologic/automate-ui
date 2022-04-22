import { useCallback, useContext } from 'react';

import { AutomateConnectionContext } from '../contexts';

export function useAutomateConnection() {
  const { connected, setConnected } = useContext(AutomateConnectionContext);

  const checkConnection = useCallback(async () => {
    const res = await isConnectedToAutomate((window as any).ethereum);

    setConnected(res);

    return res;
  }, [setConnected]);

  return { connected, checkConnection };
}

export async function isConnectedToAutomate(ethereum: any): Promise<string> {
  try {
    const res = await ethereum?.request({
      method: 'eth_call',
      params: [
        {
          from: '0x0000000000000000000000000000000000000000',
          // md5 hash of 'automate'
          to: '0x00000000e7fdc80c0728d856260f92fde10af019',
        },
      ],
    });
    if (res.client !== 'automate') {
      return 'notConnectedToAutomate';
    }
    const connectedNetowrk = res.params.network;
    return connectedNetowrk;
  } catch (e) {
    return 'none';
  }
}
