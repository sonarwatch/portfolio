import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  perpMarketsIndexesKey,
  platformId as driftPlatformId,
} from '../drift/constants';
import {
  vaultsPids,
  prefixVaults,
  neutralPlatformId,
  hedgyPlatformId,
} from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { vaultDepositorStruct } from './structs';
import { vaultDepositorFilter } from './filters';
import { VaultInfo } from './types';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { arrayToMap } from '../../utils/misc/arrayToMap';
import { PerpMarketIndexes, SpotMarketEnhanced } from '../drift/types';
import { spotMarketsMemo } from '../drift/depositsFetcher';

export const oneDay = 1000 * 60 * 60 * 24;
export const sevenDays = 7 * oneDay;

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const depositAccounts = (
    await Promise.all(
      vaultsPids.map((vaultsPid) =>
        getParsedProgramAccounts(
          client,
          vaultDepositorStruct,
          vaultsPid,
          vaultDepositorFilter(owner)
        )
      )
    )
  ).flat();

  if (depositAccounts.length === 0) return [];

  const [vaultsInfo, perpMarketIndexesArr] = await Promise.all([
    cache.getItems<VaultInfo>(
      depositAccounts.map((deposit) => deposit.vault.toString()),
      { prefix: prefixVaults, networkId: NetworkId.solana }
    ),
    cache.getItem<PerpMarketIndexes>(perpMarketsIndexesKey, {
      prefix: driftPlatformId,
      networkId: NetworkId.solana,
    }),
  ]);

  const spotMarketsItems = await spotMarketsMemo.getItem(cache);
  const spotMarketByIndex: Map<number, SpotMarketEnhanced> = new Map();

  const perpMarketAddressByIndex: Map<number, string> = new Map();
  perpMarketIndexesArr?.forEach(([index, address]) => {
    perpMarketAddressByIndex.set(index, address);
  });
  for (const spotMarketItem of spotMarketsItems || []) {
    spotMarketByIndex.set(spotMarketItem.marketIndex, spotMarketItem);
  }

  const vaultById: Map<string, VaultInfo> = arrayToMap(
    vaultsInfo.filter((v) => v !== undefined) as VaultInfo[],
    'pubkey'
  );

  const elementRegistry = new ElementRegistry(
    NetworkId.solana,
    driftPlatformId
  );

  for (const depositAccount of depositAccounts) {
    if (
      depositAccount.lastWithdrawRequest.value.isZero() &&
      depositAccount.netDeposits.isLessThanOrEqualTo(0)
    )
      continue;

    const vaultInfo = vaultById.get(depositAccount.vault.toString());
    if (!vaultInfo) continue;

    const { name, mint, platformId } = vaultInfo;

    const element = elementRegistry.addElementMultiple({
      label: 'Deposit',
      platformId,
      name,
    });

    let amountLeft = new BigNumber(vaultInfo.totalTokens)
      .dividedBy(vaultInfo.totalShares)
      .multipliedBy(depositAccount.vaultShares);

    if (!depositAccount.lastWithdrawRequest.value.isZero()) {
      amountLeft = amountLeft.minus(depositAccount.lastWithdrawRequest.value);
      element.addAsset({
        address: mint,
        amount: depositAccount.lastWithdrawRequest.value,
        attributes: {
          lockedUntil: depositAccount.lastWithdrawRequest.ts
            .times(1000)
            .plus(
              [neutralPlatformId, hedgyPlatformId].includes(platformId)
                ? oneDay
                : sevenDays
            )
            .toNumber(),
        },
      });
    }

    element.addAsset({
      address: mint,
      amount: amountLeft,
    });
  }

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${driftPlatformId}-mm-vaults-deposits`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
