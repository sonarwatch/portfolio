import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { gamesCacheId, programId, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { gameStruct } from './structs';
import { gameToCached } from './helpers';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();
  const games = await getParsedProgramAccounts(
    connection,
    gameStruct,
    programId,
    [
      {
        dataSize: gameStruct.byteSize,
      },
    ]
  );
  const cachedGames = games.map((g) => gameToCached(g));
  await cache.setItem(gamesCacheId, cachedGames, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};
const job: Job = {
  id: `${platformId}-games`,
  executor,
  label: 'normal',
};
export default job;
