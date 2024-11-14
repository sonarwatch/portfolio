import { PublicKey } from '@solana/web3.js';
import {
  aptosNativeAddress,
  aptosNativeDecimals,
  NetworkId,
  solanaNativeAddress,
  solanaNativeDecimals,
  solanaNativeWrappedAddress,
  suiNativeAddress,
  suiNativeDecimals,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import {
  FeedInfo,
  getPythTokenPriceSources,
} from '../../utils/solana/pyth/helpers';
import {
  usdcSuiDecimals,
  usdcSuiType,
  wusdcSuiDecimals,
  wUsdcSuiType,
} from '../../utils/sui/constants';
import { usdcSolanaDecimals, usdcSolanaMint } from '../../utils/solana';

const feedsToFetch: FeedInfo[] = [
  // SOL
  {
    address: new PublicKey('H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG'),
    tokens: [
      {
        mint: solanaNativeAddress,
        decimals: solanaNativeDecimals,
        networkdId: NetworkId.solana,
      },
      {
        mint: solanaNativeWrappedAddress,
        decimals: solanaNativeDecimals,
        networkdId: NetworkId.solana,
      },
    ],
  },
  // SUI
  {
    address: new PublicKey('3Qub3HaAJaa2xNY7SUqPKd3vVwTqDfDDkEUMPjXD2c1q'),
    tokens: [
      {
        mint: suiNativeAddress,
        decimals: suiNativeDecimals,
        networkdId: NetworkId.sui,
      },
      {
        mint: '0x2::sui::SUI',
        decimals: suiNativeDecimals,
        networkdId: NetworkId.sui,
      },
    ],
  },
  // APT
  {
    address: new PublicKey('FNNvb1AFDnDVPkocEri8mWbJ1952HQZtFLuwPiUjSJQ'),
    tokens: [
      {
        mint: aptosNativeAddress,
        decimals: aptosNativeDecimals,
        networkdId: NetworkId.aptos,
      },
    ],
  },
  // USDC
  {
    address: new PublicKey('Gnt27xtC473ZT2Mw5u8wZ68Z3gULkSTb5DuxJy7eJotD'),
    tokens: [
      {
        mint: wUsdcSuiType,
        decimals: wusdcSuiDecimals,
        networkdId: NetworkId.sui,
      },
      {
        mint: usdcSuiType,
        decimals: usdcSuiDecimals,
        networkdId: NetworkId.sui,
      },
      {
        mint: usdcSolanaMint,
        decimals: usdcSolanaDecimals,
        networkdId: NetworkId.solana,
      },
    ],
  },

  // USDT
  {
    address: new PublicKey('3vxLXJqLqF3JG5TCbYycbKWRBbCJQLxQmBGCkyqEEefL'),
    tokens: [
      {
        mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
        decimals: 6,
        networkdId: NetworkId.solana,
      },
    ],
  },
  // wsETH
  {
    address: new PublicKey('8QFEAwdamHFFRnj3Swnv1CkVNZBeFiVzraC548xhmpT5'),
    tokens: [
      {
        mint: 'ZScHuTtqZukUrtZS43teTKGs2VqkKL8k4QCouR2n6Uo',
        decimals: 8,
        networkdId: NetworkId.solana,
      },
    ],
  },
  // MOD
  {
    address: new PublicKey('BNnzTdorVyW4ttRAoXvohD46Q8ycN8LCHz2CGV4pUH7S'),
    tokens: [
      {
        mint: '0x6f986d146e4a90b828d8c12c14b6f4e003fdff11a8eecceceb63744363eaac01::mod_coin::MOD',
        decimals: 8,
        networkdId: NetworkId.aptos,
      },
    ],
  },
];

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();
  const sources = await getPythTokenPriceSources(connection, feedsToFetch);
  await cache.setTokenPriceSources(sources);
};
const job: Job = {
  id: `${platformId}-pricing`,
  executor,
  label: 'coingecko',
};
export default job;
