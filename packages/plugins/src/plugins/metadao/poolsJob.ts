import { NetworkId, TokenPriceSource } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import {
  MintAccount,
  getParsedMultipleAccountsInfo,
  getParsedProgramAccounts,
  mintAccountStruct,
} from '../../utils/solana';
import { dataSizeFilter } from '../../utils/solana/filters';
import { ammPid, platformId } from './constants';
import { ammStruct } from './structs';
import { getLpTokenSourceRaw } from '../../utils/misc/getLpTokenSourceRaw';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const pools = await getParsedProgramAccounts(
    client,
    ammStruct,
    ammPid,
    dataSizeFilter(224)
  );

  const mints: Set<string> = new Set();
  const lpMints: PublicKey[] = [];
  pools.forEach((pool) => {
    if (pool.baseAmount.isZero() || pool.quoteAmount.isZero()) return;

    mints.add(pool.quoteMint.toString());
    mints.add(pool.baseMint.toString());
    lpMints.push(pool.lpMint);
  });

  const [tokenPriceById, lpMintsAccounts] = await Promise.all([
    cache.getTokenPricesAsMap(Array.from(mints), NetworkId.solana),
    getParsedMultipleAccountsInfo(client, mintAccountStruct, lpMints),
  ]);
  const lpMintAccountById: Map<string, MintAccount> = new Map();
  lpMintsAccounts.forEach((acc) => {
    if (acc) lpMintAccountById.set(acc.pubkey.toString(), acc);
  });

  const lpTokenSource: TokenPriceSource[] = [];
  for (const pool of pools) {
    const [lpMint, baseMint, quoteMint] = [
      pool.lpMint.toString(),
      pool.baseMint.toString(),
      pool.quoteMint.toString(),
    ];

    const [basePrice, quotePrice, lpMintAccount] = [
      tokenPriceById.get(pool.baseMint.toString()),
      tokenPriceById.get(pool.quoteMint.toString()),
      lpMintAccountById.get(lpMint),
    ];

    if (!basePrice || !quotePrice || !lpMintAccount) continue;

    let lpTypeName;
    if (basePrice.liquidityName?.startsWith('p')) {
      lpTypeName = `passLP ${basePrice.liquidityName.slice(1)}`;
    } else if (basePrice.liquidityName?.startsWith('f')) {
      lpTypeName = `failLP ${basePrice.liquidityName.slice(1)}`;
    }
    lpTokenSource.push(
      ...getLpTokenSourceRaw({
        lpDetails: {
          address: lpMint,
          decimals: lpMintAccount.decimals,
          supplyRaw: lpMintAccount.supply,
        },
        networkId: NetworkId.solana,
        platformId,
        poolUnderlyingsRaw: [
          {
            address: baseMint,
            decimals: pool.baseMintDecimals,
            reserveAmountRaw: pool.baseAmount,
            weight: 0.5,
            tokenPrice: basePrice,
          },
          {
            address: quoteMint,
            decimals: pool.quoteMintDecimals,
            reserveAmountRaw: pool.quoteAmount,
            weight: 0.5,
            tokenPrice: quotePrice,
          },
        ],
        sourceId: pool.pubkey.toString(),
        liquidityName: lpTypeName,
      })
    );
  }
  await cache.setTokenPriceSources(lpTokenSource);
};

const job: Job = {
  id: `${platformId}-pools`,
  executor,
  label: 'normal',
};
export default job;
