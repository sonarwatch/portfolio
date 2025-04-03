import { NetworkId, PortfolioAssetToken } from '@sonarwatch/portfolio-core';
import { Operator, Position, Withdrawal } from './types';

import axios, { AxiosResponse } from 'axios';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getAddress } from '@ethersproject/address';
import { customEigenlayerTokenMapping } from './constants';
import { Cache } from '../../Cache';
import BigNumber from 'bignumber.js';
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
    `${eigenlayerApiUrl}/withdrawals?status=queued_withdrawable&take=${eigenlayerApiWithdrawalsLimit}`,
    options
  );

  return res.data;
}

export const getAssetsFromPositions = async (
  positions: Position[],
  cache: Cache
): Promise<PortfolioAssetToken[]> => {
  const assets: PortfolioAssetToken[] = [];
  for (const position of positions) {
    const underlyingToken = position.underlyingToken;
    if (!underlyingToken || !position.amount) return [];

    const amount = position.amount;
    const tokenPrice = await cache.getTokenPrice(
      customEigenlayerTokenMapping[
        underlyingToken as keyof typeof customEigenlayerTokenMapping
      ] || underlyingToken,
      NetworkId.ethereum
    );
    const underlyingTokenAddress = getAddress(underlyingToken);
    const asset = tokenPriceToAssetToken(
      underlyingTokenAddress,
      BigNumber(amount.toString())
        .div(10 ** (position.decimals || 18))
        .toNumber(),
      NetworkId.ethereum,
      tokenPrice
    );
    assets.push(asset);
  }
  return assets;
};
