import { PublicKey } from '@solana/web3.js';
import { NetworkId, TokenPrice } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import {
  TokenAccount,
  getParsedMultipleAccountsInfo,
  getParsedProgramAccounts,
  tokenAccountStruct,
} from '../../utils/solana';
import {
  OpenOrdersV2,
  openOrdersV2Struct,
} from '../orders/clobs-solana/structs';
import { atrixV1, platformId } from './constants';
import { poolStruct } from './structs';
import { fetchTokenSupplyAndDecimals } from '../../utils/solana/fetchTokenSupplyAndDecimals';
import getLpTokenSourceOld from '../../utils/misc/getLpTokenSourceOld';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const poolsAccounts = await getParsedProgramAccounts(
    client,
    poolStruct,
    atrixV1
  );

  const tokensAccountsAddresses: PublicKey[] = [];
  const ordersAccountsAddresses: PublicKey[] = [];
  const tokensAddresses: Set<string> = new Set();

  poolsAccounts.forEach((pool) => {
    if (
      pool.poolCoinAccount.toString() === '11111111111111111111111111111111' ||
      pool.poolPcAccount.toString() === '11111111111111111111111111111111'
    )
      return;
    if (
      pool.pubkey.toString() === 'BumkG6W1Jvmd3nUM16VWEncfJuL9mYyveE5RgvHubqnw'
    ) {
      tokensAddresses.add(pool.pcMint.toString());
      tokensAddresses.add(pool.coinMint.toString());
    }
    tokensAccountsAddresses.push(...[pool.poolCoinAccount, pool.poolPcAccount]);
    ordersAccountsAddresses.push(pool.openOrders);
  });

  const tokensAccounts = await getParsedMultipleAccountsInfo(
    client,
    tokenAccountStruct,
    tokensAccountsAddresses
  );

  const tokenAccountById: Map<string, TokenAccount> = new Map();
  tokensAccounts.forEach((tA) =>
    tA ? tokenAccountById.set(tA.pubkey.toString(), tA) : []
  );

  const openOrdersAccounts = await getParsedMultipleAccountsInfo(
    client,
    openOrdersV2Struct,
    ordersAccountsAddresses
  );

  const orderAccountById: Map<string, OpenOrdersV2> = new Map();
  openOrdersAccounts.forEach((account) =>
    account ? orderAccountById.set(account.pubkey.toString(), account) : []
  );

  const tokensPrices = await cache.getTokenPrices(
    Array.from(tokensAddresses),
    NetworkId.solana
  );
  const tokenPriceById: Map<string, TokenPrice> = new Map();
  tokensPrices.forEach((tP) => (tP ? tokenPriceById.set(tP.address, tP) : []));

  const sourcesPromises = [];
  for (const pool of poolsAccounts) {
    const [coinAccount, pcAccount, openOrderAccount] = [
      tokenAccountById.get(pool.poolCoinAccount.toString()),
      tokenAccountById.get(pool.poolPcAccount.toString()),
      orderAccountById.get(pool.openOrders.toString()),
    ];

    const [coinTokenPrice, pcTokenPrice] = [
      tokenPriceById.get(pool.coinMint.toString()),
      tokenPriceById.get(pool.pcMint.toString()),
    ];

    if (
      !coinAccount ||
      !pcAccount ||
      !coinTokenPrice ||
      !pcTokenPrice ||
      !openOrderAccount
    )
      continue;

    const { baseTokenTotal, quoteTokenTotal } = openOrderAccount;
    const supplyAndDecimals = await fetchTokenSupplyAndDecimals(
      pool.lpMint,
      client
    );

    if (!supplyAndDecimals) continue;

    const { supply, decimals } = supplyAndDecimals;

    const poolUnderlyings = [
      {
        address: pool.coinMint.toString(),
        reserveAmount: coinAccount.amount
          .plus(baseTokenTotal)
          .dividedBy(10 ** coinTokenPrice.decimals)
          .toNumber(),
        price: coinTokenPrice.price,
        decimals: coinTokenPrice.decimals,
      },
      {
        address: pool.pcMint.toString(),
        reserveAmount: pcAccount.amount
          .plus(quoteTokenTotal)
          .dividedBy(10 ** pcTokenPrice.decimals)
          .toNumber(),
        price: pcTokenPrice.price,
        decimals: pcTokenPrice.decimals,
      },
    ];

    const lpDetailsRaw = {
      address: pool.lpMint.toString(),
      decimals,
      supply,
    };

    const source = getLpTokenSourceOld(
      NetworkId.solana,
      pool.pubkey.toString(),
      platformId,
      lpDetailsRaw,
      poolUnderlyings,
      'V1 (Deprecated)'
    );
    sourcesPromises.push(cache.setTokenPriceSource(source));
  }

  await Promise.allSettled(sourcesPromises);
};

const job: Job = {
  id: `${platformId}-pools-v1`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
