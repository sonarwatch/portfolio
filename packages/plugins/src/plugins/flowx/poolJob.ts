import {
  formatTokenAddress,
  NetworkId,
  TokenPriceSource,
  parseTypeString,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId, pairsOwner, lpDecimals } from './constants';
import { getClientSui } from '../../utils/clients';
import { getDynamicFields } from '../../utils/sui/getDynamicFields';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import { getLpTokenSourceRaw } from '../../utils/misc/getLpTokenSourceRaw';
import { PairObject, PairObjectFields } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();
  const pairIds = await getDynamicFields(client, pairsOwner).then((pairs) =>
    pairs.map((p) => p.objectId)
  );
  if (pairIds.length === 0) return;

  const lpSources: TokenPriceSource[] = [];

  const pairObjects = await multiGetObjects<PairObject>(client, pairIds, {
    showContent: true,
  });

  const pairInfos = pairObjects.map((pairInfo) => {
    if (!pairInfo.data?.content?.fields.value.fields) {
      return null;
    }

    const enhancedPairInfo: PairObjectFields =
      pairInfo.data?.content?.fields.value.fields;

    const { keys: coinTypeX } = parseTypeString(
      enhancedPairInfo.reserve_x.type
    );
    if (coinTypeX) {
      enhancedPairInfo.reserve_x.coinType = coinTypeX[0].type;
    }

    const { keys: coinTypeY } = parseTypeString(
      enhancedPairInfo.reserve_y.type
    );
    if (coinTypeY) {
      enhancedPairInfo.reserve_y.coinType = coinTypeY[0].type;
    }

    const { keys: coinType } = parseTypeString(enhancedPairInfo.lp_supply.type);
    if (coinType) {
      enhancedPairInfo.coinType = coinType[0].type;
    }

    return enhancedPairInfo;
  });

  // list coinTypes
  const coinTypes = new Set<string>();
  pairInfos.forEach((pairInfo) => {
    if (pairInfo) {
      if (
        pairInfo.reserve_x.coinType &&
        !coinTypes.has(pairInfo.reserve_x.coinType)
      )
        coinTypes.add(pairInfo.reserve_x.coinType);
      if (
        pairInfo.reserve_y.coinType &&
        !coinTypes.has(pairInfo.reserve_y.coinType)
      )
        coinTypes.add(pairInfo.reserve_y.coinType);
    }
  });

  // get tokenPrices
  const tokenPrices = await cache.getTokenPricesAsMap(
    [...coinTypes],
    NetworkId.sui
  );

  pairInfos.forEach((pairInfo) => {
    if (
      !pairInfo ||
      !pairInfo.reserve_x.coinType ||
      !pairInfo.reserve_y.coinType ||
      !pairInfo.coinType
    )
      return;

    const tokenPriceX = tokenPrices.get(
      formatTokenAddress(pairInfo.reserve_x.coinType, NetworkId.sui)
    );
    const tokenPriceY = tokenPrices.get(
      formatTokenAddress(pairInfo.reserve_y.coinType, NetworkId.sui)
    );

    if (!tokenPriceX || !tokenPriceY) return;

    const newLpSources = getLpTokenSourceRaw({
      networkId: NetworkId.sui,
      sourceId: pairInfo.coinType,
      platformId,
      priceUnderlyings: true,
      lpDetails: {
        address: pairInfo.coinType,
        decimals: lpDecimals,
        supplyRaw: pairInfo.lp_supply.fields.value,
      },
      poolUnderlyingsRaw: [
        {
          address: formatTokenAddress(
            pairInfo.reserve_x.coinType,
            NetworkId.sui
          ),
          decimals: tokenPriceX.decimals,
          reserveAmountRaw: pairInfo.reserve_x.fields.balance,
          weight: 0.5,
          tokenPrice: tokenPriceX,
        },
        {
          address: formatTokenAddress(
            pairInfo.reserve_y.coinType,
            NetworkId.sui
          ),
          decimals: tokenPriceY.decimals,
          reserveAmountRaw: pairInfo.reserve_y.fields.balance,
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
  id: `${platformId}-pool`,
  networkIds: [NetworkId.sui],
  executor,
  labels: ['normal', NetworkId.sui],
};
export default job;
