import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import { u8ArrayToString } from '../../utils/solana';
import { keySpotMarkets, platformId } from '../drift/constants';
import {
  vaultsPids,
  platformIdByVaultManager,
  prefixVaults,
} from './constants';
import { vaultFilter } from './filters';
import { SpotMarketEnhanced } from '../drift/types';
import { getVaultClient } from './helpers';
import { VaultInfo } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const [vaultIds, spotMarkets] = await Promise.all([
    (
      await Promise.all(
        vaultsPids.map((vaultsPid) =>
          client.getProgramAccounts(vaultsPid, {
            filters: vaultFilter,
            dataSlice: { offset: 0, length: 0 },
          })
        )
      )
    ).flat(),
    cache.getItem<SpotMarketEnhanced[]>(keySpotMarkets, {
      prefix: platformId,
      networkId: NetworkId.solana,
    }),
  ]);

  if (!spotMarkets) return;

  const vaultClient = await getVaultClient();

  const vaults = await Promise.all(
    vaultIds.map((vaultId) => vaultClient.getVault(vaultId.pubkey))
  );

  const cachedItems = [];

  for (const vault of vaults) {
    const spotMarket = spotMarkets.find(
      (sm) => sm.marketIndex === vault.spotMarketIndex
    );
    if (!spotMarket) continue;
    const pubkey = vault.pubkey.toString();
    const vaultPlatformId = platformIdByVaultManager.get(
      vault.manager.toString()
    );
    if (!vaultPlatformId) continue;

    const totalTokens = await vaultClient.calculateVaultEquityInDepositAsset({
      vault,
      factorUnrealizedPNL: true,
    });

    cachedItems.push({
      key: pubkey,
      value: {
        pubkey,
        platformId: vaultPlatformId,
        name: u8ArrayToString(vault.name),
        mint: spotMarket.mint.toString(),
        decimals: spotMarket.decimals,
        totalShares: vault.totalShares.toString(),
        totalTokens: totalTokens.toString(),
        user: vault.user.toString(),
        profitShare: vault.profitShare,
      },
    });
  }

  await cache.setItems<VaultInfo>(cachedItems, {
    prefix: prefixVaults,
    networkId: NetworkId.solana,
  });

  await vaultClient.driftClient.unsubscribe();
};

const job: Job = {
  id: `${platformId}-market-maker-vaults`,
  executor,
  label: 'realtime',
};
export default job;
