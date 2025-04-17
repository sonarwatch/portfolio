import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import { u8ArrayToString } from '../../utils/solana';
import { keySpotMarkets, platformId } from '../drift/constants';
import {
  vaultsProgramIds,
  platformIdByVaultManager,
  prefixVaults,
  linksByPlatformId,
} from './constants';
import { vaultFilter } from './filters';
import { SpotMarketEnhanced } from '../drift/types';
import { getVaultClient } from './helpers';
import { VaultInfo } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const [vaultIdsByProgram, spotMarkets] = await Promise.all([
    Promise.all(
      vaultsProgramIds.map((vaultsPid) =>
        client.getProgramAccounts(vaultsPid, {
          filters: vaultFilter,
          dataSlice: { offset: 0, length: 0 },
        })
      )
    ),
    cache.getItem<SpotMarketEnhanced[]>(keySpotMarkets, {
      prefix: platformId,
      networkId: NetworkId.solana,
    }),
  ]);

  if (!spotMarkets) return;

  const cachedItems = [];

  for (const vaultIds of vaultIdsByProgram) {
    const i = vaultIdsByProgram.indexOf(vaultIds);
    const programId = vaultsProgramIds[i];

    const vaultClient = await getVaultClient(programId.toString());
    const vaults = await Promise.all(
      vaultIds.map((vaultId) => vaultClient.getVault(vaultId.pubkey))
    );

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

      const link = linksByPlatformId.get(vaultPlatformId);
      const totalTokens = await vaultClient.calculateVaultEquityInDepositAsset({
        vault,
        factorUnrealizedPNL: true,
      });

      const vaultInfo: VaultInfo = {
        pubkey,
        platformId: vaultPlatformId,
        name: u8ArrayToString(vault.name),
        mint: spotMarket.mint.toString(),
        decimals: spotMarket.decimals,
        totalShares: vault.totalShares.toString(),
        totalTokens: totalTokens.toString(),
        user: vault.user.toString(),
        profitShare: vault.profitShare,
        link,
      };

      cachedItems.push({
        key: pubkey,
        value: vaultInfo,
      });
    }

    await vaultClient.driftClient.unsubscribe();
  }

  await cache.setItems<VaultInfo>(cachedItems, {
    prefix: prefixVaults,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-market-maker-vaults`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['realtime', NetworkId.solana],
};
export default job;
