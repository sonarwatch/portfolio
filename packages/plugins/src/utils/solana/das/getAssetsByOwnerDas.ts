import { RpcEndpoint } from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import {
  GetAssetsByOwnerDasParams,
  GetAssetsByOwnerOutput,
  HeliusAsset,
} from './types';
import { getBasicAuthHeaders } from '../../misc/getBasicAuthHeaders';
import { getDisplayOptions } from './getDisplayOptions';

const LIMIT = 1000;
const DEFAULT_MAX_PAGE = 25;

export async function getAssetsByOwnerDas(
  dasEndpoint: RpcEndpoint,
  owner: string,
  params?: GetAssetsByOwnerDasParams
): Promise<HeliusAsset[]> {
  const httpHeaders = dasEndpoint.basicAuth
    ? getBasicAuthHeaders(
        dasEndpoint.basicAuth.username,
        dasEndpoint.basicAuth.password
      )
    : undefined;

  const items: HeliusAsset[] = [];

  const maxPage = params?.limit
    ? Math.ceil(params.limit / LIMIT)
    : DEFAULT_MAX_PAGE;

  let page = 0;
  while (page < maxPage) {
    page += 1;
    const res = await axios.post<
      unknown,
      AxiosResponse<GetAssetsByOwnerOutput, unknown>,
      unknown
    >(
      dasEndpoint.url,
      {
        jsonrpc: '2.0',
        id: Math.random().toString(),
        method: 'getAssetsByOwner',
        params: {
          ownerAddress: owner,
          page,
          limit: LIMIT,
          sortBy: {
            sortBy: 'id',
            sortDirection: 'asc',
          },
          displayOptions: getDisplayOptions(params),
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          ...httpHeaders,
        },
      }
    );
    items.push(...res.data.result.items);
    if (res.data.result.total !== LIMIT) break;
  }
  return items;
}
