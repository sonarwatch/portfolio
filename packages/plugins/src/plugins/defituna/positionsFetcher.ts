import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { defiTunaProgram, platformId, poolsMemo } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts, ParsedAccount } from '../../utils/solana';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { TunaPositionStatus, tunaPositionStruct } from './structs';
import { whirlpoolPrefix } from '../orca/constants';
import { Whirlpool } from '../orca/structs/whirlpool';
import { getTokenAmountsFromLiquidity } from '../../utils/clmm/tokenAmountFromLiquidity';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const accounts = await getParsedProgramAccounts(
    connection,
    tunaPositionStruct,
    defiTunaProgram,
    [
      {
        memcmp: {
          offset: 0,
          bytes: 'DqnVziNrcvP',
        },
      },
      {
        memcmp: {
          offset: 11,
          bytes: owner,
        },
      },
      {
        dataSize: 339,
      },
    ]
  );

  if (accounts.length === 0) return [];

  const [pools, lendingPools] = await Promise.all([
    cache.getItems<ParsedAccount<Whirlpool>>(
      accounts.map((acc) => acc.pool.toString()),
      {
        prefix: whirlpoolPrefix,
        networkId: NetworkId.solana,
      }
    ),
    poolsMemo.getItem(cache),
  ]);

  if (!lendingPools) throw new Error('Lending pools not cached');

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  accounts.forEach((account) => {
    if (account.state !== TunaPositionStatus.Normal) return;
    const pool = pools.find(
      (p) => p && p.pubkey.toString() === account.pool.toString()
    );
    if (!pool) return;
    const lendingPoolA = lendingPools.find(
      (p) => p.mint.toString() === account.mint_a.toString()
    );
    const lendingPoolB = lendingPools.find(
      (p) => p.mint.toString() === account.mint_b.toString()
    );
    if (!lendingPoolA || !lendingPoolB) return;

    const element = elementRegistry.addElementBorrowlend({
      label: 'LiquidityPool',
      ref: account.pubkey,
      link: 'https://defituna.com/trade',
      sourceRefs: [
        { name: 'Lending Market', address: lendingPoolA.pubkey.toString() },
        { name: 'Lending Market', address: lendingPoolB.pubkey.toString() },
      ],
    });

    const { tokenAmountA, tokenAmountB } = getTokenAmountsFromLiquidity(
      new BigNumber(account.liquidity),
      Number(pool.tickCurrentIndex),
      Number(account.tick_lower_index),
      Number(account.tick_upper_index),
      true
    );

    element.addSuppliedAsset({
      address: account.mint_a,
      amount: tokenAmountA,
    });

    element.addSuppliedAsset({
      address: account.mint_b,
      amount: tokenAmountB,
    });

    if (tokenAmountA.isZero() || tokenAmountB.isZero())
      element.addTag('Out Of Range');

    element.addSuppliedAsset({
      address: account.mint_a,
      amount: account.leftovers_a,
    });

    element.addSuppliedAsset({
      address: account.mint_b,
      amount: account.leftovers_b,
    });

    element.addBorrowedAsset({
      address: account.mint_a,
      amount: account.loan_shares_a
        .multipliedBy(lendingPoolA.borrowedFunds)
        .dividedBy(lendingPoolA.borrowedShares),
    });

    element.addBorrowedAsset({
      address: account.mint_b,
      amount: account.loan_shares_b
        .multipliedBy(lendingPoolB.borrowedFunds)
        .dividedBy(lendingPoolB.borrowedShares),
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
