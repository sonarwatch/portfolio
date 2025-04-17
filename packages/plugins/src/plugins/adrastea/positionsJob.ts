import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  jlpLedgerPk,
  jlpPositionsCacheKey,
  platformId,
  usdcLedgerPk,
  usdcPositionsCacheKey,
} from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';
import { jlpLedgerStruct, usdcLedgerStruct } from './structs';
import { Position } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();

  const [jlpLedger, usdcLedger] = await Promise.all([
    getParsedAccountInfo(connection, jlpLedgerStruct, jlpLedgerPk),
    getParsedAccountInfo(connection, usdcLedgerStruct, usdcLedgerPk),
  ]);

  const jlpPositions: Position[] = [];
  const usdcPositions: Position[] = [];

  jlpLedger?.holders.forEach((holder) => {
    if (!holder.base_amount.isZero())
      jlpPositions.push({
        owner: holder.address.toString(),
        amount: holder.base_amount.toString(),
      });
  });

  usdcLedger?.holders.forEach((holder) => {
    if (!holder.base_amount.isZero())
      usdcPositions.push({
        owner: holder.address.toString(),
        amount: holder.base_amount.toString(),
      });
  });

  await cache.setItems<Position[]>(
    [
      { key: jlpPositionsCacheKey, value: jlpPositions },
      { key: usdcPositionsCacheKey, value: usdcPositions },
    ],
    {
      prefix: platformId,
      networkId: NetworkId.solana,
    }
  );
};

const job: Job = {
  id: `${platformId}-positions`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['realtime', NetworkId.solana],
};
export default job;
