import { NetworkId, TokenPrice } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { dataSizeFilter } from '../../utils/solana/filters';
import { farmProgramId, farmsKey, platformId } from './constants';
import { farmStateStruct } from './structs/vaults';
import { FarmInfo } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const farms = await getParsedProgramAccounts(
    client,
    farmStateStruct,
    farmProgramId,
    dataSizeFilter(8336)
  );

  const tokenPrices = await cache.getTokenPrices(
    farms.map((farm) => farm.token.mint.toString()),
    NetworkId.solana
  );
  const tokenPriceById: Map<string, TokenPrice> = new Map();
  tokenPrices.forEach((tP) =>
    tP ? tokenPriceById.set(tP.address, tP) : undefined
  );

  const farmsInfo: FarmInfo[] = [];
  farms.forEach((farm) => {
    if (farm.token.mint.toString() === '11111111111111111111111111111111')
      return;
    const kTokenPrice = tokenPriceById.get(farm.token.mint.toString());
    if (!kTokenPrice) return;

    const farmInfo: FarmInfo = {
      pubkey: farm.pubkey.toString(),
      mint: farm.token.mint.toString(),
      decimals: farm.token.decimals.toNumber(),
      price: kTokenPrice.price,
      rewardsMints: farm.rewardInfos.map((r) => r.token.mint.toString()),
      lockingDuration: farm.lockingDuration.toNumber(),
      lockingStart: farm.lockingStartTimestamp.toNumber(),
      strategyId: farm.strategyId.toString(),
    };
    farmsInfo.push(farmInfo);
  });

  await cache.setItem(farmsKey, farmsInfo, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-farms`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
