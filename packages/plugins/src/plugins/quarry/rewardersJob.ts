import axios, { AxiosResponse } from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId, rewardersUrl, rewardersCacheKey } from './constants';
import { Rewarder, RewardersApiRes } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const res: AxiosResponse<RewardersApiRes> = await axios
    .get(rewardersUrl)
    .catch((err) => {
      throw Error(`QUARRY_API ERR: ${err}`);
    });

  if (!res.data) {
    throw Error(`QUARRY_API NO RESPONSE`);
  }

  const { data } = res;

  if (!data) return;

  const rewarders = Object.entries(data).map(
    ([rewarder, rewarderData]) =>
      ({
        rewarder,
        ...rewarderData,
      } as Rewarder)
  );

  await cache.setItem(rewardersCacheKey, rewarders, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};
const job: Job = {
  id: `${platformId}-rewarders`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
