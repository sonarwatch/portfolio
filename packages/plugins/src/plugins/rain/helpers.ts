import axios, { AxiosResponse } from 'axios';
import { PublicKey } from '@solana/web3.js';
import { programId, rainApi } from './constants';
import { Collection, CollectionResponse, Pool, PoolResponse } from './types';

export async function getPool(pool: string): Promise<Pool | undefined> {
  const getPoolsRes: AxiosResponse<PoolResponse> | null = await axios
    .get(`${rainApi}/pools/pool?pubkey=${pool}`)
    .catch(() => null);
  if (!getPoolsRes || !getPoolsRes.data) return undefined;
  return getPoolsRes.data.pool;
}

export async function getCollections(): Promise<Collection[] | undefined> {
  const getCollectionsRes: AxiosResponse<CollectionResponse> | null =
    await axios.get(`${rainApi}/collections`).catch(() => null);
  if (!getCollectionsRes || !getCollectionsRes.data) return undefined;
  return getCollectionsRes.data.collections;
}

export function getPoolPda(owner: PublicKey): PublicKey {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('poolv2', 'utf-8'), owner.toBuffer()],
    programId
  )[0];
}
