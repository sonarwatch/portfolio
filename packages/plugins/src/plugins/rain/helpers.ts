import axios, { AxiosResponse } from 'axios';
import BigNumber from 'bignumber.js';
import { rainApiV3 } from './constants';
import { Collection, CollectionResponse } from './types';

const oneDay = 1000 * 60 * 60 * 24;

export async function getCollections(): Promise<Collection[]> {
  const getCollectionsRes: AxiosResponse<CollectionResponse> | null =
    await axios.get(`${rainApiV3}/collection/collections`).catch(() => null);
  if (!getCollectionsRes || !getCollectionsRes.data) return [];
  return getCollectionsRes.data.collections;
}

export function daysBetweenDates(start: Date, end: Date) {
  return new BigNumber(end.getTime())
    .minus(start.getTime())
    .dividedBy(oneDay)
    .decimalPlaces(0, BigNumber.ROUND_DOWN)
    .toNumber();
}
