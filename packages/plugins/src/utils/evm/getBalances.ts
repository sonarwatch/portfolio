import { EvmNetworkIdType } from '@sonarwatch/portfolio-core';
import { getEvmClient } from '../clients';
import { erc20ABI } from './erc20Abi';
import { zeroBigInt } from '../misc/constants';

export async function getBalances(
  owner: `0x${string}`,
  addresses: `0x${string}`[],
  networkId: EvmNetworkIdType
) {
  const client = getEvmClient(networkId);
  const balances = await client.multicall({
    contracts: addresses.map((a) => ({
      abi: erc20ABI,
      address: a,
      functionName: 'balanceOf',
      args: [owner],
    })),
  });
  return balances.map((b) =>
    !b.result || b.result === zeroBigInt ? null : b.result
  );
}
