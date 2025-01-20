import { Cache } from './Cache';
import promiseTimeout from './utils/misc/promiseTimeout';
import { getClientSolana } from './utils/clients';
import { services } from './index';

const runActivityTimeout = 60000;

export async function runActivity(owner: string, cache: Cache) {
  const client = getClientSolana();

  console.log(services);

  const activityPromise = client.getTransaction(
    'JBEufKsoiAgJUTa1u9iUqVuRRq43pDhLmMD1QtkXEdqDYgRrR7kKzFuGS1FaZ93cNmnvbtDp2Yf9uDRZ9815B3f',
    {
      maxSupportedTransactionVersion: 1,
    }
  );

  return promiseTimeout(
    activityPromise,
    runActivityTimeout,
    `Activity timed out`
  );
}
