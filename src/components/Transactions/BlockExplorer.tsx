import { ExportOutlined } from '@ant-design/icons';

import { shortAddress } from '../../utils';
import { ChainId, NetworkScanUrl, BlockchainExplorer } from '../../constants';
interface IProps {
  address: string;
  chars?: number;
  chainId: number;
  isCheckingTx: boolean;
  displayedText?: any;
}

function BlockExplorer({ address, chars, chainId, isCheckingTx, displayedText }: IProps) {
  let networkName: string = ChainId[chainId];
  var networkUrl: string = NetworkScanUrl[networkName as keyof typeof NetworkScanUrl];
  if (isCheckingTx) {
    networkUrl += 'tx/';
  } else {
    networkUrl += 'address/';
  }
  if (displayedText === 'ScanMenuItem') {
    displayedText = ' ' + BlockchainExplorer[networkName as keyof typeof NetworkScanUrl];
    return (
      <a href={`${networkUrl}${address}`} title={address} target="_blank" rel="noopener noreferrer">
        <ExportOutlined />
        {displayedText}
      </a>
    );
  }
  return (
    <a href={`${networkUrl}${address}`} title={address} target="_blank" rel="noopener noreferrer">
      {displayedText ? displayedText : shortAddress(address, chars)}
    </a>
  );
}

export default BlockExplorer;
