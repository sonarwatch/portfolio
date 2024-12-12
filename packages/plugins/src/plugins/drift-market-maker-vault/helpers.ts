import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { VaultInfo } from './types';
import {
  SpotBalanceType,
  UserAccount,
  userAccountStruct,
} from '../drift/struct';
import { SolanaClient } from '../../utils/clients/types';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';
import { PRICE_PRECISION_BIG_NUMBER } from '../drift/perpHelpers/constants';
import { calculatePositionPNL } from '../drift/perpHelpers/position';
import { getPerpMarket } from '../drift/perpHelpers/getPerpMarket';
import { getOraclePrice } from '../drift/perpHelpers/getOraclePrice';
import { ParsedAccount } from '../../utils/solana';
import {
  getSignedTokenAmount,
  getTokenAmount,
  isSpotPositionAvailable,
} from '../drift/helpers';
import { SpotMarketEnhanced } from '../drift/types';
import { Cache } from '../../Cache';

export const calculateVaultEquity = async (
  client: SolanaClient,
  vaultAccount: VaultInfo,
  perpMarketAddressByIndex: Map<number, string>,
  spotMarketByIndex: Map<number, SpotMarketEnhanced>,
  cache: Cache
): Promise<BigNumber> => {
  const userAccount = await getParsedAccountInfo(
    client,
    userAccountStruct,
    new PublicKey(vaultAccount.user)
  );
  if (!userAccount) return new BigNumber(0);

  const [perps, spots] = await Promise.all([
    calculateUserUnrealizedPNL(client, userAccount, perpMarketAddressByIndex),
    calculateUserNetSpotMarketValue(userAccount, spotMarketByIndex, cache),
  ]);

  return perps.plus(spots);
};

export const calculateUserUnrealizedPNL = async (
  client: SolanaClient,
  userAccount: ParsedAccount<UserAccount>,
  perpMarketAddressByIndex: Map<number, string>
): Promise<BigNumber> => {
  try {
    let sumPnl = new BigNumber(0);

    for (const perpPosition of userAccount.perpPositions) {
      if (perpPosition.baseAssetAmount.isZero()) continue;
      const perpMarketAddress = perpMarketAddressByIndex.get(
        perpPosition.marketIndex
      );
      if (!perpMarketAddress) continue;
      const market = await getPerpMarket(perpMarketAddress, client);
      if (!market) continue;

      const oraclePriceData = await getOraclePrice(
        market.amm.oracle.toString(),
        market.amm.oracleSource,
        client
      );

      sumPnl = sumPnl.plus(
        new BigNumber(
          calculatePositionPNL(market, perpPosition, oraclePriceData).toString()
        ).div(PRICE_PRECISION_BIG_NUMBER)
      );
    }

    return sumPnl;
  } catch (err) {
    return new BigNumber(0);
  }
};

export const calculateUserNetSpotMarketValue = async (
  userAccount: ParsedAccount<UserAccount>,
  spotMarketByIndex: Map<number, SpotMarketEnhanced>,
  cache: Cache
): Promise<BigNumber> => {
  let netQuoteValue = new BigNumber(0);

  for (const spotPosition of userAccount.spotPositions) {
    if (spotPosition.scaledBalance.isZero()) continue;

    if (isSpotPositionAvailable(spotPosition)) {
      continue;
    }

    const spotMarket = spotMarketByIndex.get(spotPosition.marketIndex);
    if (!spotMarket) continue;

    const tokenPrice = await cache.getTokenPrice(
      spotMarket.mint.toString(),
      NetworkId.solana
    );

    if (!tokenPrice) continue;

    const tokenAmount = getTokenAmount(
      spotPosition.scaledBalance,
      spotMarket,
      spotPosition.balanceType
    );
    const assetValue = getSignedTokenAmount(
      tokenAmount,
      spotPosition.balanceType
    )
      .multipliedBy(tokenPrice.price)
      .dividedBy(10 ** tokenPrice.decimals);

    if (spotPosition.balanceType === SpotBalanceType.Borrow) {
      netQuoteValue = netQuoteValue.minus(assetValue.abs());
    } else {
      netQuoteValue = netQuoteValue.plus(assetValue);
    }
  }

  return netQuoteValue;
};
