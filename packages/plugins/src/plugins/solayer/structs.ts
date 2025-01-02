import { BeetStruct, u8 } from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, i64, u64 } from '../../utils/solana';

export enum AccountType {
  Uninitialized,
  StakePool,
  ValidatorList,
}

export type RestakingPool = {
  buffer: Buffer;
  lstMint: PublicKey;
  rstMint: PublicKey;
  bump: number;
  bump2: number;
};

export const restakingPoolStruct = new BeetStruct<RestakingPool>(
  [
    ['buffer', blob(8)],
    ['lstMint', publicKey],
    ['rstMint', publicKey],
    ['bump', u8],
    ['bump2', u8],
  ],
  (args) => args as RestakingPool
);

export type StakePool = {
  accountType: number;
  manager: PublicKey;
  staker: PublicKey;
  stakeDepositAuthority: PublicKey;
  stakeWithdrawBumpSeed: number;
  validatorList: PublicKey;
  reserveStake: PublicKey;
  poolMint: PublicKey;
  managerFeeAccount: PublicKey;
  tokenProgramId: PublicKey;
  totalLamports: BigNumber;
  poolTokenSupply: BigNumber;
  lastUpdateEpoch: BigNumber;
};

export const stakePoolStruct = new BeetStruct<StakePool>(
  [
    ['accountType', u8],
    ['manager', publicKey],
    ['staker', publicKey],
    ['stakeDepositAuthority', publicKey],
    ['stakeWithdrawBumpSeed', u8],
    ['validatorList', publicKey],
    ['reserveStake', publicKey],
    ['poolMint', publicKey],
    ['managerFeeAccount', publicKey],
    ['tokenProgramId', publicKey],
    ['totalLamports', u64],
    ['poolTokenSupply', u64],
    ['lastUpdateEpoch', u64],
  ],
  (args) => args as StakePool
);

export type Proof = {
  buffer: Buffer;
  bump: number;
  nonce: BigNumber;
  from: PublicKey;
  amount: BigNumber;
  mint: PublicKey;
  batchId: BigNumber;
  userSusdVault: PublicKey;
};

export const proofStruct = new BeetStruct<Proof>(
  [
    ['buffer', blob(8)],
    ['bump', u8],
    ['nonce', u64],
    ['from', publicKey],
    ['amount', u64],
    ['mint', publicKey],
    ['batchId', u64],
    ['userSusdVault', publicKey],
  ],
  (args) => args as Proof
);

enum Status {
  Active,
  Inactive,
}

type Fee = {
  numerator: BigNumber;
  denominator: BigNumber;
  recipient: PublicKey;
};

const feeStruct = new BeetStruct<Fee>(
  [
    ['numerator', u64],
    ['denominator', u64],
    ['recipient', publicKey],
  ],
  (args) => args as Fee
);

export type SUSDPool = {
  buffer: Buffer;
  bump: number;
  manager: PublicKey;
  operator: PublicKey;
  rateAuthority: PublicKey;
  fee: Fee;
  poolCreationTimestampSeconds: BigNumber;
  lastFeeCollectionTimestampSeconds: BigNumber;
  usdcMint: PublicKey;
  poolUsdcMainVault: PublicKey;
  susdMint: PublicKey;
  poolSusdVault: PublicKey;
  batchDepositStatus: Status;
  currentDepositId: BigNumber;
  currentDepositUsdcAmount: BigNumber;
  batchDepositRemainingUsdcAmount: BigNumber;
  batchWithdrawStatus: Status;
  currentWithdrawId: BigNumber;
  currentWithdrawSusdAmount: BigNumber;
  batchWithdrawRemainingSusdAmount: BigNumber;
  openedenInfo: PublicKey;
};

export const sUSDPoolStruct = new BeetStruct<SUSDPool>(
  [
    ['buffer', blob(8)],
    ['bump', u8],
    ['manager', publicKey],
    ['operator', publicKey],
    ['rateAuthority', publicKey],
    ['fee', feeStruct],
    ['poolCreationTimestampSeconds', i64],
    ['lastFeeCollectionTimestampSeconds', i64],
    ['usdcMint', publicKey],
    ['poolUsdcMainVault', publicKey],
    ['susdMint', publicKey],
    ['poolSusdVault', publicKey],
    ['batchDepositStatus', u8],
    ['currentDepositId', u64],
    ['currentDepositUsdcAmount', u64],
    ['batchDepositRemainingUsdcAmount', u64],
    ['batchWithdrawStatus', u8],
    ['currentWithdrawId', u64],
    ['currentWithdrawSusdAmount', u64],
    ['batchWithdrawRemainingSusdAmount', u64],
    ['openedenInfo', publicKey],
  ],
  (args) => args as SUSDPool
);
