import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  platformId,
  programIdLookupTable,
  programsCacheKey,
} from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedMultipleAccountsInfo } from '../../utils/solana';
import {
  MarginMarket,
  marginMarketStruct,
  State,
  stateStruct,
} from './structs';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();

  const addressLookupTable = (
    await connection.getAddressLookupTable(programIdLookupTable)
  ).value;

  if (!addressLookupTable) return;

  const programs = [];

  for (const programId of addressLookupTable.state.addresses) {
    const [statePda] = PublicKey.findProgramAddressSync(
      [Buffer.from('ratex_state')],
      programId
    );

    const states = await getParsedMultipleAccountsInfo<State>(
      connection,
      stateStruct,
      [statePda]
    );

    if (!states[0]) continue;

    const marketIndexStart = states[0]['marketIndexStart'] as number;

    const [marginMarketPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('margin_market'),
        new BN(marketIndexStart).toArrayLike(Buffer, 'le', 4),
      ],
      programId
    );

    const marginMarkets = await getParsedMultipleAccountsInfo<MarginMarket>(
      connection,
      marginMarketStruct,
      [marginMarketPda]
    );

    if (!marginMarkets[0]) continue;

    programs.push({
      programId: programId.toString(),
      mint: marginMarkets[0].mint.toString(),
    });
  }

  await cache.setItem(programsCacheKey, programs, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-markets`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
