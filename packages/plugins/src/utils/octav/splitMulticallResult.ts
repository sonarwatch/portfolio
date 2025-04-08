import {
  ContractFunctionConfig,
  MulticallReturnType,
  PublicClient,
} from 'viem';

export const executeAndSplitMulticall = async <
  TContracts extends ContractFunctionConfig[]
>(
  client: PublicClient,
  contracts: readonly [...TContracts]
): Promise<
  [MulticallReturnType<TContracts>, MulticallReturnType<TContracts>]
> => {
  const results = await client.multicall({
    contracts: [...contracts] as TContracts,
    allowFailure: true,
  });

  const evenIndexed = results.filter(
    (_, i) => i % 2 === 0
  ) as MulticallReturnType<TContracts>;
  const oddIndexed = results.filter(
    (_, i) => i % 2 === 1
  ) as MulticallReturnType<TContracts>;
  return [evenIndexed, oddIndexed];
};
