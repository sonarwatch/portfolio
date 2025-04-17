import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../../Cache';
import { Job, JobExecutor } from '../../../Job';
import { getClientSolana } from '../../../utils/clients';
import { getParsedProgramAccounts } from '../../../utils/solana';
import { feeVaultsKey, stakeForFeeProgramId, platformId } from '../constants';
import { feeVaultStruct } from './structs';
import { feeVaultFilter } from '../filters';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const vaults = await getParsedProgramAccounts(
    client,
    feeVaultStruct,
    stakeForFeeProgramId,
    feeVaultFilter()
  );

  await cache.setItem(feeVaultsKey, vaults, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-stake-for-fee-vaults`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
