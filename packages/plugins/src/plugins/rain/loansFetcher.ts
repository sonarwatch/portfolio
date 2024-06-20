import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  Yield,
  getElementLendingValues,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import {
  ParsedAccount,
  getParsedMultipleAccountsInfo,
} from '../../utils/solana';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { Pool, poolStruct } from './structs/pool';
import { daysBetweenDates, getLoans } from './helpers';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  // const loans = await getParsedProgramAccounts(
  //   client,
  //   loanStruct,
  //   programId,
  //   loanBorrowerFilter(owner)
  // );

  // if (loans.length === 0) return [];

  const loans = await getLoans(owner);
  if (loans.length === 0) return [];

  const mints: Set<string> = new Set();
  const pools: Set<string> = new Set();
  loans.forEach((loan) => {
    pools.add(loan.pool.toString());
    mints.add(loan.currency.toString());
    mints.add(loan.mint.toString());
  });

  const tokenPriceById = await cache.getTokenPricesAsMap(
    Array.from(mints),
    NetworkId.solana
  );

  const poolsAccounts = await getParsedMultipleAccountsInfo(
    client,
    poolStruct,
    Array.from(pools).map((pool) => new PublicKey(pool))
  );
  const poolById: Map<string, ParsedAccount<Pool>> = new Map();
  poolsAccounts.forEach((account) =>
    account ? poolById.set(account.pubkey.toString(), account) : undefined
  );
  const elements: PortfolioElement[] = [];

  for (const loan of loans) {
    if (new BigNumber(loan.amount).isZero()) continue;
    if (loan.status !== 'Ongoing') continue;
    if (!loan.isDefi) continue;

    const collateraMint = loan.mint.toString();
    const borrowMint = loan.currency.toString();

    const collatTokenPrice = tokenPriceById.get(collateraMint);
    const borrowTokenPrice = tokenPriceById.get(borrowMint);
    if (!collatTokenPrice || !borrowTokenPrice) continue;

    const borrowedAssets: PortfolioAsset[] = [];
    const borrowedYields: Yield[][] = [];
    const suppliedAssets: PortfolioAsset[] = [];
    const suppliedYields: Yield[][] = [];
    const rewardAssets: PortfolioAsset[] = [];

    const amountBorrowed = new BigNumber(loan.amount).dividedBy(
      10 ** borrowTokenPrice.decimals
    );
    const daysRemaining = daysBetweenDates(
      new Date(),
      new Date(loan.expiredAt)
    );
    if (!amountBorrowed.isZero())
      borrowedAssets.push(
        tokenPriceToAssetToken(
          borrowTokenPrice.address,
          amountBorrowed.toNumber(),
          NetworkId.solana,
          borrowTokenPrice,
          undefined,
          { tags: [`Refund in ${daysRemaining} days`] }
        )
      );

    const amountDeposited = new BigNumber(loan.collateralAmount).dividedBy(
      10 ** collatTokenPrice.decimals
    );
    if (!amountDeposited.isZero())
      suppliedAssets.push(
        tokenPriceToAssetToken(
          collatTokenPrice.address,
          amountDeposited.toNumber(),
          NetworkId.solana,
          collatTokenPrice
        )
      );

    if (suppliedAssets.length === 0 && borrowedAssets.length === 0) continue;

    const { borrowedValue, healthRatio, suppliedValue, value, rewardValue } =
      getElementLendingValues({ suppliedAssets, borrowedAssets, rewardAssets });

    elements.push({
      type: PortfolioElementType.borrowlend,
      networkId: NetworkId.solana,
      platformId,
      label: 'Lending',
      value,
      data: {
        borrowedAssets,
        borrowedValue,
        borrowedYields,
        suppliedAssets,
        suppliedValue,
        suppliedYields,
        rewardAssets,
        healthRatio,
        rewardValue,
        value,
      },
    });
  }
  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-loans`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
