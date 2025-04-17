import { PublicKey } from '@solana/web3.js';
import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';
import { platformId, preMarketPriceKey } from './constants';
import { preLaunchOracleStruct } from './struct';
import { getClientSolana } from '../../utils/clients';

const oraclesAndIds = [
  { oracle: 'sDAQaZQJQ4RXAxH3x526mbEXyQZT15ktkL84d7hmk7M', id: 'KMNO' },
];
const factor = new BigNumber(10 ** 6);
const oneDayInSlot = new BigNumber(100000);

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();
  const epoch = await client.getEpochInfo();

  for (const data of oraclesAndIds) {
    const prelaunchOracle = await getParsedAccountInfo(
      client,
      preLaunchOracleStruct,
      new PublicKey(data.oracle)
    );
    if (!prelaunchOracle) continue;

    // Check if data is too old, would mean the market is not active anymore.
    if (
      prelaunchOracle.lastUpdateSlot
        .plus(oneDayInSlot)
        .isLessThan(epoch.absoluteSlot)
    )
      continue;

    const price = prelaunchOracle.price.dividedBy(factor);
    await cache.setItem(`${preMarketPriceKey}-${data.id}`, price.toNumber(), {
      prefix: platformId,
      networkId: NetworkId.solana,
    });
  }
};

const job: Job = {
  id: `${platformId}-premarket`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
