import {
  PortfolioAssetToken,
  PortfolioElementType,
  PortfolioLiquidity,
} from '@sonarwatch/portfolio-core';
import { getEvmClient } from '../../utils/clients';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { Cache } from '../../Cache';
import { lockedAbi } from './abis';
import { platformId } from './constants';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { StgConfig } from './types';

export function getVoteTokensFetcher(config: StgConfig): Fetcher {
  const { networkId, votingEscrow, stgAddress } = config;
  const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    const client = getEvmClient(networkId);

    const contract = {
      address: votingEscrow,
      abi: lockedAbi,
      functionName: 'locked',
      args: [owner as `0x${string}`],
    } as const;
    const [balance, lockedUntil] = await client.readContract(contract);
    if (balance === BigInt(0)) return [];

    const tokenPrice = await cache.getTokenPrice(stgAddress, networkId);
    if (!tokenPrice) return [];

    const amountLocked = Number(balance) / 10 ** tokenPrice.decimals;

    const assets: PortfolioAssetToken[] = [
      {
        ...tokenPriceToAssetToken(
          stgAddress,
          amountLocked,
          networkId,
          tokenPrice,
          tokenPrice.price
        ),
        attributes: {
          lockedUntil: Number(lockedUntil),
        },
      },
    ];
    const value = amountLocked * tokenPrice.price;

    const liquidity: PortfolioLiquidity = {
      assets,
      assetsValue: value,
      value,
      yields: [],
      rewardAssets: [],
      rewardAssetsValue: null,
    };

    return [
      {
        networkId,
        platformId,
        label: 'Vesting',
        type: PortfolioElementType.liquidity,
        data: { liquidities: [liquidity] },
        value,
        name: 'Voting Escrow',
      },
    ];
  };
  return {
    executor,
    networkId,
    id: `${platformId}-${networkId}-vesting`,
  };
}
