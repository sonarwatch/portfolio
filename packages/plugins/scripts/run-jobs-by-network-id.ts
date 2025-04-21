import {
  assertNetworkId, Network,
  NetworkIdType,
  networks
} from '@sonarwatch/portfolio-core';
import { getCache, getLlamaProtocolsJob, jobs } from '../src';

const networkId = process.argv.at(2);
if (!networkId || networkId === '') {
  console.error('Network ID is missing');
  process.exit(1);
}
const fNetworkId: NetworkIdType = assertNetworkId(networkId);
const networkData: Network = networks[fNetworkId]

const allJobs = [...jobs, getLlamaProtocolsJob([{id: networkData.id, defiLlamaId: networkData.llamaId}])];

async function runJobs(network: NetworkIdType) {
  const networkJobs = allJobs.filter(
    (f) => f.networkIds.includes(network) || f.networkIds.includes('ALL')
  );

  if (!jobs.length) {
    console.error(`Job cannot be found for network: ${network}`);
    process.exit(1);
  }

  const cache = getCache();

  const startDate = Date.now();
  console.log(`Running jobs: ${jobs.length}`);
  const promises = networkJobs.map(async (job) => {
    console.log(`${job.id}. Running.`);
    const startJob = Date.now();
    await job.executor(cache);
    const durationJob = ((Date.now() - startJob) / 1000).toFixed(2);
    console.log(`${job.id}. Finished (${durationJob}s)`);
  });
  await Promise.all(promises);
  const duration = ((Date.now() - startDate) / 1000).toFixed(2);
  console.log(`Finished (${duration}s)`);
  process.exit(0);
}

runJobs(fNetworkId);
