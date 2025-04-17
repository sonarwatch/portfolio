import axios, { AxiosResponse } from 'axios';
import {
  NetworkId,
  BorrowLendRate,
  apyToApr,
  borrowLendRatesPrefix,
  TokenPriceSource,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import {
  platformId,
  reserveEndpoint,
  reservesPrefix as prefix,
  wadsDecimal,
  marketsKey,
} from './constants';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { ApiResponse, MarketInfo, ReserveInfo } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const markets = await cache.getItem<MarketInfo[]>(marketsKey, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
  if (!markets) return;

  const reservesAddressesByMarket = markets.map((m) =>
    m.reserves.map((r) => r.address)
  );

  const reservesInfosResponses = [];
  const mints: Set<string> = new Set();

  for (let i = 0; i < reservesAddressesByMarket.length; i += 1) {
    const reservesAddresses = reservesAddressesByMarket[i];
    const reservesInfoRes: void | AxiosResponse<ApiResponse<ReserveInfo>> =
      await axios
        .get(`${reserveEndpoint}${reservesAddresses.join(',')}`)
        .catch(() => {
          //
        });
    reservesInfosResponses.push(reservesInfoRes);
    if (!reservesInfoRes) continue;

    reservesInfoRes.data.results.forEach((res) => {
      mints.add(res.reserve.liquidity.mintPubkey);
    });
  }

  const tokenPriceById = await cache.getTokenPricesAsMap(
    Array.from(mints),
    NetworkId.solana
  );

  const reserveItems = [];
  const rateItems = [];
  const sources: TokenPriceSource[] = [];
  for (let i = 0; i < reservesAddressesByMarket.length; i += 1) {
    const reservesAddresses = reservesAddressesByMarket[i];
    const poolName = markets[i].name;
    const reservesInfoRes = reservesInfosResponses[i];
    if (!reservesInfoRes) continue;

    for (let j = 0; j < reservesInfoRes.data.results.length; j += 1) {
      const reserveInfo = reservesInfoRes.data.results[j];
      const reserveAddress = reservesAddresses[j];
      reserveItems.push({
        key: reserveAddress,
        value: { pubkey: reserveAddress, ...reserveInfo },
      });
      const { reserve } = reserveInfo;
      const { liquidity, collateral } = reserve;
      const { mintPubkey } = liquidity;
      const decimals = liquidity.mintDecimals;
      const cTokenExchangeRate = new BigNumber(reserveInfo.cTokenExchangeRate);
      const tokenAddress = reserveInfo.reserve.collateral.mintPubkey;

      const borrowApy = +reserveInfo.rates.borrowInterest / 100;
      const depositApy = +reserveInfo.rates.supplyInterest / 100;

      const borrowedAmount = new BigNumber(liquidity.borrowedAmountWads)
        .dividedBy(10 ** (wadsDecimal + decimals))
        .toNumber();
      const reserveAvailableAmount = new BigNumber(liquidity.availableAmount)
        .dividedBy(10 ** decimals)
        .toNumber();

      const depositedAmount = borrowedAmount + reserveAvailableAmount;

      // Compute the price of the cToken https://solend.fi/ctokens
      const mintTokenPrice = tokenPriceById.get(mintPubkey);
      const cPrice = mintTokenPrice
        ? cTokenExchangeRate.multipliedBy(mintTokenPrice.price).toNumber()
        : undefined;
      if (cPrice) {
        sources.push({
          address: collateral.mintPubkey.toString(),
          decimals,
          id: platformId,
          networkId: NetworkId.solana,
          platformId,
          price: cPrice,
          timestamp: Date.now(),
          weight: 1,
        });
      }

      if (borrowedAmount <= 1 && depositedAmount <= 1) continue;

      const rate: BorrowLendRate = {
        tokenAddress,
        borrowYield: {
          apy: borrowApy,
          apr: apyToApr(borrowApy),
        },
        borrowedAmount,
        depositYield: {
          apy: depositApy,
          apr: apyToApr(depositApy),
        },
        depositedAmount,
        platformId,
        poolName,
      };

      rateItems.push({ key: `${reserveAddress}-${tokenAddress}`, value: rate });
    }
  }
  await cache.setTokenPriceSources(sources);
  await cache.setItems(reserveItems, {
    prefix,
    networkId: NetworkId.solana,
  });
  await cache.setItems(rateItems, {
    prefix: borrowLendRatesPrefix,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-reserves`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
