import { EvmNetworkIdType } from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import { yearnApiUrl } from './constants';
import { VaultData, YearnConfig } from './types';
import { balanceOfErc20ABI } from '../../utils/evm/erc20Abi';
import { getEvmClient } from '../../utils/clients';

export async function getVaults(config: YearnConfig): Promise<VaultData[]> {
  if (!(config.network.id as EvmNetworkIdType)) return [];
  const allPoolsRes: AxiosResponse<VaultData[]> | null = await axios
    .get(`${yearnApiUrl}/${config.network.chainId}/vaults/all`)
    .catch(() => null);
  const allPoolsData = allPoolsRes?.data;

  if (!allPoolsData) return [];

  return allPoolsData;
}

export async function getBalances(
  evmNetworkId: EvmNetworkIdType,
  contracts: string[],
  owner: string
): Promise<bigint[]> {
  const client = getEvmClient(evmNetworkId);
  const balanceOfBase = {
    abi: balanceOfErc20ABI,
    args: [owner as `0x${string}`],
    functionName: balanceOfErc20ABI[0].name,
  } as const;

  const balancesRes = await client.multicall({
    contracts: contracts.map(
      (ctx) =>
        ({
          ...balanceOfBase,
          address: ctx as `0x${string}`,
        } as const)
    ),
  });

  return balancesRes.map((balance) =>
    balance.status === 'failure' ? BigInt(0) : balance.result
  );
}
