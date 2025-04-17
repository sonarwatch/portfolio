import { NetworkId } from '@sonarwatch/portfolio-core';
import axios from 'axios';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  platformId,
  vaults,
  vaultsKey,
  vaultsPrefix,
  vaultsTvlKey,
} from './constants';
import { getClientSui } from '../../utils/clients';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import { Vault } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();

  const [vaultObjects, res] = await Promise.all([
    multiGetObjects<Vault>(
      client,
      vaults.map((v) => v.address)
    ),
    axios
      .get('https://metrics-api.trusted-mainnet.elixir.xyz/metrics/tvl-apy')
      .catch((err) => {
        throw Error(`ELIXIR_API ERR: ${err}`);
      }),
  ]);

  if (!res || !res.data.data.tvl_per_exchange.BLUEFIN.token_pairs) {
    throw Error(`ELIXIR_API NO RESPONSE`);
  }

  await cache.setItem(vaultsKey, vaultObjects, {
    prefix: vaultsPrefix,
    networkId: NetworkId.sui,
  });

  await cache.setItem(
    vaultsTvlKey,
    Object.values(
      res.data.data.tvl_per_exchange.BLUEFIN.token_pairs
    ) as string[],
    {
      prefix: vaultsPrefix,
      networkId: NetworkId.sui,
    }
  );
};

const job: Job = {
  id: `${platformId}-vaults`,
  networkIds: [NetworkId.sui],
  executor,
  labels: ['normal', NetworkId.sui],
};
export default job;
