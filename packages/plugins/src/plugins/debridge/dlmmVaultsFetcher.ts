// DLMM Bootstrapping Pools
// DLMM Alpha Vault

import {
  getUsdValueSum,
  NetworkId,
  PortfolioAssetToken,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { dlmmVaultProgramId, platformId } from './constants';
import { getParsedProgramAccounts } from '../../utils/solana';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { escrowStruct } from '../meteora/struct';
import { CachedDlmmVaults } from '../meteora/types';
import { dlmmVaultsKey } from '../meteora/constants';

const slotTtl = 30000;
let slot: number | null = null;
let slotUpdate = 0;

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
      // {
      //   memcmp: {
      //     offset: 8,
      //     bytes: 'CGZvC5MWsu1bc3vRis619ZBEtvuPqoXrtBMeV9RrKFJp',
      //   },
      // },
      // {
      //   memcmp: {
      //     offset: 96,
      //     bytes: '1', // refunded === false
      //   },
      // },
    ]
  );
  if (accounts.length === 0) return [];

  const vaults = await cache.getItem<CachedDlmmVaults>(dlmmVaultsKey, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
  if (!vaults) return [];

  if (!slot || Date.now() - slotTtl > slotUpdate) {
    slot = await client.getSlot();
    slotUpdate = Date.now();
  }
  if (!slot) return [];

  const tokenPrices = await cache.getTokenPricesAsMap(
    accounts
      .map((a) => {
        const v = vaults[a.dlmmVault.toString()];
        return [v.baseMint, v.quoteMint];
      })
      .flat(),
    NetworkId.solana
  );

  const assets: PortfolioAssetToken[] = [];
  accounts.forEach((escrow) => {
    if (!slot) return;
    const vault = vaults[escrow.dlmmVault.toString()];
    if (!vault) return;

    // Vesting not started yet
    if (slot < Number(vault.startVestingSlot)) {
      const tpQuote = tokenPrices.get(vault.quoteMint);
      if (!tpQuote) return;
      assets.push(
        tokenPriceToAssetToken(
          vault.quoteMint,
          new BigNumber(escrow.totalDeposit)
            .div(10 ** tpQuote.decimals)
            .toNumber(),
          NetworkId.solana,
          tpQuote,
          undefined,
          {}
        )
      );
    } else {
      // Vesting started
      // If not refunded yet

      const filledRatio = new BigNumber(vault.totalDeposit)
        .div(vault.maxCap)
        .toNumber();

      if (escrow.refunded === 0 && filledRatio > 1) {
        const tpQuote = tokenPrices.get(vault.quoteMint);
        if (!tpQuote) return;
        const amount = new BigNumber(escrow.totalDeposit)
          .div(10 ** tpQuote.decimals)
          .times(1 - 1 / filledRatio)
          .toNumber();
        assets.push(
          tokenPriceToAssetToken(
            vault.quoteMint,
            amount,
            NetworkId.solana,
            tpQuote,
            undefined,
            {
              isClaimable: true,
            }
          )
        );
      }
      const tpBase = tokenPrices.get(vault.baseMint);
      if (!tpBase) return;
      const shares = new BigNumber(escrow.totalDeposit).div(vault.totalDeposit);
      const totalAmount = new BigNumber(vault.boughtToken).times(shares);
      const remainingAmount = totalAmount.minus(escrow.claimedToken);
      if (remainingAmount.isZero()) return;

      let claimableAmount = new BigNumber(remainingAmount.toString());
      if (slot < Number(vault.endVestingSlot)) {
        const amountPerSlot = new BigNumber(totalAmount).div(
          Number(vault.endVestingSlot) - Number(vault.startVestingSlot)
        );
        let lastClaimedSlot = escrow.lastClaimedSlot.isZero()
          ? Number(vault.startVestingSlot)
          : escrow.lastClaimedSlot.toNumber();
        if (lastClaimedSlot > slot) lastClaimedSlot = slot;
        claimableAmount = amountPerSlot.times(
          Math.min(slot, Number(vault.endVestingSlot)) - lastClaimedSlot
        );
      }
      if (claimableAmount.isGreaterThan(0)) {
        assets.push(
          tokenPriceToAssetToken(
            vault.baseMint,
            claimableAmount.div(10 ** tpBase.decimals).toNumber(),
            NetworkId.solana,
            tpBase,
            undefined,
            {
              isClaimable: true,
            }
          )
        );
      }

      const vestingAmount = remainingAmount.minus(claimableAmount);
      if (vestingAmount.isGreaterThan(0)) {
        assets.push(
          tokenPriceToAssetToken(
            vault.baseMint,
            vestingAmount.div(10 ** tpBase.decimals).toNumber(),
            NetworkId.solana,
            tpBase,
            undefined,
            {
              tags: ['Vesting'],
            }
          )
        );
      }
    }
  });
  if (assets.length === 0) return [];

  return [
    {
      networkId: NetworkId.solana,
      type: PortfolioElementType.multiple,
      label: 'Vesting',
      platformId,
      name: 'Alpha Vault',
      data: {
        assets,
      },
      value: getUsdValueSum(assets.map((a) => a.value)),
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-dlmm-vaults`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
