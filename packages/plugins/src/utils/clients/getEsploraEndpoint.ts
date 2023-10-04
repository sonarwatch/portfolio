import { RpcEndpoint } from '@sonarwatch/portfolio-core';
import urlToRpcEndpoint from './urlToRpcEndpoint';

export default function getEsploraEndpoint(): RpcEndpoint {
  const endpoint =
    process.env['PORTFOLIO_ESPLORA_ENDPOINT'] ||
    'https://blockstream.info/api/';
  return urlToRpcEndpoint(endpoint);
}
