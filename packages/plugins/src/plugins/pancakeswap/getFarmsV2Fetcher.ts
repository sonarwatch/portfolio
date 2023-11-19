import {
  EvmNetworkIdType,
  PortfolioAsset,
  PortfolioElementType,
  PortfolioLiquidity,
  TokenPrice,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { platformId } from './constants';
import { farmsAbi } from './abis';
import { getEvmClient } from '../../utils/clients';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getPairKey } from '../uniswap-v2/helpers';

export default function getFarmsV2Fetcher(
  networkId: EvmNetworkIdType,
  version: string,
  masterChef: string
): Fetcher {
  const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    const client = getEvmClient(networkId);
    const pairsV2 = await cache.getItem<string[]>(getPairKey('v2'), {
      networkId,
      prefix: platformId,
    });
    if (!pairsV2) return [];

    const farmsLengthContract = {
      abi: [farmsAbi.poolLength],
      functionName: farmsAbi.poolLength.name,
      address: masterChef as `0x${string}`,
    } as const;

    const farmsLengthRes = await client.readContract(farmsLengthContract);

    const farmInfoContractBase = {
      abi: [farmsAbi.poolInfo],
      functionName: farmsAbi.poolInfo.name,
      address: masterChef as `0x${string}`,
    } as const;
    const farmInfoContracts = [];
    for (let i = BigInt(0); i < farmsLengthRes; i++) {
      farmInfoContracts.push({ ...farmInfoContractBase, args: [i] } as const);
    }

    const farmsInfoRes = await client.multicall({
      contracts: farmInfoContracts,
    });

    const lpAddresses = farmsInfoRes
      .map((fI) => (fI.status === 'success' ? fI.result[0].toString() : []))
      .flat();

    const lpTokenPrices = await cache.getTokenPrices(lpAddresses, networkId);
    const lpTokenPriceById: Map<string, TokenPrice> = new Map();

    lpTokenPrices.forEach((lpTP) =>
      lpTP ? lpTokenPriceById.set(lpTP.address, lpTP) : []
    );

    const userInfoBase = {
      abi: [farmsAbi.userInfo],
      functionName: farmsAbi.userInfo.name,
      address: masterChef as `0x${string}`,
    } as const;
    const userInfoContracts = [];
    const farmsInfo = [];
    for (let i = BigInt(0); i < farmsLengthRes; i++) {
      const farmInfoRes = farmsInfoRes[Number(i)];
      if (farmInfoRes.status === 'failure') continue;

      farmsInfo.push(farmInfoRes.result);
      userInfoContracts.push({
        ...userInfoBase,
        args: [i, owner as `0x${string}`],
      } as const);
    }

    const userInfosRes = await client.multicall({
      contracts: userInfoContracts,
    });

    const liquidities: PortfolioLiquidity[] = [];
    for (let j = 0; j < farmsLengthRes; j++) {
      const userInfoRes = userInfosRes[j];
      if (userInfoRes.status === 'failure') continue;

      const farmInfo = farmsInfo[j];
      const lpTokenPrice = lpTokenPriceById.get(farmInfo[0].toString());
      if (!lpTokenPrice) continue;
      if (userInfoRes.result[0] === BigInt(0)) continue;
      if (!lpTokenPrice.underlyings) continue;

      const amount = new BigNumber(userInfoRes.result[0].toString())
        .dividedBy(10 ** lpTokenPrice.decimals)
        .toNumber();

      const assets: PortfolioAsset[] = [];
      for (const underlying of lpTokenPrice.underlyings) {
        assets.push(
          tokenPriceToAssetToken(
            underlying.address,
            underlying.amountPerLp * amount,
            networkId,
            underlying
          )
        );
      }

      liquidities.push({
        assets,
        assetsValue: getUsdValueSum(assets.map((a) => a.value)),
        rewardAssets: [],
        rewardAssetsValue: 0,
        value: 0,
        yields: [],
      });
    }

    if (liquidities.length === 0) return [];

    return [
      {
        networkId,
        platformId,
        label: 'Farming',
        name: version,
        type: PortfolioElementType.liquidity,
        data: {
          liquidities,
        },
        value: getUsdValueSum(liquidities.map((a) => a.value)),
      },
    ];
  };

  return {
    executor,
    id: `${platformId}-${networkId}-farms-${version}`,
    networkId,
  };
}
