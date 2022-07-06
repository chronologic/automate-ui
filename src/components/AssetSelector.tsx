import { useCallback } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Divider, Select, Typography } from 'antd';
import styled from 'styled-components';

import { AssetType } from '../types';
import { ChainId } from '../constants';
import { useAddAssetModal, useAssetOptions, IAssetStorageItem } from '../hooks';
import AssetSymbol from './AssetSymbol';

interface IProps {
  assetType: AssetType;
  chainId: ChainId;
  address?: string;
  name?: string;
  allowEth?: boolean;
  onChange: (item: IAssetStorageItem) => void;
}

function AssetSelector({ assetType, chainId, address, name, allowEth, onChange }: IProps) {
  const { assetOptions } = useAssetOptions({ assetType, chainId, allowEth });
  const { open: onOpenAddAssetModal } = useAddAssetModal();

  const handleChange = useCallback(
    (contractAddress: string) => {
      const asset = assetOptions.find((a) => a.address === contractAddress)!;
      onChange(asset);
    },
    [assetOptions, onChange]
  );

  const handleOpenAddAssetModal = useCallback(() => {
    onOpenAddAssetModal({ chainId, assetType, onSubmit: onChange });
  }, [assetType, chainId, onChange, onOpenAddAssetModal]);

  return (
    <Container>
      <Select
        value={address}
        className="select"
        onChange={handleChange}
        dropdownRender={(menu) => (
          <>
            {menu}
            <Divider style={{ margin: '4px 0' }} className="selectDivider" />
            <Typography.Link style={{ margin: '4px 12px' }} className="addItemButton" onClick={handleOpenAddAssetModal}>
              <PlusOutlined /> Add
            </Typography.Link>
          </>
        )}
      >
        {assetOptions.map((asset) => (
          <Select.Option key={asset.address} value={asset.address}>
            <AssetSymbol
              chainId={chainId}
              address={asset.address}
              name={name || asset.name}
              alwaysShowName
              imageSize="2rem"
            />
          </Select.Option>
        ))}
      </Select>
    </Container>
  );
}

const Container = styled.div`
  .select {
    width: 110px;
  }
`;

export default AssetSelector;
