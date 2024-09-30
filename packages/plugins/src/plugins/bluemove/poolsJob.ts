import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { dexInfoId, lpDecimals, platformId } from './constants';
import { getClientSui } from '../../utils/clients';
import { getDynamicFieldObjects } from '../../utils/sui/getDynamicFieldObjects';
import { Pool } from './types';
import {
  formatTokenAddress,
  NetworkId,
  parseTypeString,
  TokenPriceSource,
} from '@sonarwatch/portfolio-core';
import { getLpTokenSourceRaw } from '../../utils/misc/getLpTokenSourceRaw';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();

  const pools = await getDynamicFieldObjects<Pool>(client, dexInfoId);

  const mints = new Set<string>();

  pools.forEach((pool) => {
    if (
      pool.data?.content?.fields.is_freeze ||
      !pool.data?.type ||
      !pool.data?.content?.fields.lsp_supply.type
    )
      return;

    let { keys: coinTypeKeys } = parseTypeString(pool.data.type);
    if (!coinTypeKeys) return;
    const coinTypeX = coinTypeKeys[0].type;
    const coinTypeY = coinTypeKeys[1].type;

    if (!coinTypeX || !coinTypeY) return;

    mints.add(coinTypeX);
    mints.add(coinTypeY);
  });

  const tokenPrices = await cache.getTokenPricesAsMap(mints, NetworkId.sui);
  const lpSources: TokenPriceSource[] = [];

  pools.forEach((pool) => {
    if (
      pool.data?.content?.fields.is_freeze ||
      !pool.data?.type ||
      !pool.data?.content?.fields.lsp_supply.type
    )
      return;

    let { keys: coinTypeKeys } = parseTypeString(pool.data.type);
    if (!coinTypeKeys) return;
    const coinTypeX = coinTypeKeys[0].type;
    const coinTypeY = coinTypeKeys[1].type;

    const { keys: lpCoinTypeKeys } = parseTypeString(
      pool.data.content.fields.lsp_supply.type
    );
    if (!lpCoinTypeKeys) return;
    const lpCoinType = lpCoinTypeKeys[0].type;

    if (!coinTypeX || !coinTypeY || !lpCoinType) return;

    const tokenPriceX = tokenPrices.get(coinTypeX);
    const tokenPriceY = tokenPrices.get(coinTypeY);

    if (!tokenPriceX || !tokenPriceY) return;

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
          decimals: tokenPriceX.decimals,
          reserveAmountRaw: pool.data.content.fields.reserve_x,
          weight: 0.5,
          tokenPrice: tokenPriceX,
        },
        {
          address: formatTokenAddress(coinTypeY, NetworkId.sui),
          decimals: tokenPriceY.decimals,
          reserveAmountRaw: pool.data.content.fields.reserve_y,
          weight: 0.5,
          tokenPrice: tokenPriceY,
        },
      ],
    });

    lpSources.push(...newLpSources);
  });

  await cache.setTokenPriceSources(lpSources);
};
const job: Job = {
  id: `${platformId}-pools`,
  executor,
  label: 'normal',
};
export default job;
