import { NetworkId, TokenPriceSource } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../../Cache';
import { Job, JobExecutor } from '../../../Job';
import { platformId } from '../constants';
import multiTokenPools from './multiTokenPools.json';
import {
  ParsedAccount,
  TokenAccount,
  getParsedMultipleAccountsInfo,
  mintAccountStruct,
  tokenAccountStruct,
} from '../../../utils/solana';
import { getClientSolana } from '../../../utils/clients';
import getLpTokenSourceRawOld, {
  PoolUnderlyingRaw,
} from '../../../utils/misc/getLpTokenSourceRawOld';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();
  const reserveAddresses = multiTokenPools
    .map((p) => p.reserveAccounts.map((a) => new PublicKey(a)))
    .flat();
  const reserveAccounts = await getParsedMultipleAccountsInfo(
    connection,
    tokenAccountStruct,
    reserveAddresses
  );
  const reserves: Map<string, ParsedAccount<TokenAccount>> = new Map();
  const tokenAddresses: string[] = [];
  reserveAccounts.forEach((acc) => {
    if (!acc) return;
    reserves.set(acc.pubkey.toString(), acc);
    tokenAddresses.push(acc.mint.toString());
  });
  const tokenPrices = await cache.getTokenPricesAsMap(
    tokenAddresses,
    NetworkId.solana
  );

  const lpMintAccounts = await getParsedMultipleAccountsInfo(
    connection,
    mintAccountStruct,
    multiTokenPools.map((p) => new PublicKey(p.address))
  );

  const lpSources: TokenPriceSource[] = [];
  for (let i = 0; i < multiTokenPools.length; i++) {
    const pool = multiTokenPools[i];
    const lpMintAccount = lpMintAccounts[i];
    if (!lpMintAccount) continue;

    const poolUnderlyingsRaw: PoolUnderlyingRaw[] = [];
    pool.reserveAccounts.forEach((reserveAddress) => {
      const reserveAccount = reserves.get(reserveAddress);
      if (!reserveAccount) return;
      const tokenPrice = tokenPrices.get(reserveAccount.mint.toString());
      if (!tokenPrice) return;

      poolUnderlyingsRaw.push({
        address: reserveAccount.mint.toString(),
        decimals: tokenPrice.decimals,
        price: tokenPrice.price,
        reserveAmountRaw: reserveAccount.amount,
      });
    });
    if (poolUnderlyingsRaw.length !== pool.reserveAccounts.length) continue;

    const lpSource = getLpTokenSourceRawOld(
      NetworkId.solana,
      pool.address,
      platformId,
      {
        address: pool.address,
        decimals: lpMintAccount.decimals,
        supplyRaw: lpMintAccount.supply,
      },
      poolUnderlyingsRaw
    );
    lpSources.push(lpSource);
  }
  await cache.setTokenPriceSources(lpSources);
};
const job: Job = {
  id: `${platformId}-multitoken-pools`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
