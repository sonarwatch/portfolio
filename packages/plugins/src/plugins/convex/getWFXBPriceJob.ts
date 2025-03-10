import { NetworkId } from '@sonarwatch/portfolio-core';
import { Job, JobExecutor } from '../../Job';
import { platformId, wFXBAddress } from './constants';

import { Cache } from '../../Cache';

const executor: JobExecutor = async (cache: Cache) => {
  // We get this price from the curve pools check plugins/curve/getPoolTokenPrices.ts
  // we use its price to get the price of WFXB on Fraxtal
  const FXB20291231Address = '0xF1e2b576aF4C6a7eE966b14C810b772391e92153';

  const tokenPrice = await cache.getTokenPrice(
    FXB20291231Address,
    NetworkId.fraxtal
  );

  await cache.setTokenPriceSource({
    address: wFXBAddress,
    decimals: tokenPrice?.decimals as number,
    id: platformId,
    networkId: NetworkId.fraxtal,
    platformId,
    price: tokenPrice?.price as number,
    timestamp: tokenPrice?.timestamp as number,
    weight: 1,
  });
};

const job: Job = {
  id: `${platformId}-fraxtal-wfxb`,
  executor,
  labels: ['normal'],
};
export default job;
