import axios from 'axios';
import crypto from 'crypto';
import { earnLenderDataSize, earnVaultDataSize, lender_seed, leverageVaultJson, plutoProgramId, plutoProgramIdl, plutoServer } from './constants';
import { GetEarn, GetLeverage } from './types';
import { getUsdValueSumStrict, PortfolioAsset, UsdValue } from '@sonarwatch/portfolio-core';
import { Connection, GetProgramAccountsFilter } from '@solana/web3.js';
import { getAutoParsedMultipleAccountsInfo, getAutoParsedProgramAccounts, getParsedProgramAccounts, getProgramAccounts } from '../../utils/solana';
import { EarnLender, earnLenderBeet, VaultEarn, vaultEarnBeet } from './structs';
import { PublicKey } from '@solana/web3.js';
import { Buffer } from 'buffer';


export async function getAllEarn(conn: Connection): Promise<VaultEarn[]> {
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

export async function getAllEarnLender(conn: Connection): Promise<EarnLender[]> {
  const account = await getParsedProgramAccounts(
    conn,
    earnLenderBeet,
    plutoProgramId,
    [
      {
        dataSize: earnLenderDataSize
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

export async function testing(conn: Connection) {
  const account = await getProgramAccounts(
    conn,
    plutoProgramId,
  )

  console.log(account)
  const fill: any = []
  account.forEach((acc) => {
    if (acc.account.data.length > 200 && acc.account.data.length < 400) {
      fill.push({acc, length: acc.account.data.length})
    }
  })
  console.log(fill)

}

export const getEarnVaults = () => {
  const url = `${plutoServer}/vaults`;

  return axios.get(url, {}).then((response) => {
      return response.data;
  }).catch((error) => {
      console.error("Error:", error.response ? error.response.data : error.message);
      return {};
  })
}

export const getLeverageVaults = () => {
  const url = leverageVaultJson;

  return axios.get(url, {}).then((response) => {
      return response.data;
  })
}

export const getEarn = (address: string):Promise<GetEarn> => {
  const url = `${plutoServer}/earn?address=${address}`;

  return axios.get(url, {}).then((response) => {
    return response.data;
  }).catch((error) => {
    console.error("Error:", error.response ? error.response.data : error.message);
    return {}
  })
}

export const getLeverage = (address: string):Promise<GetLeverage> => {
  const url = `${plutoServer}/leverage?address=${address}`;

  return axios.get(url, {}).then((response) => {
      return response.data;
  }).catch((error) => {
      console.error("Error:", error.response ? error.response.data : error.message);
      return {};
  })
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
