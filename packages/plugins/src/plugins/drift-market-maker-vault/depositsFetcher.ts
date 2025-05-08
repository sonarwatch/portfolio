import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId as driftPlatformId } from '../drift/constants';
import {
  vaultsProgramIds,
  prefixVaults,
  neutralPlatformId,
  hedgyPlatformId,
  vectisPlatformId,
} from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { vaultDepositorStruct } from './structs';
import { vaultDepositorFilter } from './filters';
import { VaultInfo } from './types';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { arrayToMap } from '../../utils/misc/arrayToMap';

export const oneDay = 1000 * 60 * 60 * 24;
export const sevenDays = 7 * oneDay;

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const depositAccounts = (
    await Promise.all(
      vaultsProgramIds.map((vaultsPid) =>
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

  const vaultsInfo = await cache.getItems<VaultInfo>(
    depositAccounts.map((deposit) => deposit.vault.toString()),
    { prefix: prefixVaults, networkId: NetworkId.solana }
  );
  if (!vaultsInfo) throw new Error('Vaults not cached');

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
    if (!vaultInfo || new BigNumber(vaultInfo.totalShares).isZero()) continue;

    const { name, mint, platformId, link } = vaultInfo;

    const element = elementRegistry.addElementMultiple({
      label: 'Deposit',
      platformId,
      name,
      link:
        link ?? `https://app.drift.trade/vaults/${vaultInfo.pubkey.toString()}`,
      sourceRefs: [
        {
          name: 'Vault',
          address: vaultInfo.pubkey.toString(),
        },
      ],
      ref: depositAccount.pubkey,
    });

    const pricePerShare = new BigNumber(vaultInfo.totalTokens).dividedBy(
      vaultInfo.totalShares
    );
    const userSharesValue =
      depositAccount.vaultShares.multipliedBy(pricePerShare);
    const { netDeposits } = depositAccount;
    const performanceFee = new BigNumber(vaultInfo.profitShare).shiftedBy(-6);

    const PnL = userSharesValue.minus(netDeposits);

    element.addAsset({
      address: mint,
      amount: netDeposits.minus(depositAccount.lastWithdrawRequest?.value || 0),
    });

    let hasPendingFees = false;
    if (PnL.isPositive()) {
      const profitShareFees = PnL.multipliedBy(performanceFee).minus(
        depositAccount.profitShareFeePaid
      );
      if (profitShareFees.isPositive()) {
        hasPendingFees = true;
        element.addAsset({
          address: mint,
          amount: profitShareFees.negated(),
          attributes: {
            tags: [`Pending ${performanceFee.shiftedBy(2)}% Performance Fee`],
          },
        });
      }
    }

    element.addAsset({
      address: mint,
      amount: PnL,
      attributes: {
        tags: [hasPendingFees ? 'PnL before Fees' : 'PnL'],
      },
    });

    if (!depositAccount.lastWithdrawRequest?.value.isZero()) {
      const withdrawCooldown = [
        neutralPlatformId,
        hedgyPlatformId,
        vectisPlatformId,
      ].includes(platformId)
        ? oneDay
        : sevenDays;

      element.addAsset({
        address: mint,
        amount: depositAccount.lastWithdrawRequest.value,
        attributes: {
          lockedUntil: depositAccount.lastWithdrawRequest.ts
            .times(1000)
            .plus(withdrawCooldown)
            .toNumber(),
        },
      });
    }
  }

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${driftPlatformId}-mm-vaults-deposits`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
