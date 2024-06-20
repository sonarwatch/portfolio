import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
  Yield,
  getElementLendingValues,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { poolStruct } from './structs/pool';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getPoolPda } from './helpers';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  // Trying to get https://solscan.io/account/4g5zooignaoVrS6NdUWEcNLxZmJGN9UJBAGtrUiBwieF

  const poolAccount = await getParsedAccountInfo(
    client,
    poolStruct,
    getPoolPda(owner)
  );
  if (!poolAccount || poolAccount.totalAmount.isZero()) return [];

  const tokenPrice = await cache.getTokenPrice(
    poolAccount.currency.toString(),
    NetworkId.solana
  );
  if (!tokenPrice) return [];

  const borrowedAssets: PortfolioAsset[] = [];
  const borrowedYields: Yield[][] = [];
  const suppliedAssets: PortfolioAsset[] = [];
  const suppliedYields: Yield[][] = [];
  const rewardAssets: PortfolioAsset[] = [];

  const amount = poolAccount.totalAmount
    .dividedBy(10 ** tokenPrice.decimals)
    .toNumber();
  suppliedAssets.push(
    tokenPriceToAssetToken(
      tokenPrice.address,
      amount,
      NetworkId.solana,
      tokenPrice
    )
  );

  if (suppliedAssets.length === 0 && borrowedAssets.length === 0) return [];

  const { borrowedValue, healthRatio, rewardValue, suppliedValue, value } =
    getElementLendingValues({ suppliedAssets, borrowedAssets, rewardAssets });

  return [
    {
      type: PortfolioElementType.borrowlend,
      networkId: NetworkId.solana,
      platformId,
      label: 'Lending',
      value,
      data: {
        borrowedAssets,
        borrowedValue,
        borrowedYields,
        suppliedAssets,
        suppliedValue,
        suppliedYields,
        healthRatio,
        rewardValue,
        rewardAssets,
        value,
      },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-pools`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
