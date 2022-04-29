import { isEmptyName } from '../../utils';
import AssetSymbol from '../AssetSymbol';
import { ChainId, NetworkScanUrl } from '../../constants';

interface IProps {
  assetName: string;
  assetContract: string;
  chars?: number;
  chainId: number;
}

function AssetSymbolLink({ assetName, assetContract, chars, chainId }: IProps) {
  const name = (assetName || '').toUpperCase();

  const _name = isEmptyName(name) ? '' : name;
  let networkName: string = ChainId[chainId];
  var networkUrl: string = NetworkScanUrl[networkName as keyof typeof NetworkScanUrl];

  if (assetContract) {
    return (
      <a
        href={`${networkUrl}address/${assetContract}`}
        title={_name || assetContract}
        target="_blank"
        rel="noopener noreferrer"
      >
        <AssetSymbol name={name} address={assetContract} chars={chars} />
      </a>
    );
  }

  return <AssetSymbol name={name} address={assetContract} chars={chars} />;
}

export default AssetSymbolLink;
