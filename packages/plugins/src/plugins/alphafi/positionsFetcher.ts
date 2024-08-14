import {
  formatMoveTokenAddress,
  getUsdValueSum,
  NetworkId,
  PortfolioAsset,
  PortfolioAssetAttributes,
  PortfolioElement,
  PortfolioElementMultiple,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import {
  alphaPoolReceiptType,
  alphaToken,
  cetusPoolMap,
  distinctReceiptTypes,
  platformId,
} from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getOwnedObjects } from '../../utils/sui/getOwnedObjects';
import { getClientSui } from '../../utils/clients';
import { Balance, Pool, Receipt } from './types';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import { ObjectResponse } from '../../utils/sui/types';
import { extractCointypesFromPool, getExchangeRate } from './helpers';
import tokenPriceToAssetTokens from '../../utils/misc/tokenPriceToAssetTokens';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const receipts = await getOwnedObjects<Receipt>(client, owner, {
    filter: {
      MatchAny: distinctReceiptTypes.map((t) => ({
        StructType: t,
      })),
    },
  });

  if (receipts.length === 0) return [];

  const pools = await multiGetObjects<Pool>(
    client,
    receipts
      .map((r) => r.data?.content?.fields.pool_id)
      .filter((p) => p !== null) as string[]
  ).then((arrPools) => {
    const poolsByKey = new Map<string, ObjectResponse<Pool>>();
    arrPools.forEach((item) => {
      if (!item) return;
      poolsByKey.set(item.data?.content?.fields.id.id as string, item);
    });
    return poolsByKey;
  });

  const elements: PortfolioElement[] = [];

  const positions: { name: string; balances: Balance[] }[] = [];

  receipts.forEach((receipt) => {
    if (
      !receipt.data?.content?.fields.pool_id ||
      !receipt.data?.content?.fields.xTokenBalance
    )
      return;
    const pool = pools.get(receipt.data?.content?.fields.pool_id);
    if (!pool || !pool.data?.type || !pool.data?.content?.fields) return;

    const depositedCoinTypes = extractCointypesFromPool(pool.data?.type);
    const exchangeRate = getExchangeRate(pool.data?.content?.fields);

    const balances: Balance[] = [];

    let totalLockedXTokens = new BigNumber(0);
    let totalUnlockedXTokens = new BigNumber(0);

    if (receipt.data?.type === alphaPoolReceiptType) {
      // alpha vault

      const xTokens = new BigNumber(receipt.data.content.fields.xTokenBalance);
      const bal = new BigNumber(
        Number(receipt.data.content.fields.unlocked_xtokens) *
          exchangeRate.toNumber()
      );
      totalLockedXTokens = totalLockedXTokens.plus(xTokens.minus(bal));

      const lockedTokens = totalLockedXTokens
        .div(1e9)
        .multipliedBy(exchangeRate);

      balances.push({
        coinType: alphaToken,
        balance: lockedTokens,
        locked: true,
      });

      const bal2 = BigNumber(
        receipt.data.content.fields.unlocked_xtokens
      ).multipliedBy(exchangeRate);
      totalUnlockedXTokens = totalUnlockedXTokens.plus(bal2);

      const unlockedTokens = totalUnlockedXTokens
        .div(1e9)
        .multipliedBy(exchangeRate);

      balances.push({
        coinType: alphaToken,
        balance: unlockedTokens,
        locked: false,
      });
    } else {
      totalUnlockedXTokens = totalUnlockedXTokens.plus(
        receipt.data.content.fields.xTokenBalance
      );
      const unlockedTokens = totalUnlockedXTokens
        .div(1e9)
        .multipliedBy(exchangeRate);

      let coinType;
      if (receipt.data?.type.includes('cetus')) {
        coinType = cetusPoolMap[pool.data.objectId];
      } else if (receipt.data?.type.includes('navi')) {
        [coinType] = depositedCoinTypes;
      }

      if (coinType)
        balances.push({
          coinType,
          balance: unlockedTokens,
        });
    }

    positions.push({
      name: receipt.data?.content.fields.name,
      balances,
    });
  });

  const tokenPrices = await cache.getTokenPricesAsMap(
    positions
      .map((p) => p.balances)
      .flat()
      .map((b) => formatMoveTokenAddress(b.coinType)),
    NetworkId.sui
  );

  positions.forEach((position) => {
    const assets: PortfolioAsset[] = [];

    position.balances.forEach((balance) => {
      if (balance.balance.isZero()) return;
      const tokenPrice = tokenPrices.get(
        formatMoveTokenAddress(balance.coinType)
      );
      if (!tokenPrice) return;

      const attributes: PortfolioAssetAttributes = {};

      if (balance.locked !== undefined)
        attributes['isClaimable'] = !balance.locked;

      assets.push(
        ...tokenPriceToAssetTokens(
          balance.coinType,
          balance.balance.toNumber(),
          NetworkId.sui,
          tokenPrice,
          undefined,
          attributes
        )
      );
    });

    if (assets.length === 0) return;

    const element: PortfolioElementMultiple = {
      type: 'multiple',
      networkId: NetworkId.sui,
      platformId,
      value: getUsdValueSum(assets.map((a) => a.value)),
      label: 'Deposit',
      name: position.name,
      data: { assets },
    };

    elements.push(element);
  });

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-positions`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
