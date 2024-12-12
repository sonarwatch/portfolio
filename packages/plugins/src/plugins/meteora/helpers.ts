import { PublicKey } from '@solana/web3.js';
import { NetworkId, TokenPriceSource } from '@sonarwatch/portfolio-core';
import { farmProgramId, platformId } from './constants';
import { Farm, PoolState } from './struct';
import { FormattedFarm } from './types';
import {
  getParsedMultipleAccountsInfo,
  MintAccount,
  mintAccountStruct,
  ParsedAccount,
  TokenAccount,
  tokenAccountStruct,
} from '../../utils/solana';
import { SolanaClient } from '../../utils/clients/types';
import { Cache } from '../../Cache';
import { getLpTokenSourceRaw } from '../../utils/misc/getLpTokenSourceRaw';

export function getStakingAccounts(
  owner: string,
  farms: string[]
): PublicKey[] {
  return farms.map(
    (farm) =>
      PublicKey.findProgramAddressSync(
        [new PublicKey(owner).toBuffer(), new PublicKey(farm).toBuffer()],
        farmProgramId
      )[0]
  );
}

export function formatFarm(farm: ParsedAccount<Farm>): FormattedFarm {
  return {
    pubkey: farm.pubkey.toString(),
    authority: farm.authority.toString(),
    stakingMint: farm.stakingMint.toString(),
    stakingVault: farm.stakingVault.toString(),
    rewardAMint: farm.rewardAMint.toString(),
    rewardAVault: farm.rewardAVault.toString(),
    rewardBMint: farm.rewardBMint.toString(),
    rewardBVault: farm.rewardBVault.toString(),
    rewardDuration: farm.rewardDuration.toString(),
    rewardDurationEnd: farm.rewardDurationEnd.toString(),
    lastUpdateTime: farm.lastUpdateTime.toString(),
    rewardARate: farm.rewardARate.toString(),
    rewardBRate: farm.rewardBRate.toString(),
    rewardAPerTokenStored: farm.rewardAPerTokenStored.toString(),
    rewardBPerTokenStored: farm.rewardBPerTokenStored.toString(),
    rewardARateU128: farm.rewardARateU128.toString(),
    rewardBRateU128: farm.rewardBRateU128.toString(),
    paused: farm.paused,
    totalStaked: farm.totalStaked.toString(),
  };
}

export async function getLpTokenPricesFromPoolsStates(
  client: SolanaClient,
  cache: Cache,
  poolsStates: (PoolState | null)[]
): Promise<TokenPriceSource[]> {
  const poolsAccounts = poolsStates.filter((poolAccount) => {
    if (!poolAccount) return false;
    if (!poolAccount.enabled) return false;

    return !(
      poolAccount.tokenAMint.toString() ===
        '11111111111111111111111111111111' ||
      poolAccount.tokenBMint.toString() === '11111111111111111111111111111111'
    );
  });

  // Store all tokens, lpmint, lpVaults
  const vaultsLpAddresses: Set<PublicKey> = new Set();
  const tokensMint: Set<string> = new Set();
  const lpMints: Set<PublicKey> = new Set();
  poolsAccounts.forEach((poolAccount) => {
    if (!poolAccount) return;

    vaultsLpAddresses.add(poolAccount.aVaultLp);
    vaultsLpAddresses.add(poolAccount.bVaultLp);
    tokensMint.add(poolAccount.tokenAMint.toString());
    tokensMint.add(poolAccount.tokenBMint.toString());
    lpMints.add(poolAccount.lpMint);
  });

  const tokenPrices = await cache.getTokenPricesAsMap(
    [...Array.from(tokensMint)],
    NetworkId.solana
  );

  // Get all vaults token accounts
  const tokensAccounts = await getParsedMultipleAccountsInfo(
    client,
    tokenAccountStruct,
    Array.from(vaultsLpAddresses)
  );
  if (!tokensAccounts) return [];
  const tokenAccountsMap: Map<string, TokenAccount> = new Map();
  tokensAccounts.forEach((tokenAccount) => {
    if (!tokenAccount) return;
    tokenAccountsMap.set(tokenAccount.pubkey.toString(), tokenAccount);
  });

  // Get all mints account
  const mintsAccounts = await getParsedMultipleAccountsInfo(
    client,
    mintAccountStruct,
    [
      ...Array.from(lpMints),
      ...Array.from(tokensMint).map((tM) => new PublicKey(tM)),
    ]
  );
  const mintsAccountByAddress: Map<string, MintAccount> = new Map();
  mintsAccounts.forEach((mintAccount) => {
    if (!mintAccount) return;
    mintsAccountByAddress.set(mintAccount.pubkey.toString(), mintAccount);
  });

  const lpSources: TokenPriceSource[] = [];
  for (let id = 0; id < poolsAccounts.length; id++) {
    const poolAccount = poolsAccounts[id];
    if (!poolAccount) continue;

    const aTokenMint = poolAccount.tokenAMint.toString();
    const bTokenMint = poolAccount.tokenBMint.toString();
    const aTokenPrice = tokenPrices.get(aTokenMint);
    const bTokenPrice = tokenPrices.get(bTokenMint);

    const aMintAccount = mintsAccountByAddress.get(aTokenMint);
    const bMintAccount = mintsAccountByAddress.get(bTokenMint);

    const tAccountA = tokenAccountsMap.get(poolAccount.aVaultLp.toString());
    const tAccountB = tokenAccountsMap.get(poolAccount.bVaultLp.toString());

    if (!tAccountA || !tAccountB) continue;
    if (tAccountA.amount.isZero() || tAccountB.amount.isZero()) continue;

    const lpMint = poolAccount.lpMint.toString();
    const lpMintAccount = mintsAccountByAddress.get(lpMint);
    if (!lpMintAccount) continue;

    if (aMintAccount && bMintAccount) {
      const tokenPriceSources = getLpTokenSourceRaw({
        lpDetails: {
          address: lpMint.toString(),
          decimals: lpMintAccount.decimals,
          supplyRaw: lpMintAccount.supply,
        },
        networkId: NetworkId.solana,
        platformId,
        poolUnderlyingsRaw: [
          {
            address: aTokenMint,
            decimals: aMintAccount.decimals,
            tokenPrice: aTokenPrice,
            reserveAmountRaw: tAccountA.amount,
          },
          {
            address: bTokenMint,
            decimals: bMintAccount.decimals,
            tokenPrice: bTokenPrice,
            reserveAmountRaw: tAccountB.amount,
          },
        ],
        sourceId: lpMint.toString(),
        priceUnderlyings: true,
      });
      lpSources.push(...tokenPriceSources);
    }
  }

  return lpSources;
}
