import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  TokenPrice,
  Yield,
  aprToApy,
  getElementLendingValues,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { driftProgram, platformId, prefixSpotMarkets } from './constants';
import {
  SpotBalanceType,
  insuranceFundStakeStruct,
  userAccountStruct,
} from './struct';
import {
  getSignedTokenAmount,
  getTokenAmount,
  getUserAccountsPublicKeys,
  getUserInsuranceFundStakeAccountPublicKey,
  isSpotPositionAvailable,
} from './helpers';
import { SpotMarketEnhanced } from './types';
import {
  getParsedMultipleAccountsInfo,
  u8ArrayToString,
} from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const spotMarketsItems = await cache.getAllItems<SpotMarketEnhanced>({
    prefix: prefixSpotMarkets,
    networkId: NetworkId.solana,
  });

  if (spotMarketsItems.length === 0) return [];

  const spotMarketByIndex: Map<number, SpotMarketEnhanced> = new Map();
  const tokensMints = [];
  const insuranceFundStakeAccountsAddresses: PublicKey[] = [];
  for (const spotMarketItem of spotMarketsItems) {
    insuranceFundStakeAccountsAddresses[spotMarketItem.marketIndex] =
      getUserInsuranceFundStakeAccountPublicKey(
        driftProgram,
        new PublicKey(owner),
        spotMarketItem.marketIndex
      );
    spotMarketByIndex.set(spotMarketItem.marketIndex, spotMarketItem);
    tokensMints.push(spotMarketItem.mint.toString());
  }

  const tokensPrices = await cache.getTokenPrices(
    tokensMints,
    NetworkId.solana
  );
  const tokenPriceById: Map<string, TokenPrice> = new Map();
  tokensPrices.forEach((tP) => (tP ? tokenPriceById.set(tP.address, tP) : []));

  const insuranceAccounts = await getParsedMultipleAccountsInfo(
    client,
    insuranceFundStakeStruct,
    insuranceFundStakeAccountsAddresses
  );

  const elements: PortfolioElement[] = [];
  if (insuranceAccounts) {
    const assets: PortfolioAsset[] = [];
    insuranceAccounts.forEach((account, i) => {
      if (!account || account.costBasis.isLessThan(0)) return;
      const mint = spotMarketByIndex.get(i)?.mint.toString();
      if (!mint) return;
      const tokenPrice = tokenPriceById.get(mint);
      if (!tokenPrice) return;
      assets.push(
        tokenPriceToAssetToken(
          mint,
          account.costBasis.dividedBy(10 ** tokenPrice.decimals).toNumber(),
          NetworkId.solana,
          tokenPrice
        )
      );
    });

    if (assets.length !== 0) {
      elements.push({
        networkId: NetworkId.solana,
        label: 'Staked',
        name: 'Insurance Fund',
        platformId,
        type: PortfolioElementType.multiple,
        value: getUsdValueSum(assets.map((a) => a.value)),
        data: {
          assets,
        },
      });
    }
  }

  let id = 0;
  const userAccounts = [];
  let parsedAccount;
  do {
    const accountPubKeys = getUserAccountsPublicKeys(
      driftProgram,
      new PublicKey(owner),
      id,
      id + 10
    );
    parsedAccount = await getParsedMultipleAccountsInfo(
      client,
      userAccountStruct,
      accountPubKeys
    );
    userAccounts.push(...parsedAccount);
    id += 10;
  } while (parsedAccount[parsedAccount.length]);

  if (!userAccounts) return elements;

  // One user can have multiple sub-account
  for (const userAccount of userAccounts) {
    if (!userAccount) continue;
    const borrowedAssets: PortfolioAsset[] = [];
    const borrowedYields: Yield[][] = [];
    const suppliedAssets: PortfolioAsset[] = [];
    const suppliedYields: Yield[][] = [];
    const rewardAssets: PortfolioAsset[] = [];

    const marketIndexRef = 0;

    // Each account has up to 8 SpotPositions
    for (const spotPosition of userAccount.spotPositions) {
      if (spotPosition.scaledBalance.isZero()) continue;
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

      const tokenPrice = tokenPriceById.get(spotMarket.mint.toString());
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

    const { borrowedValue, suppliedValue, value, healthRatio, rewardValue } =
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
        rewardAssets,
        rewardValue,
        healthRatio,
        value,
      },
      name: u8ArrayToString(userAccount.name),
    });
  }

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-deposits`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
