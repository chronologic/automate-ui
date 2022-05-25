import { useCallback, useMemo, useState } from 'react';
import { Input, Modal } from 'antd';
import styled from 'styled-components';

import { TokenAPI } from '../../api/TokenAPI';
import { IAssetStorageItem, useAssetOptions } from '../../hooks';
import { ChainId } from '../../constants';
import { AssetType } from '../../types';

type OnSubmitCallback = (asset: IAssetStorageItem) => void;

export type OpenAddAssetModal = ({
  chainId,
  assetType,
  onSubmit,
}: {
  chainId: ChainId;
  assetType: AssetType;
  onSubmit: OnSubmitCallback;
}) => void;

function useAddAssetModal() {
  const { addAsset } = useAssetOptions();
  const [visible, setVisible] = useState(false);
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [decimals, setDecimals] = useState(18);
  const [error, setError] = useState('');
  const [fetchingAsset, setFetchingAsset] = useState(false);
  const [assetType, setAssetType] = useState<AssetType>();
  const [chainId, setChainId] = useState<ChainId>();
  const [onSubmitCallback, setOnSubmitCallback] = useState<OnSubmitCallback>();

  const handleOpen: OpenAddAssetModal = useCallback(({ chainId, assetType, onSubmit }) => {
    setAssetType(assetType);
    setChainId(chainId);
    // workaround to store function in useState https://stackoverflow.com/a/55621325
    setOnSubmitCallback((asset: IAssetStorageItem) => (asset: IAssetStorageItem) => onSubmit(asset));
    setVisible(true);
  }, []);

  const handleFetchAsset = useCallback(
    async (e: any) => {
      try {
        setFetchingAsset(true);
        const inputAddress = e.target.value || '';
        setAddress(inputAddress);

        const { address, decimals, symbol, name, validationError } = await TokenAPI.resolveToken(
          inputAddress,
          chainId as ChainId
        );

        setAddress(address);
        setDecimals(decimals);
        setName(symbol || name);
        setError(validationError);
      } finally {
        setFetchingAsset(false);
      }
    },
    [chainId]
  );

  const handleReset = useCallback(() => {
    setError('');
    setAddress('');
    setDecimals(18);
    setName('');
  }, []);

  const handleDismiss = useCallback(() => {
    handleReset();
    setVisible(false);
  }, [handleReset]);

  const handleSubmit = useCallback(() => {
    if (name) {
      const newAsset = {
        assetType: assetType!,
        chainId: chainId!,
        address,
        decimals,
        name,
      };
      addAsset(newAsset);
      onSubmitCallback!(newAsset);
    }
    handleReset();
    handleDismiss();
  }, [addAsset, address, assetType, chainId, decimals, handleDismiss, handleReset, name, onSubmitCallback]);

  const modal = useMemo(
    () => (
      <Container>
        <Modal
          title={`Add Asset for chain ${chainId}`}
          visible={visible}
          onCancel={handleDismiss}
          onOk={handleSubmit}
          confirmLoading={fetchingAsset}
          okButtonProps={{
            disabled: !name || !!error,
          }}
        >
          <Input
            type="text"
            placeholder="Contract address"
            value={address}
            disabled={fetchingAsset}
            onChange={handleFetchAsset}
          />
          <br />
          <br />
          <Input type="text" placeholder="Symbol" disabled={true} value={name} />
          <br />
          <br />
          <Input type="text" placeholder="Decimals" disabled={true} value={address ? decimals : ''} />
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <br />
        </Modal>
      </Container>
    ),
    [address, chainId, decimals, error, fetchingAsset, handleDismiss, handleFetchAsset, handleSubmit, name, visible]
  );

  return {
    modal,
    open: handleOpen,
  };
}

const Container = styled.div``;

export { useAddAssetModal };
