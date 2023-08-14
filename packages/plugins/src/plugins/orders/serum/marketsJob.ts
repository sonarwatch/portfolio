import axios, { AxiosResponse } from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../../Cache';
import { Job, JobExecutor } from '../../../Job';
import {
  platformId,
  serumMarketPrefix,
  serumMarketUrl,
  serumProgramId,
} from '../constants';
import { SerumMarket } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const swapsResponse: AxiosResponse<SerumMarket[]> | null = await axios
    .get(serumMarketUrl)
    .catch(() => null);
  if (!swapsResponse) return;
  const serumMarkets = swapsResponse.data.filter(
    (market) => market.programId === serumProgramId.toString()
  );
  const promises = serumMarkets.map((market) =>
    cache.setItem(market.address, market, {
      prefix: serumMarketPrefix,
      networkId: NetworkId.solana,
    })
  );
  await Promise.allSettled(promises);
};

const job: Job = {
  id: `${platformId}-markets`,
  executor,
};
export default job;
