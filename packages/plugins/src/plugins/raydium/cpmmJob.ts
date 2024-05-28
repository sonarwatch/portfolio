import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { cpmmProgramId, platformId } from './constants';
import {
  TokenAccount,
  getParsedMultipleAccountsInfo,
  getParsedProgramAccounts,
  tokenAccountStruct,
} from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import { Job, JobExecutor } from '../../Job';
import { Cache } from '../../Cache';
import { cpmmPoolsStateFilter } from './filters';
import { poolStateStruct } from './structs/cpmm';
import { getLpTokenSourceRaw } from '../../utils/misc/getLpTokenSourceRaw';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const clmmPoolsInfo = await getParsedProgramAccounts(
    client,
    poolStateStruct,
    cpmmProgramId,
    cpmmPoolsStateFilter
  );

  const tokenAccountsPkeys: PublicKey[] = [];
  const mints: Set<string> = new Set();
  clmmPoolsInfo.forEach((pI) => {
    mints.add(pI.token0Mint.toString());
    mints.add(pI.token1Mint.toString());
    tokenAccountsPkeys.push(...[pI.token0Vault, pI.token1Vault]);
  });

  const [tokenAccounts, tokenPriceById] = await Promise.all([
    getParsedMultipleAccountsInfo(
      client,
      tokenAccountStruct,
      tokenAccountsPkeys
    ),
    cache.getTokenPricesAsMap(Array.from(mints), NetworkId.solana),
  ]);

  const tokenAccountsMap: Map<string, TokenAccount> = new Map();
  tokenAccounts.forEach((tA) => {
    if (!tA) return;
    tokenAccountsMap.set(tA.pubkey.toString(), tA);
  });

  const tokenPriceSources = [];
  for (let id = 0; id < clmmPoolsInfo.length; id++) {
    const poolState = clmmPoolsInfo[id];

    const mintA = poolState.token0Mint.toString();
    const mintB = poolState.token1Mint.toString();

    const tokenAccountA = tokenAccountsMap.get(
      poolState.token0Vault.toString()
    );
    const tokenAccountB = tokenAccountsMap.get(
      poolState.token1Vault.toString()
    );

    if (!tokenAccountA || !tokenAccountB) continue;

    const decimalsA = poolState.mint0Decimals;
    const decimalsB = poolState.mint1Decimals;
    const tokenAmountARaw = tokenAccountA.amount;
    const tokenAmountBRaw = tokenAccountB.amount;

    if (tokenAmountARaw.isZero() && tokenAmountBRaw.isZero()) continue;

    const [tokenPriceA, tokenPriceB] = [
      tokenPriceById.get(mintA),
      tokenPriceById.get(mintB),
    ];

    const { lpMint, lpMintDecimals, lpSupply } = poolState;
    if (lpSupply.isZero()) continue;

    tokenPriceSources.push(
      ...getLpTokenSourceRaw({
        networkId: NetworkId.solana,
        lpDetails: {
          address: lpMint.toString(),
          decimals: lpMintDecimals,
          supplyRaw: lpSupply,
        },
        poolUnderlyingsRaw: [
          {
            address: mintA,
            decimals: decimalsA,
            tokenPrice: tokenPriceA,
            reserveAmountRaw: tokenAmountARaw,
            weight: 0.5,
          },
          {
            address: mintB,
            decimals: decimalsB,
            tokenPrice: tokenPriceB,
            reserveAmountRaw: tokenAmountBRaw,
            weight: 0.5,
          },
        ],
        sourceId: poolState.pubkey.toString(),
        elementName: 'CPMM',
        platformId,
        priceUnderlyings: true,
      })
    );
  }
  await cache.setTokenPriceSources(tokenPriceSources);
};

const job: Job = {
  id: `${platformId}-cpmm`,
  executor,
  label: 'normal',
};
export default job;
