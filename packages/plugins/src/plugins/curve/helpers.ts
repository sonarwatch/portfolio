import axios, { AxiosResponse } from 'axios';
import { RegistryId } from './types';
import { CrvNetworkId, apiBaseUrl } from './constants';
import { GetPoolsResponse, PoolDatum } from './getPoolsTypes';

function getPoolsEndpoints(crvNetworkId: CrvNetworkId) {
  return Object.values(RegistryId).map(
    (registryId) => `${apiBaseUrl}/getPools/${crvNetworkId}/${registryId}`
  );
}

export async function getPoolsData(
  crvNetworkId: CrvNetworkId
): Promise<PoolDatum[]> {
  const poolsData: PoolDatum[] = [];
  const endpoints = getPoolsEndpoints(crvNetworkId);
  for (let i = 0; i < endpoints.length; i++) {
    const endpoint = endpoints[i];
    const getPoolsRes: AxiosResponse<GetPoolsResponse> | null = await axios
      .get(endpoint)
      .catch(() => null);
    if (!getPoolsRes || !getPoolsRes.data.success) continue;
    const { poolData } = getPoolsRes.data.data;
    const fPoolData = poolData.filter((pData) => {
      if (pData.totalSupply === '0') return false;
      if (pData.usdTotal <= 100) return false;
      if (pData.isBroken) return false;
      return true;
    });
    poolsData.push(...fPoolData);
  }
  return poolsData;
}
