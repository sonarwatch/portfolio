import {
  aptosNativeAddress,
  aptosNativeDecimals,
  NetworkId,
  Platform,
  solanaNativeAddress,
  solanaNativeDecimals,
  solanaNativeWrappedAddress,
  suiNativeAddress,
  suiNativeDecimals,
} from '@sonarwatch/portfolio-core';
import {
  usdcSuiDecimals,
  usdcSuiType,
  wusdcSuiDecimals,
  wUsdcSuiType,
} from '../../utils/sui/constants';
import { usdcSolanaDecimals, usdcSolanaMint } from '../../utils/solana';
import { CmcToken } from './types';

export const platformId = 'coinmarketcap';
export const platform: Platform = {
  id: platformId,
  name: 'CoinMarketCap',
};

export const cmcTokens: CmcToken[] = [
  {
    slug: 'solana',
    tokens: [
      {
        mint: solanaNativeAddress,
        decimals: solanaNativeDecimals,
        networkId: NetworkId.solana,
      },
      {
        mint: solanaNativeWrappedAddress,
        decimals: solanaNativeDecimals,
        networkId: NetworkId.solana,
      },
    ],
  },
  {
    slug: 'sui',
    tokens: [
      {
        mint: suiNativeAddress,
        decimals: suiNativeDecimals,
        networkId: NetworkId.sui,
      },
      {
        mint: '0x2::sui::SUI',
        decimals: suiNativeDecimals,
        networkId: NetworkId.sui,
      },
    ],
  },
  {
    slug: 'aptos',
    tokens: [
      {
        mint: aptosNativeAddress,
        decimals: aptosNativeDecimals,
        networkId: NetworkId.aptos,
      },
    ],
  },
  {
    slug: 'usd-coin',
    tokens: [
      {
        mint: wUsdcSuiType,
        decimals: wusdcSuiDecimals,
        networkId: NetworkId.sui,
      },
      {
        mint: usdcSuiType,
        decimals: usdcSuiDecimals,
        networkId: NetworkId.sui,
      },
      {
        mint: usdcSolanaMint,
        decimals: usdcSolanaDecimals,
        networkId: NetworkId.solana,
      },
    ],
  },
  {
    slug: 'tether',
    tokens: [
      {
        mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
        decimals: 6,
        networkId: NetworkId.solana,
      },
    ],
  },
  {
    slug: 'bonk1',
    tokens: [
      {
        mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
        decimals: 5,
        networkId: NetworkId.solana,
      },
    ],
  },
  {
    slug: 'dogwifhat',
    tokens: [
      {
        mint: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
        decimals: 6,
        networkId: NetworkId.solana,
      },
    ],
  },
];
