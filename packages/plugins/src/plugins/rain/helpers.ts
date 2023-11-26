import axios, { AxiosResponse } from 'axios';
import { rainApi } from './constants';
import { Pool, PoolResponse } from './types';

export async function getPool(pool: string): Promise<Pool | undefined> {
  const getPoolsRes: AxiosResponse<PoolResponse> | null = await axios
    .get(`${rainApi}/pools/pool?pubkey=${pool}`)
    .catch(() => null);
  if (!getPoolsRes || !getPoolsRes.data) return undefined;
  return getPoolsRes.data.pool;
}
