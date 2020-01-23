import cn from 'classnames';
import * as React from 'react';

import { AssetType } from 'src/models';

const assets = [
  {
    height: 120,
    imgUrl: './assets/eth.svg',
    label: 'Ethereum',
    symbol: AssetType.Ethereum,
    type: AssetType.Ethereum
  },
  {
    height: 120,
    imgUrl: './assets/dot.svg',
    label: 'Polkadot',
    symbol: AssetType.Polkadot,
    type: AssetType.Polkadot
  },
  {
    height: 45,
    imgUrl: './assets/usdt.svg',
    label: 'Tether',
    symbol: 'usdt',
    type: AssetType.Ethereum
  },
  {
    height: 45,
    imgUrl: './assets/usdc.svg',
    label: 'USD Coin',
    symbol: 'usdc',
    type: AssetType.Ethereum
  },
  {
    height: 45,
    imgUrl: './assets/kitty.svg',
    label: 'Cryptokitties',
    symbol: 'kitty',
    type: AssetType.Ethereum
  },
  {
    height: 45,
    imgUrl: './assets/axie.svg',
    label: 'Axie Infinity',
    symbol: 'axie',
    type: AssetType.Ethereum
  },
  {
    height: 45,
    imgUrl: './assets/snx.svg',
    label: 'Synthetix',
    symbol: 'snx',
    type: AssetType.Ethereum
  },
  {
    height: 45,
    imgUrl: './assets/dai.svg',
    label: 'Multi-Collateral Dai',
    symbol: 'dai',
    type: AssetType.Ethereum
  },
  {
    height: 45,
    imgUrl: './assets/mana.svg',
    label: 'Decentraland',
    symbol: 'mana',
    type: AssetType.Ethereum
  },
  {
    height: 45,
    imgUrl: './assets/heroes.svg',
    label: 'My Crypto Heroes',
    symbol: 'heroes',
    type: AssetType.Ethereum
  },
  {
    height: 45,
    imgUrl: './assets/hot.svg',
    label: 'Holochain',
    symbol: 'hot',
    type: AssetType.Ethereum
  },
  {
    height: 45,
    imgUrl: './assets/link.svg',
    label: 'Chainlink',
    symbol: 'link',
    type: AssetType.Ethereum
  },
  {
    height: 45,
    imgUrl: './assets/gods.svg',
    label: 'Gods Unchained',
    symbol: 'gods',
    type: AssetType.Ethereum
  },
  {
    height: 45,
    imgUrl: './assets/erc20.svg',
    label: 'Other ERC20 Tokens',
    symbol: 'erc20',
    type: AssetType.Ethereum
  }
];

interface IAssetSelectorProps {
  active: boolean;
  selectedSymbol: string;
  onClick: (type: AssetType, symbol: string) => void;
}

const Checkmark = () => (
  <div className="bx--tile__checkmark">
    <svg
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
      style={{ willChange: 'transform' }}
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 16 16"
      aria-hidden="true"
    >
      <path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zM7 11L4.3 8.3l.9-.8L7 9.3l4-3.9.9.8L7 11z" />
      <path d="M7 11L4.3 8.3l.9-.8L7 9.3l4-3.9.9.8L7 11z" opacity={0} />
    </svg>
  </div>
);

const AssetSelector: React.FC<IAssetSelectorProps> = ({
  active,
  selectedSymbol,
  onClick
}) => {
  const assetNodes = assets.map(asset => {
    const isMain = asset.type === asset.symbol;
    const isSelected = asset.symbol === selectedSymbol;
    const hasSelectedItem = !!selectedSymbol;
    const handleClick = () => onClick(asset.type, asset.symbol);

    return (
      <div
        key={asset.symbol}
        className={cn(
          'bx--tile grid-item',
          isMain ? 'span-1' : 'span-2',
          isSelected ? 'selected' : hasSelectedItem ? 'not-selected' : ''
        )}
        onClick={handleClick}
      >
        {isSelected && <Checkmark />}
        <div className="bx--tile-content">
          <div className={isMain ? 'asset-center' : 'asset-left'}>
            <embed
              type={
                asset.imgUrl.endsWith('.svg') ? 'image/svg+xml' : 'image/png'
              }
              src={
                isSelected
                  ? asset.imgUrl.replace('.svg', '_a.svg')
                  : asset.imgUrl
              }
              height={asset.height}
              width={asset.height}
            />
            <p className="icon-label">{asset.label}</p>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div
      className={cn(
        'bx--row asset-selector',
        active ? ' main-section-blue' : ''
      )}
    >
      <div className="bx--col-xs-6 main-section">
        <h2 className="asset-selector-title">
          Select the asset you want to schedule a transaction for
        </h2>
        <div className="grid-layout">{assetNodes}</div>
      </div>
    </div>
  );
};

export default AssetSelector;
