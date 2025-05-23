import {
  aprToApy,
  NetworkId,
  solanaNativeWrappedAddress,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import {
  lendingPoolKey,
  leverageVaultsMints,
  platformId,
  solayerPoolKey,
} from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { ParsedAccount } from '../../utils/solana';
import { LendingPool, SolayerPool } from './structs';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import {
  formatLendingPool,
  getBorrowNoteRate,
  getFragmetricLendingAccounts,
  getLendingAccounts,
  getMarginAccount,
  getMarginPools,
  getSolayerUserAccounts,
  getSupplyNoteRate,
  getVSolPositionAccounts,
} from './helpers';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const lendingPoolsMemo = new MemoizedCache<ParsedAccount<LendingPool>[]>(
  lendingPoolKey,
  {
    prefix: platformId,
    networkId: NetworkId.solana,
  }
);
const solayerPoolsMemo = new MemoizedCache<ParsedAccount<SolayerPool>[]>(
  solayerPoolKey,
  {
    prefix: platformId,
    networkId: NetworkId.solana,
  }
);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const [lendingPools, solayerPools] = await Promise.all([
    lendingPoolsMemo.getItem(cache),
    solayerPoolsMemo.getItem(cache),
  ]);
  if (!lendingPools) throw new Error('Lending pools missing in cache.');
  if (!solayerPools) throw new Error('Solayer pools missing in cache.');

  const [
    lendingAccounts,
    fragmetricLendingAccounts,
    vSolPositionsAccounts,
    marginAccount,
    solayerUserAccounts,
  ] = await Promise.all([
    getLendingAccounts(lendingPools, owner), // JLP
    getFragmetricLendingAccounts(owner), // fragSOL
    getVSolPositionAccounts(lendingPools, owner), // vSOL
    getMarginAccount(owner), // Fulcrum Lending Pool
    getSolayerUserAccounts(solayerPools, owner), // Solayer
  ]);

  if (
    lendingAccounts.length === 0 &&
    fragmetricLendingAccounts.length === 0 &&
    vSolPositionsAccounts.length === 0 &&
    !marginAccount &&
    solayerUserAccounts.length === 0
  )
    return [];

  const mints = new Set<string>();
  if (marginAccount) {
    marginAccount.deposits.forEach((d) => mints.add(d.tokenMint.toString()));
    marginAccount.loans.forEach((l) => mints.add(l.tokenMint.toString()));
  }
  vSolPositionsAccounts.forEach((vSolPositionsAccount) => {
    vSolPositionsAccount?.positions.forEach((position) => {
      mints.add(position.borrowMint.toString());
      mints.add(position.collateralMint.toString());
      mints.add(position.leverageMint.toString());
    });
  });
  lendingPools.forEach((l) => mints.add(l.tokenMint.toString()));
  fragmetricLendingAccounts.forEach((acc) => {
    acc.positions.forEach((position) => {
      mints.add(position.borrowMint.toString());
      mints.add(position.collateralMint.toString());
      mints.add(position.leverageMint.toString());
    });
  });

  const [marginPools, tokenPrices] = await Promise.all([
    getMarginPools(mints),
    cache.getTokenPricesAsMap(mints, NetworkId.solana),
  ]);

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  fragmetricLendingAccounts.forEach((lendingAccount) => {
    if (!lendingAccount) return;

    lendingAccount.positions.forEach((position) => {
      if (position.collateralNote.isZero()) return;

      const element = elementRegistry.addElementMultiple({
        label: 'Leverage',
        name: `fragSOL Leverage x${new BigNumber(position.leverageMultiples)
          .dividedBy(1000000)
          .decimalPlaces(2)}`,
        link: 'https://www.nxfinance.info/leverage/v2/fragSOL',
        ref: lendingAccount.pubkey.toString(),
      });

      const collateralTokenPrice = tokenPrices.get(
        position.collateralMint.toString()
      );
      const loanTokenPrice = tokenPrices.get(position.borrowMint.toString());
      const leverageTokenPrice = tokenPrices.get(
        position.leverageMint.toString()
      );

      if (!collateralTokenPrice || !loanTokenPrice || !leverageTokenPrice)
        return;

      const amount = new BigNumber(
        new BigNumber(position.leverageTokens)
          .dividedBy(10 ** leverageTokenPrice.decimals)
          .times(leverageTokenPrice.price)
      )
        .minus(
          new BigNumber(position.borrowTokens)
            .dividedBy(10 ** loanTokenPrice.decimals)
            .times(loanTokenPrice.price)
        )
        .div(collateralTokenPrice.price);

      element.addAsset({
        address: position.collateralMint,
        amount,
        alreadyShifted: true,
      });
    });
  });

  lendingAccounts.forEach((lendingAccount) => {
    if (!lendingAccount) return;
    if (lendingAccount.depositNotes.isZero()) return;

    const lendingPool = lendingPools.find(
      (lp) => lp.nxMarket.toString() === lendingAccount.nxMarket.toString()
    );
    if (!lendingPool) return;

    const tokenPrice = tokenPrices.get(lendingPool.tokenMint.toString());

    if (!tokenPrice) return;

    const element = elementRegistry.addElementLiquidity({
      label: 'Lending',
      name: 'GMS Lending Pool',
      link: 'https://www.nxfinance.info/lend',
    });

    const formattedLendingPool = formatLendingPool(
      lendingPools[0],
      tokenPrice.decimals
    );

    const liquidity = element.addLiquidity({
      ref: lendingAccount.pubkey.toString(),
      sourceRefs: [
        { name: 'Lending Market', address: lendingPool.pubkey.toString() },
      ],
    });
    liquidity.addAsset({
      address: lendingPool.tokenMint,
      amount: new BigNumber(lendingAccount.depositNotes).multipliedBy(
        formattedLendingPool.depositNoteRate
      ),
    });
    liquidity.addYield({
      apr: formattedLendingPool.APR,
      apy: aprToApy(formattedLendingPool.APR),
    });
  });

  vSolPositionsAccounts.forEach((vSolPositionsAccount) => {
    if (!vSolPositionsAccount) return;

    vSolPositionsAccount.positions.forEach((position) => {
      if (!position) return;
      const lendingPool = lendingPools.find(
        (lp) =>
          lp.nxMarket.toString() === vSolPositionsAccount.nxMarket.toString()
      );
      if (!lendingPool) return;

      const tokenPrice = tokenPrices.get(lendingPool.tokenMint.toString());

      if (!tokenPrice) return;

      const formattedLendingPool = formatLendingPool(
        lendingPools[0],
        tokenPrice.decimals
      );

      const collateralTokenPrice = tokenPrices.get(
        position.collateralMint.toString()
      );
      const loanTokenPrice = tokenPrices.get(position.borrowMint.toString());
      const leverageTokenPrice = tokenPrices.get(
        position.leverageMint.toString()
      );

      if (!collateralTokenPrice || !loanTokenPrice || !leverageTokenPrice)
        return;

      const element = elementRegistry.addElementMultiple({
        label: 'Leverage',
        name: `vSOL Leverage x${new BigNumber(position.leverageMultiples)
          .dividedBy(1000000)
          .decimalPlaces(2)}`,
        link: 'https://www.nxfinance.info/leverage',
        ref: vSolPositionsAccount.pubkey.toString(),
        sourceRefs: [
          { name: 'Lending Market', address: lendingPool.pubkey.toString() },
        ],
      });

      const amount = new BigNumber(
        new BigNumber(position.leverageNote)
          .dividedBy(10 ** leverageTokenPrice.decimals)
          .times(leverageTokenPrice.price)
      )
        .minus(
          new BigNumber(position.borrowNote)
            .multipliedBy(formattedLendingPool.borrowNoteRate)
            .dividedBy(10 ** loanTokenPrice.decimals)
            .times(loanTokenPrice.price)
        )
        .div(collateralTokenPrice.price);

      element.addAsset({
        address: position.collateralMint,
        amount,
        alreadyShifted: true,
      });
    });
  });

  if (marginAccount) {
    const elementMultiple = elementRegistry.addElementMultiple({
      label: 'Lending',
      name: 'Fulcrum Lending Pool',
      link: 'https://www.nxfinance.info/lend',
      ref: marginAccount.pubkey,
    });
    const elementBorrowlend = elementRegistry.addElementBorrowlend({
      label: 'Leverage',
      name: `JLP x${new BigNumber(marginAccount.leverage)
        .dividedBy(100)
        .decimalPlaces(2)}`,
      link: 'https://www.nxfinance.info/leverage',
      ref: marginAccount.pubkey,
    });

    marginAccount.deposits.forEach((deposit) => {
      const marginPool = marginPools.find(
        (mp) => mp?.tokenMint.toString() === deposit.tokenMint.toString()
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

      if (leverageVaultsMints.includes(deposit.tokenMint.toString())) {
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
        (mp) => mp?.tokenMint.toString() === loan.tokenMint.toString()
      );
      if (!marginPool) return;
      if (loan.loanNote.isZero()) return;

      const borrowNoteRate = getBorrowNoteRate(marginPool);

      elementBorrowlend.addBorrowedAsset({
        address: loan.tokenMint,
        amount: new BigNumber(loan.loanNote).multipliedBy(borrowNoteRate),
      });
    });
  }

  solayerUserAccounts.forEach((solayerUserAccount) => {
    if (!solayerUserAccount) return;
    const element = elementRegistry.addElementMultiple({
      label: 'Leverage',
      link: 'https://www.nxfinance.info/leverage',
      ref: solayerUserAccount.pubkey,
    });
    element.addAsset({
      address: solayerUserAccount.lrtMint,
      amount: solayerUserAccount.amount,
    });
    solayerUserAccount.withdrawals.forEach((withdrawal) => {
      if (withdrawal[0])
        element.addAsset({
          address: solanaNativeWrappedAddress,
          amount: withdrawal[0].solAmount,
        });
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
