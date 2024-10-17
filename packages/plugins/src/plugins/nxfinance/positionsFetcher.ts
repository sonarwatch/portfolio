import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import {
  ID,
  leverageFiProgramID,
  leverageVaultsMints,
  nxfinanceLeverageIdlItem,
  platformId,
} from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { getAutoParsedMultipleAccountsInfo } from '../../utils/solana';
import { MarginAccount, MarginPool } from './types';
import { getBorrowNoteRate, getSupplyNoteRate } from './helpers';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const marginAccountPublicKey = PublicKey.findProgramAddressSync(
    [
      PublicKey.findProgramAddressSync(
        [ID.toBuffer()],
        leverageFiProgramID
      )[0].toBuffer(),
      new PublicKey(owner).toBuffer(),
      Buffer.from('account'),
    ],
    leverageFiProgramID
  )[0];

  const marginAccount = (
    await getAutoParsedMultipleAccountsInfo<MarginAccount>(
      connection,
      nxfinanceLeverageIdlItem,
      [marginAccountPublicKey]
    )
  )[0];

  if (!marginAccount) return [];

  const mints = new Set<string>();
  marginAccount.deposits.forEach((d) => mints.add(d.tokenMint));
  marginAccount.loans.forEach((l) => mints.add(l.tokenMint));

  const marginPoolsPublicKeys = [...mints].map(
    (mint) =>
      PublicKey.findProgramAddressSync(
        [
          PublicKey.findProgramAddressSync(
            [ID.toBuffer()],
            leverageFiProgramID
          )[0].toBuffer(),
          new PublicKey(mint).toBuffer(),
        ],
        leverageFiProgramID
      )[0]
  );

  const marginPools = await getAutoParsedMultipleAccountsInfo<MarginPool>(
    connection,
    nxfinanceLeverageIdlItem,
    marginPoolsPublicKeys
  );

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  const elementMultiple = elementRegistry.addElementMultiple({
    label: 'Lending',
    name: 'Fulcrum Lending Pool',
  });
  const elementBorrowlend = elementRegistry.addElementBorrowlend({
    label: 'Leverage',
    name: `JLP Leverage x${new BigNumber(marginAccount.leverage)
      .dividedBy(100)
      .decimalPlaces(2)}`,
  });

  marginAccount.deposits.forEach((deposit) => {
    const marginPool = marginPools.find(
      (mp) => mp?.tokenMint === deposit.tokenMint
    );
    if (!marginPool) return;

    const supplyNoteRate = getSupplyNoteRate(marginPool);

    const amount = new BigNumber(deposit.depositNote).multipliedBy(
      supplyNoteRate
    );

    const asset = {
      address: deposit.tokenMint,
      amount,
    };

    if (leverageVaultsMints.includes(deposit.tokenMint)) {
      asset.amount = asset.amount
        .multipliedBy(marginAccount.leverage)
        .dividedBy(100);
      elementBorrowlend.addSuppliedAsset(asset);
    } else {
      elementMultiple.addAsset(asset);
    }
  });

  marginAccount.loans.forEach((loan) => {
    const marginPool = marginPools.find(
      (mp) => mp?.tokenMint === loan.tokenMint
    );
    if (!marginPool) return;
    if (loan.loanNote === '0') return;

    const borrowNoteRate = getBorrowNoteRate(marginPool);

    elementBorrowlend.addBorrowedAsset({
      address: loan.tokenMint,
      amount: new BigNumber(loan.loanNote).multipliedBy(borrowNoteRate),
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-positions`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
