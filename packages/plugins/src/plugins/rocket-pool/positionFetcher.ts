import {
  NetworkId,
  PortfolioAssetToken,
  PortfolioAssetType,
  PortfolioElementType,
  ethereumNetwork,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import {
  minipoolManagerAddress,
  nodeStakingAddress,
  platformId,
  rplAddress,
  rplFactor,
} from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getEvmClient } from '../../utils/clients';
import { minipoolAbi, minipoolManagerAbi, nodeStakingAbi } from './abis';
import { ethFactor } from '../../utils/evm/constants';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getEvmClient(NetworkId.ethereum);
  const r = await client.readContract({
    abi: minipoolManagerAbi,
    address: minipoolManagerAddress,
    functionName: 'getNodeMinipoolCount',
    args: [owner as `0x${string}`],
  });
  const minipoolCount = Number(r);
  if (!minipoolCount) return [];

  const contracts = Array.from(Array(minipoolCount).keys()).map(
    (i) =>
      ({
        abi: minipoolManagerAbi,
        address: minipoolManagerAddress,
        functionName: 'getNodeMinipoolAt',
        args: [owner as `0x${string}`, i],
      } as const)
  );
  const nodeAddressResults = await client.multicall({ contracts });

  const getFinalisedContracts = nodeAddressResults
    .map((nodeAddressResult) => {
      if (nodeAddressResult.status === 'failure') return [];
      return {
        abi: minipoolAbi,
        address: nodeAddressResult.result as `0x${string}`,
        functionName: 'getFinalised',
        arg: [],
      } as const;
    })
    .flat();

  const getNodeDepositBalanceContracts = nodeAddressResults
    .map((nodeAddressResult) => {
      if (nodeAddressResult.status === 'failure') return [];
      return {
        abi: minipoolAbi,
        address: nodeAddressResult.result as `0x${string}`,
        functionName: 'getNodeDepositBalance',
        args: [],
      } as const;
    })
    .flat();

  const getNodeRPLStakePromise = client.readContract({
    abi: nodeStakingAbi,
    address: nodeStakingAddress,
    functionName: 'getNodeRPLStake',
    args: [owner as `0x${string}`],
  });
  const getFinalisedPromise = client.multicall({
    contracts: getFinalisedContracts,
  });
  const getNodeDepositBalancePromise = client.multicall({
    contracts: getNodeDepositBalanceContracts,
  });

  const [
    getFinalisedResults,
    getNodeDepositBalanceResults,
    getNodeRPLStakeResult,
  ] = await Promise.all([
    getFinalisedPromise,
    getNodeDepositBalancePromise,
    getNodeRPLStakePromise,
  ]);

  let ethAmountRaw = new BigNumber(0);
  getFinalisedResults.forEach((getFinalisedResult, i) => {
    const getNodeDepositBalanceResult = getNodeDepositBalanceResults[i];
    if (
      getFinalisedResult.status === 'failure' ||
      getFinalisedResult.result === true ||
      getNodeDepositBalanceResult.status === 'failure'
    )
      return;
    ethAmountRaw = ethAmountRaw.plus(
      (getNodeDepositBalanceResult.result as bigint).toString(10)
    );
  });
  if (ethAmountRaw.isZero()) return [];

  const ethTokenPrice = await cache.getTokenPrice(
    ethereumNetwork.native.address,
    NetworkId.ethereum
  );
  const ethPrice = ethTokenPrice?.price || null;
  const ethAmount = ethAmountRaw.div(ethFactor).toNumber();
  const ethValue = ethPrice ? ethAmount * ethPrice : null;

  const assets: PortfolioAssetToken[] = [
    {
      networkId: NetworkId.ethereum,
      type: PortfolioAssetType.token,
      attributes: {},
      data: {
        address: ethereumNetwork.native.address,
        amount: ethAmount,
        price: ethPrice,
      },
      value: ethValue,
    },
  ];

  const rplAmountRaw = new BigNumber(getNodeRPLStakeResult.toString());
  if (!rplAmountRaw.isZero()) {
    const rplTokenPrice = await cache.getTokenPrice(
      rplAddress,
      NetworkId.ethereum
    );
    const rplPrice = rplTokenPrice?.price || null;
    const rplAmount = rplAmountRaw.div(rplFactor).toNumber();
    const rplValue = rplPrice ? rplAmount * rplPrice : null;

    assets.push({
      networkId: NetworkId.ethereum,
      type: PortfolioAssetType.token,
      attributes: {},
      data: {
        address: rplAddress,
        amount: rplAmount,
        price: rplValue,
      },
      value: rplValue,
    });
  }

  return [
    {
      type: PortfolioElementType.multiple,
      networkId: NetworkId.ethereum,
      platformId,
      label: 'Staked',
      value: getUsdValueSum(assets.map((a) => a.value)),
      data: {
        assets,
      },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-minipools`,
  networkId: NetworkId.ethereum,
  executor,
};

export default fetcher;
