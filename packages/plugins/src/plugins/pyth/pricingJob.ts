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

// https://www.pyth.network/developers/price-feed-ids#solana-price-feed-accounts
const feedsToFetch: FeedInfo[] = [
  // SOL
  {
    address: new PublicKey('7UVimffxr9ow1uXYxsr4LHAcV58mLzhmwaeKvJ1pjLiE'),
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
    address: new PublicKey('GgV3a7YeVRga9prjNGEDBG9NwatSaD8rwjZ4GNjPiXTq'),
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
    address: new PublicKey('9oR3Uh2zsp1CxLdsuFrg3QhY2eZ2e5eLjDgDfZ6oG2ev'),
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
    address: new PublicKey('Dpw1EAVrSB1ibxiDQyTAW6Zip3J4Btk2x4SgApQCeFbX'),
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
    address: new PublicKey('HT2PLQBcG5EiCcNSaMHAjSgd9F98ecpATbk4Sk5oYuM'),
    tokens: [
      {
        mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
        decimals: 6,
        networkdId: NetworkId.solana,
      },
    ],
  },
  // wstETH
  {
    address: new PublicKey('HyoTrHkmhM8YETBagUFqtT95JpkFWtLDtL3uQHsLVT5j'),
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
    address: new PublicKey('37MmKHDVspCyZtXkjfLD2xHiiEV1WwNNsRkJxAdvvb33'),
    tokens: [
      {
        mint: '0x6f986d146e4a90b828d8c12c14b6f4e003fdff11a8eecceceb63744363eaac01::mod_coin::MOD',
        decimals: 8,
        networkdId: NetworkId.aptos,
      },
    ],
  },
  // USDS
  {
    address: new PublicKey('DyYBBWEi9xZvgNAeMDCiFnmC1U9gqgVsJDXkL5WETpoX'),
    tokens: [
      {
        decimals: 6,
        mint: 'USDSwr9ApdHk5bvJKMjzff41FfuX8bSxdKcR81vTwcA',
        networkdId: NetworkId.solana,
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
  label: 'realtime',
};
export default job;
