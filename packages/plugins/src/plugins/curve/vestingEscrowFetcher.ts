import {
  NetworkId,
  PortfolioElementLiquidity,
  PortfolioElementType,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import {
  crvAddress,
  crvDecimals,
  platformId,
  vestingEscrowAddress,
} from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getEvmClient } from '../../utils/clients';
import { vestingEscrowAbi } from './abis';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { zeroBigInt } from '../../utils/misc/constants';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getEvmClient(NetworkId.ethereum);

  const multicallResponse = await client.multicall({
    contracts: [
      {
        abi: vestingEscrowAbi,
        address: vestingEscrowAddress,
        functionName: 'lockedOf',
        args: [owner as `0x${string}`],
      },
      {
        abi: vestingEscrowAbi,
        address: vestingEscrowAddress,
        functionName: 'balanceOf',
        args: [owner as `0x${string}`],
      },
    ],
  });
  const lockedOfAmount =
    multicallResponse[0].status === 'success'
      ? multicallResponse[0].result
      : zeroBigInt;
  const balanceOfAmount =
    multicallResponse[1].status === 'success'
      ? multicallResponse[1].result
      : zeroBigInt;

  if (
    lockedOfAmount === zeroBigInt &&
    (!balanceOfAmount || balanceOfAmount === zeroBigInt)
  )
    return [];

  const crvTokenPrice = await cache.getTokenPrice(
    crvAddress,
    NetworkId.ethereum
  );
  const lockedAmount = new BigNumber(lockedOfAmount.toString())
    .div(10 ** crvDecimals)
    .toNumber();

  let balanceAmount = 0;
  if (balanceOfAmount)
    balanceAmount = new BigNumber(balanceOfAmount.toString())
      .div(10 ** crvDecimals)
      .toNumber();

  const lockedAsset = tokenPriceToAssetToken(
    crvAddress,
    lockedAmount,
    NetworkId.ethereum,
    crvTokenPrice
  );
  const balanceAsset = tokenPriceToAssetToken(
    crvAddress,
    balanceAmount,
    NetworkId.ethereum,
    crvTokenPrice
  );

  const value = getUsdValueSum([lockedAsset.value, balanceAsset.value]);
  const element: PortfolioElementLiquidity = {
    networkId: NetworkId.ethereum,
    label: 'Vesting',
    name: 'Vesting Escrow',
    platformId,
    type: PortfolioElementType.liquidity,
    value,
    data: {
      liquidities: [
        {
          assets: [balanceAsset],
          assetsValue: balanceAsset.value,
          rewardAssets: [lockedAsset],
          rewardAssetsValue: lockedAsset.value,
          value,
          yields: [],
        },
      ],
    },
  };

  return [element];
};

const fetcher: Fetcher = {
  id: `${platformId}-vesting-escrow`,
  networkId: NetworkId.ethereum,
  executor,
};

export default fetcher;
