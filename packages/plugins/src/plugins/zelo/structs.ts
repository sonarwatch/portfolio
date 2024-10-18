import { BeetStruct } from '@metaplex-foundation/beet';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { blob, u64 } from '../../utils/solana';

export type UserRecord = {
  buffer: Buffer;
  userKey: PublicKey;
  solDeposit: BigNumber;
  averageAge: BigNumber;
};

export const userRecordStruct = new BeetStruct<UserRecord>(
  [
    ['buffer', blob(8)],
    ['userKey', publicKey],
    ['solDeposit', u64],
    ['averageAge', u64],
  ],
  (args) => args as UserRecord
);
