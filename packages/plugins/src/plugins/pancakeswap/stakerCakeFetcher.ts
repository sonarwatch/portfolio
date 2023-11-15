import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { stakersAbi } from './abis';
import { Cache } from '../../Cache';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { platformId, stakerCake } from './constants';
import { getEvmClient } from '../../utils/clients';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const networkId = NetworkId.bnb;
  const client = getEvmClient(networkId);
  const address = owner as `0x${string}`;
  const userInfosContracts = [];
  const balanceOfContracts = [];
  const totalSharesContracts = [];
  for (const stakerInfo of stakerCake) {
    const userInfoContract = {
      abi: [stakersAbi.userInfos],
      address: stakerInfo.contract as `0x${string}`,
      functionName: stakersAbi.userInfos.name,
      args: [address],
    } as const;

    const balanceOfContract = {
      abi: [stakersAbi.balanceOf],
      address: stakerInfo.contract as `0x${string}`,
      functionName: stakersAbi.balanceOf.name,
    } as const;

    const totalSharesContract = {
      abi: [stakersAbi.totalShares],
      address: stakerInfo.contract as `0x${string}`,
      functionName: stakersAbi.totalShares.name,
    } as const;

    userInfosContracts.push(userInfoContract);
    balanceOfContracts.push(balanceOfContract);
    totalSharesContracts.push(totalSharesContract);
  }

  const [userInfosRes, balancesOfRes, totalsSharesRes] = await Promise.all([
    client.multicall({
      contracts: userInfosContracts,
    }),
    client.multicall({
      contracts: balanceOfContracts,
    }),
    client.multicall({
      contracts: totalSharesContracts,
    }),
  ]);

  const cakeTokenPrice = await cache.getTokenPrice(
    '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    networkId
  );
  if (!cakeTokenPrice) return [];

  const assets: PortfolioAsset[] = [];
  for (let i = 0; i < stakerCake.length; i++) {
    const userInfoRes = userInfosRes[i];
    const balanceOfRes = balancesOfRes[i];
    const totalSharesRes = totalsSharesRes[i];

    if (
      userInfoRes.status === 'failure' ||
      balanceOfRes.status === 'failure' ||
      totalSharesRes.status === 'failure'
    )
      continue;
    if (userInfoRes.result[0] === BigInt(0)) continue;

    const amount = new BigNumber(balanceOfRes.result.toString())
      .multipliedBy(userInfoRes.result[0].toString())
      .dividedBy(totalSharesRes.result.toString())
      .minus(userInfoRes.result[6].toString())
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
