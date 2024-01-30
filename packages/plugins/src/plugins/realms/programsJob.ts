import axios, { AxiosResponse } from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId, splGovProgramsKey, splGovernanceUrl } from './constants';

const executor: JobExecutor = async (cache: Cache) => {
  const splGovPrograms: AxiosResponse<string[]> = await axios.get(
    splGovernanceUrl
  );

  if (splGovPrograms.data.length !== 0) {
    await cache.setItem(splGovProgramsKey, splGovPrograms.data, {
      prefix: platformId,
      networkId: NetworkId.solana,
    });
  }
};

const job: Job = {
  id: `${platformId}-programs`,
  executor,
  label: 'normal',
};

export default job;
