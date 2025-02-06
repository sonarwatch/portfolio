import axios from 'axios';
import crypto from 'crypto';
import { leverageVaultJson, plutoProgramId, plutoServer } from './constants';
import { GetEarn, GetLeverage } from './types';
import { getUsdValueSumStrict, PortfolioAsset, UsdValue } from '@sonarwatch/portfolio-core';
import { Connection } from '@solana/web3.js';
import { getParsedProgramAccounts, getProgramAccounts } from '../../utils/solana';
import { vaultFilter } from './structs';


export async function getAllEarn(conn: Connection): Promise<any> {
  const accounts = await getProgramAccounts(conn, plutoProgramId)

  
  console.log("Return dari ini apa",accounts)

  return accounts
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
