import { isEmptyName } from '../../utils';
import AssetSymbol from '../AssetSymbol';

interface IProps {
  assetName: string;
  assetContract: string;
  chars?: number;
}

function AssetSymbolLink({ assetName, assetContract, chars }: IProps) {
  const name = (assetName || '').toUpperCase();

  const _name = isEmptyName(name) ? '' : name;

  if (assetContract) {
    return (
      <a
        href={`https://etherscan.io/address/${assetContract}`}
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
