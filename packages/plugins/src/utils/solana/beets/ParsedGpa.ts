import { GpaBuilder } from '@metaplex-foundation/beet-solana';
import { Connection, PublicKey } from '@solana/web3.js';
import { BeetField } from '@metaplex-foundation/beet';
import { GlobalBeetStruct, ParsedAccount } from '../types';
import { getProgramAccounts } from '../getProgramAccounts';

export class ParsedGpa<T> {
  protected gpaBuilder;

  static build<T>(
    connection: Connection,
    beets: GlobalBeetStruct<T>,
    programId: PublicKey
  ) {
    return new ParsedGpa<T>(connection, programId, beets);
  }

  private constructor(
    protected readonly connection: Connection,
    protected programId: PublicKey,
    protected beets: GlobalBeetStruct<T>
  ) {
    this.gpaBuilder = GpaBuilder.fromStruct<T>(
      programId,
      beets as { fields: BeetField<T, T[keyof T]>[] }
    );
  }

  addInnerFilter(keys: string, val: T[keyof T] & NonNullable<unknown>) {
    this.gpaBuilder.addInnerFilter(keys, val);
    return this;
  }

  addRawFilter(offset: number, bytes: string) {
    if (this.gpaBuilder.config.filters == null) {
      this.gpaBuilder.config.filters = [];
    }
    this.gpaBuilder.config.filters.push({ memcmp: { offset, bytes } });
    return this;
  }

  addFilter(key: keyof T & string, val: T[keyof T]) {
    this.gpaBuilder.addFilter(key, val);
    return this;
  }

  addDataSizeFilter(size?: number) {
    this.gpaBuilder.dataSize(
      !size && 'byteSize' in this.beets ? this.beets.byteSize : size
    );
    return this;
  }

  async run() {
    const accountsRes = await getProgramAccounts(
      this.connection,
      this.programId,
      this.gpaBuilder.config.filters
    );
    return accountsRes.map(
      (account) =>
        ({
          pubkey: account.pubkey,
          lamports: account.account.lamports,
          ...this.beets.deserialize(account.account.data)[0],
        } as ParsedAccount<T>)
    );
  }

  debug() {
    /* eslint-disable no-console */
    console.log(this.programId.toString());
    console.log(this.gpaBuilder.config.filters);
    /* eslint-enable no-console */
    return this;
  }
}
