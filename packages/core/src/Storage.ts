import {
  Storage as UnStorage,
  createStorage,
  StorageValue,
  Driver,
} from 'unstorage';
import memoryDriver from 'unstorage/drivers/memory';

import { NetworkIdType } from './Network';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TransactionOptions = Record<string, any> & {
  networkId?: NetworkIdType;
  prefix?: string;
};

export class Storage {
  private readonly storage: UnStorage;

  constructor(driver: Driver = memoryDriver()) {
    this.storage = createStorage({
      driver,
    });
  }

  hasItem(key: string, opts?: TransactionOptions) {
    const trueKey = getTrueKey(key, opts?.prefix, opts?.networkId);
    return this.storage.hasItem(trueKey, opts);
  }

  getItem(key: string, opts?: TransactionOptions) {
    const trueKey = getTrueKey(key, opts?.prefix, opts?.networkId);
    return this.storage.getItem(trueKey, opts);
  }

  setItem(key: string, value: StorageValue, opts?: TransactionOptions) {
    const trueKey = getTrueKey(key, opts?.prefix, opts?.networkId);
    return this.storage.setItem(trueKey, value, opts);
  }

  removeItem(
    key: string,
    opts?: TransactionOptions & { removeMeta?: boolean }
  ) {
    const trueKey = getTrueKey(key, opts?.prefix, opts?.networkId);
    return this.storage.removeItem(trueKey, opts);
  }

  getKeys(opts?: TransactionOptions) {
    const trueBase = getTrueBase(opts?.prefix, opts?.networkId);
    return this.storage.getKeys(trueBase);
  }

  dispose() {
    return this.storage.dispose();
  }
}

function getTrueKey(
  key: string,
  prefix?: string,
  networkId?: NetworkIdType
): string {
  const networkIdKeyPrefix = networkId ? `/${networkId.toString()}` : '';
  const keyPrefix = prefix !== undefined ? `/${prefix}` : '';
  return `${networkIdKeyPrefix}${keyPrefix}/${key}`;
}

function getTrueBase(prefix?: string, networkId?: NetworkIdType) {
  const networkIdBasePrefix = networkId ? `${networkId.toString()}:` : '';
  const basePrefix = prefix ? `${prefix}:` : '';
  const trueBase = `${networkIdBasePrefix}${basePrefix}`;
  if (trueBase === '') return undefined;
  return trueBase;
}
