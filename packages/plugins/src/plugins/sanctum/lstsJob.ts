import axios from 'axios';
import { apyToApr, NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { lstsKey, platformId } from './constants';

const BATCH_SIZE = 100;

function chunkArray<T>(arr: T[], chunkSize: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }
  return result;
}

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

    const chunks = chunkArray(mints, BATCH_SIZE);
    const allYields = [];

    for (const chunk of chunks) {
      const params = new URLSearchParams();
      chunk.forEach((mint) => {
        params.append('lst', mint);
      });

      const aprs = await axios.get<{
        apys: Record<string, number>;
      }>(`https://extra-api.sanctum.so/v1/apy/latest?${params.toString()}`);

      const yields = Object.keys(aprs.data.apys).map((address) => {
        const apy = aprs.data.apys[address];
        return {
          address,
          networkId: NetworkId.solana,
          yield: {
            apr: apyToApr(apy),
            apy,
          },
          timestamp: Date.now(),
        };
      });

      allYields.push(...yields);
    }

    await cache.setTokenYields(allYields);
  }
};
const job: Job = {
  id: `${platformId}-lsts`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
