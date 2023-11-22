import axios, { AxiosResponse } from 'axios';
import { PoolData, PoolsResponse } from './types';

export async function getPools(url: string): Promise<PoolData[]> {
  const allPoolsRes: AxiosResponse<PoolsResponse> | null = await axios
    .get(url)
    .catch(() => null);
  const allPoolsData = allPoolsRes?.data;

  if (!allPoolsData) return [];

  return allPoolsData.pools;
}
