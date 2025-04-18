import { networks } from '@sonarwatch/portfolio-core';
import { getLlamaProtocolsJob, jobs, platforms } from '../src';

async function listJobs(network?: string) {
  if (network && !Object.keys(networks).includes(network)) {
    console.error(`unknown network. NetworkId: ${network}`);
  }

  const allJobs = [...jobs, getLlamaProtocolsJob(platforms)];
  console.log(allJobs);
  const filteredJobs = allJobs
    .filter(job => !network || job.id.includes(network)  )
    .map(job => job.id);

  console.info(`Available jobs: \n ${filteredJobs.join('\n')}`);
}

listJobs(process.argv.at(2));
