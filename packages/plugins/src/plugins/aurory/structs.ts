import { BeetStruct } from '@metaplex-foundation/beet';
import BigNumber from 'bignumber.js';
import { blob, u64 } from '../../utils/solana';

type UserStakingAccount = {
  buffer: Buffer;
  amount: BigNumber;
  xAmount: BigNumber;
};

export const UserStakingAccountStruct = new BeetStruct<UserStakingAccount>(
  [
    ['buffer', blob(8)],
    ['amount', u64],
    ['xAmount', u64],
  ],
  (args) => args as UserStakingAccount,
  'UserStakingAccount'
);
