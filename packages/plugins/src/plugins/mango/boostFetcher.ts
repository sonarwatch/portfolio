import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  TokenPrice,
  Yield,
  getElementLendingValues,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  boostBanksKey,
  boostProgramId,
  yieldFanPlatformId as platformId,
  platformId as mangoPlatformId,
} from './constants';
import { getClientSolana } from '../../utils/clients';
import { mangoAccountStruct } from './struct';
import { boostAccountsFilter } from './filters';
import { getParsedProgramAccounts } from '../../utils/solana';
import { BankDetails } from './types';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const accounts = await getParsedProgramAccounts(
    client,
    mangoAccountStruct,
    boostProgramId,
    boostAccountsFilter(owner)
  );
  if (accounts.length === 0) return [];

  const banksDetails = await cache.getItem<BankDetails[]>(boostBanksKey, {
    prefix: mangoPlatformId,
    networkId: NetworkId.solana,
  });
  if (!banksDetails) return [];

  const tokenPricesRes = await cache.getTokenPrices(
    banksDetails.map((bd) => bd.mint),
    NetworkId.solana
  );
  const tokenPrices: Map<string, TokenPrice> = new Map();
  tokenPricesRes.forEach((tp) => {
    if (!tp) return;
    tokenPrices.set(tp.address, tp);
  });

  const elements: PortfolioElement[] = [];
  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];
    const tokenPositions = account.tokens;

    const borrowedAssets: PortfolioAsset[] = [];
    const borrowedYields: Yield[][] = [];
    const suppliedAssets: PortfolioAsset[] = [];
    const suppliedYields: Yield[][] = [];
    const rewardAssets: PortfolioAsset[] = [];

    for (let j = 0; j < tokenPositions.length; j++) {
      const tokenPosition = tokenPositions[j];
      if (tokenPosition.tokenIndex === 65535) continue;
      if (tokenPosition.indexedPosition.isZero()) continue;
      const bankDetails = banksDetails.find(
        (bd) => bd.tokenIndex === tokenPosition.tokenIndex
      );
      if (!bankDetails) continue;

      const tokenPrice = tokenPrices.get(bankDetails.mint);
      if (!tokenPrice) continue;

      // Deposit
      if (tokenPosition.indexedPosition.isPositive()) {
        const amount = new BigNumber(tokenPosition.indexedPosition)
          .times(bankDetails.depositIndex)
          .div(10 ** tokenPrice.decimals)
          .toNumber();

        suppliedAssets.push(
          tokenPriceToAssetToken(
            tokenPrice.address,
            amount,
            NetworkId.solana,
            tokenPrice
          )
        );
        suppliedYields.push([]);
      }

      // Borrow
      if (tokenPosition.indexedPosition.isNegative()) {
        const amount = new BigNumber(tokenPosition.indexedPosition)
          .abs()
          .times(bankDetails.borrowIndex)
          .div(10 ** tokenPrice.decimals)
          .toNumber();
        borrowedAssets.push(
          tokenPriceToAssetToken(
            tokenPrice.address,
            amount,
            NetworkId.solana,
            tokenPrice
          )
        );
        borrowedYields.push([]);
      }
    }

    if (suppliedAssets.length === 0 && borrowedAssets.length === 0) continue;

    const { borrowedValue, healthRatio, suppliedValue, value, rewardValue } =
      getElementLendingValues({ suppliedAssets, borrowedAssets, rewardAssets });

    let leverage;
    if (
      suppliedAssets[0] &&
      suppliedAssets[0].data.price &&
      suppliedAssets[0].data.amount &&
      value
    ) {
      const depositAmount = new BigNumber(value).dividedBy(
        suppliedAssets[0].data.price
      );
      leverage = `${new BigNumber(suppliedAssets[0].data.amount)
        .dividedBy(depositAmount)
        .decimalPlaces(2)
        .toString()}x`;
    }

    const element: PortfolioElement = {
      type: PortfolioElementType.borrowlend,
      networkId: NetworkId.solana,
      platformId,
      label: 'Leverage',
      name: leverage,
      value,
      data: {
        borrowedAssets,
        borrowedValue,
        borrowedYields,
        suppliedAssets,
        suppliedValue,
        suppliedYields,
        healthRatio,
        rewardAssets,
        rewardValue,
        value,
      },
    };
    elements.push(element);
  }
  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-boost`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
