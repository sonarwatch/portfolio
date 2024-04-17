import {
  PortfolioElementType,
  PortfolioLiquidity,
  TokenPrice,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { poolsKey, poolsPrefix } from './constants';
import { balanceOfAbI } from '../curve/abis';
import { getEvmClient } from '../../utils/clients';
import {
  feeGrowthGlobal0X128Abi,
  feeGrowthGlobal1X128Abi,
  getPoolsAbi,
  positionsAbi,
  slot0Abi,
  ticksAbi,
  tokenOfOwnerByIndexAbi,
} from './abis';
import {
  PoolInfo,
  Position,
  PositionData,
  UniswapNetworkConfig,
} from './types';
import { getTokenAmountsFromLiquidity } from '../../utils/clmm/tokenAmountFromLiquidity';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

export function getUniV3PositionsFetcher(
  config: UniswapNetworkConfig,
  platformId: string,
  version: string
): Fetcher {
  const { networkId } = config;
  const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    const client = getEvmClient(networkId);

    // Get the number of positions on all pools
    const balanceOfContract = {
      address: config.positionManager,
      abi: balanceOfAbI,
      functionName: 'balanceOf',
      args: [owner as `0x${string}`],
    } as const;

    const nbrOfPositions = await client.readContract(balanceOfContract);

    if (nbrOfPositions === BigInt(0)) return [];

    // Get the tokenIndex of the pool for each positions
    const baseTokenOfOwner = {
      address: config.positionManager,
      abi: tokenOfOwnerByIndexAbi,
      functionName: 'tokenOfOwnerByIndex',
    } as const;
    const tokenOfOwnerContracts = [];
    for (let i = BigInt(0); i < nbrOfPositions; i++) {
      tokenOfOwnerContracts.push({
        ...baseTokenOfOwner,
        args: [owner as `0x${string}`, i],
      } as const);
    }
    const tokensOfOwnerRes = await client.multicall({
      contracts: tokenOfOwnerContracts,
    });

    // Get each pool data (tokens, ticks), with the tokenIndex
    const basePositionsContract = {
      address: config.positionManager,
      abi: positionsAbi,
      functionName: 'positions',
    } as const;
    const positionsContracts = [];
    for (const tokenOfOwner of tokensOfOwnerRes) {
      if (tokenOfOwner.status === 'failure') continue;

      const tokenId = tokenOfOwner.result;
      positionsContracts.push({
        ...basePositionsContract,
        args: [tokenId],
      } as const);
    }
    const positionsRes = await client.multicall({
      contracts: positionsContracts,
    });
    if (positionsRes.length === 0) return [];

    // Get the address of each pool based on [token1, token0, fee]
    const baseGetPoolContract = {
      address: config.factory,
      abi: getPoolsAbi,
      functionName: 'getPool',
    } as const;
    const getPoolContracts = [];
    const positions: Position[] = [];
    for (const positionRes of positionsRes) {
      if (positionRes.status === 'failure') continue;
      // If 0 amount of liquidity
      if (positionRes.result[7] === BigInt(0)) continue;
      const position = {
        nonce: positionRes.result[0],
        operator: positionRes.result[1],
        token0: positionRes.result[2],
        token1: positionRes.result[3],
        fee: positionRes.result[4],
        tickLower: positionRes.result[5],
        tickUpper: positionRes.result[6],
        liquidity: positionRes.result[7],
        feeGrowthInside0LastX128: positionRes.result[8],
        feeGrowthInside1LastX128: positionRes.result[9],
        tokensOwed0: positionRes.result[10],
        tokensOwed1: positionRes.result[11],
      };
      positions.push(position);

      getPoolContracts.push({
        ...baseGetPoolContract,
        args: [position.token0, position.token1, position.fee],
      } as const);
    }

    if (positions.length === 0) return [];

    const poolsAddressesRes = await client.multicall({
      contracts: getPoolContracts,
    });

    // To avoid duplicate RPC call, we remove duplicates of pools
    const positionsData: PositionData[] = [];
    const poolsAddressesUniq: Set<`0x${string}`> = new Set();

    poolsAddressesRes.forEach((poolRes, index) => {
      if (poolRes.status === 'success') {
        const poolAddress = poolRes.result;
        poolsAddressesUniq.add(poolAddress);
        // Store it to keep the relation between position and pool
        positionsData.push({
          userPosition: positions[index],
          poolAddress,
        });
      }
    });
    const poolsAddresses = Array.from(poolsAddressesUniq);

    // Check if some pools data were already fetched by previous users
    const availablePoolsInfo = await cache.getItem<PoolInfo[]>(poolsKey, {
      prefix: poolsPrefix,
      networkId,
    });

    const availablePoolsAd = availablePoolsInfo
      ? availablePoolsInfo.map((p) => (p === undefined ? [] : p.id)).flat()
      : undefined;

    // Get the missing pools to fetch
    const missingPoolsAd = availablePoolsAd
      ? poolsAddresses.filter((pool) => !availablePoolsAd.includes(pool))
      : poolsAddresses;

    // Get slot0 and fees for each pool on which we don't have the data
    const slot0Contracts = [];
    const feeGrowth0Contracts = [];
    const feeGrowth1Contracts = [];

    for (const missingPool of missingPoolsAd) {
      slot0Contracts.push({
        address: missingPool,
        abi: slot0Abi,
        functionName: 'slot0',
      } as const);
      feeGrowth0Contracts.push({
        address: missingPool,
        abi: feeGrowthGlobal0X128Abi,
        functionName: 'feeGrowthGlobal0X128',
      } as const);
      feeGrowth1Contracts.push({
        address: missingPool,
        abi: feeGrowthGlobal1X128Abi,
        functionName: 'feeGrowthGlobal1X128',
      } as const);
    }

    const [slots0sRes, feesGrowthGlobal0X128Res, feesGrowthGlobal1X128Res] =
      await Promise.all([
        client.multicall({ contracts: slot0Contracts }),
        client.multicall({ contracts: feeGrowth0Contracts }),
        client.multicall({ contracts: feeGrowth1Contracts }),
      ]);

    // Merge pools infos
    const missingPoolsInfo: PoolInfo[] = slots0sRes.map((slot0, index) => ({
      id: missingPoolsAd[index],
      slot0: {
        sqrtPriceX96: slot0.result?.[0].toString(),
        tick: Number(slot0.result?.[1]),
        observationIndex: Number(slot0.result?.[2]),
        observationCardinality: Number(slot0.result?.[3]),
        observationCardinalityNext: Number(slot0.result?.[4]),
        feeProtocol: Number(slot0.result?.[5]),
        unlocked: slot0.result?.[6],
      },
      fees: {
        zeroX: Number(feesGrowthGlobal0X128Res[index].result),
        oneX: Number(feesGrowthGlobal1X128Res[index].result),
      },
    }));

    const poolsInfo = availablePoolsInfo
      ? [...missingPoolsInfo, ...availablePoolsInfo]
      : missingPoolsInfo;

    // Store poolsInfo by pool's address
    const poolsInfoById: Map<`0x${string}`, PoolInfo> = new Map();
    poolsInfo.forEach((poolInfo) => {
      if (poolInfo) {
        poolsInfoById.set(poolInfo.id, poolInfo);
      }
    });

    // Store infos in cache for next users
    await cache.setItem(poolsKey, poolsInfo, {
      prefix: poolsPrefix,
      networkId,
    });

    // Get ticks info for a pool base on tickUpper and tickLower of each position
    const contractsLower = [];
    const contractsUpper = [];
    for (const positionData of positionsData) {
      contractsLower.push({
        address: positionData.poolAddress,
        abi: ticksAbi,
        functionName: 'ticks',
        args: [positionData.userPosition.tickLower],
      } as const);
      contractsUpper.push({
        address: positionData.poolAddress,
        abi: ticksAbi,
        functionName: 'ticks',
        args: [positionData.userPosition.tickUpper],
      } as const);
    }

    const [tickLowerRes, tickUpperRes] = await Promise.all([
      client.multicall({ contracts: contractsLower }),
      client.multicall({ contracts: contractsUpper }),
    ]);

    for (let ind = 0; ind < positionsData.length; ind++) {
      const tickUpper = tickUpperRes[ind];
      const tickLower = tickLowerRes[ind];
      const positionData = positionsData[ind];
      const poolInfo = poolsInfoById.get(positionData.poolAddress);
      if (!poolInfo) continue;
      positionData.poolInfo = poolInfo;
      if (tickUpper.status === 'success' && tickLower.status === 'success') {
        positionData.ticks = {
          upper: {
            liquidityGross: tickUpper.result[0],
            liquidityNet: tickUpper.result[1],
            feeGrowthOutside0X128: tickUpper.result[2],
            feeGrowthOutside1X128: tickUpper.result[3],
            tickCumulativeOutside: tickUpper.result[4],
            secondsPerLiquidityOutsideX128: tickUpper.result[5],
            secondsOutside: tickUpper.result[6],
            initialized: tickUpper.result[7],
          },
          lower: {
            liquidityGross: tickLower.result[0],
            liquidityNet: tickLower.result[1],
            feeGrowthOutside0X128: tickLower.result[2],
            feeGrowthOutside1X128: tickLower.result[3],
            tickCumulativeOutside: tickLower.result[4],
            secondsPerLiquidityOutsideX128: tickLower.result[5],
            secondsOutside: tickLower.result[6],
            initialized: tickLower.result[7],
          },
        };
      }
    }

    // Get all tokens
    const tokensAddresses = positionsData
      .map((pos) => [pos.userPosition.token0, pos.userPosition.token1])
      .flat();

    // Fetch all tokens prices
    const tokensPrices = await cache.getTokenPrices(tokensAddresses, networkId);

    const tokenPriceByAddress: Map<string, TokenPrice> = new Map();
    for (const tokenPrice of tokensPrices) {
      if (!tokenPrice) continue;
      tokenPriceByAddress.set(tokenPrice.address, tokenPrice);
    }

    const liquidities: PortfolioLiquidity[] = [];
    let totalLiquidityValue = 0;

    // Create each position element
    for (const positionData of positionsData) {
      if (
        !positionData.poolInfo ||
        !positionData.ticks ||
        !positionData.poolInfo.slot0
      )
        continue;

      const { token0, token1, tickLower, tickUpper } =
        positionData.userPosition;
      const tokenPrice0 = tokenPriceByAddress.get(token0);
      const tokenPrice1 = tokenPriceByAddress.get(token1);

      if (!tokenPrice0 || !tokenPrice1) continue;

      const { tick } = positionData.poolInfo.slot0;
      if (!tick) continue;

      const { tokenAmountA, tokenAmountB } = getTokenAmountsFromLiquidity(
        new BigNumber(positionData.userPosition.liquidity.toString()),
        Number(tick),
        Number(tickLower),
        Number(tickUpper),
        false
      );

      if (tokenAmountA.isZero() && tokenAmountB.isZero()) continue;

      const assetToken0 = tokenPriceToAssetToken(
        token0,
        tokenAmountA.dividedBy(10 ** tokenPrice0.decimals).toNumber(),
        networkId,
        tokenPrice0
      );

      const assetToken1 = tokenPriceToAssetToken(
        token1,
        tokenAmountB.dividedBy(10 ** tokenPrice1.decimals).toNumber(),
        networkId,
        tokenPrice1
      );

      if (
        !assetToken0 ||
        !assetToken1 ||
        assetToken0.value === null ||
        assetToken1.value === null
      )
        continue;

      const value = assetToken0.value + assetToken1.value;
      liquidities.push({
        assets: [assetToken0, assetToken1],
        assetsValue: value,
        rewardAssets: [],
        rewardAssetsValue: 0,
        value,
        yields: [],
      });
      totalLiquidityValue += value;
    }

    if (liquidities.length === 0) return [];

    return [
      {
        type: PortfolioElementType.liquidity,
        networkId,
        platformId,
        label: 'LiquidityPool',
        name: version,
        value: totalLiquidityValue,
        data: {
          liquidities,
        },
      },
    ];
  };

  return {
    executor,
    id: `${platformId}-${networkId}-positions-${version.toLowerCase()}`,
    networkId,
  };
}
