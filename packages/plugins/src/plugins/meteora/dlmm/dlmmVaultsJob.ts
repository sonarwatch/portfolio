import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../../Cache';
import { Job, JobExecutor } from '../../../Job';
import { getClientSolana } from '../../../utils/clients';
import { dlmmVaultProgramId, dlmmVaultsKey, platformId } from '../constants';
import { dlmmVaultStruct } from './structs';
import { CachedDlmmVaults } from '../types';
import { ParsedGpa } from '../../../utils/solana/beets/ParsedGpa';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();
  const accounts = await ParsedGpa.build(
    client,
    dlmmVaultStruct,
    dlmmVaultProgramId
  )
    .addFilter('accountDiscriminator', [211, 8, 232, 43, 2, 152, 117, 119])
    .run();
  const vaults: CachedDlmmVaults = {};
  accounts.forEach((acc) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newAcc: any = {
      ...acc,
      pubkey: acc.pubkey.toString(),
    };
    delete newAcc['buffer'];
    delete newAcc['padding0'];
    delete newAcc['padding'];
    vaults[acc.pubkey.toString()] = newAcc;
  });

  await cache.setItem(dlmmVaultsKey, vaults, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-dlmm-vaults`,
  executor,
  labels: ['normal'],
};
export default job;
