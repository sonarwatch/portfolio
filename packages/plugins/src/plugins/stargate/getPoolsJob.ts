import { zeroAddress } from 'viem';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getEvmClient } from '../../utils/clients';
import { platformId, poolsKey } from './constants';
import { allPoolsAbi, allPoolsLengthAbi, decimalsAbi, tokenAbi } from './abis';
import { StgConfig } from './types';

export function getPoolsJob(config: StgConfig) {
  const { poolsContract: address, networkId } = config;

  const executor: JobExecutor = async (cache: Cache) => {
    const client = getEvmClient(networkId);
    const contract = {
      address,
      abi: allPoolsLengthAbi,
      functionName: 'allPoolsLength',
    } as const;
    const poolsLength = await client.readContract(contract);

    const poolsAddressesContracts = [];
    for (let i = BigInt(0); i < Number(poolsLength); i++) {
      poolsAddressesContracts.push({
        address,
        abi: allPoolsAbi,
        functionName: 'allPools',
        args: [i],
      } as const);
    }
    const results = await client.multicall({
      contracts: poolsAddressesContracts,
    });
    const poolsAddresses = results
      .map((res) => (res.status === 'failure' ? [] : res.result))
      .flat();

    const tokensAddressesContracts = poolsAddresses.map(
      (poolAd) =>
        ({
          address: poolAd,
          abi: tokenAbi,
          functionName: 'token',
        } as const)
    );
    const tokensAddressesResults = await client.multicall({
      contracts: tokensAddressesContracts,
    });

    const tokensAddresses = tokensAddressesResults
      .map((res) => (res.status === 'failure' ? '0' : res.result))
      .flat();

    const poolsDecimalsContract = poolsAddresses.map(
      (poolAd) =>
        ({
          address: poolAd,
          abi: decimalsAbi,
          functionName: 'decimals',
        } as const)
    );
    const decimalsResults = await client.multicall({
      contracts: poolsDecimalsContract,
    });

    const poolsDecimals = decimalsResults.map((res) =>
      res.status === 'failure' ? -1 : res.result
    );

    // handle ETH specific case
    poolsAddresses.push('0x72e2f4830b9e45d52f80ac08cb2bec0fef72ed9c');
    tokensAddresses.push(zeroAddress);

    const tokensPrices = await cache.getTokenPrices(tokensAddresses, networkId);

    for (let i = 0; i < poolsAddresses.length; i++) {
      const tokenPrice = tokensPrices[i];
      if (!tokenPrice) continue;

      const poolAddress = poolsAddresses[i];
      const poolDecimals = poolsDecimals[i];
      if (poolDecimals === -1) continue;

      const { price } = tokenPrice;

      await cache.setTokenPriceSource({
        address: poolAddress,
        decimals: Number(poolDecimals),
        id: platformId,
        networkId,
        platformId,
        price,
        timestamp: Date.now(),
        weight: 1,
        underlyings: [
          {
            address: tokenPrice.address,
            amountPerLp: 1,
            decimals: tokenPrice.decimals,
            networkId,
            price: tokenPrice.price,
          },
        ],
      });
    }
    await cache.setItem(poolsKey, poolsAddresses, {
      prefix: platformId,
      networkId,
    });
  };

  const job: Job = {
    id: `${platformId}-${networkId}-pools`,
    executor,
    labels: ['normal', 'evm', networkId],
  };
  return job;
}
