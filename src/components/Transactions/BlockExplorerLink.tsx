import { shortAddress } from '../../utils';
import { ChainId, BlockExplorerUrl } from '../../constants';
import LabelTag from '../LabelTag';

interface IProps {
  hash: string;
  label?: string;
  chainId: number;
  type: 'address' | 'tx';
  children?: React.ReactNode;
}

function BlockExplorerLink({ hash, label, chainId, type, children }: IProps) {
  const networkName: string = ChainId[chainId];
  const networkUrl: string = BlockExplorerUrl[networkName as keyof typeof BlockExplorerUrl];
  const labelTag = label ? <LabelTag raw={hash} label={label} /> : '';

  return (
    <a href={`${networkUrl}${type}/${hash}`} title={hash} target="_blank" rel="noopener noreferrer">
      {children || labelTag || shortAddress(hash, 4)}
    </a>
  );
}

export default BlockExplorerLink;
