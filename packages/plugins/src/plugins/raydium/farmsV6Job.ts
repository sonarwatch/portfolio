import { PublicKey } from '@solana/web3.js';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import { platformId } from './constants';
import { getParsedProgramAccounts } from '../../utils/solana';
import { farmAccountV6Filters } from './filters';
import { farmAccountV6Struct } from './structs/farms';
import { FarmConfigV6 } from './types';

export const farmProgramIdV6 = new PublicKey(
  'FarmqiPv5eAj3j1GMdMCMUGXqPUvmquZtMy86QH6rzhG'
);

export const farmConfigs: FarmConfigV6[] = [
  {
    programId: farmProgramIdV6,
    filters: farmAccountV6Filters,
    struct: farmAccountV6Struct,
    version: 'v6',
    d: 1e15,
  },
];

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const farmAccounts = (
    await Promise.all(
      farmConfigs.map((farmConfig) =>
        getParsedProgramAccounts(
          client,
          farmConfig.struct,
          farmConfig.programId,
          farmConfig.filters
        )
      )
    )
  ).flat();

  await cache.setItems(
    farmAccounts.map((farmAccount) => ({
      key: farmAccount.pubkey.toString(),
      value: farmAccount,
    })),
    {
      prefix: `${platformId}/farm-v6`,
      networkId: NetworkId.solana,
    }
  );
};

const job: Job = {
  id: `${platformId}-farms-v6`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal'],
};
export default job;
