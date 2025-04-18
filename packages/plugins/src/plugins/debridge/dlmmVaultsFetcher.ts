// DLMM Bootstrapping Pools
// DLMM Alpha Vault

import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { dbrDecimals, dlmmVaultProgramId, platformId } from './constants';
import { getParsedProgramAccounts } from '../../utils/solana';
import { escrowStruct } from '../meteora/struct';
import { CachedDlmmVaults } from '../meteora/types';
import { dlmmVaultsKey } from '../meteora/constants';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { getSolReceiptPdaBySeason } from './helpers';

const slotTtl = 30000;
let slot: number | null = null;
let slotUpdate = 0;
const pricePerDbrToken = 0.025;
const endOfClaim = 1747483200000;

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  if (Date.now() > endOfClaim) return [];
  const client = getClientSolana();

  const vaults = await cache.getItem<CachedDlmmVaults>(dlmmVaultsKey, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
  if (!vaults) throw new Error('No vaults cached');

  if (!slot || Date.now() - slotTtl > slotUpdate) {
    slot = await client.getSlot();
    slotUpdate = Date.now();
  }
  if (!slot) return [];

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

  const [tokenPrices, claim] = await Promise.all([
    cache.getTokenPricesAsMap(
      accounts
        .map((a) => {
          const v = vaults[a.dlmmVault.toString()];
          return [v.baseMint, v.quoteMint];
        })
        .flat(),
      NetworkId.solana
    ),
    client.getAccountInfo(getSolReceiptPdaBySeason(owner, 7)),
  ]);
  if (claim) return [];

  const registry = new ElementRegistry(NetworkId.solana, platformId);
  const vestingElement = registry.addElementMultiple({
    label: 'Vesting',
    link: 'https://debridge.foundation/lfg',
    name: 'Alpha Vault',
  });
  for (const escrow of accounts) {
    const vault = vaults[escrow.dlmmVault.toString()];
    if (!vault) continue;

    const quoteTokenPrice = tokenPrices.get(vault.quoteMint);
    if (!quoteTokenPrice) continue;

    const totalTokenEligible = escrow.totalDeposit
      .dividedBy(10 ** quoteTokenPrice.decimals)
      .dividedBy(pricePerDbrToken);

    const remainingClaimableTokens = totalTokenEligible.minus(
      escrow.claimedToken.dividedBy(10 ** dbrDecimals)
    );

    if (remainingClaimableTokens.isLessThanOrEqualTo(0)) continue;

    vestingElement.addAsset({
      address: vault.baseMint,
      amount: remainingClaimableTokens,
      alreadyShifted: true,
      ref: escrow.pubkey,
      sourceRefs: [{ name: 'Vault', address: vault.pubkey }],
      attributes: { lockedUntil: 1744876800000 },
    });
  }

  return registry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-dlmm-vaults`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
