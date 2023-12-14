import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { FixableBeetStruct, bool, u32, u8 } from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { blob, u64 } from '../../utils/solana';

export type VestingAccount = {
  magic: BigNumber;
  version: number;
  createdAt: BigNumber;
  withdrawnAmount: BigNumber;
  canceledAt: BigNumber;
  endTime: BigNumber;
  lastWithdrawnAt: BigNumber;
  sender: PublicKey;
  senderToken: PublicKey;
  recipient: PublicKey;
  recipientToken: PublicKey;
  mint: PublicKey;
  escrowToken: PublicKey;
  streamflowTreasury: PublicKey;
  streamflowTreasuryToken: PublicKey;
  streamflowFeeTotal: BigNumber;
  streamflowFeeWithdrawn: BigNumber;
  streamflowFeePercent: number;
  partner: PublicKey;
  partnerToken: PublicKey;
  partnerFeeTotal: BigNumber;
  partnerFeeWithdrawn: BigNumber;
  partnerFeePercent: number;
  startTime: BigNumber;
  netAmountDeposited: BigNumber;
  period: BigNumber;
  amountPerPeriod: BigNumber;
  cliff: BigNumber;
  cliffAmount: BigNumber;
  cancelableBySender: boolean;
  cancelableByRecipient: boolean;
  automaticWithdrawal: boolean;
  transferableBySender: boolean;
  transferableByRecipient: boolean;
  canTopup: boolean;
  streamName: Buffer;
  padding: Buffer;
};

export const vestingAccountStruct = new FixableBeetStruct<VestingAccount>(
  [
    ['magic', u64],
    ['version', u8],
    ['createdAt', u64],
    ['withdrawnAmount', u64],
    ['canceledAt', u64],
    ['endTime', u64],
    ['lastWithdrawnAt', u64],
    ['sender', publicKey],
    ['senderToken', publicKey],
    ['recipient', publicKey],
    ['recipientToken', publicKey],
    ['mint', publicKey],
    ['escrowToken', publicKey],
    ['streamflowTreasury', publicKey],
    ['streamflowTreasuryToken', publicKey],
    ['streamflowFeeTotal', u64],
    ['streamflowFeeWithdrawn', u64],
    ['streamflowFeePercent', u32],
    ['partner', publicKey],
    ['partnerToken', publicKey],
    ['partnerFeeTotal', u64],
    ['partnerFeeWithdrawn', u64],
    ['partnerFeePercent', u32],
    ['startTime', u64],
    ['netAmountDeposited', u64],
    ['period', u64],
    ['amountPerPeriod', u64],
    ['cliff', u64],
    ['cliffAmount', u64],
    ['cancelableBySender', bool],
    ['cancelableByRecipient', bool],
    ['automaticWithdrawal', bool],
    ['transferableBySender', bool],
    ['transferableByRecipient', bool],
    ['canTopup', u8],
    ['streamName', blob(64)],
    ['padding', blob(505)],
  ],
  (args) => args as VestingAccount
);
