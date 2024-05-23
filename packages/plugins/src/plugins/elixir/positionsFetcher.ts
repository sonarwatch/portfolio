import {
  formatMoveTokenAddress,
  getUsdValueSum,
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioLiquidity,
  TokenPrice,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, vaults, vaultsKey, vaultsPrefix } from './constants';
import { PositionField, Vault } from './types';
import { getClientSui } from '../../utils/clients';
import { getDynamicFieldObject } from '../../utils/sui/getDynamicFieldObject';
import { ObjectResponse } from '../../utils/sui/types';
import { parseTypeString } from '../../utils/aptos';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const vaultObjects = await cache.getItem<ObjectResponse<Vault>[]>(vaultsKey, {
    prefix: vaultsPrefix,
    networkId: NetworkId.sui,
  });

  if (!vaultObjects) return [];

  const activeShares = await Promise.all(
    vaultObjects.map(async (v) => {
      if (!v.data?.content) return null;

      const [userSharesFields, userPendingWithdrawalsFields] =
        await Promise.all([
          getDynamicFieldObject<PositionField>(client, {
            parentId: v.data?.content?.fields.user_shares.fields.id.id,
            name: {
              type: 'address',
              value: owner,
            },
          }),
          getDynamicFieldObject<PositionField>(client, {
            parentId:
              v.data?.content?.fields.user_pending_withdrawals.fields.id.id,
            name: {
              type: 'address',
              value: owner,
            },
          }),
        ]);

      if (!userSharesFields && !userPendingWithdrawalsFields) return null;

      if (userSharesFields.error && userPendingWithdrawalsFields.error)
        return null;

      if (!v.data?.type) return null;

      const { keys: coinType } = parseTypeString(v.data?.type);

      if (!coinType) return null;

      return {
        vault: v.data?.content?.fields.id.id,
        shares: userSharesFields.data?.content?.fields.value,
        pending: userPendingWithdrawalsFields.data?.content?.fields.value,
        coinType: coinType[0].type,
      };
    })
  ).then((dfs) => dfs.filter((df) => df !== null));

  const coinsTypes: string[] = [];
  activeShares.forEach((a) => {
    if (
      a &&
      a.coinType &&
      !coinsTypes.includes(formatMoveTokenAddress(a.coinType))
    )
      coinsTypes.push(formatMoveTokenAddress(a.coinType));
  });
  const tokenPrices: Map<string, TokenPrice> = await cache.getTokenPricesAsMap(
    coinsTypes,
    NetworkId.sui
  );

  const elements: PortfolioElement[] = [];

  activeShares.forEach((a) => {
    const assets: PortfolioAsset[] = [];

    if (!a) return;

    const tokenPrice = tokenPrices.get(formatMoveTokenAddress(a.coinType));

    if (!tokenPrice) return;

    if (a.shares)
      assets.push(
        tokenPriceToAssetToken(
          formatMoveTokenAddress(a.coinType),
          Number(a.shares) / 10 ** tokenPrice.decimals,
          NetworkId.sui,
          tokenPrice
        )
      );

    if (a.pending)
      assets.push(
        tokenPriceToAssetToken(
          formatMoveTokenAddress(a.coinType),
          Number(a.pending) / 10 ** tokenPrice.decimals,
          NetworkId.sui,
          tokenPrice,
          undefined,
          {
            isClaimable: true,
          }
        )
      );

    const assetsValue = getUsdValueSum(assets.map((as) => as.value));
    const value = assetsValue;

    let name;
    vaults.forEach((v) => {
      if (v.address === a.vault) name = v.vaultDisplayName;
    });

    const liquidities: PortfolioLiquidity[] = [
      {
        value,
        assets,
        assetsValue,
        rewardAssets: [],
        rewardAssetsValue: null,
        yields: [],
        name,
      },
    ];

    elements.push({
      type: 'liquidity',
      data: { liquidities },
      label: 'LiquidityPool',
      networkId: NetworkId.sui,
      platformId,
      value: getUsdValueSum(liquidities.map((liq) => liq.value)),
    });
  });

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-positions`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
