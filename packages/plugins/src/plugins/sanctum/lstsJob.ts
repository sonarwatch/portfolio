import axios from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { lstsKey, platformId } from './constants';

const executor: JobExecutor = async (cache: Cache) => {
  const res = await axios.get(
    'https://raw.githubusercontent.com/igneous-labs/sanctum-lst-list/master/sanctum-lst-list.toml'
  );

  const regex = /(?<=mint = ").{44}/g;
  const rawMints: string[] | null = String(res.data).match(regex);

  if (rawMints) {
    const mints = rawMints.map((mint) => mint.replace('"', ''));
    await cache.setItem(lstsKey, mints, {
      prefix: platformId,
      networkId: NetworkId.solana,
    });
  }
};
const job: Job = {
  id: `${platformId}-lsts`,
  executor,
  labels: ['normal'],
};
export default job;
