import { EvmNetworkIdType } from '@sonarwatch/portfolio-core';
import { getEvmClient } from '../clients';
import { balanceOfErc20ABI } from './erc20Abi';
import { zeroBigInt } from '../misc/constants';

export async function getBalances(
  owner: string,
  addresses: string[],
  networkId: EvmNetworkIdType
): Promise<(bigint | null)[]> {
  const client = getEvmClient(networkId);
  const balances = await client.multicall({
    contracts: addresses.map((a) => ({
      abi: balanceOfErc20ABI,
      address: a as `0x${string}`,
      functionName: 'balanceOf',
      args: [owner as `0x${string}`],
    })),
  });
  return balances.map((b) =>
    !b.result || b.result === zeroBigInt ? null : b.result
  );
}
