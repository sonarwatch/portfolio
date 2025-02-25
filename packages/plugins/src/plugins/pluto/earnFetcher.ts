import { apyToApr, NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { earnVaultsKey, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { Cache } from '../../Cache';
import { getLenders } from './helper';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { ParsedAccount } from '../../utils/solana';
import { VaultEarn } from './structs';

const earnVaultsMemo = new MemoizedCache<ParsedAccount<VaultEarn>[]>(
  earnVaultsKey,
  {
    prefix: platformId,
    networkId: NetworkId.solana,
  }
);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const accounts = await getLenders(client, owner);
  if (!accounts) return [];

  const vaults = await earnVaultsMemo.getItem(cache);
  if (!vaults.length) throw new Error('Vaults not cached');

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  accounts.forEach((acc) => {
    const vault = vaults.find(
      (v) => v.pubkey.toString() === acc.protocol.toString()
    );
    if (!vault) return;

    const element = elementRegistry.addElementBorrowlend({
      label: 'Lending',
      name: `Earn`,
      ref: acc.pubkey,
      sourceRefs: [
        {
          name: 'Vault',
          address: vault.pubkey.toString(),
        },
      ],
      link: 'https://app.pluto.so/earn',
    });

    const apy = Number(vault.apy.ema7d / 1e5);
    element.addSuppliedYield([{ apy, apr: apyToApr(apy) }]);

    const earnUnit = new BigNumber(acc.unit).dividedBy(10 ** 8); // Convert BigNumber to JS number (losing precision)
    const earnIndex = new BigNumber(vault.index).dividedBy(10 ** 12); // Convert index to JS number

    element.addSuppliedAsset({
      address: vault.tokenMint.toString(),
      amount: earnUnit.multipliedBy(earnIndex),
      alreadyShifted: true,
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-earn`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
