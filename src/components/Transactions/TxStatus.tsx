import { Tooltip } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseSquareOutlined,
  DeleteOutlined,
  FormOutlined,
  WarningOutlined,
} from '@ant-design/icons';

import { ChainId } from '../../constants';
import BlockExplorerLink from './BlockExplorerLink';

interface IProps {
  chainId: ChainId;
  status: string;
  txHash: string;
}

interface IStatusConfig {
  [key: string]: {
    color: string;
    description: string;
    icon: React.ReactNode;
  };
}

const statusConfig: IStatusConfig = {
  Draft: {
    color: '#0650ff',
    description: 'Draft - you need to edit this transaction before Automate starts monitoring it',
    icon: <FormOutlined />,
  },
  Pending: {
    color: 'orange',
    description: 'Pending - Automate will execute this transaction as soon as all conditions are met',
    icon: <ClockCircleOutlined />,
  },
  Completed: {
    color: 'green',
    description: 'Completed - transaction has executed successfully',
    icon: <CheckCircleOutlined />,
  },
  Cancelled: {
    color: 'gray',
    description: "Cancelled - you've cancelled this transaction and Automate will no longer try to execute it",
    icon: <DeleteOutlined />,
  },
  StaleNonce: {
    color: 'pink',
    description:
      "StaleNonce - the transaction's nonce is lower than the last nonce on the Ethereum network. This means the transaction can not be executed. You can reschedule this transaction with a higher nonce.",
    icon: <WarningOutlined />,
  },
  Error: {
    color: 'red',
    description: 'Error - an error occured while executing this transaction',
    icon: <CloseSquareOutlined />,
  },
};

function TxStatus({ status, txHash, chainId }: IProps) {
  const cfg = statusConfig[status];

  if (cfg) {
    return (
      <BlockExplorerLink chainId={chainId} hash={txHash} type="tx" title={''}>
        <Tooltip placement="right" title={cfg.description}>
          <span style={{ color: cfg.color }}>{cfg.icon}</span>
        </Tooltip>
      </BlockExplorerLink>
    );
  }

  return <span title={status}>{status}</span>;
}

export default TxStatus;
