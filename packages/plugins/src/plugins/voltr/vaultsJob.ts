import { NetworkId, TokenPriceSource } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId, vaultPid } from './constants';
import { getClientSolana } from '../../utils/clients';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import {
  getParsedMultipleAccountsInfo,
  mintAccountStruct,
  u8ArrayToString,
} from '../../utils/solana';
import { vaultStruct } from './structs';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();

  const vaults = await ParsedGpa.build(connection, vaultStruct, vaultPid)
    .addFilter('discriminator', [211, 8, 232, 43, 2, 152, 117, 119])
    .run();

  const [lpMintAccounts, tokenPricesMap] = await Promise.all([
    getParsedMultipleAccountsInfo(
      connection,
      mintAccountStruct,
      vaults.map((vault) => vault.lp.mint)
    ),
    cache.getTokenPricesAsMap(
      vaults.map((vault) => vault.asset.mint.toString()),
      NetworkId.solana
    ),
  ]);

  const sources: TokenPriceSource[] = [];
  for (let i = 0; i < vaults.length; i++) {
    const lpMintAccount = lpMintAccounts[i];
    if (!lpMintAccount) continue;

    const vault = vaults[i];
    if (vault.asset.totalValue.isZero() || lpMintAccount.supply.isZero())
      continue;

    const underlyingAssetPrice = tokenPricesMap.get(
      vault.asset.mint.toString()
    );
    if (!underlyingAssetPrice) continue;

    const { lp, asset } = vault;
    const { totalValue } = asset;
    const { mint } = lp;

    const sPrice = totalValue
      .shiftedBy(-underlyingAssetPrice.decimals)
      .dividedBy(lpMintAccount.supply.shiftedBy(-lpMintAccount.decimals))
      .times(underlyingAssetPrice.price);
    sources.push({
      address: mint.toString(),
      decimals: lpMintAccount.decimals,
      price: sPrice.toNumber(),
      networkId: NetworkId.solana,
      id: vault.pubkey.toString(),
      platformId,
      timestamp: Date.now(),
      weight: 1,
      link: `https://voltr.xyz/vault/${vault.pubkey.toString()}`,
      elementName: u8ArrayToString(vault.name),
      sourceRefs: [
        {
          address: vault.pubkey.toString(),
          name: 'Vault',
        },
      ],
      label: 'Vault',
    });
  }

  await cache.setTokenPriceSources(sources);
};
const job: Job = {
  id: `${platformId}-vaults`,
  executor,
  labels: ['normal'],
};
export default job;
