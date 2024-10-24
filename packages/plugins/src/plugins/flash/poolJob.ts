import { NetworkId } from '@sonarwatch/portfolio-core';
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
import { walletTokensPlatform } from '../tokens/constants';
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

    const lpPrice = await getLpTokenPrice(
      client,
      pool,
      pool.custodies.map(
        (c) =>
          custodyAccounts.get(c.toString())?.oracle.customOracleAccount || ''
      )
    );
    const decimals = await getDecimals(client, pool.flpMint);

    if (decimals && lpPrice) {
      await cache.setTokenPriceSource({
        address: pool.flpMint.toString(),
        decimals,
        id: poolsPkeys[i].toString(),
        networkId: NetworkId.solana,
        platformId: walletTokensPlatform.id,
        price: lpPrice,
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
  executor,
  label: 'realtime',
};
export default job;
