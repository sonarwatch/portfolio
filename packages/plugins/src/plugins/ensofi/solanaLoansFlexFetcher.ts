import { ClientType, NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { ensofiLendingFlexProgramId, platformId } from './constants';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { getClientSolana } from '../../utils/clients';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { obligationFlexStruct, reserveStruct } from './structs';
import { getParsedMultipleAccountsInfo } from '../../utils/solana';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana({ clientType: ClientType.SLOW });

  const accounts = await ParsedGpa.build(
    connection,
    obligationFlexStruct,
    ensofiLendingFlexProgramId
  )
    .addFilter('accountDiscriminator', [168, 206, 141, 106, 88, 76, 172, 167])
    .addFilter('owner', new PublicKey(owner))
    .run();

  if (!accounts.length) return [];

  const reservesPk = new Set<PublicKey>();
  accounts.forEach((account) => {
    account.deposits.forEach((deposit) => {
      if (
        deposit.reserve_storage.toString() ===
        '11111111111111111111111111111111'
      )
        return;
      reservesPk.add(deposit.reserve_storage);
    });
    account.borrows.forEach((borrow) => {
      if (
        borrow.reserve_storage.toString() === '11111111111111111111111111111111'
      )
        return;
      reservesPk.add(borrow.reserve_storage);
    });
  });

  const reserves = await getParsedMultipleAccountsInfo(
    connection,
    reserveStruct,
    [...reservesPk]
  );

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  accounts.forEach((account) => {
    const element = elementRegistry.addElementBorrowlend({
      label: 'Lending',
      link: 'https://app.ensofi.xyz/?chain=SOLANA',
      ref: account.pubkey,
    });

    account.deposits.forEach((deposit) => {
      if (
        deposit.reserve_storage.toString() ===
        '11111111111111111111111111111111'
      )
        return;
      const reserve = reserves.find(
        (r) => r?.pubkey.toString() === deposit.reserve_storage.toString()
      );
      if (!reserve) return;

      const rate = reserve.collateral.mint_total_supply.dividedBy(
        reserve.liquidity.available_amount.plus(
          reserve.liquidity.borrowed_amount_sf.dividedBy(2 ** 60)
        )
      );

      element.addSuppliedAsset({
        address: reserve.liquidity.token_mint,
        amount: deposit.deposited_amount.dividedBy(rate),
      });
    });

    account.borrows.forEach((borrow) => {
      if (
        borrow.reserve_storage.toString() === '11111111111111111111111111111111'
      )
        return;
      const reserve = reserves.find(
        (r) => r?.pubkey.toString() === borrow.reserve_storage.toString()
      );
      if (!reserve) return;

      const rate = reserve.collateral.mint_total_supply.dividedBy(
        reserve.liquidity.available_amount.plus(
          reserve.liquidity.borrowed_amount_sf.dividedBy(2 ** 60)
        )
      );

      element.addBorrowedAsset({
        address: reserve.liquidity.token_mint,
        amount: borrow.borrowed_amount_sf.dividedBy(2 ** 60).dividedBy(rate),
      });
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-solana-loans-flex`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
