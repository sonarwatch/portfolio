import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { cpmmProgramId, platformId } from './constants';
import {
  ParsedAccount,
  getParsedMultipleAccountsInfo,
  tokenAccountStruct,
} from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import { Job, JobExecutor } from '../../Job';
import { Cache } from '../../Cache';
import { cpmmPoolsStateFilter } from './filters';
import { PoolState, poolStateStruct } from './structs/cpmm';
import { getLpTokenSourceRaw } from '../../utils/misc/getLpTokenSourceRaw';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const allPoolsPubkeys = await client.getProgramAccounts(cpmmProgramId, {
    filters: cpmmPoolsStateFilter,
    dataSlice: { offset: 0, length: 0 },
  });

  const step = 100;
  const tokenPriceSources = [];
  let cpmmPoolsInfo: (ParsedAccount<PoolState> | null)[];
  let tokenAccounts;
  let tokenPriceById;
  for (let offset = 0; offset < allPoolsPubkeys.length; offset += step) {
    const tokenAccountsPkeys: PublicKey[] = [];
    const mints: Set<string> = new Set();

    cpmmPoolsInfo = await getParsedMultipleAccountsInfo(
      client,
      poolStateStruct,
      allPoolsPubkeys.slice(offset, offset + step).map((res) => res.pubkey)
    );

    cpmmPoolsInfo.forEach((pI) => {
      if (!pI) return;
      mints.add(pI.token0Mint.toString());
      mints.add(pI.token1Mint.toString());
      tokenAccountsPkeys.push(...[pI.token0Vault, pI.token1Vault]);
    });

    [tokenAccounts, tokenPriceById] = await Promise.all([
      getParsedMultipleAccountsInfo(
        client,
        tokenAccountStruct,
        tokenAccountsPkeys
      ),
      cache.getTokenPricesAsMap(Array.from(mints), NetworkId.solana),
    ]);

    const tokenAccountsMap = new Map();
    tokenAccounts.forEach((tA) => {
      if (!tA) return;
      tokenAccountsMap.set(tA.pubkey.toString(), tA);
    });

    for (let id = 0; id < cpmmPoolsInfo.length; id++) {
      const poolState = cpmmPoolsInfo[id];
      if (!poolState) continue;

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
  }
  await cache.setTokenPriceSources(tokenPriceSources);
};

const job: Job = {
  id: `${platformId}-cpmm`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
