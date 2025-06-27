import { NetworkId, yieldFromApy } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { mPstMint, platformId, pstMint } from './constants';

const APY_VALUES = {
  CLASSIC_MODE: 10.5,
  MAXI_MODE: 0,
};

const executor: JobExecutor = async (cache: Cache) => {
  await cache.setTokenYields([
    {
      address: pstMint,
      networkId: NetworkId.solana,
      yield: yieldFromApy(APY_VALUES.CLASSIC_MODE),
      timestamp: Date.now(),
    },
    {
      address: mPstMint,
      networkId: NetworkId.solana,
      yield: yieldFromApy(APY_VALUES.MAXI_MODE),
      timestamp: Date.now(),
    },
  ]);
};

const job: Job = {
  id: `${platformId}-pst-yield`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal'],
};
export default job;
