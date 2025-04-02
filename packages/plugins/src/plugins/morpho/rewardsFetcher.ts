import {
  EvmNetworkIdType,
  NetworkId,
  PortfolioElementMultiple,
  PortfolioElementType,
  getUsdValueSum,
  networks,
} from '@sonarwatch/portfolio-core';
import axios from 'axios';
import BigNumber from 'bignumber.js';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId } from './constants';
import { Cache } from '../../Cache';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

/* 
    As of April 2025, Morpho rewards are calculated off-chain.
    According to the Morpho team, the only way to access these rewards is 
    via the Morpho API, which is subject to a rate limit of 850 requests per minute.
    The exact formula used to compute rewards is currently closed-source, though the 
    team has expressed intentions to open-source it in the future.
*/

export type MorphoRewardsRes = {
  timestamp: string;
  pagination: {
    per_page: number;
    page: number;
    total_pages: number;
    next: null | number;
    prev: null | number;
  };
  data: RewardData[];
};

export type RewardData = {
  user: string;
  type: 'uniform-reward' | 'market-reward' | 'airdrop-reward';
  asset: Asset;
  program?: Program;
  program_id?: string;
  amount?: Amount;
  for_supply?: Amount;
  for_borrow?: Amount | null;
  for_collateral?: Amount | null;
  reallocated_from?: string;
};

export type Asset = {
  id: string;
  address: string;
  chain_id: number;
};

export type Program = {
  creator: string;
  start: string;
  end: string;
  created_at: string;
  blacklist: unknown[];
  type: string;
  distributor: Asset;
  asset: Asset;
  market_id: string;
  supply_rate_per_year: string;
  borrow_rate_per_year: string;
  collateral_rate_per_year: string;
  chain_id: number;
  id: string;
  cid_v0?: string;
  total_rewards?: string;
};

export type Amount = {
  total: string;
  claimable_now: string;
  claimable_next: string;
  claimed: string;
};

function calculateRawRewardBalances(data: MorphoRewardsRes['data']) {
  const balances: Record<string, bigint> = {};

  for (const entry of data) {
    const address = entry.asset?.address?.toLowerCase();
    if (!address) continue;

    let raw: bigint | null = null;

    if (entry.type === 'uniform-reward' || entry.type === 'airdrop-reward') {
      raw = BigInt(entry.amount?.claimable_now ?? '0');
    } else if (entry.type === 'market-reward') {
      raw = BigInt(entry.for_supply?.claimable_now ?? '0');
    }

    if (!raw || raw === BigInt(0)) continue;

    balances[address] = (balances[address] || BigInt(0)) + raw;
  }

  return Object.entries(balances).map(([address, total]) => ({
    address,
    balance: total.toString(),
  }));
}

const morphoRewardsApiUrl = 'https://rewards.morpho.org/v1';
export function getRewardsFetcher(networkId: EvmNetworkIdType): Fetcher {
  const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    const { data: rewardsRes } = await axios.get<MorphoRewardsRes>(
      `${morphoRewardsApiUrl}/users/${owner}/rewards`,
      {
        params: {
          chain_id: networks[networkId].chainId,
        },
        headers: {
          accept: 'application/json',
        },
      }
    );

    const rawRewards = calculateRawRewardBalances(rewardsRes.data);

    const tokenPricesMap = await cache.getTokenPricesAsMap(
      rawRewards.map((rewardToken) => rewardToken.address),
      networkId
    );

    /* 
        Context:
        The token price of Legacy Morpho is 0 (as indicated by the morpho team)
        Typically the sonarwatch code will ignore positions without a token price.
        It treats tokenPrice undefined and tokenPrice 0 the same
        The code below works around this by hard coding the token price of Legacy Morpho to 0
     */
    const rewardAssets = rawRewards.map((rewardAsset) => {
      const tokenPrice = tokenPricesMap.get(rewardAsset.address);

      // not Token Price of Legacy Morpho, therefore hardcode decimal to 18 when token not available
      const decimals = BigInt(tokenPrice?.decimals || 18);
      // Note: used BigNumber here because BigInt exponential operations are not supported in the current TypeScript target version.
      const balance = new BigNumber(rewardAsset.balance).dividedBy(
        new BigNumber(10).pow(new BigNumber(decimals.toString()))
      );

      return tokenPriceToAssetToken(
        rewardAsset.address,
        balance.toNumber(),
        networkId,
        tokenPrice,
        tokenPrice?.price || 0 // token price of Legacy Morpho is 0
      );
    });

    const rewardAssetsValue = getUsdValueSum(rewardAssets.map((a) => a.value));

    const element: PortfolioElementMultiple = {
      networkId,
      platformId,
      label: 'Rewards',
      type: PortfolioElementType.multiple,
      data: {
        assets: rewardAssets,
      },
      value: rewardAssetsValue,
    };

    return [element];
  };

  return {
    id: `${platformId}-${networkId}-rewards`,
    networkId: NetworkId.ethereum,
    executor,
  };
}

export default getRewardsFetcher;
