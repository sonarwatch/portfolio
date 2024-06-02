import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getPythTokenPriceSources } from '../../utils/solana/pyth/helpers';

const feedsToFetch = [
  {
    feed: new PublicKey('8QFEAwdamHFFRnj3Swnv1CkVNZBeFiVzraC548xhmpT5'),
    mint: new PublicKey('ZScHuTtqZukUrtZS43teTKGs2VqkKL8k4QCouR2n6Uo'),
  },
];

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();
  const sources = await getPythTokenPriceSources(connection, feedsToFetch);
  await cache.setTokenPriceSources(sources);
};
const job: Job = {
  id: `${platformId}-pricing`,
  executor,
  label: 'coingecko',
};
export default job;
