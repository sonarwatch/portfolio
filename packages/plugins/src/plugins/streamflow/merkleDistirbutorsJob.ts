import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { merklePid, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';

import { Job, JobExecutor } from '../../Job';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { merkleDistributorStruct } from './structs';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const merkleAccounts = await ParsedGpa.build(
    client,
    merkleDistributorStruct,
    merklePid
  )
    .addFilter('accountDiscriminator', [77, 119, 139, 70, 84, 247, 12, 26])
    .addDataSizeFilter(344)
    .run();

  const activeMerkles: { address: string; mint: string }[] = [];
  for (const merkle of merkleAccounts) {
    // Airdrop Expired
    if (merkle.endTs.times(1000).isLessThan(Date.now())) continue;

    // All tokens are claimed
    if (merkle.totalAmountClaimed.isEqualTo(merkle.totalAmountUnlocked))
      continue;

    activeMerkles.push({
      address: merkle.pubkey.toString(),
      mint: merkle.mint.toString(),
    });
  }

  await cache.setItem('merkles', activeMerkles, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-merkles`,
  executor,
  labels: ['normal'],
};
export default job;
