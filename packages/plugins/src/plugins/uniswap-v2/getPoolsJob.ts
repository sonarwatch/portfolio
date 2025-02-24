import {
  EvmNetworkIdType,
  TokenPrice,
  TokenPriceSource,
  TokenPriceUnderlying,
  formatTokenAddress,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getPairKey, getPairsV2FromTheGraph } from './helpers';
import { getEvmClient } from '../../utils/clients';
import { abi } from './abis';
import { TheGraphUniV2Pair, UniV2Pair } from './types';

const maxPairsToFetch = 100;

export default function getPoolsJob(
  networkId: EvmNetworkIdType,
  platformId: string,
  version: string,
  contractOrTheGraphUrl: string,
  forcedPools?: `0x${string}`[]
): Job {
  const client = getEvmClient(networkId);

  const executor: JobExecutor = async (cache: Cache) => {
    let pairs: (UniV2Pair | TheGraphUniV2Pair)[] = [];
    if (contractOrTheGraphUrl.startsWith('0x')) {
      const contract = contractOrTheGraphUrl as `0x${string}`;

      const allPairsLength = await client.readContract({
        abi: [abi.allPairsLength],
        address: contract,
        functionName: abi.allPairsLength.name,
      });

      const end = Math.min(maxPairsToFetch, Number(allPairsLength));

      const allPairsContractBase = {
        address: contract,
        abi: [abi.allPairs],
        functionName: abi.allPairs.name,
      } as const;

      const allPairsContracts = [];
      for (let pid = BigInt(0); pid < end; pid++) {
        allPairsContracts.push({
          ...allPairsContractBase,
          args: [pid],
        } as const);
      }

      const allPairsRes = await client.multicall({
        contracts: allPairsContracts,
      });

      const contracts = allPairsRes
        .map((res) => (res.status === 'success' ? res.result : []))
        .flat();

      if (forcedPools) contracts.push(...forcedPools);

      pairs = await getPairsDetails(contracts, networkId);
    } else if (contractOrTheGraphUrl.startsWith('https://api.thegraph.com/')) {
      pairs = await getPairsV2FromTheGraph(contractOrTheGraphUrl);
    } else {
      return;
    }

    const tokenAddresses = [
      ...new Set(pairs.map((p) => [p.token0.id, p.token1.id]).flat()),
    ];
    const tokenPrices = await cache.getTokenPrices(tokenAddresses, networkId);
    const tokenPricesByAddress: Map<string, TokenPrice> = new Map();
    tokenPrices.forEach((tp) => {
      if (!tp) return;
      tokenPricesByAddress.set(tp.address, tp);
    });

    const pairAddresses: string[] = [];
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];

      const underlyingsTokens = [
        [pair.token0.id, pair.reserve0],
        [pair.token1.id, pair.reserve1],
      ] as const;
      const underlyings: TokenPriceUnderlying[] = [];
      let tvl = new BigNumber(0);
      for (let j = 0; j < underlyingsTokens.length; j++) {
        const [address, amount] = underlyingsTokens[j];
        const fAddress = formatTokenAddress(address, networkId);
        const tokenPrice = tokenPricesByAddress.get(fAddress);
        if (!tokenPrice) break;
        tvl = tvl.plus(new BigNumber(amount).times(tokenPrice.price));
        underlyings.push({
          networkId,
          address: fAddress,
          decimals: tokenPrice.decimals,
          price: tokenPrice.price,
          amountPerLp: new BigNumber(amount).div(pair.totalSupply).toNumber(),
        });
      }
      if (underlyings.length !== underlyingsTokens.length) continue;

      const price = tvl.div(pair.totalSupply).toNumber();
      const lpAddress = formatTokenAddress(pair.id, networkId);
      const source: TokenPriceSource = {
        id: platformId,
        address: lpAddress,
        decimals: 18,
        networkId,
        platformId,
        price,
        timestamp: Date.now(),
        weight: 1,
        elementName: version,
        underlyings,
      };
      await cache.setTokenPriceSource(source);
      pairAddresses.push(lpAddress);
    }

    await cache.setItem(getPairKey(version), pairAddresses, {
      prefix: platformId,
      networkId,
    });
  };

  return {
    executor,
    id: `${platformId}-${networkId}-pools-${version.toLowerCase()}`,
    labels: ['normal'],
  };
}

async function getPairsDetails(
  contracts: `0x${string}`[],
  networkId: EvmNetworkIdType
): Promise<UniV2Pair[]> {
  const client = getEvmClient(networkId);

  const contractToken0Base = {
    abi: [abi.token0],
    functionName: abi.token0.name,
  } as const;
  const contractToken1Base = {
    abi: [abi.token1],
    functionName: abi.token1.name,
  } as const;
  const contractReserveBase = {
    abi: [abi.reserves],
    functionName: abi.reserves.name,
  } as const;
  const totalSupplyBase = {
    abi: [abi.totalSupply],
    functionName: abi.totalSupply.name,
  } as const;
  const decimalsBase = {
    abi: [abi.decimals],
    functionName: abi.decimals.name,
  } as const;

  const token0Contracts = [];
  const token1Contracts = [];
  const reservesContracts = [];
  const totalSuppliesContracts = [];
  const decimalsContracts = [];
  for (const contract of contracts) {
    token0Contracts.push({ ...contractToken0Base, address: contract } as const);
    token1Contracts.push({ ...contractToken1Base, address: contract } as const);
    reservesContracts.push({
      ...contractReserveBase,
      address: contract,
    } as const);
    totalSuppliesContracts.push({
      ...totalSupplyBase,
      address: contract,
    } as const);
    decimalsContracts.push({
      ...decimalsBase,
      address: contract,
    } as const);
  }

  const [token0Res, token1Res, reservesRes, totalSuppliesRes, decimalsRes] =
    await Promise.all([
      client.multicall({ contracts: token0Contracts }),
      client.multicall({ contracts: token1Contracts }),
      client.multicall({ contracts: reservesContracts }),
      client.multicall({ contracts: totalSuppliesContracts }),
      client.multicall({ contracts: decimalsContracts }),
    ]);

  const pairs: UniV2Pair[] = [];
  for (let i = 0; i < contracts.length; i++) {
    const token0 = token0Res[i];
    const token1 = token1Res[i];
    const reserves = reservesRes[i];
    const totalSupply = totalSuppliesRes[i];
    const decimals = decimalsRes[i];
    if (
      token0.status === 'success' &&
      token1.status === 'success' &&
      totalSupply.status === 'success' &&
      decimals.status === 'success' &&
      reserves.status === 'success'
    ) {
      pairs.push({
        id: contracts[i].toString(),
        reserve0: new BigNumber(reserves.result[0].toString())
          .dividedBy(10 ** 18)
          .toString(),
        reserve1: new BigNumber(reserves.result[1].toString())
          .dividedBy(10 ** 18)
          .toString(),
        totalSupply: new BigNumber(totalSupply.result.toString())
          .dividedBy(10 ** decimals.result)
          .toString(),
        token0: {
          id: token0.result,
        },
        token1: {
          id: token1.result,
        },
      });
    }
  }
  return pairs;
}
