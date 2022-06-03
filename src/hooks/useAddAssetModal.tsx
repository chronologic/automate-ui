import { useCallback, useEffect, useMemo, useState } from 'react';
import { Input, Modal } from 'antd';
import create from 'zustand';
import styled from 'styled-components';

import { TokenAPI } from '../api/TokenAPI';
import { ChainId } from '../constants';
import { AssetType } from '../types';
import { IAssetStorageItem, useAssetOptions } from './useAssetOptions';

type OnSubmitCallback = (asset: IAssetStorageItem) => void;

export type OpenAddAssetModal = ({
  chainId,
  assetType,
  onSubmit,
}: {
  chainId: ChainId;
  assetType: AssetType;
  onSubmit?: OnSubmitCallback;
}) => void;

interface IAddAssetModalState {
  modal: React.ReactNode;
}

interface IAddAssetModalInternalState extends IAddAssetModalState {
  visible: boolean;
  address: string;
  name: string;
  decimals: number;
  error: string;
  fetchingAsset: boolean;
  assetType: AssetType;
  chainId: ChainId;
  onSubmitCallback: OnSubmitCallback;
}

interface IAddAssetModalMethods {
  open: OpenAddAssetModal;
}

interface IAddAssetModalHook extends IAddAssetModalState, IAddAssetModalMethods {}

const defaultState: IAddAssetModalInternalState = {
  address: '',
  assetType: '' as any,
  chainId: '' as any,
  decimals: 18,
  error: '',
  fetchingAsset: false,
  modal: null,
  name: '',
  visible: false,
  onSubmitCallback: () => {},
};

const useAddAssetModalStore = create<IAddAssetModalInternalState>(() => defaultState);

function useAddAssetModal(): IAddAssetModalHook {
  const { addAsset, addAssets } = useAssetOptions();
  // const [visible, setVisible] = useState(false);
  // const [address, setAddress] = useState('');
  // const [name, setName] = useState('');
  // const [decimals, setDecimals] = useState(18);
  // const [error, setError] = useState('');
  // const [fetchingAsset, setFetchingAsset] = useState(false);
  // const [assetType, setAssetType] = useState<AssetType>();
  // const [chainId, setChainId] = useState<ChainId>();
  const { address, assetType, chainId, decimals, error, fetchingAsset, modal, name, visible, onSubmitCallback } =
    useAddAssetModalStore();

  // const [onSubmitCallback, setOnSubmitCallback] = useState<OnSubmitCallback>();

  useEffect(() => {
    addAssets([]);
  }, []);

  const handleOpen: OpenAddAssetModal = useCallback(({ chainId, assetType, onSubmit }) => {
    useAddAssetModalStore.setState({
      assetType,
      chainId,
      onSubmitCallback: onSubmit,
      visible: true,
    });
    // setAssetType(assetType);
    // setChainId(chainId);
    // // workaround to store function in useState https://stackoverflow.com/a/55621325
    // setOnSubmitCallback((asset: IAssetStorageItem) => (asset: IAssetStorageItem) => onSubmit && onSubmit(asset));
    // setVisible(true);
  }, []);

  const handleFetchAsset = useCallback(
    async (e: any) => {
      try {
        useAddAssetModalStore.setState({
          fetchingAsset: true,
        });
        // setFetchingAsset(true);
        const inputAddress = e.target.value || '';
        useAddAssetModalStore.setState({
          address: inputAddress,
        });
        // setAddress(inputAddress);

        const { address, decimals, symbol, name, validationError } = await TokenAPI.resolveToken(
          inputAddress,
          chainId as ChainId
        );

        useAddAssetModalStore.setState({
          address,
          decimals,
          name: symbol || name,
          error: validationError,
        });
        // setAddress(address);
        // setDecimals(decimals);
        // setName(symbol || name);
        // setError(validationError);
      } finally {
        useAddAssetModalStore.setState({
          fetchingAsset: false,
        });
      }
    },
    [chainId]
  );

  const handleReset = useCallback(() => {
    useAddAssetModalStore.setState(defaultState);
  }, []);

  const handleDismiss = useCallback(() => {
    handleReset();
    useAddAssetModalStore.setState({ visible: false });
    // setVisible(false);
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
      onSubmitCallback && onSubmitCallback(newAsset);
    }
    handleReset();
    handleDismiss();
  }, [addAsset, address, assetType, chainId, decimals, handleDismiss, handleReset, name, onSubmitCallback]);

  useEffect(() => {
    const modal = (
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
          <Input type="text" placeholder="Symbol" disabled value={name} />
          <br />
          <br />
          <Input type="text" placeholder="Decimals" disabled value={address ? decimals : ''} />
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <br />
        </Modal>
      </Container>
    );

    useAddAssetModalStore.setState({ modal });
  }, [address, chainId, decimals, error, fetchingAsset, handleDismiss, handleFetchAsset, handleSubmit, name, visible]);

  // const modal = useMemo(
  //   () => (
  //     <Container>
  //       <Modal
  //         title={`Add Asset for chain ${chainId}`}
  //         visible={visible}
  //         onCancel={handleDismiss}
  //         onOk={handleSubmit}
  //         confirmLoading={fetchingAsset}
  //         okButtonProps={{
  //           disabled: !name || !!error,
  //         }}
  //       >
  //         <Input
  //           type="text"
  //           placeholder="Contract address"
  //           value={address}
  //           disabled={fetchingAsset}
  //           onChange={handleFetchAsset}
  //         />
  //         <br />
  //         <br />
  //         <Input type="text" placeholder="Symbol" disabled value={name} />
  //         <br />
  //         <br />
  //         <Input type="text" placeholder="Decimals" disabled value={address ? decimals : ''} />
  //         {error && <div style={{ color: 'red' }}>{error}</div>}
  //         <br />
  //       </Modal>
  //     </Container>
  //   ),
  //   [address, chainId, decimals, error, fetchingAsset, handleDismiss, handleFetchAsset, handleSubmit, name, visible]
  // );

  return {
    modal,
    open: handleOpen,
  };
}

const Container = styled.div``;

export { useAddAssetModal };
