import { NetworkId } from '@sonarwatch/portfolio-core';
import { getClientSolana } from '../../utils/clients';
import {
  platformId,
  platformIdByVault,
  restakingPid,
  restakingVaultsKey,
} from './constants';
import { vaultStruct } from './structs';
import { dataSizeFilter } from '../../utils/solana/filters';
import { Cache } from '../../Cache';
import { getParsedProgramAccounts } from '../../utils/solana';
import { Job, JobExecutor } from '../../Job';
import { RestakingVaultInfo } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const vaultsAccounts = await getParsedProgramAccounts(
    client,
    vaultStruct,
    restakingPid,
    dataSizeFilter(vaultStruct.byteSize)
  );

  const vaultInfo: RestakingVaultInfo[] = vaultsAccounts.map((acc) => {
    const vaultPlatformId = platformIdByVault.get(acc.pubkey.toString());

    return {
      pubkey: acc.pubkey.toString(),
      vrtMint: acc.vrtMint.toString(),
      platformId: vaultPlatformId,
    };
  });

  await cache.setItem(restakingVaultsKey, vaultInfo, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-vaults`,
  executor,
  label: 'normal',
};
export default job;
