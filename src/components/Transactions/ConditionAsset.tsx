import { useCallback, useMemo } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Select } from 'antd';

import { AssetType } from '../../types';
import { ChainId } from '../../constants';
import { IAssetStorageItem } from '../../hooks';
import { BlockExplorerLink } from '../Transactions';
import AssetSymbol from '../AssetSymbol';

interface IProps {
  editing: boolean;
  canEdit: boolean;
  assetType: AssetType;
  chainId: ChainId;
  address: string;
  name: string;
  assetOptions: IAssetStorageItem[];
  onChange: ({
    conditionAsset,
    conditionAssetName,
    conditionAssetDecimals,
  }: {
    conditionAsset: string;
    conditionAssetName: string;
    conditionAssetDecimals: number;
  }) => void;
  onOpenAddAssetModal: () => void;
}

function ConditionAsset({
  editing,
  canEdit,
  assetType,
  chainId,
  address,
  name,
  assetOptions,
  onChange,
  onOpenAddAssetModal,
}: IProps) {
  const filteredOptions = useMemo(
    () => assetOptions.filter((item) => item.assetType === assetType && item.chainId === chainId),
    [assetOptions, assetType, chainId]
  );
  const matchedOption = useMemo(
    () => filteredOptions.find((item) => item.address === address),
    [address, filteredOptions]
  );

  const handleChange = useCallback(
    (contractAddress: string) => {
      const asset = filteredOptions.find((a) => a.address === contractAddress);
      onChange({
        conditionAsset: asset?.address!,
        conditionAssetName: asset?.name!,
        conditionAssetDecimals: asset?.decimals!,
      });
    },
    [filteredOptions, onChange]
  );

  if (editing && canEdit) {
    return (
      <div>
        <Select value={address} style={{ width: '100px' }} onChange={handleChange}>
          {filteredOptions.map((asset) => (
            <Select.Option key={asset.address} value={asset.address}>
              {asset.name}
            </Select.Option>
          ))}
        </Select>
        <br />
        <Button type="ghost" style={{ border: '0px', background: 'transparent' }} onClick={onOpenAddAssetModal}>
          <PlusOutlined /> Add
        </Button>
      </div>
    );
  }

  const assetName = (name || matchedOption?.name || '').toUpperCase();

  console.log({ address, matchedOption, name });

  if (address) {
    return (
      <BlockExplorerLink hash={address} chainId={chainId} type={'address'}>
        <AssetSymbol name={assetName} address={address} />
      </BlockExplorerLink>
    );
  }

  return <span>{assetName || '-'}</span>;
}

export default ConditionAsset;
