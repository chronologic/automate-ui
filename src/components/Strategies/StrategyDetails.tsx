import React, { useCallback, useMemo, useState } from 'react';
import { Row, Col, Typography, Button, Space, Form } from 'antd';
import { ArrowDownOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

import {
  IStrategy,
  IStrategyPrepResponse,
  IStrategyPrepTxWithConditions,
  IStrategyRepetition,
  IThemeProps,
  StrategyBlockTxs,
} from '../../types';
import { useStrategyApi, useStrategyStore, useAutomateConnection } from '../../hooks';
import { strategies } from './strategyDetailsData';
import { blockForName, Repeat } from './Blocks';

const { Title, Text } = Typography;

function StrategyDetails() {
  const location = useLocation();
  const [form] = Form.useForm();
  const txs = useStrategyStore((state) => state.txs);
  const repetitions = useStrategyStore((state) => state.repetitions);
  const { prep } = useStrategyApi();
  const { account } = useAutomateConnection();
  const [prepResponse, setPrepResponse] = useState<IStrategyPrepResponse>({} as any);

  const strategyName = useMemo(() => {
    return location?.pathname?.split('/').reverse()[0];
  }, [location?.pathname]);

  const strategy = strategies[strategyName];

  const txsToSign = useMemo(() => {
    const numOfBlocks = strategy?.blocks.length || 0;
    return numOfBlocks ** 2 * repetitions.length;
  }, [repetitions.length, strategy?.blocks.length]);

  const blocks = useMemo(() => {
    const separator = (
      <Arrow>
        <ArrowDownOutlined style={{ color: 'rgb(255 255 255 / 45%)' }} />
      </Arrow>
    );

    return strategy?.blocks.map((name, index) => {
      const Block = blockForName[name];
      return (
        <React.Fragment key={name}>
          {index !== 0 && separator}
          <Block />
        </React.Fragment>
      );
    });
  }, [strategy?.blocks]);

  const handleSubmit = useCallback(async () => {
    await form.validateFields();
    // const userNonce = await web3!.eth.getTransactionCount(account!);

    // const prepTxs = buildPrepTxs({
    //   strategy,
    //   from: account!,
    //   txs,
    //   repetitions,
    //   startNonce: userNonce,
    // });

    // console.log(prepTxs);

    // const res = await prep(prepTxs);
    // setPrepResponse(res);

    // const batch = new web3!.BatchRequest();

    // prepTxs.forEach((tx) =>
    //   web3!.eth.sendTransaction({
    //     chainId: strategy.chainId as number,
    //     from: tx.from,
    //     to: tx.to,
    //     data: tx.data,
    //     nonce: tx.nonce, // metamask will ignore this
    //   })
    // );

    // batch.execute();
  }, [account, form, prep, repetitions, strategy, txs]);

  if (!strategy) {
    return <div>strategy not found</div>;
  }

  return (
    <Container>
      <Form form={form}>
        <Row gutter={[24, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
          <Col span={12}>
            <Title level={3}>{strategy.title}</Title>
            <Text type="secondary" className="description">
              {strategy.description}
            </Text>
          </Col>
          <Col span={12}>
            <div className="outer">
              <div className="inner">{blocks}</div>
              <Repeat />
            </div>
            <Footer>
              <Space direction="vertical" size="large">
                <Button type="primary" size="large" onClick={handleSubmit}>
                  Automate!
                </Button>
                {txsToSign > 0 && (
                  <Text type="secondary" className="txsToSign">
                    This automation will generate <strong>{txsToSign} transactions</strong> for you to sign in Metamask.
                  </Text>
                )}
              </Space>
            </Footer>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

// TODO: optimize to skip lower priority transactions for transactions that always succeed
// e.g. claim -> send (in this case skip send since claim has no fail conditions)
// this might require changes in strategy.blocks to define which transaction can be skipped like that
function buildPrepTxs({
  strategy,
  from,
  txs,
  repetitions,
  startNonce,
}: {
  strategy: IStrategy;
  from: string;
  txs: StrategyBlockTxs;
  repetitions: IStrategyRepetition[];
  startNonce: number;
}): IStrategyPrepTxWithConditions[] {
  const prepTxs: IStrategyPrepTxWithConditions[] = [];

  let nonce = startNonce;
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
        nonce,
        priority,
        conditionAsset: tx.asset,
        conditionAmount: tx.amount,
        timeCondition: repetition.time,
        timeConditionTZ: repetition.tz,
      });

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
          nonce,
          priority,
          conditionAsset: otherTx.asset,
          conditionAmount: otherTx.amount,
          timeCondition: repetition.time,
          timeConditionTZ: repetition.tz,
        });
      }
      nonce++;
    }
  }

  return prepTxs;
}

const Container = styled.div`
  width: 100%;
  max-width: 1220px;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;

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

  .txsToSign {
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
