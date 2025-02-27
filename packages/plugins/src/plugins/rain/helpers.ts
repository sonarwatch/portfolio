import axios, { AxiosResponse } from 'axios';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { programId, rainApi, rainApiV3 } from './constants';
import {
  Collection,
  CollectionResponse,
  LoansResponse,
  Pool,
  PoolResponse,
} from './types';

const oneDay = 1000 * 60 * 60 * 24;

export async function getPool(pool: string): Promise<Pool | undefined> {
  const getPoolsRes: AxiosResponse<PoolResponse> | null = await axios
    .get(`${rainApi}/pools/pool?pubkey=${pool}`)
    .catch(() => null);
  if (!getPoolsRes || !getPoolsRes.data) return undefined;
  return getPoolsRes.data.pool;
}

export async function getCollections(): Promise<Collection[]> {
  const getCollectionsRes: AxiosResponse<CollectionResponse> | null =
    await axios.get(`${rainApiV3}/collection/collections`).catch(() => null);
  if (!getCollectionsRes || !getCollectionsRes.data) return [];
  return getCollectionsRes.data.collections;
}

export function getPoolPda(owner: string): PublicKey {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('poolv2', 'utf-8'), new PublicKey(owner).toBuffer()],
    programId
  )[0];
}

export async function getLoans(owner: string) {
  const getLoansRes: AxiosResponse<LoansResponse> | null = await axios
    .get(`${rainApi}/loans/user?pubkey=${owner}&status=Ongoing`, {
      timeout: 1000,
    })
    .catch(() => null);
  if (!getLoansRes || getLoansRes.data.ongoingCount === 0) return [];
  return getLoansRes.data.loans;
}

export function daysBetweenDates(start: Date, end: Date) {
  return new BigNumber(end.getTime())
    .minus(start.getTime())
    .dividedBy(oneDay)
    .decimalPlaces(0, BigNumber.ROUND_DOWN)
    .toNumber();
}
