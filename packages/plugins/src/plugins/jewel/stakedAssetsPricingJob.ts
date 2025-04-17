import {
  formatTokenAddress,
  NetworkId,
  walletTokensPlatformId,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId, stakedAssetInfos } from './constants';

const executor: JobExecutor = async (cache: Cache) => {
  const tokenPriceById = await cache.getTokenPricesAsMap(
    stakedAssetInfos.map((info) => info.underlying),
    NetworkId.sui
  );

  const promises: Promise<void>[] = [];
  stakedAssetInfos.forEach((info) => {
    const underlyingTokenPrice = tokenPriceById.get(
      formatTokenAddress(info.underlying, NetworkId.sui)
    );
    if (!underlyingTokenPrice) return;

    promises.push(
      cache.setTokenPriceSource({
        address: info.asset,
        decimals: underlyingTokenPrice.decimals,
        id: platformId,
        networkId: NetworkId.sui,
        platformId: walletTokensPlatformId,
        price: underlyingTokenPrice.price,
        timestamp: Date.now(),
        weight: 0.01,
      })
    );
  });

  await Promise.all(promises);
};
const job: Job = {
  id: `${platformId}-assets-pricing`,
  networkIds: [NetworkId.sui],
  executor,
  labels: ['normal', NetworkId.sui],
};
export default job;
