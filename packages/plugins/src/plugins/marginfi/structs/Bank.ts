import {
  FixableBeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { WrappedI80F48, wrappedI80F48Struct } from './common';
import { blob, i64, u128, u64 } from '../../../utils/solana';

// https://github.com/mrgnlabs/mrgn-ts/blob/ea61c4b40a35554549289f559ea0cb66767923df/packages/marginfi-client-v2/src/idl/marginfi.json

export enum BankOperationalState {
  Paused,
  Operational,
  ReduceOnly,
}

export enum RiskTier {
  Collateral,
  Isolated,
}

export type InterestRateConfig = {
  optimalUtilizationRate: WrappedI80F48;
  plateauInterestRate: WrappedI80F48;
  maxInterestRate: WrappedI80F48;
  insuranceFeeFixedApr: WrappedI80F48;
  insuranceIrFee: WrappedI80F48;
  protocolFixedFeeApr: WrappedI80F48;
  protocolIrFee: WrappedI80F48;
  padding: BigNumber[];
};

export const interestRateConfigStruct =
  new FixableBeetStruct<InterestRateConfig>(
    [
      ['optimalUtilizationRate', wrappedI80F48Struct],
      ['plateauInterestRate', wrappedI80F48Struct],
      ['maxInterestRate', wrappedI80F48Struct],
      ['insuranceFeeFixedApr', wrappedI80F48Struct],
      ['insuranceIrFee', wrappedI80F48Struct],
      ['protocolFixedFeeApr', wrappedI80F48Struct],
      ['protocolIrFee', wrappedI80F48Struct],
      ['padding', uniformFixedSizeArray(u128, 8)],
    ],
    (args) => args as InterestRateConfig
  );

export type BankConfig = {
  assetWeightInit: WrappedI80F48;
  assetWeightMaint: WrappedI80F48;
  liabilityWeightInit: WrappedI80F48;
  liabilityWeightMaint: WrappedI80F48;
  depositLimit: BigNumber;
  interestRateConfig: InterestRateConfig;
  operationalState: BankOperationalState;
  oracleSetup: number;
  oracleKeys: PublicKey[];
  ignore1: number[];
  borrowLimit: BigNumber;
  riskTier: RiskTier;
  padding: BigNumber[];
};

export const bankConfigStruct = new FixableBeetStruct<BankConfig>(
  [
    ['assetWeightInit', wrappedI80F48Struct],
    ['assetWeightMaint', wrappedI80F48Struct],
    ['liabilityWeightInit', wrappedI80F48Struct],
    ['liabilityWeightMaint', wrappedI80F48Struct],
    ['depositLimit', u64],
    ['interestRateConfig', interestRateConfigStruct],
    ['operationalState', u8],
    ['oracleSetup', u8],
    ['oracleKeys', uniformFixedSizeArray(publicKey, 5)],
    ['ignore1', uniformFixedSizeArray(u8, 6)],
    ['borrowLimit', u64],
    ['riskTier', u8],
    ['padding', uniformFixedSizeArray(u64, 6)],
  ],
  (args) => args as BankConfig
);

export type Bank = {
  padding: Buffer;
  mint: PublicKey;
  mintDecimals: number;
  group: PublicKey;
  ignore1: number[];
  assetShareValue: WrappedI80F48;
  liabilityShareValue: WrappedI80F48;
  liquidityVault: PublicKey;
  blob: Buffer;
  insuranceVault: PublicKey;
  insuranceVaultBump: number;
  insuranceVaultAuthorityBump: PublicKey;
  ignore3: PublicKey;
  collectedInsuranceFeesOutstanding: WrappedI80F48;
  feeVault: PublicKey;
  feeVaultBump: number;
  feeVaultAuthorityBump: number;
  ignore4: number[];
  collectedGroupFeesOutstanding: WrappedI80F48;
  totalLiabilityShares: WrappedI80F48;
  totalAssetShares: WrappedI80F48;
  lastUpdate: BigNumber;
  config: BankConfig;
  emissionsFlags: number;
  emissionsRate: number;
  emissionsMint: PublicKey;
  emissionsRemaining: WrappedI80F48;
  padding0: BigNumber[];
  padding1: BigNumber[];
};

export const bankStruct = new FixableBeetStruct<Bank>(
  [
    ['padding', blob(8)],
    ['mint', publicKey],
    ['mintDecimals', u8],
    ['group', publicKey],
    ['ignore1', uniformFixedSizeArray(u8, 7)],
    ['assetShareValue', wrappedI80F48Struct],
    ['liabilityShareValue', wrappedI80F48Struct],
    ['liquidityVault', publicKey],
    ['blob', blob(2)],
    ['insuranceVault', publicKey],
    ['insuranceVaultBump', u8],
    ['insuranceVaultAuthorityBump', u8],
    ['ignore3', uniformFixedSizeArray(u8, 4)],
    ['collectedInsuranceFeesOutstanding', wrappedI80F48Struct],
    ['feeVault', publicKey],
    ['feeVaultBump', u8],
    ['feeVaultAuthorityBump', u8],
    ['ignore4', uniformFixedSizeArray(u8, 6)],
    ['collectedGroupFeesOutstanding', wrappedI80F48Struct],
    ['totalLiabilityShares', wrappedI80F48Struct],
    ['totalAssetShares', wrappedI80F48Struct],
    ['lastUpdate', i64],
    ['config', bankConfigStruct],
    ['emissionsFlags', u64],
    ['emissionsRate', u64],
    ['emissionsMint', publicKey],
    ['emissionsRemaining', wrappedI80F48Struct],
    ['padding0', uniformFixedSizeArray(u128, 28)],
    ['padding1', uniformFixedSizeArray(u128, 32)],
  ],
  (args) => args as Bank
);
