import axios, { AxiosResponse } from 'axios';
import {
  NetworkId,
  BorrowLendRate,
  apyToApr,
  borrowLendRatesPrefix,
  TokenPrice,
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
import { getDecimalsForToken } from '../../utils/misc/getDecimalsForToken';

const executor: JobExecutor = async (cache: Cache) => {
  const markets = await cache.getAllItems<MarketInfo>({
    prefix: marketsPrefix,
  });
  const reservesAddressesByMarket = markets.map((m) =>
    m.reserves.map((r) => r.address)
  );

  const promises = [];
  for (let i = 0; i < reservesAddressesByMarket.length; i += 1) {
    const reservesAddresses = reservesAddressesByMarket[i];
    const poolName = markets[i].name;
    const reservesInfoRes: void | AxiosResponse<ApiResponse<ReserveInfo>> =
      await axios
        .get(`${reserveEndpoint}${reservesAddresses.join(',')}`)
        .catch(() => {
          //
        });
    if (!reservesInfoRes) continue;
    const mints = reservesInfoRes.data.results.map(
      (res) => res.reserve.liquidity.mintPubkey
    );
    const tokensPrices = await cache.getTokenPrices(mints, NetworkId.solana);

    const tokenPriceById: Map<string, TokenPrice> = new Map();
    tokensPrices.forEach((tokenPrice) =>
      tokenPrice ? tokenPriceById.set(tokenPrice.address, tokenPrice) : []
    );

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
      const { mintPubkey, mintDecimals } = liquidity;
      const decimals = liquidity.mintDecimals;
      const tokenAddress = reserveInfo.reserve.collateral.mintPubkey;

      const borrowApy = +reserveInfo.rates.borrowInterest / 100;
      const depositApy = +reserveInfo.rates.supplyInterest / 100;

      const borrowedAmount = new BigNumber(liquidity.borrowedAmountWads)
        .dividedBy(10 ** (wadsDecimal + decimals))
        .toNumber();
      const reserveAvailableAmount = new BigNumber(liquidity.availableAmount)
        .dividedBy(10 ** decimals)
        .toNumber();

      const collateralTotalSupply = new BigNumber(
        collateral.mintTotalSupply.toString()
      )
        .dividedBy(new BigNumber(10 ** mintDecimals))
        .toNumber();
      const depositedAmount = borrowedAmount + reserveAvailableAmount;

      // Compute the price of the cToken https://solend.fi/ctokens
      const mintTokenPrice = tokenPriceById.get(mintPubkey);
      const cPrice = mintTokenPrice
        ? mintTokenPrice.price * (depositedAmount / collateralTotalSupply)
        : undefined;
      if (cPrice) {
        const cDecimals = await getDecimalsForToken(
          cache,
          collateral.mintPubkey.toString(),
          NetworkId.solana
        );
        if (cDecimals)
          promises.push(
            cache.setTokenPriceSource({
              address: collateral.mintPubkey.toString(),
              decimals: cDecimals,
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
};
export default job;
