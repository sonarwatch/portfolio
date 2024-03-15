import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { platformId, poolsProgramId } from './constants';
import { getClientSolana } from '../../utils/clients';
import {
  MintAccount,
  TokenAccount,
  getParsedMultipleAccountsInfo,
  getParsedProgramAccounts,
  mintAccountStruct,
  tokenAccountStruct,
} from '../../utils/solana';
import { pools } from './pools';
import { fetchTokenSupplyAndDecimals } from '../../utils/solana/fetchTokenSupplyAndDecimals';
import { PoolState, poolStateStruct } from './struct';
import { constantPoolsFilters, stablePoolsFilters } from './filters';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import getTokenPricesMap from '../../utils/misc/getTokensPricesMap';
import getLpTokenSourceRaw from '../../utils/misc/getLpTokenSourceRaw';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  // Get all 2-tokens pool (permissionless)
  const constantPoolsAccounts = await getParsedProgramAccounts(
    client,
    poolStateStruct,
    poolsProgramId,
    constantPoolsFilters
  );
  const stablePoolsAccounts = await getParsedProgramAccounts(
    client,
    poolStateStruct,
    poolsProgramId,
    stablePoolsFilters
  );

  // 4pools
  const meteoraPools = pools;
  // Get all multi-tokens pools
  const reserverAddresses: Set<PublicKey> = new Set();
  meteoraPools.forEach((pool) => {
    pool.reserveAccounts.forEach((reserve) => {
      reserverAddresses.add(new PublicKey(reserve));
    });
  });
  const reserveAccounts = await getParsedMultipleAccountsInfo(
    client,
    tokenAccountStruct,
    Array.from(reserverAddresses)
  );
  const reservesAccountByAddress: Map<string, TokenAccount> = new Map();
  reserveAccounts.forEach((reserve) => {
    if (!reserve) return;
    reservesAccountByAddress.set(
      reserve.pubkey.toString(),
      reserve as TokenAccount
    );
  });

  const poolsAcountsUnfiltered: PoolState[] = [
    ...stablePoolsAccounts,
    ...constantPoolsAccounts,
  ];

  const poolsAccounts = poolsAcountsUnfiltered.filter((poolAccount) => {
    if (poolAccount.enabled === false) return false;
    if (
      poolAccount.tokenAMint.toString() ===
        '11111111111111111111111111111111' ||
      poolAccount.tokenBMint.toString() === '11111111111111111111111111111111'
    )
      return false;

    return true;
  });

  // Store all tokens, lpmint, lpVaults
  const vaultsLpAddresses: Set<PublicKey> = new Set();
  const tokensMint: Set<string> = new Set();
  const lpMints: Set<PublicKey> = new Set();
  poolsAccounts.forEach((poolAccount) => {
    vaultsLpAddresses.add(poolAccount.aVaultLp);
    vaultsLpAddresses.add(poolAccount.bVaultLp);
    tokensMint.add(poolAccount.tokenAMint.toString());
    tokensMint.add(poolAccount.tokenBMint.toString());
    lpMints.add(poolAccount.lpMint);
  });

  const tokenPriceById = await getTokenPricesMap(
    [
      ...Array.from(tokensMint),
      ...reserveAccounts
        .map((account) => (account ? account.mint.toString() : []))
        .flat(),
    ],
    NetworkId.solana,
    cache
  );

  // Get all vaults token accounts
  const tokensAccounts = await getParsedMultipleAccountsInfo(
    client,
    tokenAccountStruct,
    Array.from(vaultsLpAddresses)
  );
  if (!tokensAccounts) return;
  const tokenAccountsMap: Map<string, TokenAccount> = new Map();
  tokensAccounts.forEach((tokenAccount) => {
    if (!tokenAccount) return;
    tokenAccountsMap.set(tokenAccount.pubkey.toString(), tokenAccount);
  });

  // Get all mints account
  const mintsAccounts = await getParsedMultipleAccountsInfo(
    client,
    mintAccountStruct,
    Array.from(lpMints)
  );
  const mintsAccountByAddress: Map<string, MintAccount> = new Map();
  mintsAccounts.forEach((mintAccount) => {
    if (!mintAccount) return;
    mintsAccountByAddress.set(mintAccount.pubkey.toString(), mintAccount);
  });

  for (let id = 0; id < poolsAccounts.length; id++) {
    const poolAccount = poolsAccounts[id];
    const aTokenMint = poolAccount.tokenAMint.toString();
    const bTokenMint = poolAccount.tokenBMint.toString();
    const aTokenPrice = tokenPriceById.get(aTokenMint);
    const bTokenPrice = tokenPriceById.get(bTokenMint);
    if (!bTokenPrice || !aTokenPrice) continue;
    const tAccountA = tokenAccountsMap.get(poolAccount.aVaultLp.toString());
    const tAccountB = tokenAccountsMap.get(poolAccount.bVaultLp.toString());
    if (!tAccountA || !tAccountB) continue;
    if (tAccountA.amount.isZero() || tAccountB.amount.isZero()) continue;

    const lpMint = poolAccount.lpMint.toString();
    const lpMintAccount = mintsAccountByAddress.get(lpMint);
    if (!lpMintAccount) continue;

    const lpSource = getLpTokenSourceRaw(
      NetworkId.solana,
      lpMint,
      platformId,
      undefined,
      {
        address: lpMint,
        decimals: lpMintAccount.decimals,
        supplyRaw: lpMintAccount.supply,
      },
      [
        {
          address: aTokenPrice.address,
          decimals: aTokenPrice.decimals,
          price: aTokenPrice.price,
          reserveAmountRaw: tAccountA.amount,
        },
        {
          address: bTokenPrice.address,
          decimals: bTokenPrice.decimals,
          price: bTokenPrice.price,
          reserveAmountRaw: tAccountB.amount,
        },
      ]
    );
    await cache.setTokenPriceSource(lpSource);
  }

  // 4 pools
  for (let id = 0; id < meteoraPools.length; id++) {
    const pool = meteoraPools[id];
    const { address } = pool;
    const underlyings = [];
    let supplyValue = 0;
    let checkedTokensPrices = 0;
    const numberOfUnderlyings = pool.reserveAccounts.length;
    for (let index = 0; index < numberOfUnderlyings; index++) {
      const reserveAccount = reservesAccountByAddress.get(
        pool.reserveAccounts[index]
      );
      if (!reserveAccount) continue;

      const reserveTokenPrice = tokenPriceById.get(
        reserveAccount.mint.toString()
      );
      if (!reserveTokenPrice) continue;
      checkedTokensPrices += 1;

      const reserveAmount = new BigNumber(reserveAccount.amount.toString()).div(
        10 ** reserveTokenPrice.decimals
      );
      const reserveValue = reserveAmount.multipliedBy(reserveTokenPrice.price);

      const underlying = {
        networkId: NetworkId.solana,
        address: reserveTokenPrice.address,
        decimals: reserveTokenPrice.decimals,
        price: reserveTokenPrice.price,
        amountPerLp: reserveAmount
          .dividedBy(reserveValue)
          .dividedBy(numberOfUnderlyings)
          .toNumber(),
      };
      underlyings.push(underlying);
      supplyValue += reserveValue.toNumber();
    }

    // don't push the LP if one tokenPrice was not found.
    if (checkedTokensPrices < pool.reserveAccounts.length) continue;

    const tokenSupplyAndDecimalsRes = await fetchTokenSupplyAndDecimals(
      new PublicKey(address),
      client,
      0
    );
    if (!tokenSupplyAndDecimalsRes) continue;
    const { supply, decimals } = tokenSupplyAndDecimalsRes;

    if (supplyValue <= 0) continue;
    const price = supplyValue / supply;

    await cache.setTokenPriceSource({
      id: platformId,
      weight: 1,
      address,
      networkId: NetworkId.solana,
      platformId,
      decimals,
      price,
      underlyings,
      timestamp: Date.now(),
    });
  }
};

const job: Job = {
  id: `${platformId}-pools`,
  executor,
  label: 'normal',
};
export default job;
