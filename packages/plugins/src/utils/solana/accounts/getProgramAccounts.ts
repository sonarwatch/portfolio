import { PublicKey } from '@solana/web3.js';
import { address, decodeAccount, parseBase64RpcAccount } from '@solana/kit';
import type {
  GetProgramAccountsDatasizeFilter,
  GetProgramAccountsMemcmpFilter,
} from '@solana/rpc-types';
import { strict as assert } from 'assert';
import bs58 from 'bs58';
import { getClientSolanaKit } from '../../clients/getClientSolana';
import { CodecWithLayout } from './getStructCodecWithLayout';
import { isFixedSizeCodec } from './isFixedSizeCodec';

type GetProgramAccountsKeyValFilter<T> = Readonly<{
  key: keyof T & string;
  val: T[keyof T];
}>;

type GetProgramAccountsFilter<T> =
  | GetProgramAccountsMemcmpFilter
  | GetProgramAccountsDatasizeFilter
  | GetProgramAccountsKeyValFilter<T>;

function isKeyValFilter<T>(
  filter: GetProgramAccountsFilter<T>
): filter is GetProgramAccountsKeyValFilter<T> {
  return (
    typeof filter === 'object' &&
    filter !== null &&
    'key' in filter &&
    'val' in filter
  );
}

export async function getProgramAccounts<T extends object>(
  programId: string | PublicKey,
  codec: CodecWithLayout<T>,
  filters: GetProgramAccountsFilter<T>[] = [],
  debug = false
) {
  const rpc = getClientSolanaKit();

  const innerFilters = filters.map((filter) => {
    if (isKeyValFilter(filter)) {
      let field;
      let offset = 0;
      for (const [name, fieldCodec] of codec.layout) {
        if (name === filter.key) {
          field = fieldCodec;
          break;
        }
        const size = isFixedSizeCodec(fieldCodec)
          ? fieldCodec.fixedSize
          : fieldCodec.maxSize || 0;
        offset += size;
      }

      assert(field != null, 'Key needs to be an existing field name');

      const memcmpFilter: GetProgramAccountsMemcmpFilter = {
        memcmp: {
          bytes: bs58.encode(new Uint8Array(field.encode(filter.val))),
          encoding: 'base58',
          offset: BigInt(offset),
        },
      };
      return memcmpFilter;
    }
    return filter;
  });

  if (codec.discriminator)
    innerFilters.push({
      memcmp: {
        bytes: bs58.encode(Buffer.from(codec.discriminator)),
        encoding: 'base58',
        offset: BigInt(0),
      },
    });

  if (debug) {
    // eslint-disable-next-line no-console
    console.log(programId.toString());
    // eslint-disable-next-line no-console
    console.log(innerFilters);
  }

  const rpcAccounts = await rpc
    .getProgramAccounts(address(programId.toString()), {
      encoding: 'base64',
      filters: innerFilters,
    })
    .send();

  return rpcAccounts.map((rpcAccount) => {
    const encodedAccount = parseBase64RpcAccount(
      rpcAccount.pubkey,
      rpcAccount.account
    );
    return decodeAccount(encodedAccount, codec);
  });
}
