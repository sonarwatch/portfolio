import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { platformId, programId } from './constants';
import { reserveStruct } from './structs';
import { dataStructSizeFilter } from '../../utils/solana/filters';
import { Reserve, ReserveApi, ReserveEnhanced } from './types';
import { reservesKey } from '../kamino/constants';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const parseReserves = await cache.getItem<ReserveApi[]>(reservesKey, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });

  const parsedReserveById: Map<string, ReserveApi> = new Map();
  if (parseReserves) {
    parseReserves.forEach((res) => parsedReserveById.set(res.reserveId, res));
  }

  const reservesAccounts = await getParsedProgramAccounts(
    client,
    reserveStruct,
    programId,
    dataStructSizeFilter(reserveStruct)
  );

  const reservesByMarket: Map<string, ReserveEnhanced[]> = new Map();
  reservesAccounts.forEach((res) => {
    const tempReserves = reservesByMarket.get(res.lendingMarket.toString());
    const apys = parsedReserveById.get(res.pubkey.toString());
    if (tempReserves) {
      tempReserves.push({
        borrowApy: apys?.borrowApy,
        depositApy: apys?.depositApy,
        ...(res as unknown as Reserve),
      });
    } else {
      reservesByMarket.set(res.lendingMarket.toString(), [
        {
          borrowApy: apys?.borrowApy,
          depositApy: apys?.depositApy,
          ...(res as unknown as Reserve),
        },
      ]);
    }
  });

  const promises = [];
  for (const key of reservesByMarket.keys()) {
    const reserves = reservesByMarket.get(key);
    if (!reserves) continue;
    promises.push(
      cache.setItem(key, reserves, {
        prefix: platformId,
        networkId: NetworkId.solana,
      })
    );
  }
  await Promise.all(promises);
};

const job: Job = {
  id: `${platformId}-reserves`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
