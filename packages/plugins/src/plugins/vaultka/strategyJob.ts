import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId, strategies, strategiesCacheKey } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();

  const strategys = await Promise.all(
    strategies.map((strategy) =>
      getParsedAccountInfo(
        connection,
        strategy.strategyStruct,
        PublicKey.findProgramAddressSync(
          [Buffer.from('STRATEGY')],
          new PublicKey(strategy.pubkey)
        )[0]
      )
    )
  );

  await cache.setItem(strategiesCacheKey, strategys, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-strategy`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
