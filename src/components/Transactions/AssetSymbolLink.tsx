import { BlockExplorerLink } from '../Transactions';
import AssetSymbol from '../AssetSymbol';

interface IProps {
  assetName: string;
  assetContract: string;
  chainId: number;
}

function AssetSymbolLink({ assetName, assetContract, chainId }: IProps) {
  const name = (assetName || '').toUpperCase();

  if (assetContract) {
    return (
      <BlockExplorerLink hash={assetContract} chainId={chainId} type={'address'}>
        <AssetSymbol name={name} address={assetContract} />
      </BlockExplorerLink>
    );
  }

  return <AssetSymbol name={name} address={assetContract} />;
}

export default AssetSymbolLink;
