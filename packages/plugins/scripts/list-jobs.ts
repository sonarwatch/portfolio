import { NetworkIdType, networks } from '@sonarwatch/portfolio-core';
import { getLlamaProtocolsJob, jobs } from '../src';

async function listJobs(network?: string) {
  if (network && !Object.keys(networks).includes(network)) {
    console.error(`unknown network. NetworkId: ${network}`);
  }

  const allJobs = [...jobs, getLlamaProtocolsJob([])];
  const filteredJobs = allJobs
    .filter(
      (job) =>
        !network ||
        job.networkIds.includes('ALL') ||
        job.networkIds.includes(network as NetworkIdType)
    )
    .map((job) => job.id);

  console.info(`Available jobs: \n ${filteredJobs.join('\n')}`);
}

listJobs(process.argv.at(2));
