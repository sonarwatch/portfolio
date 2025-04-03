import {
  Address,
  fixCodecSize,
  getAddressCodec,
  getBytesCodec,
  getEnumCodec,
  getU16Codec,
  getU32Codec,
} from '@solana/kit';
import BigNumber from 'bignumber.js';
import { getStructCodecWithLayout } from '../../utils/solana/accounts/getStructCodecWithLayout';
import {
  getI64BigNumberCodec,
  getU64BigNumberCodec,
} from '../../utils/solana/accounts/bignumbers';

enum DelegationStatus {
  Activated,
  StartDelegationRemoval,
  FinalizeDelegationRemoval,
}

export type Delegation = {
  _discriminator: number[];
  delegator: Address;
  guardianSetting: Address;
  seed: number;
  status: DelegationStatus;
  lockDays: number;
  amount: BigNumber;
  claimableAmount: BigNumber;
  claimedReward: BigNumber;
  baseRewardRate: number;
  derivedRewardRate: number;
  previousAccumulatedAmount: BigNumber;
  createdAt: BigNumber;
  startedRemovalAt: BigNumber;
  finalizedRemovalAt: BigNumber;
};

export const delegationCodec = getStructCodecWithLayout<Delegation>(
  [
    ['_discriminator', fixCodecSize(getBytesCodec(), 8)],
    ['delegator', getAddressCodec()],
    ['guardianSetting', getAddressCodec()],
    ['seed', getU32Codec()],
    ['status', getEnumCodec(DelegationStatus)],
    ['lockDays', getU16Codec()],
    ['amount', getU64BigNumberCodec()],
    ['claimableAmount', getU64BigNumberCodec()],
    ['claimedReward', getU64BigNumberCodec()],
    ['baseRewardRate', getU32Codec()],
    ['derivedRewardRate', getU32Codec()],
    ['previousAccumulatedAmount', getU64BigNumberCodec()],
    ['createdAt', getI64BigNumberCodec()],
    ['startedRemovalAt', getI64BigNumberCodec()],
    ['finalizedRemovalAt', getI64BigNumberCodec()],
  ],
  [47, 21, 138, 89, 209, 154, 59, 130]
);
