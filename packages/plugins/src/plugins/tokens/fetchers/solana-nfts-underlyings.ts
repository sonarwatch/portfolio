import {
  NetworkId,
  PortfolioElement,
  walletTokensPlatformId,
} from '@sonarwatch/portfolio-core';

import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { Cache } from '../../../Cache';

import { NftFetcher } from '../types';
import { platformId as orcaPlatformId } from '../../orca/constants';
import {
  clmmPid,
  platformId as cropperPlatformId,
} from '../../cropper/constants';
import { getTokenAccountsByOwner } from '../../../utils/solana/getTokenAccountsByOwner';
import { getClmmPositions } from '../../raydium/getClmmPositions';
import { getOrcaPositions } from '../../orca/getWhirlpoolPositions';
import { getHeliumPositions } from '../../helium/getHeliumPositions';
import { getPicassoPositions } from '../../picasso/getPicassoPositions';

const nftsUnderlyingsMap: Map<string, NftFetcher> = new Map([
  ['raydium', getClmmPositions],
  ['orca', getOrcaPositions(orcaPlatformId)],
  ['cropper', getOrcaPositions(cropperPlatformId, clmmPid)],
  ['helium', getHeliumPositions],
  ['picasso', getPicassoPositions],
]);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const tokenAccounts = (await getTokenAccountsByOwner(owner)).filter((x) =>
    x.amount.isEqualTo(1)
  );

  const results: Promise<PortfolioElement[]>[] = [];
  for (const nftsUnderlyingsMapElement of nftsUnderlyingsMap) {
    results.push(nftsUnderlyingsMapElement[1](tokenAccounts, cache));
  }
  const result = await Promise.allSettled(results);

  return result
    .map((res) => (res.status === 'rejected' ? [] : res.value))
    .flat();
};

const fetcher: Fetcher = {
  id: `${walletTokensPlatformId}-solana-nfts-underlyings`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
