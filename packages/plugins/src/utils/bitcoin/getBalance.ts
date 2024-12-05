import axios from 'axios';
import { RpcEndpoint, bitcoinNetwork } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';

const bnFactor = new BigNumber(10 ** bitcoinNetwork.native.decimals);

interface MempoolApiAddressResponse {
  address: string;
  chain_stats: Stats;
  mempool_stats: Stats;
}
interface Stats {
  funded_txo_count: number;
  funded_txo_sum: number;
  spent_txo_count: number;
  spent_txo_sum: number;
  tx_count: number;
}

export async function getBalance(rpcEndpoint: RpcEndpoint, owner: string) {
  const auth = rpcEndpoint.basicAuth
    ? {
        username: rpcEndpoint.basicAuth.username,
        password: rpcEndpoint.basicAuth.password,
      }
    : undefined;

  const response = await axios.get<MempoolApiAddressResponse>(
    `/address/${owner}`,
    {
      baseURL: rpcEndpoint.url,
      auth,
      timeout: 22000,
    }
  );
  return new BigNumber(response.data.chain_stats.funded_txo_sum)
    .minus(response.data.chain_stats.spent_txo_sum)
    .div(bnFactor)
    .toNumber();
}
