import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  TokenPrice,
  Yield,
  aprToApy,
  getElementLendingValues,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { DriftProgram, platformId, prefixSpotMarkets } from './constants';
import { SpotBalanceType, userAccountStruct } from './struct';
import { accountsFilter } from './filters';
import {
  decodeName,
  getSignedTokenAmount,
  getTokenAmount,
  isSpotPositionAvailable,
} from './helpers';
import { SpotMarketEnhanced } from './types';
import { getParsedProgramAccounts } from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import runInBatch from '../../utils/misc/runInBatch';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const userAccounts = await getParsedProgramAccounts(
    client,
    userAccountStruct,
    DriftProgram,
    accountsFilter(owner)
  );
  if (!userAccounts) return [];

  const spotMarketIndexes: Set<string> = new Set();
  for (const userAccount of userAccounts) {
    for (const spotPosition of userAccount.spotPositions) {
      spotMarketIndexes.add(spotPosition.marketIndex.toString());
    }
  }
  const spotMarketsItems = await cache.getItems<SpotMarketEnhanced>(
    Array.from(spotMarketIndexes),
    {
      prefix: prefixSpotMarkets,
      networkId: NetworkId.solana,
    }
  );
  if (!spotMarketsItems) return [];
  const spotMarketByIndex: Map<number, SpotMarketEnhanced> = new Map();
  const tokensMints: Set<string> = new Set();
  for (const spotMarketItem of spotMarketsItems) {
    if (!spotMarketItem) continue;
    spotMarketByIndex.set(spotMarketItem.marketIndex, spotMarketItem);
    tokensMints.add(spotMarketItem.mint.toString());
  }

  const tokenPriceResults = await runInBatch(
    [...tokensMints].map(
      (mint) => () => cache.getTokenPrice(mint.toString(), NetworkId.solana)
    )
  );
  const tokenPrices: Map<string, TokenPrice> = new Map();
  tokenPriceResults.forEach((r) => {
    if (r.status === 'rejected') return;
    if (!r.value) return;
    tokenPrices.set(r.value.address, r.value);
  });

  const elements: PortfolioElement[] = [];
  // One user can have multiple sub-account
  for (const userAccount of userAccounts) {
    const borrowedAssets: PortfolioAsset[] = [];
    const borrowedYields: Yield[][] = [];
    const suppliedAssets: PortfolioAsset[] = [];
    const suppliedYields: Yield[][] = [];
    const rewardAssets: PortfolioAsset[] = [];

    const marketIndexRef = 0;

    // Each account has up to 8 SpotPositions
    for (const spotPosition of userAccount.spotPositions) {
      const countForBase =
        marketIndexRef === undefined ||
        spotPosition.marketIndex === marketIndexRef;

      const countForQuote =
        marketIndexRef === undefined || marketIndexRef === 0;
      if (
        isSpotPositionAvailable(spotPosition) ||
        (!countForBase && !countForQuote)
      ) {
        continue;
      }

      const spotMarket = spotMarketByIndex.get(spotPosition.marketIndex);
      if (!spotMarket) continue;

      const tokenPrice = tokenPrices.get(spotMarket.mint.toString());
      if (!tokenPrice || tokenPrice === null) continue;

      let tokenAmount = new BigNumber(0);
      if (
        spotMarket.marketIndex !== 0 &&
        spotPosition.balanceType === SpotBalanceType.Deposit
      ) {
        tokenAmount = getTokenAmount(
          spotPosition.scaledBalance,
          spotMarket,
          spotPosition.balanceType
        );
      } else {
        tokenAmount = getSignedTokenAmount(
          getTokenAmount(
            spotPosition.scaledBalance,
            spotMarket,
            spotPosition.balanceType
          ),
          spotPosition.balanceType
        );
      }

      if (spotPosition.balanceType === SpotBalanceType.Deposit) {
        suppliedAssets.push(
          tokenPriceToAssetToken(
            spotMarket.mint.toString(),
            tokenAmount.div(10 ** tokenPrice.decimals).toNumber(),
            NetworkId.solana,
            tokenPrice
          )
        );
        suppliedYields.push([
          {
            apr: spotMarket.depositApr,
            apy: aprToApy(spotMarket.depositApr),
          },
        ]);
      } else if (spotPosition.balanceType === SpotBalanceType.Borrow) {
        borrowedAssets.push(
          tokenPriceToAssetToken(
            spotMarket.mint.toString(),
            tokenAmount
              .div(10 ** tokenPrice.decimals)
              .abs()
              .toNumber(),
            NetworkId.solana,
            tokenPrice
          )
        );
        borrowedYields.push([
          {
            apr: spotMarket.borrowApr,
            apy: aprToApy(spotMarket.borrowApr),
          },
        ]);
      }
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
      name: decodeName(userAccount.name),
    });
  }

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-spotPositions`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
