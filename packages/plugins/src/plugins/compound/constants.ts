import {
  EvmNetworkIdType,
  NetworkId,
  Platform,
} from '@sonarwatch/portfolio-core';
import { MarketDetail } from './types';

export const platformId = 'compound';
export const platform: Platform = {
  id: platformId,
  name: 'Compound',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/compound.webp',
  defiLlamaId: 'parent#compound-finance', // from https://defillama.com/docs/api
  website: 'https://compound.finance/',
};

export const marketDetailsKey = 'marketsDetails';
export const comethTokenPricesPrefix = 'cometh-token-prices';
export const comptrollerV2Ethereum =
  '0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B';

export const marketDetails: Map<EvmNetworkIdType, MarketDetail[]> = new Map([
  [
    NetworkId.ethereum,
    [
      {
        networkId: NetworkId.ethereum,
        cometAddress: '0xc3d688b66703497daa19211eedff47f25384cdc3',
        cometRewardAddress: '0x1b0e765f6224c21223aea2af16c1c46e38885a40',
        baseAssetAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        baseAssetDecimals: 6,
        assets: [
          {
            address: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
            decimals: 18,
          },
          {
            address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
            decimals: 8,
          },
          {
            address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
          },
          {
            address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
            decimals: 18,
          },
          {
            address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
            decimals: 18,
          },
        ],
      },
      {
        networkId: NetworkId.ethereum,
        cometAddress: '0xa17581a9e3356d9a858b789d68b4d866e593ae94',
        cometRewardAddress: '0x1b0e765f6224c21223aea2af16c1c46e38885a40',
        baseAssetAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        baseAssetDecimals: 18,
        assets: [
          {
            address: '0xBe9895146f7AF43049ca1c1AE358B0541Ea49704',
            decimals: 18,
          },
          {
            address: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
            decimals: 18,
          },
        ],
      },
    ],
  ],
  [
    NetworkId.polygon,
    [
      {
        networkId: NetworkId.polygon,
        cometAddress: '0xF25212E676D1F7F89Cd72fFEe66158f541246445',
        cometRewardAddress: '0x45939657d1CA34A8FA39A924B71D28Fe8431e581',
        baseAssetAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        baseAssetDecimals: 6,
        assets: [
          {
            address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
            decimals: 18,
          },
          {
            address: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
            decimals: 8,
          },
          {
            address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
            decimals: 18,
          },
          {
            address: '0xfa68FB4628DFF1028CFEc22b4162FCcd0d45efb6',
            decimals: 18,
          },
          {
            address: '0x3A58a54C066FdC0f2D55FC9C89F0415C92eBf3C4',
            decimals: 18,
          },
        ],
      },
    ],
  ],
]);
