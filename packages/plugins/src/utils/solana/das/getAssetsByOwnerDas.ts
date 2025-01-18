import { RpcEndpoint } from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import { DisplayOptions, GetAssetsByOwnerOutput, HeliusAsset } from './types';
import { getBasicAuthHeaders } from '../../misc/getBasicAuthHeaders';
import { getDisplayOptions } from './getDisplayOptions';

const limit = 1000;
const maxPage = 5;

export async function getAssetsByOwnerDas(
  dasEndpoint: RpcEndpoint,
  owner: string,
  displayOptions?: DisplayOptions
): Promise<HeliusAsset[]> {
  const httpHeaders = dasEndpoint.basicAuth
    ? getBasicAuthHeaders(
        dasEndpoint.basicAuth.username,
        dasEndpoint.basicAuth.password
      )
    : undefined;

  const items: HeliusAsset[] = [];
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
          limit,
          sortBy: {
            sortBy: 'id',
            sortDirection: 'asc',
          },
          displayOptions: getDisplayOptions(displayOptions),
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
    if (res.data.result.total !== limit) break;
  }
  return items;
}
