import { RpcEndpoint } from '@sonarwatch/portfolio-core';
import urlToRpcEndpoint from './urlToRpcEndpoint';

export default function getSolanaDasEndpoint(): RpcEndpoint {
  const endpoint =
    process.env['PORTFOLIO_SOLANA_DAS_ENDPOINT'] ||
    'https://api.mainnet-beta.solana.com';
  return urlToRpcEndpoint(endpoint);
}
