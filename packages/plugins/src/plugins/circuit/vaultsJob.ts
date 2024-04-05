import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts, u8ArrayToString } from '../../utils/solana';
import { prefixSpotMarkets } from '../drift/constants';
import { circuitPid, platformId, prefixVaults } from './constants';
import { vaultFilter } from './filters';
import { vaultStruct } from './structs';
import { SpotMarketEnhanced } from '../drift/types';
import { VaultInfo } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const vaults = await getParsedProgramAccounts(
    client,
    vaultStruct,
    circuitPid,
    vaultFilter
  );

  for (const vault of vaults) {
    const name = u8ArrayToString(vault.name);
    const spotMarket = await cache.getItem<SpotMarketEnhanced>(
      vault.spotMarketIndex.toString(),
      {
        prefix: prefixSpotMarkets,
        networkId: NetworkId.solana,
      }
    );
    if (!spotMarket) continue;

    const mint = spotMarket.mint.toString();
    const { decimals } = spotMarket;
    const pubkey = vault.pubkey.toString();
    await cache.setItem<VaultInfo>(
      pubkey,
      { pubkey, name, mint, decimals },
      { prefix: prefixVaults, networkId: NetworkId.solana }
    );
  }
};

const job: Job = {
  id: `${platformId}-vaults`,
  executor,
  label: 'normal',
};
export default job;
