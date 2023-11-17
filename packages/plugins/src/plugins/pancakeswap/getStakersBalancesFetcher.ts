import {
  EvmNetworkIdType,
  PortfolioAsset,
  PortfolioElementType,
  TokenPrice,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getEvmClient } from '../../utils/clients';
import { stakersAbi } from './abis';
import { StakerInfo } from './types';
import { Cache } from '../../Cache';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

export default function getStakersBalancesFetcher(
  networkId: EvmNetworkIdType,
  platformId: string,
  stakersInfos: StakerInfo[]
): Fetcher {
  const client = getEvmClient(networkId);
  const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    const address = owner as `0x${string}`;
    const stakerBalanceContracts = [];
    for (const stakerInfo of stakersInfos) {
      const stakerBalanceContract = {
        abi: [stakersAbi.userInfo],
        address: stakerInfo.contract as `0x${string}`,
        functionName: stakersAbi.userInfo.name,
        args: [address],
      } as const;
      stakerBalanceContracts.push(stakerBalanceContract);
    }

    const stakersBalancesRes = await client.multicall({
      contracts: stakerBalanceContracts,
    });

    const tokenAddresses: Set<string> = new Set();
    stakersInfos.forEach((sI) => tokenAddresses.add(sI.token));

    const tokensPrices = await cache.getTokenPrices(
      Array.from(tokenAddresses),
      networkId
    );
    const tokenPriceById: Map<string, TokenPrice> = new Map();
    tokensPrices.forEach((tP) =>
      tP ? tokenPriceById.set(tP.address, tP) : []
    );
    const assets: PortfolioAsset[] = [];
    for (let i = 0; i < stakersInfos.length; i++) {
      const balanceRes = stakersBalancesRes[i];

      if (balanceRes.status === 'failure') continue;
      if (balanceRes.result[0] === BigInt(0)) continue;

      const tokenPrice = tokenPriceById.get(stakersInfos[i].token);
      if (!tokenPrice) continue;

      const amount = new BigNumber(balanceRes.result[0].toString())
        .dividedBy(10 ** stakersInfos[i].decimals)
        .toNumber();

      assets.push(
        tokenPriceToAssetToken(
          tokenPrice.address,
          amount,
          networkId,
          tokenPrice
        )
      );
    }
    if (assets.length === 0) return [];

    return [
      {
        networkId,
        label: 'Staked',
        platformId,
        type: PortfolioElementType.multiple,
        value: getUsdValueSum(assets.map((a) => a.value)),
        data: {
          assets,
        },
      },
    ];
  };

  return {
    executor,
    id: `${platformId}-${networkId}-stakers`,
    networkId,
  };
}
