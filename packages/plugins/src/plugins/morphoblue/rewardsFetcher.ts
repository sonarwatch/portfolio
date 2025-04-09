import {
  EvmNetworkIdType,
  PortfolioElementMultiple,
  PortfolioElementType,
  ethereumNetwork,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';

import BigNumber from 'bignumber.js';
import { Address, getAddress } from 'viem';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { Cache } from '../../Cache';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getRewards } from './api';
import { MorphoRewardsRes } from './types';
import { platformId } from './constants';

/* 
    As of April 2025, Morpho rewards are calculated off-chain.
    According to the Morpho team, the only way to access these rewards is 
    via the Morpho API, which is subject to a rate limit of 850 requests per minute.
    The exact formula used to compute rewards is currently closed-source, though the 
    team has expressed intentions to open-source it in the future.
*/

function calculateRawRewardBalances(data: MorphoRewardsRes['data']) {
  const balances: Record<Address, bigint> = {};

  for (const entry of data) {
    const address = entry.asset?.address
      ? getAddress(entry.asset?.address)
      : undefined;
    if (!address) continue;

    let raw: bigint | undefined;

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

export function getRewardsFetcher(networkId: EvmNetworkIdType): Fetcher {
  const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    const rewardsRes = await getRewards(owner, networkId);

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
        The code below works around this by assuming the token price of Legacy Morpho is 0
     */
    const rewardAssets = rawRewards.map((rewardAsset) => {
      const tokenPrice = tokenPricesMap.get(rewardAsset.address);

      // token price of Legacy Morpho is  0
      const decimals = BigInt(
        tokenPrice?.decimals || ethereumNetwork.native.decimals
      );
      // Note: used BigNumber here because BigInt exponential operations are not supported in the current TypeScript target version.
      const decimalsBN = new BigNumber(decimals.toString());
      const divisor = new BigNumber(10).pow(decimalsBN);
      const rawBalance = new BigNumber(rewardAsset.balance);
      const balance = rawBalance.dividedBy(divisor);

      return tokenPriceToAssetToken(
        rewardAsset.address,
        balance.toNumber(),
        networkId,
        tokenPrice,
        tokenPrice?.price || 0 // token price of Legacy Morpho should be 0
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
    networkId,
    executor,
  };
}

export default getRewardsFetcher;
