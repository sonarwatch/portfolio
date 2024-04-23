import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import { getMultipleAccountsInfoSafe } from '../../utils/solana/getMultipleAccountsInfoSafe';
import { platformId, poolsKey, poolsPkeys } from './constants';
import { pool1Struct, pool2Struct, pool3Struct } from './structs';
import { fetchTokenSupplyAndDecimals } from '../../utils/solana/fetchTokenSupplyAndDecimals';
import { u8ArrayToString, usdcSolanaMint } from '../../utils/solana';
import { walletTokensPlatform } from '../tokens/constants';
import { CustodyInfo, PoolInfo } from './types';
import { custodiesKey } from '../jupiter/exchange/constants';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const pools = await getMultipleAccountsInfoSafe(client, poolsPkeys);

  if (!pools[0] || !pools[1] || !pools[2]) return;

  const poolsAccounts = [
    pool1Struct.deserialize(pools[0].data)[0],
    pool2Struct.deserialize(pools[1].data)[0],
    pool3Struct.deserialize(pools[2].data)[0],
  ];

  const custodiesInfo = await cache.getItem<CustodyInfo[]>(custodiesKey, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
  if (!custodiesInfo) return;

  const custodiesByPool: Map<string, CustodyInfo> = new Map();
  custodiesInfo.forEach((custody) =>
    custodiesByPool.set(custody.pubkey, custody)
  );

  const poolsInfo: PoolInfo[] = [];
  for (let i = 0; i < poolsAccounts.length; i++) {
    const pool = poolsAccounts[i];
    const { custodies } = pool;
    let rewardPerLp: number | undefined;
    custodies.forEach((custodyPkey) => {
      const custody = custodiesByPool.get(custodyPkey.toString());
      if (custody?.mint === usdcSolanaMint)
        rewardPerLp = Number(custody.feesStats.rewardPerLpStaked);
    });
    const supAndDecimals = await fetchTokenSupplyAndDecimals(
      pool.flpMint,
      client
    );

    const mint = pool.flpMint.toString();
    if (!supAndDecimals) continue;

    const { supply, decimals } = supAndDecimals;

    const price = pool.aumUsd
      .dividedBy(10 ** decimals)
      .dividedBy(supply)
      .toNumber();

    await cache.setTokenPriceSource({
      address: mint,
      decimals,
      id: poolsPkeys[i].toString(),
      networkId: NetworkId.solana,
      platformId: walletTokensPlatform.id,
      price,
      timestamp: Date.now(),
      weight: 1,
      elementName: u8ArrayToString(pool.name),
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
  label: 'normal',
};
export default job;
