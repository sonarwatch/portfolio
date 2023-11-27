import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  Yield,
  getElementLendingValues,
} from '@sonarwatch/portfolio-core';
import { USDC_MINT } from '@bonfida/spl-name-service';
import { WRAPPED_SOL_MINT } from '@metaplex-foundation/js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, programId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { LoanStatus, loanStruct } from './structs/loan';
import { loanBorrowerFilter } from './filters';
import { Collection } from './types';
import getTokenPricesMap from '../../utils/misc/getTokensPricesMap';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const loans = await getParsedProgramAccounts(
    client,
    loanStruct,
    programId,
    loanBorrowerFilter(owner)
  );
  if (loans.length === 0) return [];

  const tokenPriceById = await getTokenPricesMap(
    [USDC_MINT.toString(), WRAPPED_SOL_MINT.toString()],
    NetworkId.solana,
    cache
  );

  const usdcTokenPrice = tokenPriceById.get(USDC_MINT.toString());

  const collections = await cache.getItems<Collection>(
    loans.map((loan) => loan.collection.toString()),
    { prefix: platformId, networkId: NetworkId.solana }
  );
  const collectionById: Map<string, Collection> = new Map();
  collections.forEach((collection) =>
    collection
      ? collectionById.set(collection.collectionId.toString(), collection)
      : undefined
  );
  const elements: PortfolioElement[] = [];

  for (const loan of loans) {
    console.log('constexecutor:FetcherExecutor= ~ loan:', loan);
    if (loan.amount.isZero()) continue;
    if (loan.status !== LoanStatus.Ongoing) continue;

    const collection = collectionById.get(loan.collection.toString());
    if (!collection) continue;

    console.log('constexecutor:FetcherExecutor= ~ collection:', collection);

    const borrowedAssets: PortfolioAsset[] = [];
    const borrowedYields: Yield[][] = [];
    const suppliedAssets: PortfolioAsset[] = [];
    const suppliedYields: Yield[][] = [];
    const rewardAssets: PortfolioAsset[] = [];
    if (loan.isDefi) {
      const amountBorrowed = loan.amount;
      borrowedAssets.push(
        tokenPriceToAssetToken(
          USDC_MINT.toString(),
          amountBorrowed.dividedBy(10 ** 6).toNumber(),
          NetworkId.solana,
          usdcTokenPrice
        )
      );
    } else {
      console.log('Its not DeFi');
    }

    if (suppliedAssets.length === 0 && borrowedAssets.length === 0) continue;

    const { borrowedValue, collateralRatio, suppliedValue, value } =
      getElementLendingValues(suppliedAssets, borrowedAssets, rewardAssets);

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
        collateralRatio,
        rewardAssets,
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
