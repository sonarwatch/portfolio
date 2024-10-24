// DLMM Bootstrapping Pools
// DLMM Alpha Vault

import {
  getUsdValueSum,
  NetworkId,
  PortfolioAssetToken,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { dbrDecimals, dlmmVaultProgramId, platformId } from './constants';
import { getParsedProgramAccounts } from '../../utils/solana';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { escrowStruct } from '../meteora/struct';
import { CachedDlmmVaults } from '../meteora/types';
import { dlmmVaultsKey } from '../meteora/constants';

const slotTtl = 30000;
let slot: number | null = null;
let slotUpdate = 0;
const pricePerDbrToken = 0.025;

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

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
  for (const escrow of accounts) {
    const vault = vaults[escrow.dlmmVault.toString()];
    if (!vault) continue;

    const [quoteTokenPrice, baseTokenPrice] = [
      tokenPrices.get(vault.quoteMint),
      tokenPrices.get(vault.baseMint),
    ];

    if (!quoteTokenPrice) continue;

    const totalTokenEligible = escrow.totalDeposit
      .dividedBy(10 ** quoteTokenPrice.decimals)
      .dividedBy(pricePerDbrToken);

    const remainingClaimableTokens = totalTokenEligible.minus(
      escrow.claimedToken.dividedBy(10 ** dbrDecimals)
    );

    if (remainingClaimableTokens.isLessThanOrEqualTo(0)) continue;
    assets.push(
      tokenPriceToAssetToken(
        vault.baseMint,
        remainingClaimableTokens.toNumber(),
        NetworkId.solana,
        baseTokenPrice,
        undefined,
        { lockedUntil: 1744876800000 }
      )
    );
  }

  if (assets.length === 0) return [];

  return [
    {
      networkId: NetworkId.solana,
      type: PortfolioElementType.multiple,
      label: 'Vesting',
      platformId,
      name: 'LFG Vault',
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
