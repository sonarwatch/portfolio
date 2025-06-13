// DLMM Bootstrapping Pools
// DLMM Alpha Vault

import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { getClientSolana } from '../../../utils/clients';
import { dlmmVaultProgramId, dlmmVaultsKey, platformId } from '../constants';
import { CachedDlmmVaults } from '../types';
import { getParsedProgramAccounts } from '../../../utils/solana';
import { escrowStruct } from '../struct';
import { ElementRegistry } from '../../../utils/elementbuilder/ElementRegistry';

// const slotTtl = 30000;
// const slot: number | null = null;
// const slotUpdate = 0;

const dustFilter = 0.0001;

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const accounts = await getParsedProgramAccounts(
    client,
    escrowStruct,
    dlmmVaultProgramId,
    [
      { dataSize: escrowStruct.byteSize },
      {
        memcmp: {
          offset: 40,
          bytes: owner,
        },
      },
    ]
  );
  if (accounts.length === 0) return [];

  const vaults = await cache.getItem<CachedDlmmVaults>(dlmmVaultsKey, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
  if (!vaults) throw new Error('Vaults not cached');

  const tokenPrices = await cache.getTokenPricesAsMap(
    Object.values(vaults)
      .map((v) => v && [v.baseMint, v.quoteMint])
      .flat(),
    NetworkId.solana
  );

  const time = Date.now();

  // Looks like Meteora is using timesteamp instead of slot now inside their accounts
  // if (!slot || Date.now() - slotTtl > slotUpdate) {
  //   slot = await client.getSlot();
  //   slotUpdate = Date.now();
  // }
  // if (!slot) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  for (const escrow of accounts) {
    const vault = vaults[escrow.dlmmVault.toString()];
    if (!vault || !vault.endVestingTs || !vault.startVestingTs) continue;

    const element = elementRegistry.addElementMultiple({
      label: 'Vesting',
      name: 'Alpha Vault',
      ref: escrow.pubkey,
      sourceRefs: [
        {
          name: 'Vault',
          address: vault.pubkey.toString(),
        },
        {
          name: 'Pool',
          address: vault.lbPair.toString(),
        },
      ],
      link: `https://app.meteora.ag/dlmm/${vault.lbPair}`,
    });

    const baseTokenPrice = tokenPrices.get(vault.baseMint);
    const quoteTokenPrice = tokenPrices.get(vault.quoteMint);

    const filledRatio = new BigNumber(vault.totalDeposit)
      .div(vault.maxCap)
      .toNumber();

    if (escrow.refunded === 0 && filledRatio > 1) {
      const amount = new BigNumber(escrow.totalDeposit).times(
        1 - 1 / filledRatio
      );

      if (
        quoteTokenPrice &&
        amount
          .shiftedBy(-quoteTokenPrice.decimals)
          .multipliedBy(quoteTokenPrice.price)
          .isGreaterThan(dustFilter)
      ) {
        element.addAsset({
          address: vault.quoteMint,
          amount,
          attributes: {
            isClaimable: true,
          },
        });
      }
    }

    const shares = new BigNumber(escrow.totalDeposit).div(vault.totalDeposit);
    const totalAmount = new BigNumber(vault.boughtToken).times(shares);
    const remainingAmount = totalAmount.minus(escrow.claimedToken);
    if (remainingAmount.isLessThan(dustFilter)) continue;

    let claimableAmount = new BigNumber(remainingAmount.toString());
    if (time < Number(vault.endVestingTs)) {
      const amountPerSec = new BigNumber(totalAmount).div(
        Number(vault.endVestingTs) - Number(vault.startVestingTs)
      );
      let lastClaimedTs = escrow.lastClaimedTs.isZero()
        ? Number(vault.startVestingTs)
        : escrow.lastClaimedTs.toNumber();
      if (lastClaimedTs > time) lastClaimedTs = time;
      claimableAmount = amountPerSec.times(
        Math.min(time, Number(vault.endVestingTs)) - lastClaimedTs
      );
    }

    if (
      baseTokenPrice &&
      claimableAmount
        .shiftedBy(-baseTokenPrice.decimals)
        .multipliedBy(baseTokenPrice.price)
        .isGreaterThan(dustFilter)
    ) {
      element.addAsset({
        address: vault.baseMint,
        amount: claimableAmount,
        attributes: {
          isClaimable: Number(vault.endVestingTs) * 1000 < Date.now(),
          lockedUntil: Number(vault.endVestingTs) * 1000,
        },
      });
    }

    const vestingAmount = remainingAmount.minus(claimableAmount);

    if (
      baseTokenPrice &&
      vestingAmount
        .shiftedBy(-baseTokenPrice.decimals)
        .multipliedBy(baseTokenPrice.price)
        .isGreaterThan(dustFilter)
    ) {
      element.addAsset({
        address: vault.baseMint,
        amount: vestingAmount,
      });
    }
  }

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-dlmm-vaults`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
