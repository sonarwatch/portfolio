import { NetworkId, TokenPrice } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
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

  const mints: Set<string> = new Set();
  poolsAccounts.forEach((p) =>
    mints.add(p.mintA.toString()).add(p.mintB.toString())
  );
  farmsAccounts.forEach((a) => mints.add(a.baseTokenMint.toString()));

  const tokenPriceResults = await runInBatch(
    [...Array.from(mints)].map(
      (mint) => () => cache.getTokenPrice(mint, NetworkId.solana)
    )
  );
  const tokenPrices: Map<string, TokenPrice> = new Map();
  tokenPriceResults.forEach((r) => {
    if (r.status === 'rejected') return;
    if (!r.value) return;
    tokenPrices.set(r.value.address, r.value);
  });

  const tokenAddresses = [
    ...farmsAccounts.map((a) => a.baseTokenVault),
    ...poolsAccounts.map((p) => [p.tokenAccountA, p.tokenAccountB]).flat(),
  ];

  const tokensAccounts = await getParsedMultipleAccountsInfo(
    client,
    tokenAccountStruct,
    tokenAddresses
  );

  const tokenAccountByAddress: Map<string, TokenAccount> = new Map();
  tokensAccounts.forEach((tAccount) => {
    if (!tAccount) return;
    tokenAccountByAddress.set(tAccount.pubkey.toString(), tAccount);
  });

  const batchResult = await runInBatch(
    poolsAccounts.map(
      (farm) => () => fetchTokenSupplyAndDecimals(farm.tokenPool, client, 0)
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

  const poolsPromises: Promise<any>[] = [];
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

    const lpSupply = lpSupplyAndDecimals.supply;
    if (lpSupply === 0) continue;

    const poolCoinTokenAccount = tokenAccountByAddress.get(
      poolAccount.tokenAccountA.toString()
    );
    const poolPcTokenAccount = tokenAccountByAddress.get(
      poolAccount.tokenAccountB.toString()
    );
    if (!poolPcTokenAccount || !poolCoinTokenAccount) continue;

    const coinToken = tokenPrices.get(poolAccount.mintA.toString());
    const pcToken = tokenPrices.get(poolAccount.mintB.toString());
    if (!coinToken || !pcToken) continue;

    const coinDecimals = coinToken.decimals;
    const pcDecimals = pcToken.decimals;

    const coinAmountWei = new BigNumber(poolCoinTokenAccount.amount.toString());
    const pcAmountWei = new BigNumber(poolPcTokenAccount.amount.toString());
    const coinAmount = coinAmountWei
      .dividedBy(new BigNumber(10 ** coinDecimals))
      .toNumber();
    const pcAmount = pcAmountWei
      .dividedBy(new BigNumber(10 ** pcDecimals))
      .toNumber();

    const coinValueLocked = coinAmount * coinToken.price;
    const pcValueLocked = pcAmount * pcToken.price;

    const lpDecimals = lpSupplyAndDecimals.decimals;

    const tvl = coinValueLocked + pcValueLocked;
    const price = tvl / lpSupply;

    poolsPromises.push(
      cache.setTokenPriceSource({
        networkId: NetworkId.solana,
        platformId,
        id: platformId,
        weight: 1,
        address: lpMint.toString(),
        price,
        decimals: lpDecimals,
        underlyings: [
          {
            networkId: NetworkId.solana,
            address: coinToken.address,
            decimals: coinToken.decimals,
            price: coinToken.price,
            amountPerLp: coinAmount / lpSupply,
          },
          {
            networkId: NetworkId.solana,
            address: pcToken.address,
            decimals: pcToken.decimals,
            price: pcToken.price,
            amountPerLp: pcAmount / lpSupply,
          },
        ],
        timestamp: Date.now(),
      })
    );
  }

  await Promise.allSettled(poolsPromises);

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

  const farmsPromises: Promise<any>[] = [];
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
    const price = baseVaultValue / farmSupply;

    farmsPromises.push(
      cache.setTokenPriceSource({
        id: platformId,
        weight: 1,
        address: farmMint.toString(),
        networkId: NetworkId.solana,
        platformId,
        decimals: farmDecimals,
        price,
        underlyings: [
          {
            networkId: NetworkId.solana,
            address: baseToken.address,
            decimals: baseToken.decimals,
            price: baseToken.price,
            amountPerLp: baseVaultAmount / baseVaultValue,
          },
        ],
        timestamp: Date.now(),
      })
    );
  }
  await Promise.allSettled(farmsPromises);
};

const job: Job = {
  id: `${platformId}-lp-tokens`,
  executor,
};
export default job;
