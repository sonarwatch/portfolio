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
import { mSOLMint } from '../marinade/constants';

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
  // Wrapped BTC (Portal)
  {
    address: new PublicKey('4cSM2e6rvbGQUFiJbqytoVMi5GgghSMr8LwVrT9VPSPo'),
    tokens: [
      {
        mint: '3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh',
        networkdId: 'solana',
        decimals: 8,
      },
    ],
  },
  // Wrapped Ether (Wormhole)
  {
    address: new PublicKey('42amVS4KgzR9rA28tkVYqVXjq9Qa8dcZQMbH5EYFX6XC'),
    tokens: [
      {
        mint: '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs',
        networkdId: 'solana',
        decimals: 8,
      },
    ],
  },
  // mSOL
  {
    address: new PublicKey('5CKzb9j4ChgLUt8Gfm5CNGLN6khXKiqMbnGAW4cgXgxK'),
    tokens: [
      {
        mint: mSOLMint,
        networkdId: 'solana',
        decimals: 9,
      },
    ],
  },
  // Bonk
  {
    address: new PublicKey('DBE3N8uNjhKPRHfANdwGvCZghWXyLPdqdSbEW2XFwBiX'),
    tokens: [
      {
        mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
        networkdId: 'solana',
        decimals: 5,
      },
    ],
  },
  // Fida
  {
    address: new PublicKey('2cfmeuVBf7bvBJcjKBQgAwfvpUvdZV7K8NZxUEuccrub'),
    tokens: [
      {
        mint: 'EchesyfXePKdLtoiZSL8pBe8Myagyy8ZRqsACNCFGnvp',
        networkdId: 'solana',
        decimals: 6,
      },
    ],
  },
  // Pyth
  {
    address: new PublicKey('8vjchtMuJNY4oFQdTi8yCe6mhCaNBFaUbktT482TpLPS'),
    tokens: [
      {
        mint: 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3',
        networkdId: 'solana',
        decimals: 6,
      },
    ],
  },
  // HNT
  {
    address: new PublicKey('4DdmDswskDxXGpwHrXUfn2CNUm9rt21ac79GHNTN3J33'),
    tokens: [
      {
        mint: 'hntyVP6YFm1Hg25TN9WGLqM12b8TQmcknKrdu1oxWux',
        networkdId: 'solana',
        decimals: 8,
      },
    ],
  },
  // Orca
  {
    address: new PublicKey('4CBshVeNBEXz24GZpoj8SrqP5L7VGG3qjGd6tCST1pND'),
    tokens: [
      {
        mint: 'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE',
        networkdId: 'solana',
        decimals: 6,
      },
    ],
  },
  // Render
  {
    address: new PublicKey('HAm5DZhrgrWa12heKSxocQRyJWGCtXegC77hFQ8F5QTH'),
    tokens: [
      {
        mint: 'rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof',
        networkdId: 'solana',
        decimals: 8,
      },
    ],
  },
  // MNDE
  {
    address: new PublicKey('GHKcxocPyzSjy7tWApQjKRkDNuVXd4Kk624zhuaR7xhC'),
    tokens: [
      {
        mint: 'MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey',
        networkdId: 'solana',
        decimals: 9,
      },
    ],
  },
  // WIF
  {
    address: new PublicKey('6B23K3tkb51vLZA14jcEQVCA1pfHptzEHFA93V5dYwbT'),
    tokens: [
      {
        mint: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
        networkdId: 'solana',
        decimals: 6,
      },
    ],
  },
  // WEN
  {
    address: new PublicKey('CsG7wXoqZKNxx4UnFtvozfwXQ9RgpKe7zSJa4LWh5MT9'),
    tokens: [
      {
        mint: 'WENWENvqqNya429ubCdR81ZmD69brwQaaBYY6p3LCpk',
        networkdId: 'solana',
        decimals: 5,
      },
    ],
  },
  // USDe
  {
    address: new PublicKey('Cr8vurLth4b7CFNdvoXDpxuRi21CWvbQFLKy8BTwN4Wf'),
    tokens: [
      {
        mint: 'DEkqHyPN7GMRJ5cArtQFAWefqbZb33Hyf6s5iCwjEonT',
        networkdId: 'solana',
        decimals: 9,
      },
    ],
  },
  // sUSDe
  {
    address: new PublicKey('BjU7ZbbjJD2TinunF4AeEUhgJnRLwxMNqTcJesBFFm2m'),
    tokens: [
      {
        mint: 'Eh6XEPhSwoLv5wFApukmnaVSHQ6sAnoD9BmgmwQoN2sN',
        networkdId: 'solana',
        decimals: 9,
      },
    ],
  },
];

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();
  const sources = await getPythTokenPriceSources(connection, feedsToFetch);
  await cache.setTokenPriceSources(sources.filter((s) => s !== null));
};
const job: Job = {
  id: `${platformId}-pricing`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['realtime', NetworkId.solana],
};
export default job;
