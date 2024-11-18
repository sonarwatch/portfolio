import {
  NetworkId,
  yieldFromApy,
  parseTypeString,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
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
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

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

  const elementRegistry = new ElementRegistry(NetworkId.sui, platformId);

  activeShares.forEach((a) => {
    if (!a) return;

    const element = elementRegistry.addElementLiquidity({
      label: 'LiquidityPool',
    });
    const liquidity = element.addLiquidity({
      name: vaults.find((v) => v.address === a.vault)?.vaultName,
    });

    if (a.shares) {
      let tvl: VaultTvl | undefined;
      vaultTvls.forEach((t) => {
        if (t.product_id === a.vault) {
          tvl = t;
        }
      });

      if (tvl) {
        const userActiveAmounts = new BigNumber(a.shares)
          .multipliedBy(new BigNumber(tvl.USDC.amount_wei).dividedBy(10 ** 27))
          .dividedBy(a.total_shares);

        if (userActiveAmounts.gt(0)) {
          liquidity.addAsset({
            address: a.coinType,
            amount: userActiveAmounts,
            alreadyShifted: true,
          });

          liquidity.addYield(yieldFromApy(Number(tvl.pool_apy) / 100));
        }
      }
    }

    const pendingAmount = a.pending ? Number(a.pending) : undefined;
    if (pendingAmount) {
      liquidity.addAsset({
        address: a.coinType,
        amount: pendingAmount,
        attributes: {
          isClaimable: true,
        },
      });
      liquidity.addYield({
        apr: 0,
        apy: 0,
      });
    }
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-positions`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
