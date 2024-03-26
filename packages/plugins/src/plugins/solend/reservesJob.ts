import axios, { AxiosResponse } from 'axios';
import {
  NetworkId,
  BorrowLendRate,
  apyToApr,
  borrowLendRatesPrefix,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import {
  marketsPrefix,
  platformId,
  reserveEndpoint,
  reservesPrefix as prefix,
  wadsDecimal,
} from './constants';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { ApiResponse, MarketInfo, ReserveInfo } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const markets = await cache.getAllItems<MarketInfo>({
    prefix: marketsPrefix,
  });
  const reservesAddressesByMarket = markets.map((m) =>
    m.reserves.map((r) => r.address)
  );

  const promises = [];
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

  for (let i = 0; i < reservesAddressesByMarket.length; i += 1) {
    const reservesAddresses = reservesAddressesByMarket[i];
    const poolName = markets[i].name;
    const reservesInfoRes = reservesInfosResponses[i];
    if (!reservesInfoRes) continue;

    for (let j = 0; j < reservesInfoRes.data.results.length; j += 1) {
      const reserveInfo = reservesInfoRes.data.results[j];
      const reserveAddress = reservesAddresses[j];
      await cache.setItem(
        reserveAddress,
        { pubkey: reserveAddress, ...reserveInfo },
        {
          prefix,
          networkId: NetworkId.solana,
        }
      );
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
        promises.push(
          cache.setTokenPriceSource({
            address: collateral.mintPubkey.toString(),
            decimals,
            id: platformId,
            networkId: NetworkId.solana,
            platformId,
            price: cPrice,
            timestamp: Date.now(),
            weight: 1,
          })
        );
      }

      if (borrowedAmount <= 10 && depositedAmount <= 10) continue;

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

      promises.push(
        cache.setItem(`${reserveAddress}-${tokenAddress}`, rate, {
          prefix: borrowLendRatesPrefix,
          networkId: NetworkId.solana,
        })
      );
    }
  }
  await Promise.all(promises);
};

const job: Job = {
  id: `${platformId}-reserves`,
  executor,
  label: 'normal',
};
export default job;
