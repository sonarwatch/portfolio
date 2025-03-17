import { EvmNetworkIdType } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { getAddress } from 'viem';
import { getEvmClient } from '../../../utils/clients';
import { liquidityGaugeAbi } from '../abi';

export async function getOwnerBalRewards(
  networkId: EvmNetworkIdType,
  owner: string,
  gaugeAddress: string
): Promise<{
  address: string;
  balance: BigNumber;
}> {
  const client = getEvmClient(networkId);

  const [balance, address] = (
    await client.multicall({
      contracts: [
        {
          address: getAddress(gaugeAddress),
          abi: liquidityGaugeAbi,
          functionName: 'claimable_tokens',
          args: [getAddress(owner)],
        },
        {
          address: getAddress(gaugeAddress),
          abi: liquidityGaugeAbi,
          functionName: 'bal_token',
        },
      ],
    })
  ).map((result) => result.result) as [bigint, string];

  return {
    balance: new BigNumber(balance.toString()),
    address,
  };
}
