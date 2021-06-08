import { useMemo } from 'react';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseSquareOutlined,
  DeleteOutlined,
  FormOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';

interface IProps {
  status: string;
  txHash: string;
}

function TxStatus({ status, txHash }: IProps) {
  const node = useMemo(() => {
    let res = <span />;
    switch (status) {
      case 'Draft': {
        res = (
          <span style={{ color: '#0650ff' }} title={status}>
            <FormOutlined />
          </span>
        );
        break;
      }
      case 'Pending': {
        res = (
          <span style={{ color: 'orange' }} title={status}>
            <ClockCircleOutlined />
          </span>
        );
        break;
      }
      case 'Completed': {
        res = (
          <span style={{ color: 'green' }} title={status}>
            <CheckCircleOutlined />
          </span>
        );
        break;
      }
      case 'Cancelled': {
        res = (
          <span style={{ color: 'gray' }} title={status}>
            <DeleteOutlined />
          </span>
        );
        break;
      }
      case 'Error': {
        res = (
          <span style={{ color: 'red' }} title={status}>
            <CloseSquareOutlined />
          </span>
        );
        break;
      }
      default: {
        res = <span title={status}>{status}</span>;
        break;
      }
    }

    return res;
  }, [status]);

  return (
    <A href={`https://etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer">
      {node}
    </A>
  );
}

const A = styled.a``;

export default TxStatus;
