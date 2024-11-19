import {
  formatMoveTokenAddress,
  getUsdValueSum,
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioLiquidity,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import {
  alphaPoolsInfoKey,
  alphaToken,
  platformId,
  receiptTypes,
} from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getOwnedObjects } from '../../utils/sui/getOwnedObjects';
import { getClientSui } from '../../utils/clients';
import { AlphaPoolInfo, Receipt } from './types';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const balanceFactor = 10 ** 9;

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const [receipts, alphaPoolsInfo] = await Promise.all([
    getOwnedObjects<Receipt>(client, owner, {
      filter: {
        MatchAny: receiptTypes.map((t) => ({
          StructType: t,
        })),
      },
    }),
    cache.getItem<AlphaPoolInfo[]>(alphaPoolsInfoKey, {
      prefix: platformId,
      networkId: NetworkId.sui,
    }),
  ]);

  if (receipts.length === 0 || !alphaPoolsInfo) return [];

  const alphaPoolInfoById: Map<string, AlphaPoolInfo> = new Map();
  alphaPoolsInfo.forEach((pool) =>
    alphaPoolInfoById.set(pool.alphaPoolId, pool)
  );

  const mints: Set<string> = new Set();
  alphaPoolsInfo.forEach((aI) => {
    mints.add(aI.cointTypeA);
    if (aI.cointTypeB) mints.add(aI.cointTypeB);
  });

  const tokenPriceById = await cache.getTokenPricesAsMap(
    [...Array.from(mints), formatMoveTokenAddress(alphaToken)],
    NetworkId.sui
  );

  const elements: PortfolioElement[] = [];
  const cetusLiquidities: PortfolioLiquidity[] = [];
  const alphaAssets: PortfolioAsset[] = [];
  const naviAssets: PortfolioAsset[] = [];

  receipts.forEach((receipt) => {
    if (!receipt.data?.content?.fields.pool_id) return;

    const receiptInfo = receipt.data.content.fields;
    const alphaPoolInfo = alphaPoolInfoById.get(receiptInfo.pool_id);
    if (!alphaPoolInfo) return;

    // Single Vaults
    if (
      !alphaPoolInfo.cointTypeB ||
      !alphaPoolInfo.tokenAmountB ||
      !alphaPoolInfo.underlyingPoolId
    ) {
      const lockedShares = new BigNumber(receiptInfo.xTokenBalance).dividedBy(
        alphaPoolInfo.xTokenSupply
      );
      const unlockedShares = new BigNumber(
        receiptInfo.unlocked_xtokens
      ).dividedBy(alphaPoolInfo.xTokenSupply);

      const lockedAmount = lockedShares.multipliedBy(
        alphaPoolInfo.tokensInvested
      );

      const unlockedAmount = unlockedShares.multipliedBy(
        alphaPoolInfo.tokensInvested
      );

      const tokenPrice = tokenPriceById.get(
        formatMoveTokenAddress(alphaPoolInfo.cointTypeA)
      );
      if (!tokenPrice) return;

      // Alpha Vault
      if (alphaPoolInfo.unlockAt) {
        if (!lockedAmount.isZero())
          alphaAssets.push(
            tokenPriceToAssetToken(
              alphaPoolInfo.cointTypeA,
              lockedAmount.dividedBy(balanceFactor).toNumber(),
              NetworkId.sui,
              tokenPrice,
              undefined,
              { lockedUntil: alphaPoolInfo.unlockAt }
            )
          );
        if (!unlockedAmount.isZero())
          alphaAssets.push(
            tokenPriceToAssetToken(
              alphaPoolInfo.cointTypeA,
              unlockedAmount.dividedBy(balanceFactor).toNumber(),
              NetworkId.sui,
              tokenPrice,
              undefined,
              { isClaimable: true }
            )
          );
        // Navi Strategies
      } else if (!lockedAmount.isZero()) {
        naviAssets.push(
          tokenPriceToAssetToken(
            alphaPoolInfo.cointTypeA,
            lockedAmount.dividedBy(10 ** 9).toNumber(),
            NetworkId.sui,
            tokenPrice,
            undefined
          )
        );
      }
      // Cetus Strategies (2 tokens)
    } else {
      const [tokenPriceA, tokenPriceB] = [
        tokenPriceById.get(alphaPoolInfo.cointTypeA),
        tokenPriceById.get(alphaPoolInfo.cointTypeB),
      ];

      if (!tokenPriceA || !tokenPriceB) return;

      const assets: PortfolioAsset[] = [];

      const xTokenShares = new BigNumber(receiptInfo.xTokenBalance).dividedBy(
        alphaPoolInfo.xTokenSupply
      );

      assets.push(
        tokenPriceToAssetToken(
          alphaPoolInfo.cointTypeA,
          xTokenShares
            .times(alphaPoolInfo.tokenAmountA)
            .dividedBy(10 ** tokenPriceA.decimals)
            .toNumber(),
          NetworkId.sui,
          tokenPriceA
        )
      );
      assets.push(
        tokenPriceToAssetToken(
          alphaPoolInfo.cointTypeB,
          xTokenShares
            .times(alphaPoolInfo.tokenAmountB)
            .dividedBy(10 ** tokenPriceB.decimals)
            .toNumber(),
          NetworkId.sui,
          tokenPriceB
        )
      );
      cetusLiquidities.push({
        assets,
        assetsValue: getUsdValueSum(assets.map((a) => a.value)),
        rewardAssets: [],
        rewardAssetsValue: 0,
        value: getUsdValueSum(assets.map((a) => a.value)),
        yields: [],
      });
    }
  });

  if (cetusLiquidities.length !== 0)
    elements.push({
      type: 'liquidity',
      networkId: NetworkId.sui,
      platformId,
      name: 'LP Strategies',
      value: getUsdValueSum(cetusLiquidities.map((l) => l.value)),
      label: 'Deposit',
      data: { liquidities: cetusLiquidities },
    });

  if (alphaAssets.length !== 0)
    elements.push({
      type: 'multiple',
      networkId: NetworkId.sui,
      platformId,
      name: 'Alpha Vault',
      value: getUsdValueSum(alphaAssets.map((a) => a.value)),
      label: 'Vault',
      data: { assets: alphaAssets },
    });

  if (naviAssets.length !== 0)
    elements.push({
      type: 'multiple',
      networkId: NetworkId.sui,
      platformId,
      name: 'Single Token Strategies',
      value: getUsdValueSum(naviAssets.map((a) => a.value)),
      label: 'Deposit',
      data: { assets: naviAssets },
    });

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-positions`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
