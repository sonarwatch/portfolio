import { NetworkIdType } from '@sonarwatch/portfolio-core';
import { Item, Storage, StorageValue, TransactionOptions } from './Storage';

function getPath(key: string, prefix?: string, networkId?: NetworkIdType) {
  const prefixPath = prefix ? `${prefix}/` : '';
  const networkIdPath = networkId ? `${networkId}/` : '';
  return `${prefixPath}${networkIdPath}${key}`;
}
function getStartsWithPath(prefix?: string, networkId?: NetworkIdType) {
  const prefixPath = prefix ? `${prefix}/` : '';
  const networkIdPath = networkId ? `${networkId}/` : '';
  return `${prefixPath}${networkIdPath}`;
}

export type StorageMemoryOptions = {
  ttl?: number;
};

export class StorageMemory extends Storage {
  data: Map<string, StorageValue> = new Map();
  timeouts: Map<string, NodeJS.Timeout> = new Map();
  ttl?: number;

  constructor(opts?: StorageMemoryOptions) {
    super();
    this.ttl = opts?.ttl;
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-empty-function
  override async dispose() {}

  override get(
    key: string,
    prefix?: string,
    networkId?: NetworkIdType
  ): StorageValue | undefined {
    const path = getPath(key, prefix, networkId);
    return this.data.get(path);
  }

  override set(
    key: string,
    value: StorageValue,
    prefix?: string,
    networkId?: NetworkIdType,
    opts?: TransactionOptions
  ): void {
    const path = getPath(key, prefix, networkId);

    // Clear previous timeout
    const prevTimeout = this.timeouts.get(path);
    if (prevTimeout) clearTimeout(prevTimeout);
    this.timeouts.delete(path);

    // Set new timout
    const optsTtl =
      opts && opts['ttl'] && typeof opts['ttl'] === 'number'
        ? opts['ttl']
        : undefined;
    const ttl = optsTtl || this.ttl;
    if (ttl) {
      const timeout = setTimeout(() => {
        this.data.delete(path);
      }, ttl);
      this.timeouts.set(path, timeout);
    }

    // Set item
    this.data.set(path, value);
  }

  override getMany(
    keys: string[],
    prefix?: string | undefined,
    networkId?: NetworkIdType | undefined
  ): (StorageValue | undefined)[] {
    return keys.map((key) => this.get(key, prefix, networkId));
  }

  override setMany(
    items: Item[],
    prefix?: string | undefined,
    networkId?: NetworkIdType | undefined,
    opts?: TransactionOptions | undefined
  ): void {
    items.forEach((item) =>
      this.set(item.key, item.value, prefix, networkId, opts)
    );
  }

  override del(
    key: string,
    prefix?: string | undefined,
    networkId?: NetworkIdType | undefined
  ): void {
    const path = getPath(key, prefix, networkId);

    // Clear previous timeout
    const prevTimeout = this.timeouts.get(path);
    if (prevTimeout) clearTimeout(prevTimeout);
    this.timeouts.delete(path);

    this.data.delete(path);
  }

  override delMany(
    keys: string[],
    prefix?: string | undefined,
    networkId?: NetworkIdType | undefined
  ): void {
    keys.forEach((key) => this.del(key, prefix, networkId));
  }

  override getAll(
    prefix?: string | undefined,
    networkId?: NetworkIdType | undefined
  ): Item[] {
    const startWithPath = getStartsWithPath(prefix, networkId);
    const items: Item[] = [];

    this.data.forEach((value, path) => {
      if (path.startsWith(startWithPath)) {
        items.push({
          key: path.slice(startWithPath.length),
          value,
        });
      }
    });
    return items;
  }
}
