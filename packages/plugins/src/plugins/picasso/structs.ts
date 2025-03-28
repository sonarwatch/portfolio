import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import {
  u8,
  BeetStruct,
  uniformFixedSizeArray,
  DataEnumKeyAsKind,
  dataEnum,
  FixableBeetArgsStruct,
  FixableBeet,
  FixableBeetStruct,
  coption,
  COption,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { i64, u128, u64 } from '../../utils/solana';

type ServiceRecord = {
  GuestChain: {
    validator: PublicKey;
  };
};
type Service = DataEnumKeyAsKind<ServiceRecord>;

const serviceStruct = dataEnum<ServiceRecord>([
  [
    'GuestChain',
    new FixableBeetArgsStruct<ServiceRecord['GuestChain']>(
      [['validator', publicKey]],
      'ServiceRecord["GuestChain"]'
    ),
  ],
]) as FixableBeet<Service>;

export type WithdrawalRequestParams = {
  timestampInSec: BigNumber;
  owner: PublicKey;
  tokenAccount: PublicKey;
};

export const withdrawalRequestParamsStruct =
  new BeetStruct<WithdrawalRequestParams>(
    [
      ['timestampInSec', u64],
      ['owner', publicKey],
      ['tokenAccount', publicKey],
    ],
    (args) => args as WithdrawalRequestParams
  );

// Struct Vault
export type Vault = {
  accountDiscriminator: number[];
  stakeTimestampSec: BigNumber;
  service: COption<Service>;
  stakeAmount: BigNumber;
  stakeMint: PublicKey;
  lastReceivedRewardsHeight: BigNumber;
  withdrawalRequest: COption<WithdrawalRequestParams>;
};

export const vaultStruct = new FixableBeetStruct<Vault>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['stakeTimestampSec', i64],
    ['service', coption(serviceStruct)],
    ['stakeAmount', u64],
    ['stakeMint', publicKey],
    ['lastReceivedRewardsHeight', u64],
    ['withdrawalRequest', coption(withdrawalRequestParamsStruct)],
  ],
  (args) => args as Vault
);

export type StakingParams = {
  accountDiscriminator: number[];
  admin: PublicKey;
  whitelistedTokens: PublicKey[];
  guestChainProgramId?: PublicKey;
  rewardsTokenMint: PublicKey;
  stakingCap: BigNumber;
  totalDepositedAmount: BigNumber;
  newAdminProposal?: PublicKey;
};

export const stakingParamsStruct = new BeetStruct<StakingParams>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['admin', publicKey],
    ['whitelistedTokens', uniformFixedSizeArray(publicKey, 10)], // Adjust size if needed
    ['guestChainProgramId', publicKey],
    ['rewardsTokenMint', publicKey],
    ['stakingCap', u128],
    ['totalDepositedAmount', u128],
    ['newAdminProposal', publicKey],
  ],
  (args) => args as StakingParams
);
