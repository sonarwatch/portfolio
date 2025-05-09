import { networks } from '@sonarwatch/portfolio-core';
import { fetchers, solanaSimpleFetcher } from '../src';

async function listFetchers(network?: string) {
  if (network && !Object.keys(networks).includes(network)) {
    console.error(`unknown network. NetworkId: ${network}`);
  }

  const filteredFetchers = [...fetchers, solanaSimpleFetcher]
    .filter(f => !network || f.networkId === network)
    .map(f => f.id);

  console.info(`Available fetchers: \n ${filteredFetchers.join('\n')}`);
}

listFetchers(process.argv.at(2));
