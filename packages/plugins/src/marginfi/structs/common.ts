import { BeetStruct } from '@metaplex-foundation/beet';
import { i128 } from '@sonarwatch/beet';
import BigNumber from 'bignumber.js';

export type WrappedI80F48 = {
  value: BigNumber;
};

export const wrappedI80F48Struct = new BeetStruct<WrappedI80F48>(
  [['value', i128]],
  (args) => args as WrappedI80F48
);
