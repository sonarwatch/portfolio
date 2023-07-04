import { RpcEndpoint } from '@sonarwatch/portfolio-core';
import { URL } from 'node:url';

export default function urlToRpcEndpoint(url: string): RpcEndpoint {
  const nUrl = new URL(url);
  const isBasicAuth =
    nUrl.username && nUrl.username !== '' && nUrl.password && nUrl.password !== '';
  const basicAuth = isBasicAuth
    ? {
        username: nUrl.username,
        password: nUrl.password,
      }
    : undefined;

  return {
    url: `${nUrl.origin}${nUrl.pathname}${nUrl.search}`,
    basicAuth,
  };
}
