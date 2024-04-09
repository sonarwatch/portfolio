import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformByMint, platformId, poolsKey, stakePid } from './constants';
import { getParsedProgramAccounts } from '../../utils/solana';
import { StakeDepositReceiptStruct } from './structs';
import { stakeFilters } from './filters';
import { getClientSolana } from '../../utils/clients';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { PoolInfo } from './types';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const pools = await cache.getItem<PoolInfo[]>(poolsKey, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
  if (!pools) return [];

  const mintByPool: Map<string, string> = new Map();
  pools.forEach((pool) => mintByPool.set(pool.pubkey, pool.mint));

  const mints = pools.map((pool) => pool.mint);

  const tokenPricesById = await cache.getTokenPricesAsMap(
    mints,
    NetworkId.solana
  );

  const stakeAccounts = await getParsedProgramAccounts(
    client,
    StakeDepositReceiptStruct,
    stakePid,
    stakeFilters(owner)
  );
  if (stakeAccounts.length === 0) return [];

  const assetsByPlatform: Map<string, PortfolioAsset[]> = new Map();
  for (const stakeAccount of stakeAccounts) {
    if (stakeAccount.depositAmount.isZero()) continue;

    const mint = mintByPool.get(stakeAccount.stakePool.toString());
    if (!mint) continue;

    const tokenPrice = tokenPricesById.get(mint);
    if (!tokenPrice) continue;

    const platform = platformByMint.get(mint);
    if (!platform) continue;

    const lockedUntil = new Date(
      stakeAccount.depositTimestamp
        .plus(stakeAccount.lockupDuration)
        .times(1000)
        .toNumber()
    ).getTime();

    const asset = {
      ...tokenPriceToAssetToken(
        mint,
        stakeAccount.depositAmount
          .dividedBy(10 ** tokenPrice.decimals)
          .toNumber(),
        NetworkId.solana,
        tokenPrice
      ),
      attributes: {
        lockedUntil,
      },
    };

    const assetsOfPlatform = assetsByPlatform.get(platform);
    if (assetsOfPlatform) {
      assetsOfPlatform.push(asset);
      assetsByPlatform.set(platform, assetsOfPlatform);
    } else {
      assetsByPlatform.set(platform, [asset]);
    }
  }

  const elements: PortfolioElement[] = [];
  assetsByPlatform.forEach((assets, platform) =>
    elements.push({
      type: PortfolioElementType.multiple,
      label: 'Staked',
      networkId: NetworkId.solana,
      platformId: platform,
      data: { assets },
      value: getUsdValueSum(assets.map((asset) => asset.value)),
    })
  );

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
