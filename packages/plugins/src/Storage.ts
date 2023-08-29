import { NetworkIdType } from '@sonarwatch/portfolio-core';

export type MaybePromise<T> = T | Promise<T>;
export type StorageValue =
  | null
  | string
  | number
  | boolean
  | object
  | (null | string | number | boolean | object)[];
export type TransactionOptions = Record<
  string,
  string | number | boolean | object
>;

export type Item = { key: string; value: StorageValue };

export abstract class Storage {
  abstract dispose(): Promise<void>;

  abstract get(
    key: string,
    prefix?: string,
    networkId?: NetworkIdType,
    opts?: TransactionOptions
  ): MaybePromise<StorageValue | undefined>;

  abstract getMany(
    keys: string[],
    prefix?: string,
    networkId?: NetworkIdType,
    opts?: TransactionOptions
  ): MaybePromise<Array<StorageValue | undefined>>;

  abstract getAll(
    prefix?: string,
    networkId?: NetworkIdType,
    opts?: TransactionOptions
  ): MaybePromise<Item[]>;

  abstract set(
    key: string,
    value: StorageValue,
    prefix?: string,
    networkId?: NetworkIdType,
    opts?: TransactionOptions
  ): MaybePromise<void>;

  abstract setMany(
    items: Item[],
    prefix?: string,
    networkId?: NetworkIdType,
    opts?: TransactionOptions
  ): MaybePromise<void>;

  abstract del(
    key: string,
    prefix?: string,
    networkId?: NetworkIdType,
    opts?: TransactionOptions
  ): MaybePromise<void>;

  abstract delMany(
    keys: string[],
    prefix?: string,
    networkId?: NetworkIdType,
    opts?: TransactionOptions
  ): MaybePromise<void>;
}
