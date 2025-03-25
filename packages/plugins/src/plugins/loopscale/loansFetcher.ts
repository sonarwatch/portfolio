import { apyToApr, NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { Cache } from '../../Cache';
import { loopscaleProgramId, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { loanStruct } from './structs';
import { bytesToNumberLE } from './helpers';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();
  const accounts = await ParsedGpa.build(
    connection,
    loanStruct,
    loopscaleProgramId
  )
    .addFilter('accountDiscriminator', [20, 195, 70, 117, 165, 227, 182, 1])
    .addFilter('borrower', new PublicKey(owner))
    .run();

  if (!accounts.length) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  accounts.forEach((account) => {
    const element = elementRegistry.addElementBorrowlend({
      label: 'Lending',
      ref: account.pubkey,
      link: `https://app.loopscale.com/loan/${account.pubkey}`,
    });

    account.collateral.forEach((collateralData, i) => {
      if (
        collateralData.asset_identifier.toString() ===
        PublicKey.default.toString()
      ) {
        return;
      }
      element.addSuppliedAsset({
        address: collateralData.asset_identifier,
        amount: new BN(collateralData.amount.array.reverse()).toNumber(),
      });

      element.addSuppliedLtv(
        bytesToNumberLE(new Uint8Array(account.ltv_matrix[i][0].array))
      );
    });

    account.ledgers.forEach((ledger, i) => {
      if (ledger.principal_mint.toString() === PublicKey.default.toString()) {
        return;
      }

      element.addBorrowedAsset({
        address: ledger.principal_mint,
        amount:
          new BN(ledger.principal_due.array.reverse()).toNumber() -
          new BN(ledger.principal_repaid.array.reverse()).toNumber() +
          new BN(ledger.interest_due.array.reverse()).toNumber() -
          new BN(ledger.interest_repaid.array.reverse()).toNumber(),
      });

      element.addBorrowedWeight(
        bytesToNumberLE(new Uint8Array(account.weight_matrix[i][0].array))
      );

      const apy = bytesToNumberLE(new Uint8Array(ledger.apy.array)) / 10000;
      element.addBorrowedYield([
        {
          apy,
          apr: apyToApr(apy),
        },
      ]);
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-loans`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
