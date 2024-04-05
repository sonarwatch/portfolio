import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
  PortfolioLiquidity,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { farmsKey, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedMultipleAccountsInfo } from '../../utils/solana';
import { farmAccountStruct } from './struct';
import getTokenPricesMap from '../../utils/misc/getTokensPricesMap';
import tokenPriceToAssetTokens from '../../utils/misc/tokenPriceToAssetTokens';
import { Farm } from './types';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getStakingAccounts } from './helpers';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const farmsInfo = await cache.getItem<Farm[]>(farmsKey, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
  if (!farmsInfo) return [];

  const farmById: Map<string, Farm> = new Map();
  const farmsMint: string[] = [];
  farmsInfo.forEach((farm) => {
    farmById.set(farm.pubkey, farm);
    farmsMint.push(farm.pubkey);
  });

  const farmingAccountsAddresses = getStakingAccounts(owner, farmsMint);

  const farmingAccounts = await getParsedMultipleAccountsInfo(
    client,
    farmAccountStruct,
    farmingAccountsAddresses
  );

  const tokenPriceById = await getTokenPricesMap(
    farmsInfo.map((f) => [f.stakingMint, f.rewardAMint, f.rewardBMint]).flat(),
    NetworkId.solana,
    cache
  );
  const liquidities: PortfolioLiquidity[] = [];
  for (const farmingAccount of farmingAccounts) {
    if (!farmingAccount) continue;

    const rewardAssets: PortfolioAsset[] = [];
    const assets: PortfolioAsset[] = [];
    const { balanceStaked, rewardAPerTokenPending, rewardBPerTokenPending } =
      farmingAccount;
    const farmInfo = farmById.get(farmingAccount.pool.toString());
    if (!farmInfo) continue;

    const { stakingMint, rewardAMint, rewardBMint } = farmInfo;

    const [poolTokenPrice, rewardATokenPrice, rewardBTokenPrice] = [
      tokenPriceById.get(stakingMint),
      tokenPriceById.get(rewardAMint),
      tokenPriceById.get(rewardBMint),
    ];

    if (!poolTokenPrice) continue;
    const amount = balanceStaked.dividedBy(10 ** poolTokenPrice.decimals);
    assets.push(
      ...tokenPriceToAssetTokens(
        poolTokenPrice.address,
        amount.toNumber(),
        NetworkId.solana,
        poolTokenPrice
      )
    );
    if (rewardAPerTokenPending.isGreaterThan(0) && rewardATokenPrice) {
      const rewardAmount = rewardAPerTokenPending
        .dividedBy(10 ** rewardATokenPrice.decimals)
        .toNumber();
      rewardAssets.push(
        tokenPriceToAssetToken(
          rewardAMint,
          rewardAmount,
          NetworkId.solana,
          rewardATokenPrice
        )
      );
    }
    if (rewardBPerTokenPending.isGreaterThan(0) && rewardBTokenPrice) {
      const rewardAmount = rewardBPerTokenPending
        .dividedBy(10 ** rewardBTokenPrice.decimals)
        .toNumber();
      rewardAssets.push(
        tokenPriceToAssetToken(
          rewardBMint,
          rewardAmount,
          NetworkId.solana,
          rewardBTokenPrice
        )
      );
    }
    const assetsValue = getUsdValueSum(assets.map((a) => a.value));
    const rewardAssetsValue = getUsdValueSum(rewardAssets.map((r) => r.value));
    const value = getUsdValueSum([assetsValue, rewardAssetsValue]);

    if (value === 0) continue;

    const liquidity: PortfolioLiquidity = {
      value,
      assets,
      assetsValue,
      rewardAssets,
      rewardAssetsValue,
      yields: [],
    };
    liquidities.push(liquidity);
  }

  if (liquidities.length === 0) return [];

  return [
    {
      networkId: NetworkId.solana,
      platformId,
      type: PortfolioElementType.liquidity,
      label: 'Farming',
      value: getUsdValueSum(liquidities.map((l) => l.value)),
      data: {
        liquidities,
      },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-farms`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
