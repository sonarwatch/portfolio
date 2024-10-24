import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts, u8ArrayToString } from '../../utils/solana';
import {
  keySpotMarkets,
  platformId as driftPlatformId,
  platformId,
} from '../drift/constants';
import { vaultsPid, platformIdByVaultManager, prefixVaults } from './constants';
import { vaultFilter } from './filters';
import { vaultStruct } from './structs';
import { SpotMarketEnhanced } from '../drift/types';
import { VaultInfo } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const [vaults, spotMarkets] = await Promise.all([
    getParsedProgramAccounts(client, vaultStruct, vaultsPid, vaultFilter),
    cache.getItem<SpotMarketEnhanced[]>(keySpotMarkets, {
      prefix: driftPlatformId,
      networkId: NetworkId.solana,
    }),
  ]);

  if (!spotMarkets) return;

  const cachedItems = [];
  for (const vault of vaults) {
    const name = u8ArrayToString(vault.name);
    const spotMarket = spotMarkets.find(
      (sm) => sm.marketIndex === vault.spotMarketIndex
    );
    if (!spotMarket) continue;

    const mint = spotMarket.mint.toString();
    const { decimals } = spotMarket;
    const pubkey = vault.pubkey.toString();
    const vaultPlatformId = platformIdByVaultManager.get(
      vault.manager.toString()
    );
    if (!vaultPlatformId) continue;

    cachedItems.push({
      key: pubkey,
      value: { pubkey, platformId: vaultPlatformId, name, mint, decimals },
    });
  }

  await cache.setItems<VaultInfo>(cachedItems, {
    prefix: prefixVaults,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-market-maker-vaults`,
  executor,
  label: 'normal',
};
export default job;
