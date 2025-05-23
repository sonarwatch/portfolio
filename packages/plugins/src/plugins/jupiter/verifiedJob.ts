import { NetworkId } from '@sonarwatch/portfolio-core';
import axios from 'axios';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId } from './exchange/constants';
import { TokenResponse } from './types';
import { jupApiParams, verifiedTokensCacheKey } from './constants';

const executor: JobExecutor = async (cache: Cache) => {
  const verifiedTokens = await axios.get<TokenResponse[]>(
    `https://tokens.jup.ag/tokens?tags=verified&${jupApiParams ?? ''}`
  );

  await cache.setItem(
    verifiedTokensCacheKey,
    verifiedTokens.data
      .sort((a, b) => b.daily_volume - a.daily_volume)
      .slice(0, 1000),
    {
      prefix: platformId,
      networkId: NetworkId.solana,
    }
  );
};
const job: Job = {
  id: `${platformId}-verified`,
  executor,
  labels: ['normal'],
};
export default job;
