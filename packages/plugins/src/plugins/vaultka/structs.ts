import { BeetStruct } from '@metaplex-foundation/beet';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { blob, u128, u64 } from '../../utils/solana';

export type UserInfo = {
  buffer: Buffer;
  shares: BigNumber;
};

export const userInfoStruct = new BeetStruct<UserInfo>(
  [
    ['buffer', blob(8)],
    ['shares', u128],
  ],
  (args) => args as UserInfo
);

export type Lending = {
  buffer: Buffer;
  vault_balance: BigNumber;
  borrowed_amount: BigNumber;
  owner: PublicKey;
  total_shares: BigNumber;
  max_utilization_rate: BigNumber;
  water_fee_receiver: PublicKey;
  withdraw_fee: BigNumber;
  withdraw_fee_receiver_ata: PublicKey;
  mint: PublicKey;
};

export const lendingStruct = new BeetStruct<Lending>(
  [
    ['buffer', blob(8)],
    ['vault_balance', u128],
    ['borrowed_amount', u128],
    ['owner', publicKey],
    ['total_shares', u128],
    ['max_utilization_rate', u64],
    ['water_fee_receiver', publicKey],
    ['withdraw_fee', u64],
    ['withdraw_fee_receiver_ata', publicKey],
    ['mint', publicKey],
  ],
  (args) => args as Lending
);
