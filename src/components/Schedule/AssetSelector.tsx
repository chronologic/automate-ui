import cn from 'classnames';
import * as React from 'react';

import { AssetType, PolkadotChainId } from 'src/models';

const assets = [
  {
    imgUrl: './assets/eth.svg',
    label: 'Ethereum',
    main: true,
    size: 120,
    symbol: AssetType.Ethereum,
    type: AssetType.Ethereum
  },
  {
    chainId: PolkadotChainId.Kusama,
    imgUrl: './assets/dot.svg',
    label: 'Polkadot',
    main: true,
    size: 120,
    symbol: AssetType.Polkadot,
    type: AssetType.Polkadot
  },
  {
    imgUrl: './assets/usdt.svg',
    label: 'Tether',
    size: 45,
    symbol: 'usdt',
    type: AssetType.Ethereum
  },
  {
    imgUrl: './assets/usdc.svg',
    label: 'USD Coin',
    size: 45,
    symbol: 'usdc',
    type: AssetType.Ethereum
  },
  {
    imgUrl: './assets/kitty.svg',
    label: 'Cryptokitties',
    size: 45,
    symbol: 'kitty',
    type: AssetType.Ethereum
  },
  {
    imgUrl: './assets/axie.svg',
    label: 'Axie Infinity',
    size: 45,
    symbol: 'axie',
    type: AssetType.Ethereum
  },
  {
    imgUrl: './assets/snx.svg',
    label: 'Synthetix',
    size: 45,
    symbol: 'snx',
    type: AssetType.Ethereum
  },
  {
    imgUrl: './assets/dai.svg',
    label: 'Multi-Collateral Dai',
    size: 45,
    symbol: 'dai',
    type: AssetType.Ethereum
  },
  {
    imgUrl: './assets/mana.svg',
    label: 'Decentraland',
    size: 45,
    symbol: 'mana',
    type: AssetType.Ethereum
  },
  {
    imgUrl: './assets/heroes.svg',
    label: 'My Crypto Heroes',
    size: 45,
    symbol: 'heroes',
    type: AssetType.Ethereum
  },
  {
    imgUrl: './assets/hot.svg',
    label: 'Holochain',
    size: 45,
    symbol: 'hot',
    type: AssetType.Ethereum
  },
  {
    imgUrl: './assets/link.svg',
    label: 'Chainlink',
    size: 45,
    symbol: 'link',
    type: AssetType.Ethereum
  },
  // {
  //   imgUrl: './assets/gods.svg',
  //   label: 'Gods Unchained',
  //   size: 45,
  //   symbol: 'gods',
  //   type: AssetType.Ethereum
  // },
  {
    chainId: PolkadotChainId.EdgewareTestnet4,
    imgUrl: './assets/edg.svg',
    label: 'Edgeware',
    size: 45,
    symbol: AssetType.Polkadot,
    type: AssetType.Polkadot
  },
  {
    imgUrl: './assets/erc20.svg',
    label: 'Other ERC20 Tokens',
    size: 45,
    symbol: 'erc20',
    type: AssetType.Ethereum
  }
];

interface IAssetSelectorProps {
  active: boolean;
  selectedSymbol: string;
  selectedChainId?: PolkadotChainId;
  onClick: (type: AssetType, symbol: string, chainId?: PolkadotChainId) => void;
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
  selectedChainId,
  onClick
}) => {
  const assetNodes = assets.map(asset => {
    const isSelected =
      asset.symbol === selectedSymbol && asset.chainId === selectedChainId;
    const hasSelectedItem = !!selectedSymbol;
    const handleClick = () => onClick(asset.type, asset.symbol, asset.chainId);

    return (
      <div
        key={asset.symbol + asset.label}
        className={cn(
          'bx--tile grid-item',
          asset.main ? 'span-1' : 'span-2',
          isSelected ? 'selected' : hasSelectedItem ? 'not-selected' : ''
        )}
        onClick={handleClick}
      >
        {isSelected && <Checkmark />}
        <div className="bx--tile-content">
          <div className={asset.main ? 'asset-center' : 'asset-left'}>
            {isSelected ? (
              <object
                type="image/svg+xml"
                data={asset.imgUrl.replace('.svg', '_a.svg')}
                width={asset.size}
                height={asset.size}
              >
                <param
                  name="src"
                  value={asset.imgUrl.replace('.svg', '_a.svg')}
                />
              </object>
            ) : (
              <embed
                type="image/svg+xml"
                src={asset.imgUrl}
                height={asset.size}
                width={asset.size}
              />
            )}
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
