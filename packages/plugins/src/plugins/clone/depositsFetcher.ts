import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  Yield,
  getElementLendingValues,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, poolsKey } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getUserAccount } from './helpers';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';
import { userStruct } from './structs';
import { Pool } from './types';
import { usdcSolanaFactor, usdcSolanaMint } from '../../utils/solana';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const pda = getUserAccount(owner);

  const userAccount = await getParsedAccountInfo(client, userStruct, pda);
  if (!userAccount) return [];

  const pools = await cache.getItem<Pool[]>(poolsKey, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
  if (!pools) throw new Error('No pools cached');

  const tokenPriceById = await cache.getTokenPricesAsMap(
    [...pools.map((pool) => pool.assetInfo.onassetMint), usdcSolanaMint],
    NetworkId.solana
  );

  const usdcTokenPrice = tokenPriceById.get(usdcSolanaMint);

  const { borrows, comet } = userAccount;

  const elements: PortfolioElement[] = [];
  for (const borrow of borrows) {
    const {
      collateralAmount: borrowCollatAmount,
      borrowedOnasset,
      poolIndex,
    } = borrow;
    const pool = pools.at(poolIndex);
    if (!pool) continue;

    const tokenPrice = tokenPriceById.get(pool.assetInfo.onassetMint);
    if (!tokenPrice) continue;

    const borrowedAssets: PortfolioAsset[] = [];
    const borrowedYields: Yield[][] = [];
    const suppliedAssets: PortfolioAsset[] = [];
    const suppliedYields: Yield[][] = [];
    const rewardAssets: PortfolioAsset[] = [];

    if (!borrowCollatAmount.isZero()) {
      suppliedAssets.push(
        tokenPriceToAssetToken(
          usdcSolanaMint,
          borrowCollatAmount.dividedBy(usdcSolanaFactor).toNumber(),
          NetworkId.solana,
          usdcTokenPrice
        )
      );
    }

    if (!borrowedOnasset.isZero()) {
      borrowedAssets.push(
        tokenPriceToAssetToken(
          tokenPrice.address,
          borrowedOnasset.dividedBy(10 ** tokenPrice.decimals).toNumber(),
          NetworkId.solana,
          tokenPrice
        )
      );
    }

    if (suppliedAssets.length === 0 && borrowedAssets.length === 0) continue;

    const { borrowedValue, suppliedValue, value, healthRatio, rewardValue } =
      getElementLendingValues({ suppliedAssets, borrowedAssets, rewardAssets });

    elements.push({
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
        rewardAssets,
        rewardValue,
        value,
      },
    });
  }

  const { positions, collateralAmount } = comet;
  const borrowedAssets: PortfolioAsset[] = [];
  const borrowedYields: Yield[][] = [];
  const suppliedAssets: PortfolioAsset[] = [];
  const suppliedYields: Yield[][] = [];
  const rewardAssets: PortfolioAsset[] = [];
  if (!collateralAmount.isZero()) {
    suppliedAssets.push(
      tokenPriceToAssetToken(
        usdcSolanaMint,
        collateralAmount.dividedBy(usdcSolanaFactor).toNumber(),
        NetworkId.solana,
        usdcTokenPrice
      )
    );
  }

  for (const position of positions) {
    const amount = position.committedCollateralLiquidity;

    const pool = pools.at(position.poolIndex);
    if (!pool) continue;

    const tokenPrice = tokenPriceById.get(pool.assetInfo.onassetMint);
    if (!tokenPrice) continue;

    if (!amount.isZero()) {
      borrowedAssets.push(
        tokenPriceToAssetToken(
          tokenPrice.address,
          amount.dividedBy(10 ** tokenPrice.decimals).toNumber(),
          NetworkId.solana,
          tokenPrice
        )
      );
    }
  }
  if (suppliedAssets.length !== 0 && borrowedAssets.length !== 0) {
    const { borrowedValue, suppliedValue, value, healthRatio, rewardValue } =
      getElementLendingValues({ suppliedAssets, borrowedAssets, rewardAssets });

    elements.push({
      type: PortfolioElementType.borrowlend,
      networkId: NetworkId.solana,
      platformId,
      label: 'Lending',
      value,
      name: 'Comet',
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
  id: `${platformId}-deposits`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
