import { BlockExplorerLink } from '../Transactions';
import AssetSymbol from '../AssetSymbol';

interface IProps {
  assetName: string;
  assetContract: string;
  chars?: number;
  chainId: number;
}

function AssetSymbolLink({ assetName, assetContract, chars, chainId }: IProps) {
  const name = (assetName || '').toUpperCase();

  if (assetContract) {
    return (
      <BlockExplorerLink hash={assetContract} chainId={chainId} type={'address'}>
        <AssetSymbol name={name} address={assetContract} chars={chars} />
      </BlockExplorerLink>
    );
  }

  return <AssetSymbol name={name} address={assetContract} chars={chars} />;
}

export default AssetSymbolLink;
