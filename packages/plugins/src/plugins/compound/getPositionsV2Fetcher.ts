import {
  EvmNetworkIdType,
  PortfolioAsset,
  PortfolioElementType,
  TokenPrice,
  Yield,
  apyToApr,
  getElementLendingValues,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { Cache } from '../../Cache';
import { MarketV2Detail } from './types';
import { compoundV2Abi } from './abis';
import { balanceOfErc20ABI } from '../../utils/evm/erc20Abi';
import { getEvmClient } from '../../utils/clients';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { marketDetailsKey } from './constants';
import { getBDecimal } from './helpers';

export default function getPositionsV2Fetcher(
  networkId: EvmNetworkIdType,
  platformId: string
): Fetcher {
  const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    const client = getEvmClient(networkId);
    const address = owner as `0x${string}`;

    const markets = await cache.getItem<MarketV2Detail[]>(marketDetailsKey, {
      prefix: platformId,
      networkId,
    });
    if (!markets) return [];

    const tokenAddresses = markets.map((m) => m.underlyings[0]);
    const tokensPrices = await cache.getTokenPrices(tokenAddresses, networkId);
    const tokenPriceById: Map<string, TokenPrice> = new Map();
    tokensPrices.forEach((tP) =>
      tP ? tokenPriceById.set(tP.address, tP) : []
    );

    const [balancesRes, borrowBalanceRes] = await Promise.all([
      client.multicall({
        contracts: markets.map(
          (market) =>
            ({
              abi: balanceOfErc20ABI,
              address: market.address,
              functionName: 'balanceOf',
              args: [address],
            } as const)
        ),
      }),
      client.multicall({
        contracts: markets.map(
          (market) =>
            ({
              abi: [compoundV2Abi.borrowBalanceStored],
              address: market.address,
              functionName: compoundV2Abi.borrowBalanceStored.name,
              args: [address],
            } as const)
        ),
      }),
    ]);
    const borrowedAssets: PortfolioAsset[] = [];
    const borrowedYields: Yield[][] = [];
    const suppliedAssets: PortfolioAsset[] = [];
    const suppliedYields: Yield[][] = [];
    const rewardAssets: PortfolioAsset[] = [];
    for (let i = 0; i < markets.length; i++) {
      const market = markets[i];
      const tokenPrice = tokenPriceById.get(market.underlyings[0]);
      if (!tokenPrice) continue;

      const depositBalance = balancesRes[i];
      const borrowBalance = borrowBalanceRes[i];
      const { exchangeRate } = markets[i];

      const { underlyings } = market;
      if (
        depositBalance.status === 'success' &&
        depositBalance.result > BigInt(0)
      ) {
        const fmtPricePerFullShare = new BigNumber(exchangeRate).dividedBy(
          10 ** tokenPrice.decimals
        );
        const cTokenAmount = new BigNumber(depositBalance.result.toString())
          .dividedBy(10 ** 18)
          .multipliedBy(fmtPricePerFullShare);

        underlyings.forEach((underlying) =>
          suppliedAssets.push(
            tokenPriceToAssetToken(
              underlying,
              cTokenAmount.toNumber(),
              networkId,
              tokenPrice
            )
          )
        );
        const supplyApy =
          market.supplyApyFromBlock || market.supplyApyFromTimestamp;
        if (supplyApy) {
          suppliedYields.push([{ apr: apyToApr(supplyApy), apy: supplyApy }]);
        }
      }

      const bDecimals = getBDecimal(networkId);
      if (
        borrowBalance.status === 'success' &&
        borrowBalance.result > BigInt(0) &&
        bDecimals
      ) {
        underlyings.forEach((underlying) =>
          borrowedAssets.push(
            tokenPriceToAssetToken(
              underlying,
              new BigNumber(borrowBalance.result.toString())
                .dividedBy(10 ** bDecimals)
                .toNumber(),
              networkId,
              tokenPrice
            )
          )
        );
        const borrowApy =
          market.borrowApyFromBlock || market.borrowApyFromTimestamp;
        if (borrowApy) {
          borrowedYields.push([{ apr: -apyToApr(borrowApy), apy: -borrowApy }]);
        }
      }
    }

    if (borrowedAssets.length === 0 && suppliedAssets.length === 0) return [];

    const { borrowedValue, suppliedValue, value, healthRatio, rewardValue } =
      getElementLendingValues({ suppliedAssets, borrowedAssets, rewardAssets });
    return [
      {
        type: PortfolioElementType.borrowlend,
        networkId,
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
          healthRatio,
          rewardAssets,
          rewardValue,
          value,
        },
      },
    ];
  };

  return {
    id: `${platformId}-${networkId}-positions-v2`,
    networkId,
    executor,
  };
}
