import { RpcEndpoint } from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import { GetAssetBatchOutput, HeliusAsset } from './types';
import { getBasicAuthHeaders } from '../../misc/getBasicAuthHeaders';

const MAX_MINTS = 1000;

export async function getAssetBatchDas(
  dasEndpoint: RpcEndpoint,
  publicKeys: string[]
) {
  const uniquePublicKeys = Array.from(new Set(publicKeys));
  if (publicKeys.length <= MAX_MINTS) {
    return getAssetBatchDasUnsafe(dasEndpoint, uniquePublicKeys);
  }
  const assetsInfo = [];
  const publicKeysToFetch = [...uniquePublicKeys];
  while (publicKeysToFetch.length !== 0) {
    const currPublicKeysToFetch = publicKeysToFetch.splice(0, MAX_MINTS);
    const accountsInfoRes = await getAssetBatchDasUnsafe(
      dasEndpoint,
      currPublicKeysToFetch
    );
    assetsInfo.push(...accountsInfoRes);
  }
  return assetsInfo;
}

export async function getAssetBatchDasAsMap(
  dasEndpoint: RpcEndpoint,
  publicKeys: string[]
) {
  const assets = await getAssetBatchDas(dasEndpoint, publicKeys);

  const assetsMap: Map<string, HeliusAsset> = new Map();
  assets.forEach((asset) => {
    if (!asset) return;
    assetsMap.set(asset.id, asset);
  });

  return assetsMap;
}

async function getAssetBatchDasUnsafe(
  dasEndpoint: RpcEndpoint,
  publicKeys: string[]
) {
  if (publicKeys.length === 0) return [];
  const httpHeaders = dasEndpoint.basicAuth
    ? getBasicAuthHeaders(
        dasEndpoint.basicAuth.username,
        dasEndpoint.basicAuth.password
      )
    : undefined;

  const res = await axios.post<
    unknown,
    AxiosResponse<GetAssetBatchOutput, unknown>,
    unknown
  >(
    dasEndpoint.url,
    {
      jsonrpc: '2.0',
      id: Math.random().toString(),
      method: 'getAssetBatch',
      params: {
        ids: publicKeys,
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
        ...httpHeaders,
      },
    }
  );

  return res.data.result;
}
