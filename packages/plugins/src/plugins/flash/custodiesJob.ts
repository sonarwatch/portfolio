import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { marketsKey, flashPid, platformId, custodiesKey } from './constants';
import { Custody, custodyStruct, marketStruct } from './structs';
import { marketsFilter } from './filters';
import { getMultipleAccountsInfoSafe } from '../../utils/solana/getMultipleAccountsInfoSafe';
import { CustodyEnhanced } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const markets = await getParsedProgramAccounts(
    client,
    marketStruct,
    flashPid,
    marketsFilter()
  );

  const custodiesPubKeys = markets
    .map((market) => [market.targetCustody, market.collateralCustody])
    .flat()
    .filter((key) => key.toString() !== '11111111111111111111111111111111');

  const custodiesAccounts = await getMultipleAccountsInfoSafe(
    client,
    custodiesPubKeys
  );
  if (custodiesAccounts.length === 0) return;

  const custodyById: Map<string, Custody> = new Map();
  const custodies: CustodyEnhanced[] = [];
  custodiesAccounts.forEach((account, index) => {
    if (account && account.data.byteLength >= custodyStruct.byteSize) {
      const custodyAccount = custodyStruct.deserialize(account.data)[0];
      custodyById.set(custodiesPubKeys[index].toString(), custodyAccount);
      custodies.push({
        ...custodyAccount,
        pubkey: custodiesPubKeys[index].toString(),
      });
    }
  });

  const marketsInfo = [];
  for (const market of markets) {
    if (
      market.collateralCustody.toString() ===
        '11111111111111111111111111111111' ||
      market.targetCustody.toString() === '11111111111111111111111111111111'
    )
      continue;
    const colCustody = custodyById.get(market.collateralCustody.toString());
    const targetcustody = custodyById.get(market.targetCustody.toString());
    if (!colCustody || !targetcustody) continue;
    marketsInfo.push({
      ...market,
      collateralCustodyAccount: colCustody,
      targetCustodyAccount: targetcustody,
    });
  }

  await cache.setItem(marketsKey, marketsInfo, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });

  await cache.setItem(custodiesKey, custodies, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-custodies`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
