import { NetworkId, TokenPrice } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import getLpTokenSource from '../../utils/misc/getLpTokenSource';
import { getMultipleAccountsInfoSafe } from '../../utils/solana/getMultipleAccountsInfoSafe';
import { platformId, poolsPkeys } from './constants';
import { pool1Struct, pool2Struct } from './structs';
import { decodeName } from '../mango/helpers';
import { fetchTokenSupplyAndDecimals } from '../../utils/solana/fetchTokenSupplyAndDecimals';
import { CustodyInfo } from './types';
import {
  TokenAccount,
  getParsedMultipleAccountsInfo,
  tokenAccountStruct,
} from '../../utils/solana';
import { custodiesKey } from '../jupiter/constants';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const pools = await getMultipleAccountsInfoSafe(client, poolsPkeys);

  if (!pools[0] || !pools[1]) return;

  const poolsAccounts = [
    pool1Struct.deserialize(pools[0].data)[0],
    pool2Struct.deserialize(pools[1].data)[0],
  ];

  const custodies = await cache.getItem<CustodyInfo[]>(custodiesKey, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
  if (!custodies) return;

  const custodyById: Map<string, CustodyInfo> = new Map();
  for (const custody of custodies) {
    custodyById.set(custody.pubkey, custody);
  }

  const underlyingsTokenAccountsKey = custodies.map(
    (account) => new PublicKey(account.tokenAccount)
  );
  const underlyingsTokenAccounts = await getParsedMultipleAccountsInfo(
    client,
    tokenAccountStruct,
    underlyingsTokenAccountsKey
  );
  const tokenAccountById: Map<string, TokenAccount> = new Map();
  const mints: Set<string> = new Set();
  for (const tokenAccount of underlyingsTokenAccounts) {
    if (tokenAccount) {
      tokenAccountById.set(tokenAccount.pubkey.toString(), tokenAccount);
      mints.add(tokenAccount.mint.toString());
    }
  }

  const tokenPrices = await cache.getTokenPrices(
    Array.from(mints),
    NetworkId.solana
  );
  const tokenPriceById: Map<string, TokenPrice> = new Map();
  for (const tokenPrice of tokenPrices) {
    if (tokenPrice) tokenPriceById.set(tokenPrice.address, tokenPrice);
  }

  for (let i = 0; i < poolsAccounts.length; i++) {
    const pool = poolsAccounts[i];
    const mint = pool.flpMint.toString();
    const supAndDecimals = await fetchTokenSupplyAndDecimals(
      new PublicKey(mint),
      client
    );
    if (!supAndDecimals) continue;
    const { supply, decimals } = supAndDecimals;

    const custodiesAccounts = pool.custodies
      .map((custody) => {
        const account = custodyById.get(custody.toString());
        return account || [];
      })
      .flat();
    const tokenAccountKeys = custodiesAccounts.map(
      (account) => account.tokenAccount
    );

    const tokenAccounts = tokenAccountKeys
      .map((key) => {
        const tokenAccount = tokenAccountById.get(key);
        return tokenAccount || [];
      })
      .flat();

    if (tokenAccounts.length !== custodiesAccounts.length) continue;
    const assets = [];
    for (const tokenAccount of tokenAccounts) {
      if (!tokenAccount) continue;
      const tokenPrice = tokenPriceById.get(tokenAccount.mint.toString());
      if (!tokenPrice) continue;
      assets.push({
        address: tokenAccount.mint.toString(),
        decimals: tokenPrice.decimals,
        price: tokenPrice.price,
        reserveAmount: tokenAccount.amount
          .dividedBy(10 ** tokenPrice.decimals)
          .toNumber(),
      });
    }

    // eslint-disable-next-line prefer-const
    let source = getLpTokenSource(
      NetworkId.solana,
      poolsPkeys[i].toString(),
      platformId,
      decodeName(pool.name),
      { address: mint, decimals, supply },
      assets
    );
    source.price = pool.aumUsd
      .dividedBy(10 ** decimals)
      .dividedBy(supply)
      .toNumber();

    await cache.setItem(poolsPkeys[i].toString(), [pool.flpMint.toString()], {
      prefix: platformId,
      networkId: NetworkId.solana,
    });

    await cache.setTokenPriceSource(source);
  }
};

const job: Job = {
  id: `${platformId}-pool`,
  executor,
  label: 'normal',
};
export default job;
