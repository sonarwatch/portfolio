import { EvmNetworkIdType } from '@sonarwatch/portfolio-core';
import { getEvmClient } from '../../utils/clients';
import { abi } from './abi';
import { poolAddresses, poolManager } from './constants';
import { Contract, Strategy, Operator, Staker } from './types';

import { getAddress, MulticallResults } from 'viem';
import axios, { AxiosResponse } from 'axios';

export async function getAllStakers() {
  const options = {
    method: 'GET',
    headers: { 'X-API-Token': process.env['EIGENLAYER_API_KEY'] as string },
  };
  try {
    const res: AxiosResponse<{ data: Staker[] }> = await axios.get(
      'https://api.eigenexplorer.com/stakers?take=100000000',
      options
    );

    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getEigenLayerOperators() {
  const options = {
    method: 'GET',
    headers: { 'X-API-Token': process.env['EIGENLAYER_API_KEY'] as string },
  };
  const res: AxiosResponse<{ data: Operator[] }> = await axios.get(
    'https://api.eigenexplorer.com/operators?take=100000000',
    options
  );

  return res.data;
}

export async function getEigenlayerStrategies(chain: string) {
  const options = {
    method: 'GET',
    headers: { 'X-API-Token': process.env['EIGENLAYER_API_KEY'] as string },
  };

  const res: AxiosResponse<{ strategies: Strategy[] }> = await axios.get(
    'https://api.eigenexplorer.com/rewards/strategies',
    options
  );

  return res.data.strategies;
}

export async function getAVS(chain: string) {
  const options = {
    method: 'GET',
    headers: { 'X-API-Token': process.env['EIGENLAYER_API_KEY'] as string },
  };

  const res: AxiosResponse<{ strategies: Strategy[] }> = await axios.get(
    'https://api.eigenexplorer.com/avs?withTvl=false&withCuratedMetadata=false&searchMode=contains&skip=0&take=12',
    options
  );

  return res.data;
}

export async function getEigenlayerPools(
  chain: string,
  manager: Contract,
  poolAddresses: `0x${string}`[]
): Promise<Contract> {
  const client = getEvmClient(chain as EvmNetworkIdType);

  console.log(poolAddresses, 'poolAddresses');

  const underlyingsRes = await client.multicall({
    contracts: poolAddresses.map((address) => ({
      abi: [abi.underlyingToken],
      address: getAddress(address),
      functionName: abi.underlyingToken.name,
    })),
  });

  //   const underlyingsRes = await Promise.all(
  //     poolAddresses.map(async (address) =>
  //       client.readContract({
  //         abi: [abi.underlyingToken],
  //         address: getAddress(address),
  //         functionName: 'underlyingToken',
  //       })
  //     )
  //   );
  //   const underlyingsRes = await client.multicall({
  //     contracts: poolAddresses.map(
  //       (address) =>
  //         ({
  //           abi: abi.underlyingToken,
  //           address: address,
  //           functionName: abi.underlyingToken.name,
  //         } as const)
  //     ),
  //   });

  const underlyings = underlyingsRes.map((res) => res.result);
  console.log(underlyings);
  //   const underlyings = mapSuccessFilter(underlyingsRes, (res, index) => ({
  //     chain: chain,
  //     address: poolAddresses[index],
  //     token: res.output,
  //   }));

  return { ...manager };
}

export const getContracts = async (chain: string) => {
  const pool = await getEigenlayerPools(chain, poolManager, poolAddresses);

  return {
    contracts: { pool },
  };
};

export const getBalances = async (
  chain: EvmNetworkIdType,
  contracts: string[]
) => {
  //   const balances = await resolveBalances<typeof getContracts>(
  //     chain,
  //     contracts,
  //     {
  //       pool: getEigenlayerBalances,
  //     }
  //   );

  const balances = await getEigenlayerBalances(chain, poolManager);

  return {
    groups: [{ balances }],
  };
};

export async function getEigenlayerBalances(
  chain: EvmNetworkIdType,
  poolManager: Contract
): Promise<Balance[]> {
  const pools = poolManager.underlyings as Contract[];

  const userBalances = await multicall({
    ctx,
    calls: pools.map(
      (pool) => ({ target: pool.address, params: [ctx.address] } as const)
    ),
    abi: abi.shares,
  });

  const fmtBalances = await multicall({
    ctx,
    calls: mapSuccessFilter(
      userBalances,
      (res) => ({ target: res.input.target, params: [res.output] } as const)
    ),
    abi: abi.sharesToUnderlying,
  });

  return mapSuccessFilter(fmtBalances, (res, index) => ({
    ...pools[index],
    amount: res.output,
    underlyings: undefined,
    rewards: undefined,
    category: 'farm',
  }));
}

export const config = {
  startDate: 1686700800,
};

/**
 * Map successful Multicall results array and filter errors in return
 * @param results
 * @param mapFn
 */
export function mapSuccessFilter<T extends MulticallResults<never>, S>(
  results: T[],
  mapFn: (
    res: { success: true; input: T['input']; output: NonNullable<T['output']> },
    index: number
  ) => S | null
) {
  return mapSuccess(results, mapFn).filter(isNotNullish);
}

/**
 * Map successful Multicall results array and include errors in return
 * @param results
 * @param mapFn
 */
export function mapSuccess<T extends MulticallResults<never>, S>(
  results: T[],
  mapFn: (
    res: { success: true; input: T['input']; output: NonNullable<T['output']> },
    index: number
  ) => S | null
) {
  // @ts-ignore
  return results.map((res, index) => (res.success ? mapFn(res, index) : null));
}

export function isNotNullish<T>(param: T | undefined | null): param is T {
  return param != null;
}
