import {
  aptosNativeAddress,
  aptosNativeDecimals,
  NetworkId,
  NetworkIdType,
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

export const platformId = 'coinmarketcap';
export const platform: Platform = {
  id: platformId,
  name: 'CoinMarketCap',
  image: 'https://sonar.watch/img/platforms/coinmarketcap.webp',
  // defiLlamaId: 'pyth-network', // from https://defillama.com/docs/api
  website: 'https://coinmarketcap.com/',
  // twitter: 'https://twitter.com/PythNetwork',
};

export const cmcTokens: {
  slug: string;
  tokens: { mint: string; decimals: number; networkId: NetworkIdType }[];
}[] = [
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
];
