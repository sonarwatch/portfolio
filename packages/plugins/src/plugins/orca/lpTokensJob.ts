import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import { aquafarmsProgram, platformId, poolsProgram } from './constants';
import { poolsFilters, aquafarmFilters } from './filters';
import { getClientSolana } from '../../utils/clients';
import { aquafarmStruct, poolInfoStruct } from './structs/oldLiquidities';
import {
  TokenAccount,
  getParsedMultipleAccountsInfo,
  getParsedProgramAccounts,
  tokenAccountStruct,
} from '../../utils/solana';
import { fetchTokenSupplyAndDecimals } from '../../utils/solana/fetchTokenSupplyAndDecimals';
import { Job, JobExecutor } from '../../Job';
import { Cache } from '../../Cache';
import runInBatch from '../../utils/misc/runInBatch';
import { minimumLiquidity } from '../../utils/misc/computeAndStoreLpPrice';
import getTokenPricesMap from '../../utils/misc/getTokensPricesMap';
import getLpUnderlyingTokenSource from '../../utils/misc/getLpUnderlyingTokenSource';
import { getDecimalsForToken } from '../../utils/misc/getDecimalsForToken';
import getLpTokenSourceRaw from '../../utils/misc/getLpTokenSourceRaw';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();
  const farmsAccounts = await getParsedProgramAccounts(
    client,
    aquafarmStruct,
    aquafarmsProgram,
    aquafarmFilters
  );

  const poolsAccounts = await getParsedProgramAccounts(
    client,
    poolInfoStruct,
    poolsProgram,
    poolsFilters
  );

  const mints: string[] = [];
  const tokensAccountAddresses: PublicKey[] = [];
  farmsAccounts.forEach((farm) => {
    mints.push(farm.baseTokenMint.toString());
    tokensAccountAddresses.push(farm.baseTokenVault);
  });
  poolsAccounts.forEach((pool) => {
    mints.push(...[pool.mintA.toString(), pool.mintB.toString()]);
    tokensAccountAddresses.push(...[pool.tokenAccountA, pool.tokenAccountB]);
  });

  const tokenPrices = await getTokenPricesMap(mints, NetworkId.solana, cache);

  const tokensAccounts = await getParsedMultipleAccountsInfo(
    client,
    tokenAccountStruct,
    tokensAccountAddresses
  );

  const tokenAccountByAddress: Map<string, TokenAccount> = new Map();
  tokensAccounts.forEach((tAccount) => {
    if (!tAccount) return;
    tokenAccountByAddress.set(tAccount.pubkey.toString(), tAccount);
  });

  const batchResult = await runInBatch(
    poolsAccounts.map(
      (pool) => () => fetchTokenSupplyAndDecimals(pool.tokenPool, client, 0)
    )
  );

  const poolTokenInfoByAddress: Map<
    string,
    { supply: number; decimals: number }
  > = new Map();
  batchResult.forEach((r, index) => {
    if (r.status === 'rejected') return;
    if (!r.value) return;
    poolTokenInfoByAddress.set(
      poolsAccounts[index].tokenPool.toString(),
      r.value
    );
  });

  for (const poolAccount of poolsAccounts) {
    if (
      [
        poolAccount.tokenAccountA.toString(),
        poolAccount.tokenAccountB.toString(),
      ].includes('11111111111111111111111111111111')
    )
      continue;

    const lpMint = poolAccount.tokenPool;
    const lpSupplyAndDecimals = poolTokenInfoByAddress.get(lpMint.toString());
    if (!lpSupplyAndDecimals) continue;

    const lpSupply = new BigNumber(lpSupplyAndDecimals.supply).times(
      10 ** lpSupplyAndDecimals.decimals
    );
    if (lpSupply.isZero()) continue;

    const poolCoinTokenAccount = tokenAccountByAddress.get(
      poolAccount.tokenAccountA.toString()
    );
    const poolPcTokenAccount = tokenAccountByAddress.get(
      poolAccount.tokenAccountB.toString()
    );
    if (!poolPcTokenAccount || !poolCoinTokenAccount) continue;

    const mintA = poolAccount.mintA.toString();
    const mintB = poolAccount.mintB.toString();

    const tokenPriceA = tokenPrices.get(poolAccount.mintA.toString());
    const tokenPriceB = tokenPrices.get(poolAccount.mintB.toString());

    const [decimalsA, decimalsB] = await Promise.all([
      getDecimalsForToken(cache, mintA, NetworkId.solana),
      getDecimalsForToken(cache, mintB, NetworkId.solana),
    ]);
    const lpDecimals = lpSupplyAndDecimals.decimals;

    if (!decimalsA || !decimalsB) continue;

    const coinAmountWei = new BigNumber(poolCoinTokenAccount.amount.toString());
    const pcAmountWei = new BigNumber(poolPcTokenAccount.amount.toString());

    const underlyingSource = getLpUnderlyingTokenSource(
      lpMint.toString(),
      NetworkId.solana,
      {
        address: mintA,
        decimals: decimalsA,
        reserveAmountRaw: coinAmountWei,
        tokenPrice: tokenPriceA,
      },
      {
        address: mintB,
        decimals: decimalsB,
        reserveAmountRaw: pcAmountWei,
        tokenPrice: tokenPriceB,
      }
    );
    if (underlyingSource) await cache.setTokenPriceSource(underlyingSource);

    if (!tokenPriceA || !tokenPriceB) continue;

    const lpSource = getLpTokenSourceRaw(
      NetworkId.solana,
      lpMint.toString(),
      platformId,
      { address: lpMint.toString(), decimals: lpDecimals, supplyRaw: lpSupply },
      [
        {
          address: tokenPriceA.address,
          decimals: tokenPriceA.decimals,
          price: tokenPriceA.price,
          reserveAmountRaw: coinAmountWei,
        },
        {
          address: tokenPriceB.address,
          decimals: tokenPriceB.decimals,
          price: tokenPriceB.price,
          reserveAmountRaw: pcAmountWei,
        },
      ],
      'Aquafarms (deprecated)'
    );

    await cache.setTokenPriceSource(lpSource);

    // const poolData: PoolData = {
    //   id: lpMint.toString(),
    //   lpDecimals,
    //   mintTokenX: poolAccount.mintA.toString(),
    //   mintTokenY: poolAccount.mintB.toString(),
    //   reserveTokenX: coinAmountWei,
    //   reserveTokenY: pcAmountWei,
    //   supply: lpSupply,
    //   decimalX: tokenPriceA.decimals,
    //   decimalY: tokenPriceB.decimals,
    // };

    // await computeAndStoreLpPrice(cache, poolData, NetworkId.solana, platformId);
  }

  const tokensSupDecResult = await runInBatch(
    farmsAccounts.map(
      (farm) => () => fetchTokenSupplyAndDecimals(farm.farmTokenMint, client, 0)
    )
  );
  const tokensSuppliesAndDecimalsByMint: Map<
    string,
    { supply: number; decimals: number }
  > = new Map();
  tokensSupDecResult.forEach((r, index) => {
    if (r.status === 'rejected') return;
    if (!r.value) return;
    tokensSuppliesAndDecimalsByMint.set(
      farmsAccounts[index].farmTokenMint.toString(),
      r.value
    );
  });

  for (let i = 0; i < farmsAccounts.length; i += 1) {
    const aquafarm = farmsAccounts[i];

    const baseMint = aquafarm.baseTokenMint.toString();
    const baseToken = await cache.getTokenPrice(baseMint, NetworkId.solana);
    if (!baseToken) continue;

    const baseVault = tokenAccountByAddress.get(
      aquafarm.baseTokenVault.toString()
    );
    if (!baseVault) continue;
    if (baseVault.amount.isZero()) continue;

    const farmMint = aquafarm.farmTokenMint.toString();
    const tokenSupplyRes = tokensSuppliesAndDecimalsByMint.get(farmMint);
    if (!tokenSupplyRes) continue;

    const { decimals: farmDecimals, supply: farmSupply } = tokenSupplyRes;
    const baseVaultAmount = baseVault.amount
      .div(10 ** baseToken.decimals)
      .toNumber();
    const baseVaultValue = baseVaultAmount * baseToken.price;

    if (baseVaultValue < minimumLiquidity.toNumber()) continue;
    const price = baseVaultValue / farmSupply;

    await cache.setTokenPriceSource({
      id: platformId,
      elementName: 'Aquafarms (deprecated)',
      weight: 1,
      address: farmMint.toString(),
      networkId: NetworkId.solana,
      platformId,
      decimals: farmDecimals,
      price,
      underlyings: baseToken.underlyings,
      timestamp: Date.now(),
    });
  }
};

const job: Job = {
  id: `${platformId}-lp-tokens`,
  executor,
  label: 'normal',
};
export default job;
