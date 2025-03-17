import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { custodiesKey, platformId, poolsKey } from './constants';
import { getClientSolana } from '../../utils/clients';
import {
  getParsedMultipleAccountsInfo,
  usdcSolanaMint,
} from '../../utils/solana';
import { flpStakeStruct } from './structs';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getPdas } from './helpers';
import { CustodyInfo, PoolInfo } from './types';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const stakeAccounts = await getParsedMultipleAccountsInfo(
    client,
    flpStakeStruct,
    getPdas(owner)
  );
  if (!stakeAccounts.some((account) => account !== null)) return [];

  const [poolsInfo, custodiesInfo] = await Promise.all([
    cache.getItem<PoolInfo[]>(poolsKey, {
      prefix: platformId,
      networkId: NetworkId.solana,
    }),
    cache.getItem<CustodyInfo[]>(custodiesKey, {
      prefix: platformId,
      networkId: NetworkId.solana,
    }),
  ]);
  if (!poolsInfo) throw new Error('Pools not cached');
  if (!custodiesInfo) throw new Error('Custodies not cached');

  const custodiesByPool: Map<string, CustodyInfo> = new Map();
  custodiesInfo.forEach((custody) =>
    custodiesByPool.set(custody.pool, custody)
  );

  const poolInfoById: Map<string, PoolInfo> = new Map();
  poolsInfo.map((pool) => poolInfoById.set(pool.pkey, pool));

  const tokenPriceById = await cache.getTokenPricesAsMap(
    [...poolsInfo.map((info) => info.flpMint), usdcSolanaMint],
    NetworkId.solana
  );
  const usdcTokenPrice = tokenPriceById.get(usdcSolanaMint);

  const elements: PortfolioElement[] = [];
  for (let j = 0; j < stakeAccounts.length; j++) {
    const assets: PortfolioAsset[] = [];
    const stakeAccount = stakeAccounts[j];
    if (!stakeAccount) continue;

    const poolInfo = poolInfoById.get(stakeAccount.pool.toString());
    if (!poolInfo) continue;

    const flpTokenPrice = tokenPriceById.get(poolInfo.flpMint);
    if (!flpTokenPrice) continue;

    const flpFacotr = 10 ** flpTokenPrice.decimals;
    if (!stakeAccount.stakeStats.activeAmount.isZero()) {
      const amount = stakeAccount.stakeStats.activeAmount.dividedBy(flpFacotr);
      assets.push(
        tokenPriceToAssetToken(
          flpTokenPrice.address,
          amount.toNumber(),
          NetworkId.solana,
          flpTokenPrice
        )
      );
    }

    if (!stakeAccount.stakeStats.pendingActivation.isZero()) {
      const amount =
        stakeAccount.stakeStats.pendingActivation.dividedBy(flpFacotr);
      assets.push(
        tokenPriceToAssetToken(
          flpTokenPrice.address,
          amount.toNumber(),
          NetworkId.solana,
          flpTokenPrice,
          undefined,
          {
            tags: ['Activation Pending'],
          }
        )
      );
    }

    if (!stakeAccount.stakeStats.pendingDeactivation.isZero()) {
      const amount =
        stakeAccount.stakeStats.pendingDeactivation.dividedBy(flpFacotr);
      assets.push(
        tokenPriceToAssetToken(
          flpTokenPrice.address,
          amount.toNumber(),
          NetworkId.solana,
          flpTokenPrice,
          undefined,
          {
            tags: ['Deactivation Pending'],
          }
        )
      );
    }

    const watermark = stakeAccount.stakeStats.activeAmount
      .multipliedBy(poolInfo.rewardPerLp)
      .dividedBy(flpFacotr);
    const unclaimedAmount = watermark
      .minus(stakeAccount.rewardSnapshot)
      .plus(stakeAccount.unclaimedRewards)
      .times(stakeAccount.feeShareBps)
      .dividedBy(10 ** 10);

    if (!unclaimedAmount.isZero())
      assets.push({
        ...tokenPriceToAssetToken(
          usdcSolanaMint,
          unclaimedAmount.toNumber(),
          NetworkId.solana,
          usdcTokenPrice
        ),
        attributes: { isClaimable: true },
      });

    if (assets.length !== 0)
      elements.push({
        networkId: NetworkId.solana,
        label: 'Staked',
        platformId,
        type: PortfolioElementType.multiple,
        value: getUsdValueSum(assets.map((asset) => asset.value)),
        data: {
          assets,
        },
      });
  }

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-stake`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
