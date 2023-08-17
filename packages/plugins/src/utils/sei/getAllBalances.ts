import { LCDQueryClient } from '@sei-js/proto/types/codegen/cosmos/bank/v1beta1/query.lcd';
import Long from 'long';

const maxBalances = 1500;
const limit = Long.fromNumber(200);
const key: Uint8Array = new Uint8Array(0);

export async function getAllBalances(client: LCDQueryClient, owner: string) {
  const balances = [];
  let offset = Long.ZERO;
  let nextKey: Uint8Array | null = new Uint8Array(0);
  do {
    const res = await client.allBalances({
      address: owner,
      pagination: {
        countTotal: true,
        key,
        limit,
        offset,
        reverse: false,
      },
    });
    balances.push(...res.balances);
    nextKey = res.pagination.next_key as Uint8Array | null;
    offset = offset.add(limit);
    if (offset.greaterThanOrEqual(res.pagination.total)) break;
  } while (nextKey !== null && offset.lt(maxBalances));
  return balances;
}
