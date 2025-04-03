import {
  Address,
  fixCodecSize,
  getAddressCodec,
  getBytesCodec,
} from '@solana/kit';
import BigNumber from 'bignumber.js';
import { getU64BigNumberCodec } from '../../utils/solana/accounts/bignumbers';
import { getStructCodecWithLayout } from '../../utils/solana/accounts/getStructCodecWithLayout';

export type Staked = {
  _discriminator: number[];
  user: Address;
  mint: Address;
  amount: BigNumber;
};

export const stakedCodec = getStructCodecWithLayout<Staked>(
  [
    ['_discriminator', fixCodecSize(getBytesCodec(), 8)],
    ['user', getAddressCodec()],
    ['mint', getAddressCodec()],
    ['amount', getU64BigNumberCodec()],
  ],
  [171, 229, 193, 85, 67, 177, 151, 4]
);
