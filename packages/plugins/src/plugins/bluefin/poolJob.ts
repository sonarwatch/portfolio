import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { aquaVault, platformId, poolKey } from './constants';
import { getObject } from '../../utils/sui/getObject';
import { getDynamicFieldObjects } from '../../utils/sui/getDynamicFieldObjects';
import { getClientSui } from '../../utils/clients';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { BankAccount, Pool, PoolAccount, Vault } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();

  const vault = await getObject<Vault>(client, aquaVault);

  if (!vault.data?.content?.fields) throw Error();

  const fields = await getDynamicFieldObjects<BankAccount>(
    client,
    vault.data?.content?.fields.users.fields.id.id
  );

  const accounts: PoolAccount[] = [];

  fields.forEach((account) => {
    if (
      account.data?.content?.fields.name &&
      account.data?.content?.fields.value.fields.amount_locked &&
      account.data?.content?.fields.value.fields.pending_withdrawal &&
      (account.data?.content?.fields.value.fields.amount_locked !== '0' ||
        account.data?.content?.fields.value.fields.pending_withdrawal !== '0')
    )
      accounts.push({
        owner: account.data?.content?.fields.name,
        amount_locked: account.data?.content?.fields.value.fields.amount_locked,
        pending_withdrawal:
          account.data?.content?.fields.value.fields.pending_withdrawal,
      });
  });

  await cache.setItem<Pool>(
    poolKey,
    {
      name: vault.data?.content?.fields.name,
      users: accounts,
    },
    {
      prefix: platformId,
      networkId: NetworkId.sui,
    }
  );
};

const job: Job = {
  id: `${platformId}-pool`,
  executor,
  label: 'realtime',
};

export default job;
