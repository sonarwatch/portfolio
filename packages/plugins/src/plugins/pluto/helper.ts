import axios from 'axios';
import crypto from 'crypto';
import { earnLenderDataSize, earnVaultDataSize, lender_seed, leverageObligationDataSize, leverageVaultDataSize, leverageVaultJson, plutoProgramId, plutoProgramIdl, plutoServer } from './constants';
import { GetEarn, GetLeverage } from './types';
import { getUsdValueSumStrict, PortfolioAsset, UsdValue } from '@sonarwatch/portfolio-core';
import { Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import { getAutoParsedMultipleAccountsInfo, getAutoParsedProgramAccounts, getParsedProgramAccounts, getProgramAccounts, ParsedAccount } from '../../utils/solana';
import { EarnLender, earnLenderBeet, LeverageObligation, leverageObligationBeet, VaultEarn, vaultEarnBeet, VaultLeverage, vaultLeverageBeet } from './structs';
import { PublicKey } from '@solana/web3.js';
import { Buffer } from 'buffer';


export async function getAllEarn(conn: Connection): Promise<ParsedAccount<VaultEarn>[]> {
  const account = await getParsedProgramAccounts(
    conn,
    vaultEarnBeet,
    plutoProgramId,
    [
      {
        dataSize: earnVaultDataSize
      }
    ]
  )

  return account
}

export async function getAllEarnLender(conn: Connection, owner: string, protocol: string): Promise<ParsedAccount<EarnLender>[]> {
  const account = await getParsedProgramAccounts(
    conn,
    earnLenderBeet,
    plutoProgramId,
    [
      {
        dataSize: earnLenderDataSize
      },
      {
        memcmp: {
          offset: 16, 
          bytes: owner,
        },
      },
      {
        memcmp: {
          offset: 48,
          bytes: protocol,
        }
      }
    ]
  )
  return account
}

export async function calculateLenderPDA(
  programId: PublicKey,
  vaultPubkey: PublicKey,
  tokenMintPubkey: PublicKey,
  userPubkey: PublicKey
): Promise<[PublicKey, number]> {
  const seeds = lender_seed;
  // Replace with the actual value of seeds::LENDER
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(seeds),
      vaultPubkey.toBuffer(),
      tokenMintPubkey.toBuffer(),
      userPubkey.toBuffer(),
    ],
    programId
  );
}

export async function getAllLeverage(conn: Connection): Promise<ParsedAccount<VaultLeverage>[]> {
  const account = await getParsedProgramAccounts(
    conn,
    vaultLeverageBeet,
    plutoProgramId,
    [
      {
        dataSize: leverageVaultDataSize
      }
    ]
  )

  return account
}

export async function getAllLeverageObligation(conn: Connection, owner: string, protocol: string): Promise<ParsedAccount<LeverageObligation>[]> {
  const account = await getParsedProgramAccounts(
    conn,
    leverageObligationBeet,
    plutoProgramId,
    [
      {
        dataSize: leverageObligationDataSize
      },
      {
        memcmp: {
          offset: 16, 
          bytes: owner,
        },
      },
      {
        memcmp: {
          offset: 80,
          bytes: protocol,
        }
      }
    ]
  )
  return account
}

export function getElementLendingValues(params: {
  suppliedAssets: PortfolioAsset[];
  borrowedAssets: PortfolioAsset[];
  rewardAssets: PortfolioAsset[];
  suppliedLtvs?: number[];
  borrowedWeights?: number[];
  unsettledAssets?: PortfolioAsset[];
}) {
  const {
    suppliedAssets,
    borrowedAssets,
    rewardAssets,
    suppliedLtvs,
    borrowedWeights,
    unsettledAssets,
  } = params;

  const unsettledValue: UsdValue = getUsdValueSumStrict(
    unsettledAssets?.map((p) => p.value) || []
  );

  const rewardValue: UsdValue = rewardAssets.reduce(
    (acc: UsdValue, asset) =>
      acc !== null && asset.value !== null ? acc + asset.value : null,
    0
  );
  const suppliedValue: UsdValue = suppliedAssets.reduce(
    (acc: UsdValue, asset) =>
      acc !== null && asset.value !== null ? acc + asset.value : null,
    0
  );
  const borrowedValue: UsdValue = borrowedAssets.reduce(
    (acc: UsdValue, asset) =>
      acc !== null && asset.value !== null ? acc + asset.value : null,
    0
  );
  const healthRatio = null;

  // Total value
  let value =
    suppliedValue !== null && borrowedValue !== null
      ? suppliedValue
      : null;
  if (rewardValue !== null && value !== null) value += rewardValue;
  if (unsettledValue !== null && value !== null) value += unsettledValue;

  return {
    borrowedValue,
    suppliedValue,
    rewardValue,
    healthRatio,
    unsettledValue,
    value,
  };
}
