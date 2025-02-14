import { apyToApr, NetworkId } from '@sonarwatch/portfolio-core';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { leverageVaultAddressesKey, leverageVaultKey, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { Cache } from '../../Cache';
import { getLeverageObligations } from './helper';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { ParsedAccount } from '../../utils/solana';
import { LeverageVaultAddress, VaultLeverage } from './structs';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const leverageVaultsMemo = new MemoizedCache<ParsedAccount<VaultLeverage>[]>(
  leverageVaultKey,
  {
    prefix: platformId,
    networkId: NetworkId.solana,
  }
);

const leverageAddressesMemo = new MemoizedCache<LeverageVaultAddress[]>(
  leverageVaultAddressesKey,
  {
    prefix: platformId,
    networkId: NetworkId.solana,
  }
)

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const accounts = await getLeverageObligations(client, owner);
  if (!accounts.length) return [];

  const vaults = await leverageVaultsMemo.getItem(cache);
  if (!vaults.length) return [];

  const vaultAddresses = await leverageAddressesMemo.getItem(cache);
  if (!vaultAddresses.length) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  accounts.forEach((acc) => {    
    const vault = vaults.find(
      (v) => v.pubkey.toString() === acc.vault.toString()
    );
    if (!vault) return;

    const vaultAddress = vaultAddresses.find(
      (v) => v.leverageVault === vault.pubkey.toString()
    )
    if (!vaultAddress) return;

    const element = elementRegistry.addElementBorrowlend({
      name: `Leverage ${vaultAddress.leverageName.replace(
        "-", "/"
      )}`,
      label: 'Leverage',
      ref: acc.pubkey,
      sourceRefs: [
        {
          name: 'Vault',
          address: vault.pubkey.toString(),
        },
      ],
      link: 'https://app.pluto.so/leverage',
    });

    for (const position of acc.positions) {
      if (position.unit.toString() === '0') {
        continue;
      }

      const borrowingUnit = position.borrowing_unit.toNumber() / 1e8;
      const borrowingIndex = vault.borrowingIndex / 1e12;
      const borrowingAmount = borrowingUnit * borrowingIndex;
      const tokenCollateralAmount = position.token_collateral_amount.shiftedBy(-vault.tokenCollateralTokenDecimal).toNumber()

      const apy = Number(vault.apy.ema7d / 1e5);
      element.addSuppliedYield([
        {
          apy,
          apr: apyToApr(apy),
        },
      ]);

      element.addSuppliedAsset({
        address: vault.tokenCollateralTokenMint.toString(),
        amount: tokenCollateralAmount,
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
