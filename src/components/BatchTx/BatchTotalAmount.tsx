import { useMemo } from 'react';
import { Typography } from 'antd';
import styled from 'styled-components';
import { BigNumber, utils } from 'ethers';

import { useBatchParser } from './useBatchParser';
import { useBatchConfig } from './useBatchConfig';

function BatchTotalAmount() {
  const { parsedTxs } = useBatchParser();
  const { selectedAsset } = useBatchConfig();

  const totalAmount = useMemo(() => {
    let tAmount = BigNumber.from(0);
    for (const row of parsedTxs) {
      tAmount = tAmount.add(row.amount?.parsedValue!);
    }
    return tAmount;
  }, [parsedTxs]);

  const decimals = useMemo(() => {
    return selectedAsset?.decimals!;
  }, [selectedAsset]);

  const assetType = useMemo(() => {
    return selectedAsset?.name!;
  }, [selectedAsset]);

  return (
    <Container>
      <Typography.Title level={4} className="title">
        Total{' '}
        <b>
          {utils.formatUnits(totalAmount, decimals)} {assetType}
        </b>{' '}
        in <b>{parsedTxs.length}</b> txs
      </Typography.Title>
    </Container>
  );
}

const Container = styled.div`
  .title {
    font-weight: normal;
    text-align: left;
  }
`;

export default BatchTotalAmount;
