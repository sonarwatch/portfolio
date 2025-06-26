import { NetworkId, yieldFromApy } from '@sonarwatch/portfolio-core';
import axios from 'axios';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId, solayerLstMint, solayersUSDMint } from './constants';

const executor: JobExecutor = async (cache: Cache) => {
  const apiData = await axios.get<{
    apy: number;
    susd_apy: number;
  }>('https://app.solayer.org/api/info');

  await cache.setTokenYields([
    {
      address: solayerLstMint,
      networkId: NetworkId.solana,
      yield: yieldFromApy(apiData.data.apy / 100),
      timestamp: Date.now(),
    },
    {
      address: solayersUSDMint,
      networkId: NetworkId.solana,
      yield: yieldFromApy(apiData.data.susd_apy / 100),
      timestamp: Date.now(),
    },
  ]);
};
const job: Job = {
  id: `${platformId}-pools-yield`,
  executor,
  labels: ['normal'],
};
export default job;
