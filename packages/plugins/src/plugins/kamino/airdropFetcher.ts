import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { allocationPrefix, kaminoPlatform, platformId } from './constants';
import { driftPlatform, preMarketPriceKey } from '../drift/constants';
import { getAllocationsBySeason } from './helpers/common';

const oneDayInMs = 24 * 60 * 60 * 1000;
const kmnkoPreMarketPriceKey = `${preMarketPriceKey}-KMNO`;

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const premarketPrice = await cache.getItem<number>(kmnkoPreMarketPriceKey, {
    prefix: driftPlatform.id,
    networkId: NetworkId.solana,
  });

  const cachedAllocation = await cache.getItem<number>(owner, {
    prefix: allocationPrefix,
    networkId: NetworkId.solana,
  });

  let amount: BigNumber | undefined;
  if (cachedAllocation) {
    amount = new BigNumber(cachedAllocation);
  } else {
    const allocations = await getAllocationsBySeason(owner, 1);
    if (allocations) {
      amount = allocations
        .map((alloc) => new BigNumber(alloc.quantity))
        .reduce((alloc, sum) => sum.plus(alloc), new BigNumber(0));

      await cache.setItem(owner, amount.toNumber(), {
        prefix: allocationPrefix,
        networkId: NetworkId.solana,
        ttl: oneDayInMs,
      });
    }
  }
  if (!amount || amount.isZero()) return [];

  const asset: PortfolioAsset = {
    networkId: NetworkId.solana,
    type: 'generic',
    value: !premarketPrice ? null : amount.times(premarketPrice).toNumber(),
    data: {
      name: 'KMNO',
      amount: amount.toNumber(),
      price: premarketPrice || null,
      imageUri: kaminoPlatform.image,
    },
    attributes: { isClaimable: false },
  };
  return [
    {
      value: asset.value,
      type: PortfolioElementType.multiple,
      platformId,
      name: 'Season 1 Allocation',
      networkId: NetworkId.solana,
      label: 'Rewards',
      data: { assets: [asset] },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-airdrop`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
