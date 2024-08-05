import {
  NetworkId,
  PortfolioAssetToken,
  PortfolioElementType,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import {
  platformId,
  unstakingNftsCacheKey,
  unstakingNftsCachePrefix,
} from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { Vault } from './types';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';

const allVaultsMemo = new MemoizedCache<Vault[]>(unstakingNftsCacheKey, {
  prefix: unstakingNftsCachePrefix,
  networkId: NetworkId.solana,
});

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  // NFTs for active positions are in wallet
  // NFTS for unstaking positions are in 'unstakingOwner' wallet

  const allVaults = await allVaultsMemo.getItem(cache);

  if (!allVaults || allVaults.length === 0) return [];

  const myVaults = allVaults.filter(
    (v) => v.withdrawalRequest?.owner === owner
  );

  if (myVaults.length === 0) return [];

  const tokenMints = [
    ...new Set(myVaults.map((vault) => vault.stakeMint).flat()),
  ];

  const tokenPrices = await cache.getTokenPricesAsMap(
    tokenMints,
    NetworkId.solana
  );

  const assets: PortfolioAssetToken[] = [];

  myVaults.forEach((vault) => {
    const tokenPrice = tokenPrices.get(vault.stakeMint);
    if (!tokenPrice) return;
    assets.push(
      tokenPriceToAssetToken(
        vault.stakeMint,
        new BigNumber(vault.stakeAmount)
          .dividedBy(10 ** tokenPrice.decimals)
          .toNumber(),
        NetworkId.solana,
        tokenPrice
      )
    );
  });

  if (assets.length === 0) return [];

  return [
    {
      networkId: NetworkId.solana,
      label: 'Staked',
      platformId,
      type: PortfolioElementType.multiple,
      value: getUsdValueSum(assets.map((a) => a.value)),
      data: {
        assets,
      },
      tags: ['Unstaking'],
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-unstaking-positions`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
