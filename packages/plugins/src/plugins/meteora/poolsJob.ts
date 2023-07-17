import {
  Cache,
  Job,
  JobExecutor,
  NetworkId,
  TokenPrice,
  TokenPriceUnderlying,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { platformId, poolsProgramId } from './constants';
import { getClientSolana } from '../../utils/clients';
import {
  MintAccount,
  TokenAccount,
  getParsedMultipleAccountsInfo,
  mintAccountStruct,
  tokenAccountStruct,
} from '../../utils/solana';
import { pools } from './pools';
import { fetchTokenSupplyAndDecimals } from '../../utils/solana/fetchTokenSupplyAndDecimals';
import {
  PoolStateConstant,
  PoolStateStable,
  poolStateConstantStruct,
  poolStateStableStruct,
} from './struct';
import runInBatch from '../../utils/misc/runInBatch';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const poolsAccountsRaw = await client.getProgramAccounts(poolsProgramId);
  const poolsAcountsUnfiltered: (PoolStateStable | PoolStateConstant)[] = [];
  // TODO : improve by looking for the CurveType byte instead of fixed size
  poolsAccountsRaw.forEach((pool) => {
    if (pool.account.data.length === 944) {
      poolsAcountsUnfiltered.push(
        poolStateConstantStruct.deserialize(pool.account.data)[0]
      );
    } else if (pool.account.data.length === 1387) {
      poolsAcountsUnfiltered.push(
        poolStateStableStruct.deserialize(pool.account.data)[0]
      );
    }
  });
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

  // Store all tokens, mint, addresses
  const tokensAccountsAddresses: Set<PublicKey> = new Set();
  const tokensMint: Set<PublicKey> = new Set();
  const mintsAddresses: Set<PublicKey> = new Set();
  poolsAccounts.forEach((poolAccount) => {
    tokensAccountsAddresses.add(poolAccount.aVaultLp);
    tokensAccountsAddresses.add(poolAccount.bVaultLp);
    tokensMint.add(poolAccount.tokenAMint);
    tokensMint.add(poolAccount.tokenBMint);
    mintsAddresses.add(poolAccount.lpMint);
  });

  // Get all token prices
  const tokenPriceResults = await runInBatch(
    [...tokensMint].map(
      (mint) => () => cache.getTokenPrice(mint.toString(), NetworkId.solana)
    )
  );
  const tokenPrices: Map<string, TokenPrice> = new Map();
  tokenPriceResults.forEach((r) => {
    if (r.status === 'rejected') return;
    if (!r.value) return;
    tokenPrices.set(r.value.address, r.value);
  });

  // Get all tokens accounts
  const tokensAccounts = await getParsedMultipleAccountsInfo(
    client,
    tokenAccountStruct,
    Array.from(tokensAccountsAddresses)
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
    Array.from(mintsAddresses)
  );
  const mintsAccountByAddress: Map<PublicKey, MintAccount> = new Map();
  mintsAccounts.forEach((mintAccount) => {
    if (!mintAccount) return;
    mintsAccountByAddress.set(mintAccount.pubkey, mintAccount as MintAccount);
  });

  for (let id = 0; id < poolsAccounts.length; id++) {
    const poolAccount = poolsAccounts[id];

    const ATokenPrice = tokenPrices.get(poolAccount.tokenAMint.toString());
    const BTokenPrice = tokenPrices.get(poolAccount.tokenBMint.toString());
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

  // Old Pools
  const meteoraPools = pools;
  const reserverAddresses: Set<PublicKey> = new Set();
  meteoraPools.forEach((pool) => {
    pool.reserveAccounts.forEach((reserve) => {
      reserverAddresses.add(new PublicKey(reserve));
    });
  });
  meteoraPools.map((pool) =>
    pool.reserveAccounts.map((reserve) => new PublicKey(reserve))
  );
  const reserveAccounts = await getParsedMultipleAccountsInfo(
    client,
    tokenAccountStruct,
    Array.from(reserverAddresses)
  );
  if (!reserveAccounts) return;

  const reservesAccountByAddress: Map<string, TokenAccount> = new Map();
  reserveAccounts.forEach((reserve) => {
    if (!reserve) return;
    reservesAccountByAddress.set(
      reserve.pubkey.toString(),
      reserve as TokenAccount
    );
  });

  for (let id = 0; id < meteoraPools.length; id++) {
    const pool = meteoraPools[id];
    const { address } = pool;
    const underlyings = [];
    let supplyValue = 0;
    for (let index = 0; index < pool.reserveAccounts.length; index++) {
      const reserveAccount = reservesAccountByAddress.get(
        pool.reserveAccounts[index]
      );
      if (!reserveAccount) continue;

      const reserveTokenPrice = await cache.getTokenPrice(
        reserveAccount.mint.toString(),
        NetworkId.solana
      );
      if (!reserveTokenPrice) continue;

      const reserveAmount = new BigNumber(reserveAccount.amount.toString())
        .div(10 ** reserveTokenPrice.decimals)
        .toNumber();
      const reserveValue = reserveAmount * reserveTokenPrice.price;

      const underlying = {
        networkId: NetworkId.solana,
        address: reserveTokenPrice.address,
        decimals: reserveTokenPrice.decimals,
        price: reserveTokenPrice.price,
        amountPerLp: reserveAmount / reserveValue,
      };
      underlyings.push(underlying);
      supplyValue += reserveValue;
    }

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
