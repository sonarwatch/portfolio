import { NetworkId, walletTokensPlatformId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import { custodiesKey, platformId, poolsKey, poolsPkeys } from './constants';
import { flPoolStruct } from './structs';
import {
  getParsedMultipleAccountsInfo,
  u8ArrayToString,
  usdcSolanaMint,
} from '../../utils/solana';
import { CustodyInfo, PoolInfo } from './types';
import { getLpTokenPrice } from './helpers';
import { getDecimals } from '../../utils/solana/getDecimals';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const poolsAccounts = await getParsedMultipleAccountsInfo(
    client,
    flPoolStruct,
    poolsPkeys
  );
  const custodiesInfo = await cache.getItem<CustodyInfo[]>(custodiesKey, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
  if (!custodiesInfo) return;

  const custodyAccounts: Map<string, CustodyInfo> = new Map();
  custodiesInfo.forEach((custody) =>
    custodyAccounts.set(custody.pubkey, custody)
  );

  const poolsInfo: PoolInfo[] = [];
  for (let i = 0; i < poolsAccounts.length; i++) {
    const pool = poolsAccounts[i];
    if (!pool) continue;

    const [stakedLpPrice, compoundingLpPrice] = await Promise.all([
      getLpTokenPrice(
        client,
        pool,
        pool.custodies
          .map(
            (c) =>
              custodyAccounts.get(c.toString())?.oracle.customOracleAccount ||
              []
          )
          .flat(),
        'getLpTokenPrice'
      ),
      getLpTokenPrice(
        client,
        pool,
        pool.custodies
          .map(
            (c) =>
              custodyAccounts.get(c.toString())?.oracle.customOracleAccount ||
              []
          )
          .flat(),
        'getCompoundingTokenPrice'
      ),
    ]);

    const [stakedDecimals, compoundingDecimals] = await Promise.all([
      getDecimals(client, pool.flpMint),
      getDecimals(client, pool.compoundingMint),
    ]);

    if (stakedDecimals && stakedLpPrice) {
      await cache.setTokenPriceSource({
        address: pool.flpMint.toString(),
        decimals: stakedDecimals,
        id: poolsPkeys[i].toString(),
        networkId: NetworkId.solana,
        platformId: walletTokensPlatformId,
        price: stakedLpPrice,
        timestamp: Date.now(),
        weight: 1,
        elementName: u8ArrayToString(pool.name),
      });
    }

    if (compoundingDecimals && compoundingLpPrice) {
      await cache.setTokenPriceSource({
        address: pool.compoundingMint.toString(),
        decimals: compoundingDecimals,
        id: poolsPkeys[i].toString(),
        networkId: NetworkId.solana,
        platformId: walletTokensPlatformId,
        price: compoundingLpPrice,
        timestamp: Date.now(),
        weight: 1,
        elementName: u8ArrayToString(pool.name),
      });
    }

    let rewardPerLp: number | undefined;
    pool.custodies.forEach((custodyPkey) => {
      const custody = custodyAccounts.get(custodyPkey.toString());
      if (custody?.mint === usdcSolanaMint)
        rewardPerLp = Number(custody.feesStats.rewardPerLpStaked);
    });
    if (!rewardPerLp) continue;

    poolsInfo.push({
      flpMint: pool.flpMint.toString(),
      compoundingMint: pool.compoundingMint.toString(),
      pkey: poolsPkeys[i].toString(),
      rewardPerLp,
    });
  }

  await cache.setItem(poolsKey, poolsInfo, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-pools`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['realtime', NetworkId.solana],
};
export default job;
