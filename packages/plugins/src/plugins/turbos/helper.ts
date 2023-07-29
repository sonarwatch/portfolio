import {
  SuiObjectResponse,
  getObjectFields,
  getObjectId,
  getObjectType,
} from '@mysten/sui.js';
import { Pool, PoolFields, Types } from './types';

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
export function parsePool(pool: SuiObjectResponse): Pool {
  const fields = getObjectFields(pool) as PoolFields;
  const objectId = getObjectId(pool);
  const type = getObjectType(pool)!;
  return {
    ...fields,
    objectId,
    type,
    types: parsePoolType(type, 3),
  };
}
