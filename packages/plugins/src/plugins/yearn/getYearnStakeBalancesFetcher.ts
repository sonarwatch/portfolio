import {
  EvmNetworkIdType,
  PortfolioElementType,
  PortfolioLiquidity,
  TokenPrice,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { getBalancesYearn } from './helpers';
import { Contract } from './types';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { yearnStakeAbi } from './abis';
import { getEvmClient } from '../../utils/clients';

export default function getYearnStakeBalancesFetcher(
  networkId: EvmNetworkIdType,
  platformId: string,
  contracts: Contract[]
): Fetcher {
  const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    const client = getEvmClient(networkId);
    const balances = await getBalancesYearn(
      networkId,
      contracts.map((c) => c.address),
      owner
    );

    const toAssetContracts = balances.map(
      (balance, index) =>
        ({
          abi: [yearnStakeAbi.convertToAssets],
          address: contracts[index].address as `0x${string}`,
          functionName: yearnStakeAbi.convertToAssets.name,
          args: [balance],
        } as const)
    );

    const convertedBalancesRes = await client.multicall({
      contracts: toAssetContracts,
    });

    const tokenAddresses = contracts.map((v) => v.underlying);
    const tokensPrices = await cache.getTokenPrices(tokenAddresses, networkId);
    const tokenPriceById: Map<string, TokenPrice> = new Map();
    tokensPrices.forEach((tP) =>
      tP ? tokenPriceById.set(tP.address, tP) : []
    );

    const liquidities: PortfolioLiquidity[] = [];
    for (let index = 0; index < convertedBalancesRes.length; index++) {
      const balanceRes = convertedBalancesRes[index];
      if (balanceRes.status === 'failure') continue;
      const balance = balanceRes.result;
      if (balance > BigInt(0)) {
        const { underlying } = contracts[index];
        const tokenPrice = tokenPriceById.get(underlying);
        if (!tokenPrice) continue;

        const amount = new BigNumber(balance.toString())
          .dividedBy(new BigNumber(10).pow(tokenPrice.decimals))
          .toNumber();

        const asset = tokenPriceToAssetToken(
          underlying,
          amount,
          networkId,
          tokenPrice
        );
        liquidities.push({
          assets: [asset],
          assetsValue: asset.value,
          rewardAssets: [],
          rewardAssetsValue: null,
          value: asset.value,
          yields: [],
        });
      }
    }
    if (liquidities.length === 0) return [];

    return [
      {
        type: PortfolioElementType.liquidity,
        label: 'Staked',
        networkId,
        platformId,
        value: getUsdValueSum(liquidities.map((l) => l.value)),
        data: {
          liquidities,
        },
      },
    ];
  };

  return {
    networkId,
    executor,
    id: `${platformId}-${networkId}-yearn-stake`,
  };
}
