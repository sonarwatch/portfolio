import { NetworkId, TokenPriceSource } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId, pid } from './constants';
import { getClientSolana } from '../../utils/clients';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import {
  getParsedMultipleAccountsInfo,
  mintAccountStruct,
} from '../../utils/solana';
import { lpVaultStruct } from './structs';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();

  const lpVaults = await ParsedGpa.build(connection, lpVaultStruct, pid)
    .addFilter('discriminator', [189, 45, 167, 23, 91, 118, 105, 190])
    .run();

  const [mintAccounts, tokenPricesMap] = await Promise.all([
    getParsedMultipleAccountsInfo(
      connection,
      mintAccountStruct,
      lpVaults.map((vault) => vault.sharesMint)
    ),
    cache.getTokenPricesAsMap(
      lpVaults.map((vault) => vault.asset.toString()),
      NetworkId.solana
    ),
  ]);

  const sources: TokenPriceSource[] = [];
  for (let i = 0; i < lpVaults.length; i++) {
    const mintAccount = mintAccounts[i];
    if (!mintAccount) continue;

    const lpVault = lpVaults[i];

    const assetPrice = tokenPricesMap.get(lpVault.asset.toString());
    if (!assetPrice) continue;

    const { totalAssets, sharesMint } = lpVault;

    const sPrice = totalAssets
      .dividedBy(mintAccount.supply)
      .times(assetPrice.price);
    sources.push({
      address: sharesMint.toString(),
      decimals: mintAccount.decimals,
      price: sPrice.toNumber(),
      networkId: NetworkId.solana,
      id: lpVault.pubkey.toString(),
      platformId,
      timestamp: Date.now(),
      weight: 1,
      link: `https://app.wasabi.xyz/?earn=${lpVault.sharesMint.toString()}&network=solana&chain=solana`,
    });
  }

  await cache.setTokenPriceSources(sources);
};
const job: Job = {
  id: `${platformId}-lp-vaults`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal'],
};
export default job;
