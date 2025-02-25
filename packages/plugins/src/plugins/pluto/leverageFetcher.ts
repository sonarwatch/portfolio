import { apyToApr, NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  leveragesVaultApiKey,
  leveragesVaultKey,
  platformId,
} from './constants';
import { getClientSolana } from '../../utils/clients';
import { Cache } from '../../Cache';
import { getLeverageObligations } from './helper';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { ParsedAccount } from '../../utils/solana';
import { VaultLeverage } from './structs';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { LeverageVaultAddress } from './types';

const leverageVaultsMemo = new MemoizedCache<ParsedAccount<VaultLeverage>[]>(
  leveragesVaultKey,
  {
    prefix: platformId,
    networkId: NetworkId.solana,
  }
);

const leverageVaultsApiMemo = new MemoizedCache<LeverageVaultAddress[]>(
  leveragesVaultApiKey,
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
  if (!vaults.length) throw new Error('Vaults not cached');

  // used only for vault name, non necessary
  const vaultsApi = await leverageVaultsApiMemo.getItem(cache);

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  accounts.forEach((acc) => {
    const vault = vaults.find(
      (v) => v.pubkey.toString() === acc.vault.toString()
    );
    if (!vault) return;

    const vaultFromApi = vaultsApi.find(
      (v) => v.leverageVault === vault.pubkey.toString()
    );

    acc.positions.forEach((position) => {
      if (position.unit.isZero()) {
        return;
      }

      const amount = position.unit
        .shiftedBy(-8)
        .multipliedBy(new BigNumber(vault.index).shiftedBy(-12));
      const apy = new BigNumber(vault.apy.ema7d).shiftedBy(-5).toNumber();
      const borrowingUnit = position.borrowing_unit.shiftedBy(-8);
      const borrowingIndex = new BigNumber(vault.borrowingIndex).shiftedBy(-12);
      const borrowingAmount = borrowingUnit.multipliedBy(borrowingIndex);
      const borrowingApy = new BigNumber(vault.borrowingApy.ema7d)
        .shiftedBy(-5)
        .toNumber();

      const tokenCollateralAmount = position.token_collateral_amount.shiftedBy(
        -vault.tokenCollateralTokenDecimal
      );

      const tokenCollateralPrice = position.token_collateral_price.shiftedBy(
        -position.token_collateral_price_exponent
      );

      const borrowAmount = borrowingUnit.multipliedBy(
        position.avg_borrowing_index.shiftedBy(-12)
      );
      const borrowUSD = borrowAmount.multipliedBy(tokenCollateralPrice);
      const openLV = borrowUSD.dividedBy(tokenCollateralAmount).plus(1);

      const element = elementRegistry.addElementBorrowlend({
        name: `Leverage ${
          vaultFromApi ? vaultFromApi.leverageName.replace('-', '/') : ''
        } ${parseFloat(openLV.toFixed(2))}x`,
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

      element.addSuppliedAsset({
        address: vault.nativeCollateralTokenMint,
        amount,
        alreadyShifted: true,
      });

      element.addSuppliedYield([
        {
          apy,
          apr: apyToApr(apy),
        },
      ]);

      element.addBorrowedAsset({
        address: vault.tokenCollateralTokenMint,
        amount: borrowingAmount,
        alreadyShifted: true,
      });

      element.addBorrowedYield([
        {
          apy: borrowingApy,
          apr: apyToApr(borrowingApy),
        },
      ]);
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-leverage`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
