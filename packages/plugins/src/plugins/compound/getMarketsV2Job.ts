import { EvmNetworkIdType, NetworkId } from '@sonarwatch/portfolio-core';
import { zeroAddress } from 'viem';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getEvmClient } from '../../utils/clients';
import { compoundV2Abi } from './abis';
import { MarketV2Detail } from './types';
import { marketDetailsKey } from './constants';
import {
  ratePerBlockToApy,
  ratePerTimestampToApy,
} from '../../utils/evm/ratePerBlockToApy';

export default function getMarketsV2Job(
  networkId: EvmNetworkIdType,
  platformId: string,
  comptroller: string
): Job {
  const client = getEvmClient(networkId);
  const executor: JobExecutor = async (cache: Cache) => {
    const markets: `0x${string}`[] = [];

    let index = BigInt(0);
    let hasNotFailed: boolean;
    do {
      const tmpMarket = await client.multicall({
        contracts: [
          {
            abi: [compoundV2Abi.allMarkets],
            address: comptroller as `0x${string}`,
            args: [index],
            functionName: compoundV2Abi.allMarkets.name,
          } as const,
        ],
      });
      if (tmpMarket[0].status === 'success') {
        markets.push(tmpMarket[0].result);
        hasNotFailed = true;
      } else {
        hasNotFailed = false;
      }
      index += BigInt(1);
    } while (hasNotFailed);

    if (markets.length === 0) return;

    const [
      marketsInfoRes,
      underlyingsTokenAddressesRes,
      exchangeRatesStoredRes,
      supplyRatesPerBlockRes,
      borrowRatesPerBlockRes,
      supplyRatesPerTimestampRes,
      borrowRatesPerTimestampRes,
    ] = await Promise.all([
      client.multicall({
        contracts: markets.map(
          (mktAddress) =>
            ({
              abi: [compoundV2Abi.markets],
              address: comptroller as `0x${string}`,
              functionName: compoundV2Abi.markets.name,
              args: [mktAddress],
            } as const)
        ),
      }),
      client.multicall({
        contracts: markets.map(
          (mktAddress) =>
            ({
              abi: [compoundV2Abi.underlying],
              address: mktAddress,
              functionName: compoundV2Abi.underlying.name,
            } as const)
        ),
      }),
      client.multicall({
        contracts: markets.map(
          (mktAddress) =>
            ({
              abi: [compoundV2Abi.exchangeRateStored],
              address: mktAddress,
              functionName: compoundV2Abi.exchangeRateStored.name,
            } as const)
        ),
      }),
      client.multicall({
        contracts: markets.map(
          (mktAddress) =>
            ({
              abi: [compoundV2Abi.supplyRatePerBlock],
              address: mktAddress,
              functionName: compoundV2Abi.supplyRatePerBlock.name,
            } as const)
        ),
      }),
      client.multicall({
        contracts: markets.map(
          (mktAddress) =>
            ({
              abi: [compoundV2Abi.borrowRatePerBlock],
              address: mktAddress,
              functionName: compoundV2Abi.borrowRatePerBlock.name,
            } as const)
        ),
      }),
      client.multicall({
        contracts: markets.map(
          (mktAddress) =>
            ({
              abi: [compoundV2Abi.supplyRatePerTimestamp],
              address: mktAddress,
              functionName: compoundV2Abi.supplyRatePerTimestamp.name,
            } as const)
        ),
      }),
      client.multicall({
        contracts: markets.map(
          (mktAddress) =>
            ({
              abi: [compoundV2Abi.borrowRatePerTimestamp],
              address: mktAddress,
              functionName: compoundV2Abi.borrowRatePerTimestamp.name,
            } as const)
        ),
      }),
    ]);

    const marketsDetails: MarketV2Detail[] = marketsInfoRes
      .map((marketInfo, i) => {
        const market = markets[i];
        const underlyingsTokenAddresseRes = underlyingsTokenAddressesRes[i];
        const exchangeRateStoredRes = exchangeRatesStoredRes[i];
        const supplyRateResPerBlock = supplyRatesPerBlockRes[i];
        const borrowRateResPerBlock = borrowRatesPerBlockRes[i];
        const supplyRateResPerTimestamp = supplyRatesPerTimestampRes[i];
        const borrowRateResPerTimestamp = borrowRatesPerTimestampRes[i];
        if (
          marketInfo.status === 'failure' ||
          exchangeRateStoredRes.status === 'failure' ||
          (underlyingsTokenAddresseRes.status === 'failure' &&
            networkId !== NetworkId.ethereum)
        )
          return [];

        return {
          networkId,
          address: market,
          exchangeRate: exchangeRateStoredRes.result.toString(),
          // If the underlying call fail, it's the native underlying
          underlyings: [
            underlyingsTokenAddresseRes.status === 'success'
              ? underlyingsTokenAddresseRes.result.toString()
              : zeroAddress,
          ],
          borrowApyFromBlock: borrowRateResPerBlock.result
            ? ratePerBlockToApy(Number(borrowRateResPerBlock.result))
            : undefined,
          supplyApyFromBlock: supplyRateResPerBlock.result
            ? ratePerBlockToApy(Number(supplyRateResPerBlock.result))
            : undefined,
          borrowApyFromTimestamp: borrowRateResPerTimestamp.result
            ? ratePerTimestampToApy(Number(borrowRateResPerTimestamp.result))
            : undefined,
          supplyApyFromTimestamp: supplyRateResPerTimestamp.result
            ? ratePerTimestampToApy(Number(supplyRateResPerTimestamp.result))
            : undefined,
        };
      })
      .flat();

    await cache.setItem(marketDetailsKey, marketsDetails, {
      prefix: platformId,
      networkId,
    });
  };

  return {
    id: `${platformId}-${networkId}-markets-v2`,
    networkIds: [networkId],
    executor,
    labels: ['normal', 'evm'],
  };
}
