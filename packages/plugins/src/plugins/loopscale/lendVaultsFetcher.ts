import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { loopscaleProgramId, platformId, vaultsCacheKey } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { vaultStakeStruct } from './structs';
import { bytesToNumberLE } from './helpers';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';

import { arrayToMap } from '../../utils/misc/arrayToMap';
import { CachedVault } from './types';

export const vaultsMemo = new MemoizedCache<
  CachedVault[],
  Map<string, CachedVault>
>(
  vaultsCacheKey,
  {
    prefix: platformId,
    networkId: NetworkId.solana,
  },
  (arr) => arrayToMap(arr || [], 'pubkey')
);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();
  const userVaultStakes = await ParsedGpa.build(
    connection,
    vaultStakeStruct,
    loopscaleProgramId
  )
    .addFilter('accountDiscriminator', [225, 34, 128, 53, 167, 239, 182, 107])
    .addFilter('user', new PublicKey(owner))
    .run();

  if (!userVaultStakes.length) return [];

  const vaults = await vaultsMemo.getItem(cache);
  if (!vaults.size) throw new Error('Vaults not cached');

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  userVaultStakes.forEach((stakeAccount) => {
    const vault = vaults.get(stakeAccount.vault.toString());
    if (!vault) return;
    const amount = bytesToNumberLE(new Uint8Array(stakeAccount.amount.array));
    const element = elementRegistry.addElementMultiple({
      label: 'Deposit',
      ref: stakeAccount.pubkey,
      sourceRefs: [
        {
          name: 'Vault',
          address: vault.pubkey.toString(),
        },
      ],
      link: `https://app.loopscale.com/vault/AXanCP4dJHtWd7zY4X7nwxN5t5Gysfy2uG3XTxSmXdaB${vault.pubkey}`,
    });
    element.addAsset({
      address: vault.lp_mint,
      amount,
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-lend-vaults`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
