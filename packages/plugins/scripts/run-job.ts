import { getCache, getLlamaProtocolsJob, jobs, platforms } from '../src';

const allJobs = [...jobs, getLlamaProtocolsJob(platforms)];
const jobId = process.argv.at(2);
if (!jobId || jobId === '') {
  console.error('Fetcher ID is missing');
  process.exit(1);
}

async function runJob() {
  const job = allJobs.find((f) => f.id === jobId);
  if (!job) {
    console.error(`Job cannot be found: ${jobId}`);
    process.exit(1);
  }

  const cache = getCache();

  const startDate = Date.now();
  console.log(`Running job: ${jobId}`);
  await job.executor(cache);

  const duration = ((Date.now() - startDate) / 1000).toFixed(2);
  console.log(`Finished (${duration}s)`);
  process.exit(0);
}

runJob();
