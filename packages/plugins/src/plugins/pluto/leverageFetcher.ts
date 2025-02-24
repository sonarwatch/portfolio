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

    for (const position of acc.positions) {
      if (position.unit.toString() === '0') {
        continue;
      }

      const amount = (position.unit.toNumber() / 1e8) * (vault.index / 1e12);
      const borrowingUnit = position.borrowing_unit.toNumber() / 1e8;
      const borrowingIndex = vault.borrowingIndex / 1e12;
      const borrowingAmount = borrowingUnit * borrowingIndex;
      const apy = Number(vault.apy.ema7d / 1e5);
      
      const tokenCollateralAmount = position.token_collateral_amount.shiftedBy(-vaultAddress.tokenDecimalA).toNumber();
      const tokenCollateralPrice = position.token_collateral_price.shiftedBy(-position.token_collateral_price_exponent).toNumber();
      const borrowAmount = borrowingUnit * position.avg_borrowing_index.shiftedBy(-12).toNumber();
      const borrowUSD = borrowAmount * tokenCollateralPrice;
      const openLV = borrowUSD / tokenCollateralAmount + 1;

      const element = elementRegistry.addElementBorrowlend({
        name: `Leverage ${vaultAddress.leverageName.replace(
          "-", "/"
        )} ${parseFloat(openLV.toFixed(2))}x`,
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
