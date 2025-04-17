import {
  NetworkId,
  formatTokenAddress,
  parseTypeString,
  walletTokensPlatformId,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  poolAccRewardPerShareKey,
  alpDecimals,
  alpType,
  depositVaultRegistry,
  platformId,
  poolObjectId,
  abexMarketCacheKey,
} from './constants';
import { getClientSui } from '../../utils/clients';
import { getDynamicFields } from '../../utils/sui/getDynamicFields';
import { Market, Pool } from './types';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import getLpTokenSourceRawOld, {
  PoolUnderlyingRaw,
} from '../../utils/misc/getLpTokenSourceRawOld';
import { getObject } from '../../utils/sui/getObject';
import { getMarketInfo } from './helpers';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();

  // Abex market
  const marketInfo = await getMarketInfo(client);
  const { lpSupply } = marketInfo;
  if (!lpSupply) return;

  await cache.setItem(abexMarketCacheKey, marketInfo, {
    prefix: platformId,
    networkId: NetworkId.sui,
  });

  // Pool
  const poolObject = await getObject<Pool>(client, poolObjectId);
  const accRewardPerShare =
    poolObject.data?.content?.fields.acc_reward_per_share;
  if (accRewardPerShare) {
    await cache.setItem(poolAccRewardPerShareKey, accRewardPerShare, {
      prefix: platformId,
      networkId: NetworkId.sui,
    });
  }

  const depositVaultFields = await getDynamicFields(
    client,
    depositVaultRegistry
  );
  const objects = await multiGetObjects<Market>(
    client,
    depositVaultFields.map((f) => f.objectId)
  );

  const uTypes: string[] = [];
  objects.forEach((o) => {
    const oType = o.data?.content?.fields.value.type;
    if (!oType) return;
    const uType = parseTypeString(oType).keys?.at(0)?.type;
    if (!uType) return;
    uTypes.push(uType);
  });

  const tokenPrices = await cache.getTokenPricesAsMap(uTypes, NetworkId.sui);

  const lpUnderlyings: PoolUnderlyingRaw[] = [];
  for (let i = 0; i < objects.length; i++) {
    const object = objects[i];
    const market = object.data?.content?.fields;
    if (!market) return;

    const uType = parseTypeString(market.value.type).keys?.at(0)?.type;
    if (!uType) return;

    const tokenPrice = tokenPrices.get(
      formatTokenAddress(uType, NetworkId.sui)
    );
    if (!tokenPrice) return;

    const amount = new BigNumber(market.value.fields.liquidity).plus(
      market.value.fields.reserved_amount
    );
    lpUnderlyings.push({
      address: uType,
      decimals: tokenPrice.decimals,
      reserveAmountRaw: amount,
      price: tokenPrice.price,
    });
  }

  const lpSource = getLpTokenSourceRawOld(
    NetworkId.sui,
    platformId,
    platformId,
    {
      address: alpType,
      decimals: alpDecimals,
      supplyRaw: new BigNumber(lpSupply),
    },
    lpUnderlyings,
    'Vaults'
  );
  await cache.setTokenPriceSource({
    id: 'alp',
    networkId: NetworkId.sui,
    platformId: walletTokensPlatformId,
    address: alpType,
    decimals: alpDecimals,
    price: lpSource.price,
    elementName: undefined,
    underlyings: undefined,
    weight: 1,
    timestamp: Date.now(),
  });
};
const job: Job = {
  id: `${platformId}-markets`,
  networkIds: [NetworkId.sui],
  executor,
  labels: ['normal', NetworkId.sui],
};
export default job;
