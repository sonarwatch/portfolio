import { NetworkId, TokenPriceSource } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import {
  aquafarmsProgram,
  orcaStakingPlatformId,
  platformId,
  poolsProgram,
} from './constants';
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
import { getCachedDecimalsForToken } from '../../utils/misc/getCachedDecimalsForToken';
import { getLpTokenSource } from '../../utils/misc/getLpTokenSource';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const [farmsAccounts, poolsAccounts] = await Promise.all([
    getParsedProgramAccounts(
      client,
      aquafarmStruct,
      aquafarmsProgram,
      aquafarmFilters
    ),
    getParsedProgramAccounts(
      client,
      poolInfoStruct,
      poolsProgram,
      poolsFilters
    ),
  ]);

  const mintsSet: Set<string> = new Set();
  const tokensAccountAddresses: PublicKey[] = [];

  farmsAccounts.forEach((farm) => {
    mintsSet.add(farm.baseTokenMint.toString());
    tokensAccountAddresses.push(farm.baseTokenVault);
  });
  poolsAccounts.forEach((pool) => {
    mintsSet.add(pool.mintA.toString());
    mintsSet.add(pool.mintB.toString());
    tokensAccountAddresses.push(...[pool.tokenAccountA, pool.tokenAccountB]);
  });
  const mints = Array.from(mintsSet);

  const [
    tokenPriceById,
    tokensAccounts,
    poolsSupplyAndDecimals,
    farmsSupplyAndDecimals,
  ] = await Promise.all([
    cache.getTokenPricesAsMap(mints, NetworkId.solana),
    getParsedMultipleAccountsInfo(
      client,
      tokenAccountStruct,
      tokensAccountAddresses
    ),
    runInBatch(
      poolsAccounts.map(
        (pool) => () => fetchTokenSupplyAndDecimals(pool.tokenPool, client, 0)
      )
    ),
    runInBatch(
      farmsAccounts.map(
        (farm) => () =>
          fetchTokenSupplyAndDecimals(farm.farmTokenMint, client, 0)
      )
    ),
  ]);

  const unknownMints = mints.filter((mint) => !tokenPriceById.get(mint));

  const mintDecimals = await runInBatch(
    unknownMints.map(
      (mint) => () => getCachedDecimalsForToken(cache, mint, NetworkId.solana)
    )
  );
  const tokenAccountByAddress: Map<string, TokenAccount> = new Map();
  const tokensSupplyAndDecimalsByMint: Map<
    string,
    { supply: number; decimals: number }
  > = new Map();
  const decimalsByMint: Map<string, number> = new Map();

  tokensAccounts.forEach((tAccount) => {
    if (!tAccount) return;
    tokenAccountByAddress.set(tAccount.pubkey.toString(), tAccount);
  });

  farmsSupplyAndDecimals.forEach((r, index) => {
    if (r.status === 'rejected') return;
    if (!r.value) return;
    tokensSupplyAndDecimalsByMint.set(
      farmsAccounts[index].farmTokenMint.toString(),
      r.value
    );
  });
  poolsSupplyAndDecimals.forEach((r, index) => {
    if (r.status === 'rejected') return;
    if (!r.value) return;
    tokensSupplyAndDecimalsByMint.set(
      poolsAccounts[index].tokenPool.toString(),
      r.value
    );
  });
  mintDecimals.forEach((r, index) => {
    if (r.status === 'rejected') return;
    if (!r.value) return;
    decimalsByMint.set(mints[index], r.value);
  });

  const sources: TokenPriceSource[] = [];
  for (const poolAccount of poolsAccounts) {
    if (
      [
        poolAccount.tokenAccountA.toString(),
        poolAccount.tokenAccountB.toString(),
      ].includes('11111111111111111111111111111111')
    )
      continue;

    const lpMint = poolAccount.tokenPool;

    const lpSupplyAndDecimals = tokensSupplyAndDecimalsByMint.get(
      lpMint.toString()
    );
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

    const tokenPriceA = tokenPriceById.get(poolAccount.mintA.toString());
    const tokenPriceB = tokenPriceById.get(poolAccount.mintB.toString());

    const [decimalsA, decimalsB] = [
      tokenPriceA?.decimals || decimalsByMint.get(mintA),
      tokenPriceB?.decimals || decimalsByMint.get(mintB),
    ];
    const lpDecimals = lpSupplyAndDecimals.decimals;

    if (!decimalsA || !decimalsB) continue;

    const coinAmountWei = new BigNumber(poolCoinTokenAccount.amount.toString());
    const pcAmountWei = new BigNumber(poolPcTokenAccount.amount.toString());

    const tokenPriceSources = getLpTokenSource({
      lpDetails: {
        address: lpMint.toString(),
        decimals: lpDecimals,
        supply: lpSupply.dividedBy(10 ** lpDecimals).toNumber(),
      },
      networkId: NetworkId.solana,
      platformId,
      poolUnderlyings: [
        {
          address: mintA,
          decimals: decimalsA,
          tokenPrice: tokenPriceA,
          reserveAmount: coinAmountWei.dividedBy(10 ** decimalsA).toNumber(),
        },
        {
          address: mintB,
          decimals: decimalsB,
          reserveAmount: pcAmountWei.dividedBy(10 ** decimalsB).toNumber(),
          tokenPrice: tokenPriceB,
        },
      ],
      sourceId: lpMint.toString(),
      elementName: 'Aquafarms (deprecated)',
      priceUnderlyings: true,
    });

    sources.push(...tokenPriceSources);
  }

  for (let i = 0; i < farmsAccounts.length; i += 1) {
    const aquafarm = farmsAccounts[i];
    if (
      aquafarm.farmTokenMint.toString() !==
      'DJseRvvLM53GrowUcjjCRYXJSzMH7dN5jrkGWaFAU3fm'
    )
      continue;
    const baseMint = aquafarm.baseTokenMint.toString();
    const baseTokenPrice = tokenPriceById.get(baseMint);
    if (!baseTokenPrice) continue;

    const baseVault = tokenAccountByAddress.get(
      aquafarm.baseTokenVault.toString()
    );
    if (!baseVault) continue;
    if (baseVault.amount.isZero()) continue;

    const farmMint = aquafarm.farmTokenMint.toString();
    const tokenSupplyRes = tokensSupplyAndDecimalsByMint.get(farmMint);
    if (!tokenSupplyRes) continue;

    const { decimals: farmDecimals, supply: farmSupply } = tokenSupplyRes;
    const baseVaultAmount = baseVault.amount
      .div(10 ** baseTokenPrice.decimals)
      .toNumber();
    const baseVaultValue = baseVaultAmount * baseTokenPrice.price;

    if (baseVaultValue < minimumLiquidity.toNumber()) continue;
    const price = baseVaultValue / farmSupply;

    if (
      aquafarm.farmTokenMint.toString() ===
      'DJseRvvLM53GrowUcjjCRYXJSzMH7dN5jrkGWaFAU3fm'
    ) {
      sources.push({
        id: orcaStakingPlatformId,
        elementName: '(deprecated)',
        weight: 1,
        address: farmMint.toString(),
        networkId: NetworkId.solana,
        platformId,
        decimals: farmDecimals,
        price,
        underlyings: baseTokenPrice.underlyings || [
          { ...baseTokenPrice, amountPerLp: 1 },
        ],
        timestamp: Date.now(),
      });
      continue;
    }

    sources.push({
      id: platformId,
      elementName: 'Aquafarms (deprecated)',
      weight: 1,
      address: farmMint.toString(),
      networkId: NetworkId.solana,
      platformId,
      decimals: farmDecimals,
      price,
      underlyings: baseTokenPrice.underlyings || [
        { ...baseTokenPrice, amountPerLp: 1 },
      ],
      timestamp: Date.now(),
    });
  }

  await cache.setTokenPriceSources(sources);
};

const job: Job = {
  id: `${platformId}-lp-tokens`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
