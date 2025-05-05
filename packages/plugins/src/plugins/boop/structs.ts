import { BeetStruct } from '@metaplex-foundation/beet';
import BigNumber from 'bignumber.js';
import { blob, i64, u128, u64 } from '../../utils/solana';

export type User = {
  buffer: Buffer;
  reward_per_token_complete: BigNumber;
  reward_per_token_pending: BigNumber;
  balance_staked: BigNumber;
};

export const userStruct = new BeetStruct<User>(
  [
    ['buffer', blob(8)],
    ['reward_per_token_complete', u128],
    ['reward_per_token_pending', u64],
    ['balance_staked', u64],
  ],
  (args) => args as User
);

export type UnwrapRequest = {
  buffer: Buffer;
  amount: BigNumber;
  timestamp: BigNumber;
};
export const unwrapRequestStruct = new BeetStruct<UnwrapRequest>(
  [
    ['buffer', blob(8)],
    ['amount', u64],
    ['timestamp', i64],
  ],
  (args) => args as UnwrapRequest
);
