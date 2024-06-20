import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  Yield,
  formatMoveTokenAddress,
  getElementLendingValues,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  platformId,
  profileType,
  profilesSummaryType,
  reservesKey,
  wadsDecimal,
} from './constants';
import { ProfilesSummary, ReserveEnhanced, Profile } from './types';
import { getName, getProfileAmounts } from './helpers';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getAccountResource } from '../../utils/aptos';
import { getClientAptos } from '../../utils/clients';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientAptos();

  // Get deposit and borrow amounts for each profile
  const profilesSummary = await getAccountResource<ProfilesSummary>(
    client,
    owner,
    profilesSummaryType
  );
  if (!profilesSummary) return [];
  const profilesAddresses = profilesSummary.profile_signers.data.map(
    (d) => d.value.account
  );
  if (profilesAddresses.length === 0) return [];
  const profiless = await Promise.all(
    profilesAddresses.map((pAddress) =>
      getAccountResource<Profile>(client, pAddress, profileType)
    )
  );
  const amountss = await Promise.all(
    profiless.map((p) => getProfileAmounts(p, client))
  );

  // Get TokenPrices
  const tokenAddresses: string[] = [];
  amountss.forEach((amounts) => {
    amounts.deposits.forEach((deposit) => {
      tokenAddresses.push(deposit.address);
    });
    amounts.borrows.forEach((borrow) => {
      tokenAddresses.push(borrow.address);
    });
  });
  const tokenPrices = await cache.getTokenPricesAsMap(
    tokenAddresses,
    NetworkId.aptos
  );

  // Get Reserves
  const reserves = await cache.getItem<ReserveEnhanced[]>(reservesKey, {
    prefix: platformId,
    networkId: NetworkId.aptos,
  });
  if (!reserves) return [];
  const reservesByAddress: Map<string, ReserveEnhanced> = new Map();
  reserves.forEach((reserveData) => {
    reservesByAddress.set(reserveData.key, reserveData);
  });

  const elements: PortfolioElement[] = [];
  for (let i = 0; i < profiless.length; i++) {
    const profile = profiless[i];
    if (!profile) continue;
    const amounts = amountss[i];
    const profileKey = profilesSummary.profile_signers.data.at(i)?.key;
    const name = profileKey ? getName(profileKey) : undefined;

    const borrowedAssets: PortfolioAsset[] = [];
    const borrowedYields: Yield[][] = [];
    const suppliedAssets: PortfolioAsset[] = [];
    const suppliedYields: Yield[][] = [];
    const rewardAssets: PortfolioAsset[] = [];
    const suppliedLtvs: number[] = [];
    const borrowedWeights: number[] = [];

    for (let j = 0; j < amounts.deposits.length; j++) {
      const deposit = amounts.deposits[j];
      const { address, amount: amountStr } = deposit;
      const tokenPrice = tokenPrices.get(formatMoveTokenAddress(address));
      if (!tokenPrice) continue;
      const reserve = reservesByAddress.get(address);
      if (!reserve) continue;
      suppliedAssets.push(
        tokenPriceToAssetToken(
          address,
          new BigNumber(amountStr)
            .dividedBy(10 ** tokenPrice.decimals)
            .times(
              new BigNumber(reserve.value.total_borrowed)
                .plus(reserve.value.total_cash_available)
                .minus(reserve.value.reserve_amount)
                .div(reserve.value.total_lp_supply)
            )
            .toNumber(),
          NetworkId.aptos,
          tokenPrice
        )
      );
      suppliedLtvs.push(
        Number(reserve.value.reserve_config.liquidation_threshold) / 100
      );
      suppliedYields.push([reserve.rate.depositYield]);
    }

    for (let j = 0; j < amounts.borrows.length; j++) {
      const borrow = amounts.borrows[j];
      const { address, amount: amountStr } = borrow;
      const tokenPrice = tokenPrices.get(formatMoveTokenAddress(address));
      if (!tokenPrice) continue;
      const reserve = reservesByAddress.get(address);
      if (!reserve) continue;
      borrowedAssets.push(
        tokenPriceToAssetToken(
          address,
          new BigNumber(amountStr)
            .times(
              new BigNumber(reserve.value.total_borrowed).div(
                reserve.value.total_borrowed_share
              )
            )
            .dividedBy(10 ** (wadsDecimal + tokenPrice.decimals))
            .toNumber(),
          NetworkId.aptos,
          tokenPrice
        )
      );
      borrowedYields.push([reserve.rate.borrowYield]);
      borrowedWeights.push(
        Number(reserve.value.reserve_config.borrow_factor) / 100
      );
    }

    if (
      borrowedAssets.length === 0 &&
      suppliedAssets.length === 0 &&
      rewardAssets.length === 0
    )
      continue;
    const { borrowedValue, suppliedValue, value, rewardValue, healthRatio } =
      getElementLendingValues({
        suppliedAssets,
        borrowedAssets,
        rewardAssets,
        suppliedLtvs,
        borrowedWeights,
      });
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
        healthRatio,
        rewardAssets,
        rewardValue,
        value,
      },
    });
  }
  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-deposits`,
  networkId: NetworkId.aptos,
  executor,
};

export default fetcher;
