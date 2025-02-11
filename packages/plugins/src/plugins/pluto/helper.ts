import axios from 'axios';
import { earnLenderDataSize, earnVaultDataSize, leverageObligationDataSize, leverageVaultDataSize, leverageVaultJson, plutoProgramId } from './constants';
import { getUsdValueSumStrict, PortfolioAsset, UsdValue } from '@sonarwatch/portfolio-core';
import { Connection } from '@solana/web3.js';
import { getParsedProgramAccounts, ParsedAccount } from '../../utils/solana';
import { EarnLender, earnLenderBeet, LeverageObligation, leverageObligationBeet, VaultEarn, vaultEarnBeet, VaultLeverage, vaultLeverageBeet } from './structs';



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


export const getLeverageVaults = () => {
  const url = leverageVaultJson;

  return axios.get(url, {}).then((response) => {
      return response.data;
  })
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
