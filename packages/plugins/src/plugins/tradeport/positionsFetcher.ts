import {
  NetworkId,
  PortfolioElementType,
  PortfolioAsset,
  suiNetwork,
  getUsdValueSum,
  PortfolioAssetAttributes,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { locksCacheKey, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { Lock } from './types';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getStatusLabel, getTypeLabel } from './helpers';

const locksMemo = new MemoizedCache<Lock[]>(locksCacheKey, {
  prefix: platformId,
  networkId: NetworkId.sui,
});

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const allLocks = await locksMemo.getItem(cache);

  if (!allLocks) return [];

  const locks = allLocks.filter((lock) => lock.fields.maker === owner);

  if (!locks) return [];

  const suiTokenPrice = await cache.getTokenPrice(
    suiNetwork.native.address,
    NetworkId.sui
  );
  if (!suiTokenPrice) return [];

  const assets: PortfolioAsset[] = [];

  locks.forEach((lock) => {
    const attributes: PortfolioAssetAttributes = {
      tags: [],
    };

    if (lock.fields.expire_at) {
      attributes.lockedUntil = Number(lock.fields.expire_at);
    }

    const statusLabel = getStatusLabel(lock.fields.state);
    if (statusLabel) {
      attributes.tags?.push(statusLabel);
    }

    const typeLabel = getTypeLabel(lock.fields.lock_type);
    if (typeLabel) {
      attributes.tags?.push(typeLabel);
    }

    assets.push(
      tokenPriceToAssetToken(
        suiTokenPrice.address,
        new BigNumber(lock.fields.maker_price)
          .dividedBy(10 ** suiTokenPrice.decimals)
          .toNumber(),
        NetworkId.sui,
        suiTokenPrice,
        undefined,
        attributes
      )
    );
  });

  if (assets.length === 0) return [];

  return [
    {
      networkId: NetworkId.sui,
      platformId,
      type: PortfolioElementType.multiple,
      label: 'Deposit',
      name: 'Locks',
      data: { assets },
      value: getUsdValueSum(assets.map((asset) => asset.value)),
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-positions`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
