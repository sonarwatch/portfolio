import { Operator } from './types';

import axios, { AxiosResponse } from 'axios';

const eigenlayerApiKey = process.env['EIGENLAYER_API_KEY'];
const eigenlayerApiUrl = 'https://api.eigenexplorer.com';
const eigenlayerApiOperatorsUrl = `${eigenlayerApiUrl}/operators`;
const eigenlayerApiOperatorsLimit = 100_000_000;

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
