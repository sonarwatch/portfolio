import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { abi } from './abis';
import { Cache } from '../../Cache';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { platformId, stakerCake } from './constants';
import { getEvmClient } from '../../utils/clients';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const networkId = NetworkId.bnb;
  const client = getEvmClient(networkId);
  const address = owner as `0x${string}`;
  const stakerBalanceContracts = [];
  for (const stakerInfo of stakerCake) {
    const stakerBalanceContract = {
      abi: [abi.userInfos],
      address: stakerInfo.contract as `0x${string}`,
      functionName: abi.userInfos.name,
      args: [address],
    } as const;
    stakerBalanceContracts.push(stakerBalanceContract);
  }

  const stakersBalancesRes = await client.multicall({
    contracts: stakerBalanceContracts,
  });

  const cakeTokenPrice = await cache.getTokenPrice(
    '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    networkId
  );
  if (!cakeTokenPrice) return [];

  const assets: PortfolioAsset[] = [];
  for (let i = 0; i < stakerCake.length; i++) {
    const balanceRes = stakersBalancesRes[i];

    if (balanceRes.status === 'failure') continue;
    if (balanceRes.result[8] === BigInt(0)) continue;

    const amount = new BigNumber(balanceRes.result[8].toString())
      .dividedBy(10 ** stakerCake[i].decimals)
      .toNumber();

    assets.push(
      tokenPriceToAssetToken(
        cakeTokenPrice.address,
        amount,
        networkId,
        cakeTokenPrice
      )
    );
  }

  if (assets.length === 0) return [];

  return [
    {
      networkId,
      label: 'Staked',
      platformId,
      type: PortfolioElementType.multiple,
      value: getUsdValueSum(assets.map((a) => a.value)),
      data: {
        assets,
      },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-stakerCake-${NetworkId.bnb}`,
  networkId: NetworkId.bnb,
  executor,
};

export default fetcher;
