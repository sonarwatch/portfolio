import axios, { AxiosResponse } from 'axios';

import { Address, getAddress } from 'viem';
import { Operator, Withdrawal } from './types';
import { bEigenTokenAddress, eigenTokenAddress } from './constants';

const eigenlayerApiKey = process.env['EIGENLAYER_API_KEY'];
const eigenlayerApiUrl = 'https://api.eigenexplorer.com';
const eigenlayerApiOperatorsUrl = `${eigenlayerApiUrl}/operators`;
const eigenlayerApiOperatorsLimit = 100_000_000;
const eigenlayerApiWithdrawalsLimit = 100_000_000;

/**
 * Get all EigenLayer operators and get all the strategies
 * https://docs.eigenexplorer.com/api-reference/endpoint/operators/retrieve-all-operators
 * @returns {Promise<Operator[]>}
 */
export async function getEigenLayerOperators() {
  const options = {
    method: 'GET',
    headers: { 'X-API-Token': eigenlayerApiKey as string },
  };
  const res: AxiosResponse<{ data: Operator[] }> = await axios.get(
    `${eigenlayerApiOperatorsUrl}?take=${eigenlayerApiOperatorsLimit}`,
    options
  );

  return res.data;
}

export async function getEigenLayerWithdrawals() {
  const options = {
    method: 'GET',
    headers: { 'X-API-Token': eigenlayerApiKey as string },
  };

  const res: AxiosResponse<{ data: Withdrawal[] }> = await axios.get(
    `${eigenlayerApiUrl}/withdrawals?status=queued&take=${eigenlayerApiWithdrawalsLimit}`,
    options
  );

  return res.data;
}

/**
 * Unwrap the backing layer token to the eigen token
 * @param {Address} tokenAddress - The address of the token to unwrap
 * @returns {Address} - The address of the unwrapped token
 */
export const unwrapBackingLayerToken = (tokenAddress: Address | string) => {
  if (getAddress(tokenAddress) === bEigenTokenAddress) return eigenTokenAddress;
  return tokenAddress;
};
