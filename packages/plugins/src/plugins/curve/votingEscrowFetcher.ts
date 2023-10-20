import {
  NetworkId,
  PortfolioElementLiquidity,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import {
  crvAddress,
  crvDecimals,
  platformId,
  votingEscrowAddress,
} from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getEvmClient } from '../../utils/clients';
import { votingEscrowAbi } from './abis';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { zeroBigInt } from '../../utils/misc/constants';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getEvmClient(NetworkId.ethereum);

  const lockedResponse = await client.readContract({
    abi: votingEscrowAbi,
    address: votingEscrowAddress,
    functionName: 'locked',
    args: [owner as `0x${string}`],
  });
  if (lockedResponse[0] === zeroBigInt) return [];

  const crvTokenPrice = await cache.getTokenPrice(
    crvAddress,
    NetworkId.ethereum
  );
  const amount = new BigNumber(lockedResponse[0].toString())
    .div(10 ** crvDecimals)
    .toNumber();
  const asset = tokenPriceToAssetToken(
    crvAddress,
    amount,
    NetworkId.ethereum,
    crvTokenPrice
  );
  const element: PortfolioElementLiquidity = {
    networkId: NetworkId.ethereum,
    label: 'Vesting',
    name: 'Voting Escrow',
    platformId,
    type: PortfolioElementType.liquidity,
    value: asset.value,
    data: {
      liquidities: [
        {
          assets: [asset],
          assetsValue: asset.value,
          rewardAssets: [],
          rewardAssetsValue: 0,
          value: asset.value,
          yields: [],
        },
      ],
    },
  };

  return [element];
};

const fetcher: Fetcher = {
  id: `${platformId}-voting-escrow`,
  networkId: NetworkId.ethereum,
  executor,
};

export default fetcher;
