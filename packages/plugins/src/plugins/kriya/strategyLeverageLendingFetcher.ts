import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { leverageLendingVaultsInfoKey, platformId } from './constants';
import { getClientSui } from '../../utils/clients';
import { LeverageVaultInfo } from './types/vaults';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { getOwnedObjectsPreloaded } from '../../utils/sui/getOwnedObjectsPreloaded';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { ParsedData } from '../../utils/sui/types';

const leverageVaultsMemo = new MemoizedCache<LeverageVaultInfo[]>(
  leverageLendingVaultsInfoKey,
  {
    prefix: platformId,
    networkId: NetworkId.sui,
  }
);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const leverageVaults = await leverageVaultsMemo.getItem(cache);

  const receipts = await getOwnedObjectsPreloaded(client, owner, {
    filter: {
      MatchAny: Array.from(new Set(leverageVaults.map((v) => v.farm?.vtType)))
        .map((s) =>
          s
            ? {
                StructType: s,
              }
            : null
        )
        .filter((s) => s !== null) as { StructType: string }[],
    },
  });

  if (receipts.length === 0) return [];

  const elementRegistry = new ElementRegistry(NetworkId.sui, platformId);

  receipts.forEach((receipt) => {
    if (!receipt) return;

    if (
      receipt.data?.type !==
      '0xba0dd78bdd5d1b5f02a689444522ea9a79e1bc4cd4d8e6a57b59f3fbcae5e978::farm::StakeReceipt'
    ) {
      throw new Error(`Unsupported receipt type ${receipt.data?.type}`);
    }
    const receiptContent = receipt.data?.content as ParsedData<{
      shares: string;
      farm_id: string;
    }>;

    const vault = leverageVaults.find(
      (v) => v.farm.id === receiptContent.fields.farm_id
    );
    if (!vault) return;

    const sharesPercentage = new BigNumber(
      receiptContent.fields.shares
    ).dividedBy(vault.lpSupply);

    const depositedUsd = sharesPercentage.multipliedBy(vault.tvl);

    if (depositedUsd.isZero()) return;

    const element = elementRegistry.addElementBorrowlend({
      label: 'Lending',
      name: `${vault.vaultSource} ${vault.vaultName}`,
    });
    element.addSuppliedAsset({
      address: vault.coinA,
      amount: sharesPercentage.multipliedBy(vault.depositedA).toNumber(),
      alreadyShifted: true,
    });
    element.addBorrowedAsset({
      address: vault.coinB,
      amount: sharesPercentage.multipliedBy(vault.borrowedB).toNumber(),
      alreadyShifted: true,
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-strategy-leverage-lending`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
