import { EvmNetworkIdType, NetworkId } from '@sonarwatch/portfolio-core';
import { zeroAddress } from 'viem';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getEvmClient } from '../../utils/clients';
import { compoundV2Abi } from './abis';
import { MarketV2Detail } from './types';
import { marketDetailsKey } from './constants';

export default function getMarketsV2Job(
  platformId: string,
  networkId: EvmNetworkIdType,
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
    ]);

    const marketsDetails: MarketV2Detail[] = marketsInfoRes
      .map((marketInfo, id) => {
        const market = markets[id];
        const underlyingsTokenAddresseRes = underlyingsTokenAddressesRes[id];
        const exchangeRateStoredRes = exchangeRatesStoredRes[id];
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
    executor,
  };
}
