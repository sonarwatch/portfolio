import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import {
  groupPrefix,
  platformId,
  redeemProgramId,
  rootBankPrefix,
} from './constants';
import { groupFilter, rootBankFilter } from './filters';
import { mangoGroupV3Struct, rootBankStruct } from './struct';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const groupsAccounts = await getParsedProgramAccounts(
    client,
    mangoGroupV3Struct,
    redeemProgramId,
    groupFilter
  );
  if (!groupsAccounts) return;

  for (let i = 0; i < groupsAccounts.length; i++) {
    const group = groupsAccounts[i];
    const { tokens } = group;
    await cache.setItem(group.pubkey.toString(), tokens, {
      prefix: groupPrefix,
      networkId: NetworkId.solana,
    });
  }

  const rootBanksAccount = await getParsedProgramAccounts(
    client,
    rootBankStruct,
    redeemProgramId,
    rootBankFilter
  );
  if (!rootBanksAccount) return;
  for (let j = 0; j < rootBanksAccount.length; j++) {
    const rootBank = rootBanksAccount[j];
    await cache.setItem(rootBank.pubkey.toString(), rootBank, {
      prefix: rootBankPrefix,
      networkId: NetworkId.solana,
    });
  }
};

const job: Job = {
  id: `${platformId}-groups`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
