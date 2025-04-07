import { EvmNetworkIdType } from '@sonarwatch/portfolio-core';
import { ContractFunctionConfig } from 'viem';
import { getEvmClient } from '../clients';
import { balanceOfErc20ABI } from './erc20Abi';
import { zeroBigInt } from '../misc/constants';
import { stkAbi } from '../../plugins/aave/abi';

export async function getBalances(
  owner: string,
  addresses: string[],
  networkId: EvmNetworkIdType
): Promise<(bigint | null)[]> {
  const client = getEvmClient(networkId);
  const balances = await client.multicall({
    contracts: addresses.map<ContractFunctionConfig<typeof balanceOfErc20ABI>>(
      (a) => ({
        abi: balanceOfErc20ABI,
        address: a as `0x${string}`,
        functionName: 'balanceOf',
        args: [owner as `0x${string}`],
      })
    ),
  });
  return balances.map((b) =>
    !b.result || b.result === zeroBigInt ? null : b.result
  );
}
