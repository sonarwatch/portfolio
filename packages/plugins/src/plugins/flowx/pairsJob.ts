import {
  formatTokenAddress,
  NetworkId,
  TokenPriceSource
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId, pairsOwner } from './constants';
import { getClientSui } from '../../utils/clients';
import { getDynamicFields } from '../../utils/sui/getDynamicFields';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import { extract } from './helpers';
import { getLpTokenSourceRaw } from '../../utils/misc/getLpTokenSourceRaw';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();
  const [pairIds] = await Promise.all([getDynamicFields(client, pairsOwner)
    .then((pairs) => pairs.map((p) => p.objectId))]);
  if (!pairIds.length) return;

  const lpSources: TokenPriceSource[] = [];

  const pairsInfos = await multiGetObjects(client, pairIds, {
    showContent: true,
  })
    .then((pis) => pis.map((pairInfo) => {
      const fields = pairInfo.data?.content?.fields as {
        value: {
          fields: {
            coinType: string | null;
            lp_supply: {
              type: string;
              fields: {
                value: string;
              };
            };
            reserve_x: {
              type: string;
              coinType: string | null;
              fields: {
                value: string;
                balance: string;
              };
            };
            reserve_y: {
              type: string;
              coinType: string | null;
              fields: {
                value: string;
                balance: string;
              };
            };
          };
        };
      };

      return fields.value.fields;
    }))
    .then((pis) => pis.map((pairInfo) => {
      // eslint-disable-next-line no-param-reassign
      pairInfo.reserve_x.coinType = extract(pairInfo.reserve_x.type, /<(.+)>$/);
      // eslint-disable-next-line no-param-reassign
      pairInfo.reserve_y.coinType = extract(pairInfo.reserve_y.type, /<(.+)>$/);
      // eslint-disable-next-line no-param-reassign
      pairInfo.coinType = extract(pairInfo.lp_supply.type, /y<(.+)>$/);

      return pairInfo;
    }));

  // list coinTypes
  const coinTypes = new Set<string>();
  pairsInfos.forEach((pairInfos) => {
    if (pairInfos.reserve_x.coinType && !coinTypes.has(pairInfos.reserve_x.coinType)) coinTypes.add(pairInfos.reserve_x.coinType);
    if (pairInfos.reserve_y.coinType && !coinTypes.has(pairInfos.reserve_y.coinType)) coinTypes.add(pairInfos.reserve_y.coinType);
  });

  // get tokenPrices
  const tokenPrices = await cache.getTokenPricesAsMap([...coinTypes], NetworkId.sui);

  pairsInfos.forEach((pairInfos) => {

    if (!pairInfos.reserve_x.coinType
      || !pairInfos.reserve_y.coinType
      || !pairInfos.coinType)
      return;

    const tokenPriceX = tokenPrices.get(formatTokenAddress(pairInfos.reserve_x.coinType, NetworkId.sui));
    const tokenPriceY = tokenPrices.get(formatTokenAddress(pairInfos.reserve_y.coinType, NetworkId.sui));

    if (!tokenPriceX || !tokenPriceY)
      return;

    const newLpSources = getLpTokenSourceRaw({
      networkId: NetworkId.sui,
      sourceId: pairInfos.coinType,
      platformId,
      lpDetails: {
        address: pairInfos.coinType,
        decimals: 8,
        supplyRaw: pairInfos.lp_supply.fields.value
      },
      poolUnderlyingsRaw: [
        {
          address: formatTokenAddress(pairInfos.reserve_x.coinType, NetworkId.sui),
          decimals: tokenPriceX.decimals,
          reserveAmountRaw: pairInfos.reserve_x.fields.balance,
          weight: 0.1,
          tokenPrice: tokenPriceX
        },
        {
          address: formatTokenAddress(pairInfos.reserve_y.coinType, NetworkId.sui),
          decimals: tokenPriceY.decimals,
          reserveAmountRaw: pairInfos.reserve_y.fields.balance,
          weight: 0.1,
          tokenPrice: tokenPriceY
        }
      ]
    })

    lpSources.push(...newLpSources);
  });

  await cache.setTokenPriceSources(lpSources);
};

const job: Job = {
  id: `${platformId}-pairs`,
  executor,
  label: 'normal',
};
export default job;
