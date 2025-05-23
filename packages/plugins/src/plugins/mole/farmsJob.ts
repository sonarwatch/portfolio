import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId, dataKey, vaultsPrefix, positionsKey } from './constants';
import { MoleData, PositionInfo, VaultInfo } from './types';
import { getClientSui } from '../../utils/clients';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import { getDynamicFieldObjects } from '../../utils/sui/getDynamicFieldObjects';

const executor: JobExecutor = async (cache: Cache) => {
  const data = await cache.getItem<MoleData>(dataKey, {
    prefix: vaultsPrefix,
    networkId: NetworkId.sui,
  });

  if (!data || !data.farms || !data.vaults || !data.others) return;

  const client = getClientSui();

  const vaultInfos = await multiGetObjects<VaultInfo>(
    client,
    data.vaults.map((v) => v.vaultInfo)
  );

  const positionObjectIds: string[] = [];

  vaultInfos.forEach((vaultInfo) => {
    if (vaultInfo.data?.content?.fields.value.fields.positions.fields.id.id)
      positionObjectIds.push(
        vaultInfo.data?.content?.fields.value.fields.positions.fields.id.id
      );
  });

  const positionsByVault = await Promise.all(
    positionObjectIds.map((positionObjectId) =>
      getDynamicFieldObjects<PositionInfo>(client, positionObjectId)
    )
  );

  const positions = positionsByVault.flat().map((position) => ({
    id: position.data?.content?.fields.name,
    owner: position.data?.content?.fields.value.fields.owner,
    worker: position.data?.content?.fields.value.fields.worker,
  }));

  await cache.setItem(positionsKey, positions, {
    prefix: vaultsPrefix,
    networkId: NetworkId.sui,
  });
};

const job: Job = {
  id: `${platformId}-farms`,
  networkIds: [NetworkId.sui],
  executor,
  labels: ['normal', NetworkId.sui],
};
export default job;
