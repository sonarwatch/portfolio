import { NetworkId, walletTokensPlatformId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { alpMint, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { poolStruct } from './structs';
import { getSupply } from '../../utils/solana/getSupply';
import { alpDecimals } from '../abex/constants';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const alpSupply = await getSupply(client, new PublicKey(alpMint));
  if (!alpSupply) throw new Error('Cannot get ALP supply');

  const poolAccount = await getParsedAccountInfo(
    client,
    poolStruct,
    new PublicKey('4bQRutgDJs6vuh6ZcWaPVXiQaBzbHketjbCDjL4oRN34')
  );
  if (!poolAccount) throw new Error('Cannot get ALP pool');
  const aumUsd = poolAccount.aumUsdLow.div(10 ** 6);
  if (aumUsd.isZero()) throw new Error('Adrena aumUsd is 0');

  const price = aumUsd.div(alpSupply).toNumber();
  await cache.setTokenPriceSource({
    address: alpMint,
    decimals: alpDecimals,
    id: 'adrena',
    networkId: NetworkId.solana,
    platformId: walletTokensPlatformId,
    price,
    timestamp: Date.now(),
    weight: 1,
  });
};
const job: Job = {
  id: `${platformId}-alp-price`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['realtime', NetworkId.solana],
};
export default job;
