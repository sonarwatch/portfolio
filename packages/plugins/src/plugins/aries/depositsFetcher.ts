import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  TokenPrice,
  Yield,
  getElementLendingValues,
} from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { apiUrl, platformId } from './constants';
import { ProfileResponse } from './types';
import { getName } from './helpers';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const profileRes: AxiosResponse<ProfileResponse> | null = await axios
    .get(`${apiUrl}profile.find?input={"owner":"${owner}"}`)
    .catch(() => null);
  if (!profileRes || !profileRes.data) return [];

  const { profiles } = profileRes.data.result.data;

  const mintsSet: Set<string> = new Set();
  for (const accountName in profiles) {
    if (profiles[accountName]) {
      for (const coin in profiles[accountName].deposits) {
        if (profiles[accountName].deposits[coin]) {
          mintsSet.add(coin);
        }
      }
      for (const coin in profiles[accountName].borrows) {
        if (profiles[accountName].borrows[coin]) {
          mintsSet.add(coin);
        }
      }
    }
  }
  const mints = Array.from(mintsSet);
  const tokenPrices = await cache.getTokenPrices(mints, NetworkId.aptos);
  const tokenById: Map<string, TokenPrice> = new Map();
  tokenPrices.forEach((tokenPrice, index) => {
    if (tokenPrice) {
      tokenById.set(mints[index], tokenPrice);
    }
  });
  const elements: PortfolioElement[] = [];

  for (const accountName in profiles) {
    if (profiles[accountName]) {
      const borrowedAssets: PortfolioAsset[] = [];
      const borrowedYields: Yield[][] = [];
      const suppliedAssets: PortfolioAsset[] = [];
      const suppliedYields: Yield[][] = [];
      const rewardAssets: PortfolioAsset[] = [];

      const profile = profiles[accountName];
      const name = getName(accountName);

      for (const coin in profile.deposits) {
        if (profile.deposits[coin]) {
          const deposit = profile.deposits[coin];
          const amount = new BigNumber(deposit.collateral_coins);
          if (amount.isZero()) continue;

          const tokenPrice = tokenById.get(coin);
          if (!tokenPrice) continue;

          suppliedAssets.push(
            tokenPriceToAssetToken(
              coin,
              amount.dividedBy(10 ** tokenPrice.decimals).toNumber(),
              NetworkId.aptos,
              tokenPrice
            )
          );
        }
      }

      for (const coin in profile.borrows) {
        if (profile.borrows[coin]) {
          const borrow = profile.borrows[coin];
          const amount = new BigNumber(borrow.borrowed_coins);
          if (amount.isZero()) continue;

          const tokenPrice = tokenById.get(coin);
          if (!tokenPrice) continue;

          borrowedAssets.push(
            tokenPriceToAssetToken(
              coin,
              amount.dividedBy(10 ** tokenPrice.decimals).toNumber(),
              NetworkId.aptos,
              tokenPrice
            )
          );
        }
      }

      if (suppliedAssets.length === 0 && borrowedAssets.length === 0) continue;

      const { borrowedValue, suppliedValue, value, rewardValue } =
        getElementLendingValues(suppliedAssets, borrowedAssets, rewardAssets);

      elements.push({
        type: PortfolioElementType.borrowlend,
        networkId: NetworkId.aptos,
        platformId,
        label: 'Lending',
        value,
        name,
        data: {
          borrowedAssets,
          borrowedValue,
          borrowedYields,
          suppliedAssets,
          suppliedValue,
          suppliedYields,
          collateralRatio: null,
          healthRatio: 1 - new BigNumber(profile.riskFactor).toNumber(),
          rewardAssets,
          rewardValue,
          value,
        },
      });
    }
  }
  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-deposits`,
  networkId: NetworkId.aptos,
  executor,
};

export default fetcher;
