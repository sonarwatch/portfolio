import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  TokenPrice,
  Yield,
  getElementLendingValues,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { evmContracts, platformId } from './constants';
import { getEvmClient } from '../../utils/clients';
import { balanceOfErc20ABI } from '../../utils/evm/erc20Abi';
import { poolsKey } from '../stargate/constants';
import { MaplePoolInfo } from './types';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getEvmClient(NetworkId.ethereum);

  const poolsInfo = await cache.getItem<MaplePoolInfo[]>(poolsKey, {
    prefix: platformId,
    networkId: NetworkId.ethereum,
  });

  if (!poolsInfo) return [];

  const tokensPrices = await cache.getTokenPrices(
    poolsInfo.map((p) => p.asset),
    NetworkId.ethereum
  );

  const tokenPriceById: Map<string, TokenPrice> = new Map();
  tokensPrices.forEach((tP) => (tP ? tokenPriceById.set(tP.address, tP) : []));

  const balancOfBase = {
    abi: balanceOfErc20ABI,
    functionName: 'balanceOf',
    args: [owner as `0x${string}`],
  } as const;

  const balanceOfContracts = [];
  for (const contract of evmContracts) {
    balanceOfContracts.push({
      ...balancOfBase,
      address: contract as `0x${string}`,
    } as const);
  }

  const balancesRes = await client.multicall({ contracts: balanceOfContracts });

  const elements: PortfolioElement[] = [];

  for (let i = 0; i < evmContracts.length; i++) {
    const balanceRes = balancesRes[i];
    if (balanceRes.status === 'failure') continue;
    if (balanceRes.result === BigInt(0)) continue;

    const poolInfo = poolsInfo[i];
    const { name, decimal, asset } = poolInfo;
    const tokenPrice = tokenPriceById.get(asset);
    if (!tokenPrice) continue;

    const borrowedAssets: PortfolioAsset[] = [];
    const borrowedYields: Yield[][] = [];
    const suppliedAssets: PortfolioAsset[] = [];
    const suppliedYields: Yield[][] = [];
    const rewardAssets: PortfolioAsset[] = [];

    const balance = new BigNumber(balanceRes.result.toString()).dividedBy(
      10 ** decimal
    );
    suppliedAssets.push(
      tokenPriceToAssetToken(
        asset,
        balance.toNumber(),
        NetworkId.ethereum,
        tokenPrice
      )
    );
    if (suppliedAssets.length === 0) continue;

    const { borrowedValue, suppliedValue, value, healthRatio, rewardValue } =
      getElementLendingValues({ suppliedAssets, borrowedAssets, rewardAssets });

    elements.push({
      type: PortfolioElementType.borrowlend,
      networkId: NetworkId.ethereum,
      platformId,
      label: 'Lending',
      value,
      name,
      data: {
        borrowedAssets,
        borrowedValue,
        borrowedYields,
        suppliedAssets,
        suppliedValue,
        suppliedYields,
        healthRatio,
        rewardAssets,
        rewardValue,
        value,
      },
    });
  }

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-ethereum`,
  networkId: NetworkId.ethereum,
  executor,
};

export default fetcher;
