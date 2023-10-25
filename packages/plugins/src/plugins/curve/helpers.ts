import axios, { AxiosResponse } from 'axios';
import { NetworkId, NetworkIdType } from '@sonarwatch/portfolio-core';
import { RegistryId } from './types';
import {
  CrvNetworkId,
  apiBaseUrl,
  crvNetworkIdBySwNetworkId,
} from './constants';
import { GetPoolsResponse, PoolDatumRaw } from './getPoolsTypes';
import { GaugeDatum, GetAllGaugesResponse } from './getAllGaugesTypes';

function getPoolsEndpoints(crvNetworkId: CrvNetworkId) {
  return Object.values(RegistryId).map(
    (registryId) => `${apiBaseUrl}/getPools/${crvNetworkId}/${registryId}`
  );
}

export async function getPoolsData(
  crvNetworkId: CrvNetworkId
): Promise<PoolDatumRaw[]> {
  const poolsData: PoolDatumRaw[] = [];
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

function getGaugeNetworkId(gauge: GaugeDatum): NetworkIdType | null {
  if (gauge.side_chain === false) return NetworkId.ethereum;
  const nameFirstPart = gauge.name.split('-').at(0);
  if (!nameFirstPart) return null;

  const crvNetworkId = CrvNetworkId[nameFirstPart as CrvNetworkId];
  if (!crvNetworkId) return null;
  return crvNetworkIdBySwNetworkId[crvNetworkId];
}

export async function getAllGaugesData(): Promise<
  Partial<Record<NetworkIdType, GaugeDatum[]>>
> {
  const getAllGaugesRes: AxiosResponse<GetAllGaugesResponse> | null =
    await axios.get(`${apiBaseUrl}/getAllGauges`).catch(() => null);
  const allGaugesData = getAllGaugesRes?.data.data;
  if (!allGaugesData) return {};

  const gauges: Partial<Record<NetworkIdType, GaugeDatum[]>> = {};
  const allGauges = Object.values(allGaugesData);
  allGauges.forEach((gauge) => {
    const networkId = getGaugeNetworkId(gauge);
    if (!networkId) return;
    if (!gauges[networkId]) gauges[networkId] = [];
    gauges[networkId]?.push(gauge);
  });
  return gauges;
}
