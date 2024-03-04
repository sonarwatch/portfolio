import { BeetStruct, bool } from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, i64, u64 } from '../../utils/solana';

export type VestingAccount = {
  buffer: Buffer;
  owner: PublicKey;
  lastClaimedAt: BigNumber;
  totalAmount: BigNumber;
  amountClaimed: BigNumber;
  isCanceled: boolean;
};

export const vestingAccountStruct = new BeetStruct<VestingAccount>(
  [
    ['buffer', blob(8)],
    ['owner', publicKey],
    ['lastClaimedAt', i64],
    ['totalAmount', u64],
    ['amountClaimed', u64],
    ['isCanceled', bool],
  ],
  (args) => args as VestingAccount
);
