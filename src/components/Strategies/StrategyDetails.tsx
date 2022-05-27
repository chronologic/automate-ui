import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Row, Col, Typography, Button, Space, Form, notification } from 'antd';
import { ArrowDownOutlined } from '@ant-design/icons';
import ReactPlayer from 'react-player';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import Web3 from 'web3';

import {
  IStrategy,
  IStrategyPrepResponse,
  IStrategyPrepTxWithConditions,
  IStrategyRepetition,
  IThemeProps,
  StrategyBlockTxs,
} from '../../types';
import { useStrategyApi, useStrategyStore, useAutomateConnection } from '../../hooks';
import { ChainId, ethereum, Network } from '../../constants';
import { retryRpcCallOnIntermittentError } from '../../utils';
import { strategies } from './strategyData';
import { blockConfig, Repeat } from './Blocks';
import SigningPopup from './SigningPopup';

const { Title, Text } = Typography;
const web3 = new Web3(ethereum as any);

function StrategyDetails() {
  const location = useLocation();
  const [form] = Form.useForm();
  const txs = useStrategyStore((state) => state.txs);
  const repetitions = useStrategyStore((state) => state.repetitions);
  const setChainId = useStrategyStore((state) => state.setChainId);
  const { prep, cancel } = useStrategyApi();
  const { account, connect } = useAutomateConnection();
  const [prepResponse, setPrepResponse] = useState<IStrategyPrepResponse>({} as any);
  const [automating, setAutomating] = useState(false);
  const [displaySigningPopup, setDisplaySigningPopup] = useState(false);
  const [currentTxIndex, setCurrentTxIndex] = useState(-1);
  const [completedSigning, setCompletedSigning] = useState(false);

  const strategyName = useMemo(() => {
    return location?.pathname?.split('/').reverse()[0];
  }, [location?.pathname]);

  const strategy = useMemo(() => {
    return strategies.find((s) => s.url === strategyName)!;
  }, [strategyName]);

  const txsToSignCount = useMemo(() => {
    try {
      const prepTxsJustForCount = buildPrepTxs({
        strategy,
        from: account!,
        txs,
        repetitions,
      });
      return prepTxsJustForCount.length;
    } catch (e) {
      return 0;
    }
  }, [account, repetitions, strategy, txs]);

  const blocks = useMemo(() => {
    const separator = (
      <Arrow>
        <ArrowDownOutlined style={{ color: 'rgb(255 255 255 / 45%)' }} />
      </Arrow>
    );

    return strategy?.blocks.map((name, index) => {
      const Block = blockConfig[name].component;
      return (
        <React.Fragment key={name}>
          {index !== 0 && separator}
          <Block />
        </React.Fragment>
      );
    });
  }, [strategy?.blocks]);

  const handleModalCancel = () => {
    setDisplaySigningPopup(false);
    cancel(prepResponse.instanceId);
  };

  const handleSubmit = useCallback(async () => {
    try {
      setAutomating(true);
      setCompletedSigning(false);

      await form.validateFields();
      await connect({ desiredNetwork: ChainId[strategy.chainId] as Network });

      const prepTxs = buildPrepTxs({
        strategy,
        from: account!,
        txs,
        repetitions,
      });

      const prepRes = await prep(prepTxs);
      setPrepResponse(prepRes);

      setDisplaySigningPopup(true);

      for (const tx of prepTxs) {
        const txIndex = prepTxs.indexOf(tx);
        setCurrentTxIndex(txIndex);
        try {
          await tryExecuteTx(strategy.chainId as number, tx);
        } catch (e: any) {
          cancel(prepRes.instanceId);
          setDisplaySigningPopup(false);
          notification.error({ message: e?.message || 'Unknown error' });
          throw e;
        }
      }

      setCompletedSigning(true);
    } finally {
      setAutomating(false);
    }
  }, [account, cancel, connect, form, prep, repetitions, strategy, txs]);

  useEffect(() => {
    setChainId(strategy?.chainId);
  }, [setChainId, strategy?.chainId]);

  if (!strategy) {
    return <div>strategy not found</div>;
  }

  return (
    <Container>
      <Form form={form}>
        <Row gutter={[24, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
          <Col span={24} lg={12}>
            <Title level={3}>{strategy.title}</Title>
            <Text type="secondary" className="description">
              {strategy.description}
            </Text>
            <br />
            <br />
            <ReactPlayer url="https://youtu.be/IKcruLqdTSs" width="540px" controls />
          </Col>
          <Col span={24} lg={12}>
            <div className="outer">
              <div className="inner">{blocks}</div>
              <Repeat />
            </div>
            <Footer>
              <Space direction="vertical" size="large">
                <Button type="primary" size="large" disabled={automating} loading={automating} onClick={handleSubmit}>
                  Automate!
                </Button>
                {txsToSignCount > 0 && (
                  <Text type="secondary" className="txsToSignCount">
                    This automation will generate <strong>{txsToSignCount} transactions</strong> for you to sign in
                    Metamask
                  </Text>
                )}
                <SigningPopup
                  visible={displaySigningPopup}
                  onCancel={handleModalCancel}
                  currentTxIndex={currentTxIndex}
                  totalTxsToSign={txsToSignCount}
                  completedSigning={completedSigning}
                />
              </Space>
            </Footer>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

function buildPrepTxs({
  strategy,
  from,
  txs,
  repetitions,
}: {
  strategy: IStrategy;
  from: string;
  txs: StrategyBlockTxs;
  repetitions: IStrategyRepetition[];
}): IStrategyPrepTxWithConditions[] {
  const prepTxs: IStrategyPrepTxWithConditions[] = [];

  let order = 1;
  for (const repetition of repetitions) {
    for (const block of strategy.blocks) {
      const tx = txs[block];
      let priority = 1;
      prepTxs.push({
        assetType: strategy.assetType,
        chainId: strategy.chainId,
        from,
        to: tx.to,
        data: tx.data,
        order: order++,
        priority,
        conditionAsset: tx.asset,
        conditionAmount: tx.amount,
        timeCondition: repetition.time,
        timeConditionTZ: repetition.tz,
      });

      const { requiresFallback } = blockConfig[block];

      if (requiresFallback) {
        const otherBlocks = strategy.blocks.filter((b) => b !== block);

        for (const otherBlock of otherBlocks) {
          const otherTx = txs[otherBlock];
          priority += 1;
          prepTxs.push({
            assetType: strategy.assetType,
            chainId: strategy.chainId,
            from,
            to: otherTx.to,
            data: otherTx.data,
            order: order++,
            priority,
            conditionAsset: otherTx.asset,
            conditionAmount: otherTx.amount,
            timeCondition: repetition.time,
            timeConditionTZ: repetition.tz,
          });
        }
      }
      prepTxs[prepTxs.length - 1].isLastForNonce = true;
    }
  }

  return prepTxs;
}

async function tryExecuteTx(chainId: number, tx: IStrategyPrepTxWithConditions) {
  try {
    await retryRpcCallOnIntermittentError(async () =>
      web3!.eth.sendTransaction({
        chainId: chainId,
        from: tx.from,
        to: tx.to,
        data: tx.data,
      })
    );
  } catch (e: any) {
    const errorThatIntentionallyPreventsNonceIncrease = '[automate:metamask:nonce]';
    const errorMessage = e?.message || '';
    if (errorMessage.includes(errorThatIntentionallyPreventsNonceIncrease)) {
      // suppress error
    } else {
      throw e;
    }
  }
}

const Container = styled.div`
  width: 100%;
  max-width: 1220px;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;

  .ant-form {
    width: 100%;
  }

  .description {
    color: rgb(255 255 255 / 45%);
  }

  .outer {
    border: 1px solid ${(props: IThemeProps) => props.theme.colors.accent};
    border-radius: 2px;
  }

  .inner {
    padding: 10px 10px 20px;
  }

  .ant-card-head {
    color: white;
  }

  .secondary {
    color: rgb(255 255 255 / 45%);
  }

  .ant-card-extra {
    color: rgb(255 255 255 / 25%);
    font-size: 18px;
  }

  .cardTitle {
    margin-left: 10px;
  }
`;

const Footer = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 3em;

  .txsToSignCount {
    color: rgb(255 255 255 / 45%);
  }
`;

const Arrow = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2px 0;
`;

export default StrategyDetails;
