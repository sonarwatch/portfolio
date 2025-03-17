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
import { ParsedAccount } from '../../utils/solana';

const allVaultsMemo = new MemoizedCache<ParsedAccount<Vault>[]>(
  unstakingNftsCacheKey,
  {
    prefix: unstakingNftsCachePrefix,
    networkId: NetworkId.solana,
  }
);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  // NFTs for active positions are in wallet
  // NFTS for unstaking positions are in 'unstakingOwner' wallet

  const allVaults = await allVaultsMemo.getItem(cache);

  if (!allVaults) throw new Error('Vaults not cached');

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
    if (!tokenPrice || !vault.withdrawalRequest) return;

    const unlockingAt = new Date(
      new BigNumber(vault.withdrawalRequest.timestampInSec)
        .plus(7 * 24 * 60 * 60)
        .times(1000)
        .toNumber()
    );

    const isClaimable = unlockingAt.getTime() < Date.now();

    assets.push({
      ...tokenPriceToAssetToken(
        vault.stakeMint,
        new BigNumber(vault.stakeAmount)
          .dividedBy(10 ** tokenPrice.decimals)
          .toNumber(),
        NetworkId.solana,
        tokenPrice,
        undefined,
        {
          isClaimable,
          lockedUntil: unlockingAt.getTime(),
        }
      ),
      ref: vault.pubkey.toString(),
    });
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
        link: 'https://app.picasso.network/restake',
      },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-unstaking-positions`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
