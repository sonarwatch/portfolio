import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId, lendingsCacheKey, lendingProgramIds } from './constants';
import { lendingStruct } from './structs';
import { getClientSolana } from '../../utils/clients';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();

  const lendings = await Promise.all(
    lendingProgramIds.map((lendingProgramId) =>
      getParsedAccountInfo(
        connection,
        lendingStruct,
        PublicKey.findProgramAddressSync(
          [Buffer.from('LENDING')],
          lendingProgramId
        )[0]
      )
    )
  );

  await cache.setItem(lendingsCacheKey, lendings, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-lending`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
