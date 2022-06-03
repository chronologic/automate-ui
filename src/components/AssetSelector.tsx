import { useCallback, useMemo } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Select } from 'antd';
import styled from 'styled-components';

import { AssetType } from '../types';
import { ChainId } from '../constants';
import { useAddAssetModal, useAssetOptions, IAssetStorageItem } from '../hooks';
import AssetSymbol from './AssetSymbol';

interface IProps {
  assetType: AssetType;
  chainId: ChainId;
  address: string;
  name: string;
  onChange: (item: IAssetStorageItem) => void;
}

function AssetSelector({ assetType, chainId, address, name, onChange }: IProps) {
  const { assetOptions } = useAssetOptions();
  const { open: onOpenAddAssetModal } = useAddAssetModal();

  const filteredOptions = useMemo(
    () => assetOptions.filter((item) => item.assetType === assetType && item.chainId === chainId),
    [assetOptions, assetType, chainId]
  );

  const handleChange = useCallback(
    (contractAddress: string) => {
      const asset = filteredOptions.find((a) => a.address === contractAddress)!;
      onChange(asset);
    },
    [filteredOptions, onChange]
  );

  const handleOpenAddAssetModal = useCallback(() => {
    onOpenAddAssetModal({ chainId, assetType });
  }, [assetType, chainId, onOpenAddAssetModal]);

  return (
    <Container>
      <Select
        value={address}
        style={{ width: '100px' }}
        onChange={handleChange}
        dropdownRender={(menu) => (
          <>
            {menu}
            <Divider className="selectDivider" />
            <Button type="ghost" className="addItemButton" onClick={handleOpenAddAssetModal}>
              <PlusOutlined /> Add
            </Button>
          </>
        )}
      >
        {filteredOptions.map((asset) => (
          <Select.Option key={asset.address} value={asset.address}>
            <AssetSymbol chainId={chainId} address={asset.address} name={name} alwaysShowName />
          </Select.Option>
        ))}
      </Select>
    </Container>
  );
}

const Container = styled.div`
  .selectDivider {
    margin: 4px 0 !important;
  }

  .addItemButton {
    color: blue;
  }
`;

export default AssetSelector;
