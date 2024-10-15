import {
  BeetStruct,
  FixableBeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, u64 } from '../../utils/solana';

export type JlpHolder = {
  address: PublicKey;
  base_amount: BigNumber;
  balance: BigNumber;
  deposited_at: BigNumber;
  deposited_at_price: BigNumber;
  leveraged_amount: BigNumber;
  cumulative_borrow: BigNumber;
  target_leverage: number;
  _padding: number[];
};

export const jlpHolderStruct = new BeetStruct<JlpHolder>(
  [
    ['address', publicKey],
    ['base_amount', u64],
    ['balance', u64],
    ['deposited_at', u64],
    ['deposited_at_price', u64],
    ['leveraged_amount', u64],
    ['cumulative_borrow', u64],
    ['target_leverage', u8],
    ['_padding', uniformFixedSizeArray(u8, 7)],
  ],
  (args) => args as JlpHolder
);

export type JlpLedger = {
  padding: Buffer;
  total_base_amount: BigNumber;
  total_leveraged_amount: BigNumber;
  min_amount: BigNumber;
  max_capacity: BigNumber;
  max_amount: BigNumber;
  holders: JlpHolder[];
};

export const jlpLedgerStruct = new FixableBeetStruct<JlpLedger>(
  [
    ['padding', blob(8)],
    ['total_base_amount', u64],
    ['total_leveraged_amount', u64],
    ['min_amount', u64],
    ['max_capacity', u64],
    ['max_amount', u64],
    ['holders', uniformFixedSizeArray(jlpHolderStruct, 5000)],
  ],
  (args) => args as JlpLedger
);

export type UsdcHolder = {
  address: PublicKey;
  base_amount: BigNumber;
  balance: BigNumber;
  deposited_at: BigNumber;
  cumulative_borrow: BigNumber;
};

export const usdcHolderStruct = new BeetStruct<UsdcHolder>(
  [
    ['address', publicKey],
    ['base_amount', u64],
    ['balance', u64],
    ['deposited_at', u64],
    ['cumulative_borrow', u64],
  ],
  (args) => args as UsdcHolder
);

export type UsdcLedger = {
  padding: Buffer;
  total_base_amount: BigNumber;
  total_available_amount: BigNumber;
  total_reserved_amount: BigNumber;
  max_capacity: BigNumber;
  min_amount: BigNumber;
  max_amount: BigNumber;
  holders: UsdcHolder[];
};

export const usdcLedgerStruct = new FixableBeetStruct<UsdcLedger>(
  [
    ['padding', blob(8)],
    ['total_base_amount', u64],
    ['total_available_amount', u64],
    ['total_reserved_amount', u64],
    ['max_capacity', u64],
    ['min_amount', u64],
    ['max_amount', u64],
    ['holders', uniformFixedSizeArray(usdcHolderStruct, 5000)],
  ],
  (args) => args as UsdcLedger
);
