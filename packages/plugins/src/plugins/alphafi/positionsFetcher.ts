import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { alphaPoolsInfoKey, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSui } from '../../utils/clients';
import { AlphaPoolInfo, Receipt } from './types';
import { getOwnedObjectsPreloaded } from '../../utils/sui/getOwnedObjectsPreloaded';
import { poolsInfos } from './poolsInfos';
import { arrayToMap } from '../../utils/misc/arrayToMap';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const balanceFactor = 10 ** 9;

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const receipts = await getOwnedObjectsPreloaded<Receipt>(client, owner, {
    filter: {
      MatchAny: Array.from(
        new Set(
          Object.values(poolsInfos).map((poolInfo) => ({
            StructType: poolInfo.receiptType,
          }))
        )
      ),
    },
  });

  if (receipts.length === 0) return [];

  const alphaPoolsInfo = await cache.getItem<AlphaPoolInfo[]>(
    alphaPoolsInfoKey,
    {
      prefix: platformId,
      networkId: NetworkId.sui,
    }
  );

  if (!alphaPoolsInfo) return [];

  const alphaPoolInfoById = arrayToMap(alphaPoolsInfo, 'alphaPoolId');

  const elementRegistry = new ElementRegistry(NetworkId.sui, platformId);

  receipts.forEach((receipt) => {
    if (!receipt.data?.content?.fields.pool_id) return;

    const receiptInfo = receipt.data.content.fields;
    const alphaPoolInfo = alphaPoolInfoById.get(receiptInfo.pool_id);

    if (!alphaPoolInfo) return;

    const xTokenShares = new BigNumber(receiptInfo.xTokenBalance).dividedBy(
      alphaPoolInfo.xTokenSupply
    );

    if (
      alphaPoolInfo.protocol === 'ALPHAFI' ||
      alphaPoolInfo.protocol === 'NAVI' ||
      alphaPoolInfo.protocol === 'BUCKET'
    ) {
      const lockedAmount = xTokenShares.multipliedBy(
        alphaPoolInfo.tokensInvested
      );

      const unlockedAmount = new BigNumber(receiptInfo.unlocked_xtokens)
        .dividedBy(alphaPoolInfo.xTokenSupply)
        .multipliedBy(alphaPoolInfo.tokensInvested);

      // Alpha Vault
      if (alphaPoolInfo.unlockAt && alphaPoolInfo.protocol === 'ALPHAFI') {
        const alphaVaultElement = elementRegistry.addElementMultiple({
          label: 'Vault',
          name: 'Alpha Vault',
        });
        alphaVaultElement.addAsset({
          address: alphaPoolInfo.coinTypeA,
          amount: lockedAmount.dividedBy(balanceFactor),
          alreadyShifted: true,
          attributes: { lockedUntil: alphaPoolInfo.unlockAt },
        });
        alphaVaultElement.addAsset({
          address: alphaPoolInfo.coinTypeA,
          amount: unlockedAmount.dividedBy(balanceFactor),
          alreadyShifted: true,
          attributes: { isClaimable: true },
        });
      } else if (!lockedAmount.isZero()) {
        elementRegistry
          .addElementMultiple({
            label: 'Deposit',
            name: alphaPoolInfo.protocol,
          })
          .addAsset({
            address: alphaPoolInfo.coinTypeA,
            amount: lockedAmount.dividedBy(balanceFactor),
            alreadyShifted: true,
          });
      }
    } else if (
      alphaPoolInfo.protocol === 'CETUS' ||
      alphaPoolInfo.protocol === 'BLUEFIN'
    ) {
      const liquidity = elementRegistry
        .addElementLiquidity({
          label: 'Deposit',
          name: alphaPoolInfo.protocol,
        })
        .addLiquidity();

      liquidity.addAsset({
        address: alphaPoolInfo.coinTypeA,
        amount: xTokenShares.times(alphaPoolInfo.tokenAmountA),
      });
      if (alphaPoolInfo.coinTypeB && alphaPoolInfo.tokenAmountB)
        liquidity.addAsset({
          address: alphaPoolInfo.coinTypeB,
          amount: xTokenShares.times(alphaPoolInfo.tokenAmountB),
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
