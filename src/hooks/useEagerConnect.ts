import { useState, useEffect } from 'react';
import { useWallet } from 'use-wallet';

import { useChainId } from './useChainId';

// https://github.com/aragon/use-wallet/issues/70#issuecomment-821257314
const useEagerConnect = () => {
  const { chainId } = useChainId();
  const wallet = useWallet();
  const { activate, active } = (wallet as any)._web3ReactContext;
  const injected = (wallet.connectors.injected as any).web3ReactConnector({ chainId });
  const [tried, setTried] = useState(false);

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized: boolean) => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          setTried(true);
        });
      } else {
        setTried(true);
      }
    });
    // intentionally only running on mount (make sure it's only mounted once :))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
};

export { useEagerConnect };
