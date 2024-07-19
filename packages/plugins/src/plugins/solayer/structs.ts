import { BeetStruct, u8 } from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, u64 } from '../../utils/solana';

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
