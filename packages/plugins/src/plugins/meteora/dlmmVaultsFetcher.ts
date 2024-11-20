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
import { dlmmVaultProgramId, dlmmVaultsKey, platformId } from './constants';
import { CachedDlmmVaults } from './types';
import { getParsedProgramAccounts } from '../../utils/solana';
import { escrowStruct } from './struct';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

// const slotTtl = 30000;
// const slot: number | null = null;
// const slotUpdate = 0;

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
  if (!vaults) return [];

  const time = Date.now();

  // Looks like Meteora is using timesteamp instead of slot now inside their accounts
  // if (!slot || Date.now() - slotTtl > slotUpdate) {
  //   slot = await client.getSlot();
  //   slotUpdate = Date.now();
  // }
  // if (!slot) return [];

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
    const vault = vaults[escrow.dlmmVault.toString()];
    if (!vault) return;

    if (time > Number(vault.endVestingTs)) return;

    // Vesting not started yet
    if (Date.now() < Number(vault.startVestingTs)) {
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
          .times(1 - 1 / filledRatio);

        if (amount.isGreaterThan(0.0001))
          assets.push(
            tokenPriceToAssetToken(
              vault.quoteMint,
              amount.toNumber(),
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
      if (remainingAmount.isLessThan(0.0001)) return;

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

      const vestingAmount = remainingAmount
        .minus(claimableAmount)
        .div(10 ** tpBase.decimals);
      if (vestingAmount.isGreaterThan(0.0001)) {
        assets.push(
          tokenPriceToAssetToken(
            vault.baseMint,
            vestingAmount.toNumber(),
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
