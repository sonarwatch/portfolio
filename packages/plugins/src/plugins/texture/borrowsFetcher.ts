import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { platformId, reservesMemo, superlendyProgramId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { getClientSolana } from '../../utils/clients';
import { positionStruct } from './structs';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const accounts = await ParsedGpa.build(
    client,
    positionStruct,
    superlendyProgramId
  )
    .addFilter('accountDiscriminator', [80, 79, 83, 73, 84, 73, 79, 78])
    .addFilter('owner', new PublicKey(owner))
    .run();

  if (!accounts.length) return [];

  const reserves = await reservesMemo.getItem(cache);

  if (!reserves) throw new Error('Reserves not cached');

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  accounts.forEach((account) => {
    const element = elementRegistry.addElementBorrowlend({
      label: 'Lending',
    });

    account.collateral.forEach((collateral) => {
      if (
        collateral.deposit_reserve.toString() === PublicKey.default.toString()
      )
        return;
      const reserve = reserves.get(collateral.deposit_reserve.toString());
      if (!reserve) return;

      element.addSuppliedAsset({
        address: reserve.mint,
        amount: collateral.deposited_amount.multipliedBy(reserve.exchange_rate),
      });
    });

    account.borrows.forEach((borrow) => {
      if (borrow.borrow_reserve.toString() === PublicKey.default.toString())
        return;

      const reserve = reserves.get(borrow.borrow_reserve.toString());
      if (!reserve) return;

      element.addBorrowedAsset({
        address: reserve.mint,
        amount: borrow.borrowed_amount.shiftedBy(-12),
      });
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-borrows`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
