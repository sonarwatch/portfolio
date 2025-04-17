import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { dataSizeFilter } from '../../utils/solana/filters';
import { dlmmVaultProgramId, platformId } from './constants';
import { CachedDlmmVaults } from '../meteora/types';
import { dlmmVaultStruct } from '../meteora/dlmm/structs';
import { dlmmVaultsKey } from '../meteora/constants';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();
  const accounts = await getParsedProgramAccounts(
    client,
    dlmmVaultStruct,
    dlmmVaultProgramId,
    dataSizeFilter(dlmmVaultStruct.byteSize)
  );
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
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
