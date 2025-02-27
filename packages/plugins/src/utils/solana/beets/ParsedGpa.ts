import { GpaBuilder } from '@metaplex-foundation/beet-solana';
import { Connection, PublicKey } from '@solana/web3.js';
import { BeetField } from '@metaplex-foundation/beet';
import { GlobalBeetStruct, ParsedAccount } from '../types';

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
    const accounts = await this.gpaBuilder.run(this.connection);
    return accounts.map(
      (account) =>
        ({
          pubkey: account.pubkey,
          lamports: account.account.lamports,
          ...this.beets.deserialize(account.account.data)[0],
        } as ParsedAccount<T>)
    );
  }

  debug() {
    console.log(this.programId.toString());
    console.log(this.gpaBuilder.config.filters);
    return this;
  }
}
