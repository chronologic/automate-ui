import { useCallback, useMemo } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Select } from 'antd';
import styled from 'styled-components';

import { AssetType } from '../types';
import { ChainId } from '../constants';
import { useAddAssetModal, useAssetOptions, IAssetStorageItem } from '../hooks';
import AssetSymbol from './AssetSymbol';
import ReactDOM from 'react-dom';

interface IProps {
  assetType: AssetType;
  chainId: ChainId;
  address: string;
  name: string;
  onChange: (item: IAssetStorageItem) => void;
}

function AssetSelector({ assetType, chainId, address, name, onChange }: IProps) {
  const { assetOptions } = useAssetOptions();
  const { modal, open: onOpenAddAssetModal } = useAddAssetModal();

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
      {ReactDOM.createPortal(modal, document.getElementById('root'))}
      <Select value={address} style={{ width: '100px' }} onChange={handleChange}>
        {filteredOptions.map((asset) => (
          <Select.Option key={asset.address} value={asset.address}>
            {asset.name}
          </Select.Option>
        ))}
      </Select>
      <br />
      <Button type="ghost" style={{ border: '0px', background: 'transparent' }} onClick={handleOpenAddAssetModal}>
        <PlusOutlined /> Add
      </Button>
    </Container>
  );
}

const Container = styled.div``;

export default AssetSelector;
