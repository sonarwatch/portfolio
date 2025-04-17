import {
  formatTokenAddress,
  NetworkId,
  parseTypeString,
  TokenPriceSource,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { dexInfoId, lpDecimals, platformId } from './constants';
import { getClientSui } from '../../utils/clients';
import { getDynamicFieldObjects } from '../../utils/sui/getDynamicFieldObjects';
import { Pool } from './types';
import { getLpTokenSourceRaw } from '../../utils/misc/getLpTokenSourceRaw';
import { getCachedDecimalsForToken } from '../../utils/misc/getCachedDecimalsForToken';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();

  const pools = await getDynamicFieldObjects<Pool>(client, dexInfoId);

  const mints = new Set<string>();

  pools.forEach((pool) => {
    if (
      !pool.data ||
      !pool.data.type ||
      pool.data.content?.fields.is_freeze ||
      !pool.data.content?.fields.lsp_supply?.type
    )
      return;

    const { keys: coinTypeKeys } = parseTypeString(pool.data.type);
    if (!coinTypeKeys) return;
    const coinTypeX = coinTypeKeys[0].type;
    const coinTypeY = coinTypeKeys[1].type;

    if (!coinTypeX || !coinTypeY) return;

    mints.add(coinTypeX);
    mints.add(coinTypeY);
  });

  const tokenPrices = await cache.getTokenPricesAsMap(mints, NetworkId.sui);
  const lpSources: TokenPriceSource[] = [];

  for (const pool of pools) {
    if (
      !pool.data ||
      !pool.data.type ||
      pool.data.content?.fields.is_freeze ||
      !pool.data.content?.fields.lsp_supply?.type
    )
      continue;

    const { keys: coinTypeKeys } = parseTypeString(pool.data.type);
    if (!coinTypeKeys) continue;
    const coinTypeX = coinTypeKeys[0].type;
    const coinTypeY = coinTypeKeys[1].type;

    const { keys: lpCoinTypeKeys } = parseTypeString(
      pool.data.content.fields.lsp_supply.type
    );
    if (!lpCoinTypeKeys) continue;
    const lpCoinType = lpCoinTypeKeys[0].type;

    if (!coinTypeX || !coinTypeY || !lpCoinType) continue;

    const tokenPriceX = tokenPrices.get(coinTypeX);
    const tokenPriceY = tokenPrices.get(coinTypeY);

    const decimalsX = tokenPriceX
      ? tokenPriceX.decimals
      : await getCachedDecimalsForToken(cache, coinTypeX, NetworkId.sui);
    const decimalsY = tokenPriceY
      ? tokenPriceY.decimals
      : await getCachedDecimalsForToken(cache, coinTypeY, NetworkId.sui);

    if (!decimalsX || !decimalsY) continue;

    const newLpSources = getLpTokenSourceRaw({
      networkId: NetworkId.sui,
      sourceId: lpCoinType,
      platformId,
      priceUnderlyings: true,
      lpDetails: {
        address: lpCoinType,
        decimals: lpDecimals,
        supplyRaw: pool.data.content.fields.lsp_supply.fields.value,
      },
      poolUnderlyingsRaw: [
        {
          address: formatTokenAddress(coinTypeX, NetworkId.sui),
          decimals: decimalsX,
          reserveAmountRaw: pool.data.content.fields.reserve_x,
          weight: 0.5,
          tokenPrice: tokenPriceX,
        },
        {
          address: formatTokenAddress(coinTypeY, NetworkId.sui),
          decimals: decimalsY,
          reserveAmountRaw: pool.data.content.fields.reserve_y,
          weight: 0.5,
          tokenPrice: tokenPriceY,
        },
      ],
    });

    lpSources.push(...newLpSources);
  }

  await cache.setTokenPriceSources(lpSources);
};
const job: Job = {
  id: `${platformId}-pools`,
  networkIds: [NetworkId.sui],
  executor,
  labels: ['normal', NetworkId.sui],
};
export default job;
