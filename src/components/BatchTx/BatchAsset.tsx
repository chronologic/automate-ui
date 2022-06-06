import { useCallback } from 'react';
import styled from 'styled-components';

import { AssetType } from '../../types';
import { ChainId } from '../../constants';
import { IAssetStorageItem } from '../../hooks';
import AssetSelector from '../AssetSelector';
import { useBatchConfig } from './useBatchConfig';

function BatchAsset() {
  const { selectedAsset, selectAsset } = useBatchConfig();

  const handleChange = useCallback(
    (asset: IAssetStorageItem) => {
      selectAsset(asset);
    },
    [selectAsset]
  );

  return (
    <Container>
      <AssetSelector
        assetType={AssetType.Ethereum}
        chainId={ChainId.ethereum}
        address={selectedAsset?.address}
        name=""
        onChange={handleChange}
      />
    </Container>
  );
}

const Container = styled.div``;

export default BatchAsset;
