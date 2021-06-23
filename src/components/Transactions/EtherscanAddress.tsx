import { shortAddress } from '../../utils';

interface IProps {
  address: string;
  chars?: number;
}

function EtherscanAddress({ address, chars }: IProps) {
  return (
    <a href={`https://etherscan.io/address/${address}`} title={address} target="_blank" rel="noopener noreferrer">
      {shortAddress(address, chars)}
    </a>
  );
}

export default EtherscanAddress;
