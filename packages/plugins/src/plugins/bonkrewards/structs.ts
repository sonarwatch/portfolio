import { BeetStruct, uniformFixedSizeArray } from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, i64, u128, u64 } from '../../utils/solana';

export type StakeDepositReceipt = {
  buffer: Buffer;
  owner: PublicKey;
  payer: PublicKey;
  stakePool: PublicKey;
  lockupDuration: BigNumber;
  depositTimestamp: BigNumber;
  depositAmount: BigNumber;
  effectiveStake: BigNumber;
  claimedAmounts: BigNumber[];
};

export const stakeDepositReceiptStruct = new BeetStruct<StakeDepositReceipt>(
  [
    ['buffer', blob(8)],
    ['owner', publicKey],
    ['payer', publicKey],
    ['stakePool', publicKey],
    ['lockupDuration', u64],
    ['depositTimestamp', i64],
    ['depositAmount', u64],
    ['effectiveStake', u128],
    ['claimedAmounts', uniformFixedSizeArray(u128, 10)],
  ],
  (args) => args as StakeDepositReceipt
);
