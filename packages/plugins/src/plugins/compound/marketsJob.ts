import { NetworkId, TokenPrice } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  comethTokenPricesPrefix,
  marketDetails,
  platformId,
} from './constants';

const executor: JobExecutor = async (cache: Cache) => {
  for (const [networkId, markets] of marketDetails.entries()) {
    const tokenAddresses = [
      ...new Set([
        ...markets.map((m) => m.baseAssetAddress),
        ...markets.map((m) => m.assets.map((a) => a.address)).flat(),
      ]),
    ];
    const tokenPrices = await cache.getTokenPrices(tokenAddresses, networkId);
    const tokenPricesObj: Record<string, TokenPrice> = {};
    tokenPrices.forEach((tokenPrice) => {
      if (!tokenPrice) return;
      tokenPricesObj[tokenPrice.address] = tokenPrice;
    });

    await cache.setItem(comethTokenPricesPrefix, tokenPricesObj, {
      networkId,
      prefix: platformId,
    });
  }
};
const job: Job = {
  id: `${platformId}-v3-markets`,
  networkIds: [NetworkId.ethereum, NetworkId.polygon],
  executor,
  labels: ['normal', NetworkId.ethereum, NetworkId.polygon],
};
export default job;
