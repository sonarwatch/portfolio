import {
  apyToApr,
  formatMoveTokenAddress,
  getUsdValueSum,
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioLiquidity,
  TokenPrice,
  Yield,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  platformId,
  vaults,
  vaultsKey,
  vaultsPrefix,
  vaultsTvlKey,
} from './constants';
import { PositionField, Vault, VaultTvl } from './types';
import { getClientSui } from '../../utils/clients';
import { getDynamicFieldObject } from '../../utils/sui/getDynamicFieldObject';
import { ObjectResponse } from '../../utils/sui/types';
import { parseTypeString } from '../../utils/aptos';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import {
  formatAndCleanBigInt,
  convertDecimalStringToScaledBigInt,
} from './helpers';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const [vaultObjects, vaultTvls] = await Promise.all([
    cache.getItem<ObjectResponse<Vault>[]>(vaultsKey, {
      prefix: vaultsPrefix,
      networkId: NetworkId.sui,
    }),
    cache.getItem<VaultTvl[]>(vaultsTvlKey, {
      prefix: vaultsPrefix,
      networkId: NetworkId.sui,
    }),
  ]);

  if (!vaultObjects || !vaultTvls) return [];

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
        total_shares: v.data?.content?.fields.total_shares,
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

    const yields: Yield[] = [];

    if (a.shares) {
      let tvl: VaultTvl | undefined;
      vaultTvls.forEach((t) => {
        if (t.product_id === a.vault) {
          tvl = t;
        }
      });

      if (tvl) {
        const userActiveAmounts = formatAndCleanBigInt(
          (convertDecimalStringToScaledBigInt(a.shares, 6) *
            BigInt(tvl.USDC.amount_wei)) /
            BigInt(a.total_shares),
          18
        );

        if (Number(userActiveAmounts) > 0) {
          assets.push(
            tokenPriceToAssetToken(
              a.coinType,
              Number(userActiveAmounts) / 10 ** tokenPrice.decimals,
              NetworkId.sui,
              tokenPrice
            )
          );

          yields.push({
            apr: apyToApr(Number(tvl.pool_apy)),
            apy: Number(tvl.pool_apy),
          });
        }
      }
    }

    const pendingAmount = a.pending
      ? Number(a.pending) / 10 ** tokenPrice.decimals
      : undefined;
    if (pendingAmount) {
      assets.push(
        tokenPriceToAssetToken(
          a.coinType,
          pendingAmount,
          NetworkId.sui,
          tokenPrice,
          undefined,
          {}
        )
      );
      yields.push({
        apr: 0,
        apy: 0,
      });
    }

    const assetsValue = getUsdValueSum(assets.map((as) => as.value));
    const value = assetsValue;

    if (assets.length > 0) {
      const liquidities: PortfolioLiquidity[] = [
        {
          value,
          assets,
          assetsValue,
          rewardAssets: [],
          rewardAssetsValue: null,
          yields,
          name: vaults.find((v) => v.address === a.vault)?.vaultName,
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
    }
  });

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-positions`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
