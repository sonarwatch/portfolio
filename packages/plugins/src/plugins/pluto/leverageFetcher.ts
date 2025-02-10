import { apyToApr, NetworkId } from '@sonarwatch/portfolio-core';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { leveragesVaultKey, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { Cache } from '../../Cache';
import { getLeverageObligations } from './helper';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { ParsedAccount } from '../../utils/solana';
import { VaultLeverage } from './structs';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const leverageVaultsMemo = new MemoizedCache<ParsedAccount<VaultLeverage>[]>(
  leveragesVaultKey,
  {
    prefix: platformId,
    networkId: NetworkId.solana,
  }
);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const accounts = await getLeverageObligations(client, owner);
  if (!accounts.length) return [];

  const vaults = await leverageVaultsMemo.getItem(cache);
  if (!vaults.length) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  accounts.forEach((acc) => {
    const vault = vaults.find(
      (v) => v.protocol.toString() === acc.protocol.toString()
    );
    if (!vault) return;
    const element = elementRegistry.addElementBorrowlend({
      name: `Leverage`,
      label: 'Leverage',
    });

    for (const position of acc.positions) {
      if (position.unit.toString() === '0') {
        continue;
      }

      const unit = position.unit.toNumber() / 1e8;
      const borrowingUnit = position.borrowing_unit.toNumber() / 1e8;
      const borrowingIndex = vault.borrowingIndex / 1e12;
      const borrowingAmount = borrowingUnit * borrowingIndex;
      const index = vault.index / 1e12;
      const amount = unit * index;

      const apy = Number(vault.apy.ema7d / 1e5);
      element.addSuppliedYield([
        {
          apy,
          apr: apyToApr(apy),
        },
      ]);

      element.addSuppliedAsset({
        address: vault.nativeCollateralTokenMint.toString(),
        amount,
        alreadyShifted: true,
      });

      const borrowingApy = Number(vault.borrowingApy.ema7d / 1e5);
      element.addBorrowedYield([
        {
          apy: borrowingApy,
          apr: apyToApr(borrowingApy),
        },
      ]);
      element.addBorrowedAsset({
        address: vault.tokenCollateralTokenMint.toString(),
        amount: borrowingAmount,
        alreadyShifted: true,
      });
    }
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-leverage`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
