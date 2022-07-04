import { useCallback } from 'react';
import { Typography } from 'antd';
import styled from 'styled-components';

import { AssetType } from '../../types';
import { IAssetStorageItem } from '../../hooks';
import AssetSelector from '../AssetSelector';
import { useBatchConfig } from './useBatchConfig';

function BatchAsset() {
  const { selectedAsset, selectAsset, selectedNetwork } = useBatchConfig();

  const handleChange = useCallback(
    (asset: IAssetStorageItem) => {
      selectAsset(asset);
    },
    [selectAsset]
  );

  return (
    <Container>
      <Typography.Title level={4}>Choose transaction asset</Typography.Title>
      <AssetSelector
        assetType={AssetType.Ethereum}
        chainId={selectedNetwork?.chainId!}
        address={selectedAsset?.address}
        onChange={handleChange}
      />
    </Container>
  );
}

const Container = styled.div``;

export default BatchAsset;
