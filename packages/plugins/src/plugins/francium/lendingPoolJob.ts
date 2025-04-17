import BN from 'bn.js';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  lendingPoolList,
  lendingPools,
  lendingPoolsCacheKey,
  platformId,
} from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedMultipleAccountsInfo } from '../../utils/solana';
import { lendingPoolStruct } from './structs';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const lendingPoolPublicKeyList = lendingPoolList.map(
    (p) => lendingPools[p.pool].lendingPoolInfoAccount
  );

  const accountInfos = await getParsedMultipleAccountsInfo(
    client,
    lendingPoolStruct,
    lendingPoolPublicKeyList
  );

  const formatResults = accountInfos.map((accountInfo, index) => {
    if (!accountInfo) return null;

    const availableAmount = new BN(
      String(accountInfo.liquidity_available_amount)
    );
    const borrowedAmount = new BN(
      accountInfo.liquidity_borrowed_amount_wads,
      'le'
    ).div(new BN(10).pow(new BN(18)));

    const totalAmount = availableAmount.add(borrowedAmount);

    const totalShareMintSupply = new BN(
      accountInfo.share_mint_total_supply,
      'le'
    );

    return {
      pool: lendingPoolList[index].pool,
      totalAmount: totalAmount.toString(),
      totalShareMintSupply: totalShareMintSupply.toString(),
    };
  });

  await cache.setItem(lendingPoolsCacheKey, formatResults, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};
const job: Job = {
  id: `${platformId}-lending-pool`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
