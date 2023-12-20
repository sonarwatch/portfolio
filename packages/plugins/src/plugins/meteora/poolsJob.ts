import { NetworkId, TokenPriceUnderlying } from '@sonarwatch/portfolio-core';
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
  const tokenAccountByAddress: Map<PublicKey, TokenAccount> = new Map();
  tokensAccounts.forEach((tokenAccount) => {
    if (!tokenAccount) return;
    tokenAccountByAddress.set(
      tokenAccount.pubkey,
      tokenAccount as TokenAccount
    );
  });

  // Get all mints account
  const mintsAccounts = await getParsedMultipleAccountsInfo(
    client,
    mintAccountStruct,
    Array.from(lpMints)
  );
  const mintsAccountByAddress: Map<PublicKey, MintAccount> = new Map();
  mintsAccounts.forEach((mintAccount) => {
    if (!mintAccount) return;
    mintsAccountByAddress.set(mintAccount.pubkey, mintAccount as MintAccount);
  });

  for (let id = 0; id < poolsAccounts.length; id++) {
    const poolAccount = poolsAccounts[id];

    const ATokenPrice = tokenPriceById.get(poolAccount.tokenAMint.toString());
    const BTokenPrice = tokenPriceById.get(poolAccount.tokenBMint.toString());
    if (!BTokenPrice || !ATokenPrice) continue;

    const tokenAccountA = tokenAccountByAddress.get(poolAccount.aVaultLp);
    const tokenAccountB = tokenAccountByAddress.get(poolAccount.bVaultLp);
    if (!tokenAccountA || !tokenAccountB) continue;
    if (
      tokenAccountA.amount.isLessThanOrEqualTo(0) ||
      tokenAccountB.amount.isLessThanOrEqualTo(0)
    )
      continue;

    const tokenAmountA = tokenAccountA.amount.dividedBy(
      10 ** ATokenPrice.decimals
    );
    const tokenAmountB = tokenAccountB.amount.dividedBy(
      10 ** BTokenPrice.decimals
    );

    const totalValueTokenA = tokenAmountA.multipliedBy(ATokenPrice.price);
    const totalValueTokenB = tokenAmountB.multipliedBy(BTokenPrice.price);

    const { lpMint } = poolAccount;
    const lpMintAccount = mintsAccountByAddress.get(lpMint);
    if (!lpMintAccount) continue;

    const lpDecimals = lpMintAccount.decimals;
    const lpSupply = lpMintAccount.supply.dividedBy(10 ** lpDecimals);

    const tvl = totalValueTokenA.plus(totalValueTokenB);
    const price = tvl.dividedBy(lpSupply).toNumber();

    const underlyings: TokenPriceUnderlying[] = [];
    underlyings.push({
      networkId: NetworkId.solana,
      address: ATokenPrice.address,
      decimals: ATokenPrice.decimals,
      price: ATokenPrice.price,
      amountPerLp: tokenAmountA.dividedBy(lpSupply).toNumber(),
    });
    underlyings.push({
      networkId: NetworkId.solana,
      address: BTokenPrice.address,
      decimals: BTokenPrice.decimals,
      price: BTokenPrice.price,
      amountPerLp: tokenAmountB.dividedBy(lpSupply).toNumber(),
    });
    await cache.setTokenPriceSource({
      id: platformId,
      weight: 1,
      address: lpMint.toString(),
      networkId: NetworkId.solana,
      platformId,
      decimals: lpDecimals,
      price,
      underlyings,
      timestamp: Date.now(),
    });
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
};
export default job;
