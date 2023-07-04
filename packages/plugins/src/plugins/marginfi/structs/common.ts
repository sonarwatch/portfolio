import { BeetStruct } from '@metaplex-foundation/beet';
import BigNumber from 'bignumber.js';
import { i128 } from '../../../utils/solana';

export type WrappedI80F48 = {
  value: BigNumber;
};

export const wrappedI80F48Struct = new BeetStruct<WrappedI80F48>(
  [['value', i128]],
  (args) => args as WrappedI80F48
);
