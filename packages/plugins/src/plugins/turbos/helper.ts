import { suiNativeAddress } from '@sonarwatch/portfolio-core';
import { Pool, PoolFields, Types } from './types';
import { ObjectResponse } from '../../utils/sui/types';

export function parsePoolType(type: string, length: 2): [string, string];
export function parsePoolType(type: string, length: 3): Types;
export function parsePoolType(type: string): string[];
export function parsePoolType(type: string, length?: number): string[] {
  const types = type.replace('>', '').split('<')[1]?.split(/,\s*/) || [];

  if (length !== undefined && length !== types.length) {
    throw new Error('Invalid pool type');
  }

  return types;
}
export function parsePool(pool: ObjectResponse<PoolFields>): Pool {
  if (!pool.data?.content) throw new Error('turbos parsePool error');
  const fields = pool.data?.content?.fields;
  const objectId = pool.data?.objectId;
  const type = pool.data?.type;
  return {
    ...fields,
    objectId,
    type,
    types: parsePoolType(type, 3),
  };
}

export function formatForNative(coin: string): string {
  return coin === suiNativeAddress ? '0x2::sui::SUI' : coin;
}
