import { shortAddress } from '../../utils';
import { ChainId, BlockExplorerUrl } from '../../constants';
interface IProps {
  hash: string;
  chainId: number;
  type: 'address' | 'tx';
  children?: React.ReactNode;
}

function BlockExplorerLink({ hash, chainId, type, children }: IProps) {
  const networkName: string = ChainId[chainId];
  const networkUrl: string = BlockExplorerUrl[networkName as keyof typeof BlockExplorerUrl];
  return (
    <a href={`${networkUrl}${type}/${hash}`} title={hash} target="_blank" rel="noopener noreferrer">
      {children ? children : shortAddress(hash, 4)}
    </a>
  );
}

export default BlockExplorerLink;
