import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import {
  anaDecimals,
  anaMint,
  nirvDecimals,
  nirvMint,
  pid,
  platformId,
  prAnaDecimals,
  prAnaMint,
} from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { personalAccountStruct } from './structs';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const personalAccounts = await ParsedGpa.build(
    connection,
    personalAccountStruct,
    pid
  )
    .addFilter('owner', new PublicKey(owner))
    .addDataSizeFilter(272)
    .run();
  if (personalAccounts.length === 0) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  personalAccounts.forEach((acc) => {
    // Skip the demo accounts from temple.nirvana.finance
    if (
      acc.tenant.toString() === '8PWyxJYYpoJgrgeGRUEqqFRun4z9zzZFy5cCZvXSXWe5'
    )
      return;
    const lendingElement = elementRegistry.addElementBorrowlend({
      label: 'Lending',
      ref: acc.pubkey,
      link: 'https://app.nirvana.finance/borrow',
    });
    lendingElement.addBorrowedAsset({
      address: nirvMint,
      amount: acc.nirvBorrowed.dividedBy(10 ** nirvDecimals),
      alreadyShifted: true,
    });
    lendingElement.addSuppliedAsset({
      address: anaMint,
      amount: acc.anaDeposited.dividedBy(10 ** anaDecimals),
      alreadyShifted: true,
    });

    const daoElement = elementRegistry.addElementMultiple({
      label: 'Deposit',
      name: 'Nirvana DAO',
      ref: acc.pubkey,
      link: 'https://app.nirvana.finance/govern',
    });
    daoElement.addAsset({
      address: prAnaMint,
      amount: acc.stagedPrana.dividedBy(10 ** prAnaDecimals),
      alreadyShifted: true,
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-deposits`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
