import { NetworkId, yieldFromApy } from '@sonarwatch/portfolio-core';
import axios from 'axios';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { crtMint, platformId } from './constants';

const executor: JobExecutor = async (cache: Cache) => {
  const apiRes = await axios.get<{ apy: number }>(
    `https://api.deficarrot.com/performance?vault=FfCRL34rkJiMiX5emNDrYp3MdWH2mES3FvDQyFppqgpJ&useCache=true`
  );

  if (apiRes.data.apy) {
    await cache.setTokenYield({
      address: crtMint,
      networkId: NetworkId.solana,
      yield: yieldFromApy(apiRes.data.apy),
      timestamp: Date.now(),
    });
  }
};

const job: Job = {
  id: `${platformId}-crt-yield`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal'],
};
export default job;
